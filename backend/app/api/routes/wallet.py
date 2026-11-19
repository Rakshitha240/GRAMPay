from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.services import get_wallet
from app.db.models import User
from app.db.session import get_db
from app.schemas import WalletRead

router = APIRouter(prefix='/wallet', tags=['wallet'])


@router.get('/me', response_model=WalletRead, summary='Get the authenticated user wallet')
def read_my_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WalletRead:
    return get_wallet(db, current_user.id)
