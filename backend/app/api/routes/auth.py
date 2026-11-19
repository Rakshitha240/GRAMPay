"""Registration, login, logout and current-user endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import bearer_scheme, create_session, get_current_user
from app.core.config import settings
from app.core.security import generate_session_token, hash_password, hash_session_token, verify_password
from app.db.models import SessionToken, User, Wallet
from app.db.session import get_db
from app.schemas import LoginRequest, MessageResponse, TokenResponse, UserCreate, UserRead

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post(
    '/register',
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary='Register a customer or merchant account',
)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    normalized_email = str(payload.email).lower()
    existing = db.scalar(select(User).where(User.email == normalized_email))
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account with this email already exists.',
        )

    user = User(
        email=normalized_email,
        full_name=payload.full_name,
        business_name=payload.business_name if payload.role.value == 'merchant' else None,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()

    db.add(
        Wallet(
            user_id=user.id,
            balance=settings.registration_balance,
            offline_spending_limit=settings.demo_offline_spending_limit,
        )
    )

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account with this email already exists.',
        ) from exc

    db.refresh(user)
    return UserRead.model_validate(user)


@router.post('/login', response_model=TokenResponse, summary='Log in and receive an access token')
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    normalized_email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == normalized_email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password.',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='This account is inactive.',
        )

    raw_token = generate_session_token()
    create_session(db, user.id, raw_token, settings.access_token_expire_minutes)
    return TokenResponse(access_token=raw_token, user=UserRead.model_validate(user))


@router.post('/logout', response_model=MessageResponse, summary='Revoke the current session')
def logout(
    current_user: User = Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> MessageResponse:
    if credentials is not None:
        session = db.scalar(
            select(SessionToken).where(
                SessionToken.token_hash == hash_session_token(credentials.credentials),
                SessionToken.user_id == current_user.id,
            )
        )
        if session is not None:
            session.revoked = True
            db.commit()
    return MessageResponse(message='Logged out successfully.')


@router.get('/me', response_model=UserRead, summary='Get the authenticated user')
def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)
