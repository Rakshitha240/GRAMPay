"""Idempotent seed script for the two Phase 2 demo accounts.

Run from the backend directory:

    python -m app.db.seed
"""

from datetime import timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.enums import TransactionStatus, UserRole
from app.core.security import hash_password, utcnow
from app.db.models import Transaction, User, Wallet
from app.db.session import Base, SessionLocal, engine

# Importing models registers their tables on Base.metadata.
_ = (User, Wallet, Transaction)

DEMO_CUSTOMER_EMAIL = 'customer@grampay.demo'
DEMO_MERCHANT_EMAIL = 'merchant@grampay.demo'


def _get_or_create_user(db: Session, *, email: str, full_name: str, role: UserRole,
                        business_name: str | None, balance: Decimal) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(
            email=email,
            full_name=full_name,
            business_name=business_name,
            role=role,
            hashed_password=hash_password(settings.demo_account_password),
        )
        db.add(user)
        db.flush()
        db.add(
            Wallet(
                user_id=user.id,
                balance=balance,
                offline_spending_limit=settings.demo_offline_spending_limit,
            )
        )
    elif user.wallet is None:
        db.add(
            Wallet(
                user_id=user.id,
                balance=balance,
                offline_spending_limit=settings.demo_offline_spending_limit,
            )
        )
    return user


def seed(db: Session | None = None) -> None:
    """Seed demo users and transactions.

    A session can be supplied by tests that run against an in-memory database;
    otherwise the configured PostgreSQL engine is used.
    """
    if db is None:
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as session:
            seed(session)
        return

    customer = _get_or_create_user(
        db,
        email=DEMO_CUSTOMER_EMAIL,
        full_name='Ananya Sharma',
        role=UserRole.CUSTOMER,
        business_name=None,
        balance=settings.demo_customer_balance,
    )
    merchant = _get_or_create_user(
        db,
        email=DEMO_MERCHANT_EMAIL,
        full_name='Ramesh Kumar',
        role=UserRole.MERCHANT,
        business_name='Gram Kirana Store',
        balance=settings.demo_merchant_balance,
    )

    now = utcnow()
    demo_transactions = [
        ('GP-DEMO-1001', customer.id, merchant.id, Decimal('120.00'),
         TransactionStatus.COMPLETED, 'Groceries', 2),
        ('GP-DEMO-1002', merchant.id, customer.id, Decimal('40.00'),
         TransactionStatus.COMPLETED, 'Change refund', 5),
        ('GP-DEMO-1003', customer.id, merchant.id, Decimal('65.50'),
         TransactionStatus.PENDING, 'Offline QR payment', 26),
        ('GP-DEMO-1004', customer.id, merchant.id, Decimal('210.00'),
         TransactionStatus.COMPLETED, 'Farm supplies', 50),
    ]

    for reference, sender_id, receiver_id, amount, status, note, hours_ago in demo_transactions:
        exists = db.scalar(select(Transaction).where(Transaction.reference == reference))
        if exists is None:
            db.add(
                Transaction(
                    reference=reference,
                    sender_id=sender_id,
                    receiver_id=receiver_id,
                    amount=amount,
                    status=status,
                    note=note,
                    created_at=now - timedelta(hours=hours_ago),
                )
            )
    db.commit()


if __name__ == '__main__':
    seed()
    print('GRAMPay demo data ready.')
    print(f'  Customer: {DEMO_CUSTOMER_EMAIL} / {settings.demo_account_password}')
    print(f'  Merchant: {DEMO_MERCHANT_EMAIL} / {settings.demo_account_password}')
