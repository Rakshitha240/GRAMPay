"""Role-specific dashboard data endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.api.services import get_recent_transactions, get_sales_overview, get_wallet
from app.core.enums import UserRole
from app.db.models import User
from app.db.session import get_db
from app.schemas import (
    CustomerDashboardRead,
    MerchantDashboardRead,
    UserRead,
)

router = APIRouter(prefix='/dashboard', tags=['dashboard'])


@router.get(
    '/customer',
    response_model=CustomerDashboardRead,
    summary='Customer dashboard payload (customers only)',
)
def customer_dashboard(
    current_user: User = Depends(require_roles(UserRole.CUSTOMER)),
    db: Session = Depends(get_db),
) -> CustomerDashboardRead:
    return CustomerDashboardRead(
        user=UserRead.model_validate(current_user),
        wallet=get_wallet(db, current_user.id),
        recent_transactions=get_recent_transactions(db, current_user.id, limit=8),
    )


@router.get(
    '/merchant',
    response_model=MerchantDashboardRead,
    summary='Merchant dashboard payload (merchants only)',
)
def merchant_dashboard(
    current_user: User = Depends(require_roles(UserRole.MERCHANT)),
    db: Session = Depends(get_db),
) -> MerchantDashboardRead:
    return MerchantDashboardRead(
        user=UserRead.model_validate(current_user),
        wallet=get_wallet(db, current_user.id),
        sales_overview=get_sales_overview(db, current_user.id),
        recent_transactions=get_recent_transactions(db, current_user.id, limit=8),
    )
