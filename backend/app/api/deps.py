"""Shared FastAPI dependencies for authentication and role checks."""

from collections.abc import Callable
from datetime import timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.enums import UserRole
from app.core.security import hash_session_token, utcnow
from app.db.models import SessionToken, User
from app.db.session import get_db

bearer_scheme = HTTPBearer(auto_error=False, description='Opaque access token from /auth/login')


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or credentials.scheme.lower() != 'bearer':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication required.',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    token_hash = hash_session_token(credentials.credentials)
    session = db.query(SessionToken).filter(SessionToken.token_hash == token_hash).first()
    if (
        session is None
        or session.revoked
        or session.expires_at <= utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Session is invalid or has expired.',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    user = db.get(User, session.user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Account is inactive.',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    return user


def require_roles(*roles: UserRole) -> Callable[..., User]:
    """Build a dependency that only allows the supplied roles."""

    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail='This action is not available for your account role.',
            )
        return current_user

    return checker


def create_session(db: Session, user_id: str, raw_token: str, expires_in_minutes: int) -> SessionToken:
    session = SessionToken(
        token_hash=hash_session_token(raw_token),
        user_id=user_id,
        expires_at=utcnow() + timedelta(minutes=expires_in_minutes),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
