"""Read-only query helpers shared by the Phase 2 dashboard endpoints."""

from decimal import Decimal

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.enums import TransactionStatus
from app.core.security import utcnow
from app.db.models import Transaction, Wallet
from app.schemas import SalesOverview, TransactionRead, WalletRead


def get_wallet(db: Session, user_id: str) -> WalletRead:
    wallet = db.scalar(select(Wallet).where(Wallet.user_id == user_id))
    if wallet is None:
        # Defensive fallback: every registered user gets a wallet, but older
        # rows or manual DB edits could leave one missing.
        return WalletRead(
            balance=Decimal('0.00'),
            offline_spending_limit=Decimal('0.00'),
            updated_at=utcnow()
        )
    return WalletRead.model_validate(wallet)


def get_recent_transactions(db: Session, user_id: str, limit: int) -> list[TransactionRead]:
    rows = db.scalars(
        select(Transaction)
        .where(or_(Transaction.sender_id == user_id, Transaction.receiver_id == user_id))
        .order_by(Transaction.created_at.desc(), Transaction.reference.desc())
        .limit(limit)
    ).all()

    results: list[TransactionRead] = []
    for row in rows:
        sent = row.sender_id == user_id
        counterparty = row.receiver if sent else row.sender
        results.append(
            TransactionRead(
                id=row.id,
                reference=row.reference,
                amount=row.amount,
                status=row.status,
                note=row.note,
                direction='out' if sent else 'in',
                counterparty_name=(
                    (counterparty.business_name or counterparty.full_name)
                    if counterparty is not None
                    else 'Unknown'
                ),
                created_at=row.created_at,
            )
        )
    return results


def get_sales_overview(db: Session, merchant_id: str) -> SalesOverview:
    received = db.scalars(
        select(Transaction).where(Transaction.receiver_id == merchant_id)
    ).all()
    completed = [tx for tx in received if tx.status == TransactionStatus.COMPLETED]
    pending = [tx for tx in received if tx.status == TransactionStatus.PENDING]
    return SalesOverview(
        total_received=sum((tx.amount for tx in completed), Decimal('0.00')),
        completed_count=len(completed),
        pending_count=len(pending),
    )
