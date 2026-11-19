from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.services import get_recent_transactions
from app.db.models import User
from app.db.session import get_db
from app.schemas import TransactionRead

router = APIRouter(prefix='/transactions', tags=['transactions'])


@router.get(
    '/me',
    response_model=list[TransactionRead],
    summary='List recent transactions for the authenticated user',
)
def read_my_transactions(
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TransactionRead]:
    return get_recent_transactions(db, current_user.id, limit)
