"""SQLAlchemy models for Phase 2.

The models use portable SQLAlchemy types so the same code runs against
PostgreSQL in deployment and SQLite in the automated tests.
"""

from datetime import datetime
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import TransactionStatus, UserRole
from app.core.security import utcnow
from app.db.session import Base


def _new_id() -> str:
    return uuid4().hex


class User(Base):
    __tablename__ = 'users'

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    business_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, name='user_role', values_callable=lambda enum: [item.value for item in enum]),
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=utcnow, nullable=False)

    wallet: Mapped['Wallet'] = relationship(
        back_populates='user', uselist=False, cascade='all, delete-orphan'
    )
    sent_transactions: Mapped[list['Transaction']] = relationship(
        back_populates='sender', foreign_keys='Transaction.sender_id'
    )
    received_transactions: Mapped[list['Transaction']] = relationship(
        back_populates='receiver', foreign_keys='Transaction.receiver_id'
    )


class Wallet(Base):
    __tablename__ = 'wallets'

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    user_id: Mapped[str] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), unique=True, index=True, nullable=False
    )
    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    offline_spending_limit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(default=utcnow, onupdate=utcnow, nullable=False)

    user: Mapped['User'] = relationship(back_populates='wallet')


class SessionToken(Base):
    __tablename__ = 'session_tokens'

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), index=True, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    revoked: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=utcnow, nullable=False)

    user: Mapped['User'] = relationship()


class Transaction(Base):
    __tablename__ = 'transactions'

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    reference: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[TransactionStatus] = mapped_column(
        SAEnum(
            TransactionStatus,
            name='transaction_status',
            values_callable=lambda enum: [item.value for item in enum],
        ),
        nullable=False,
    )
    note: Mapped[str | None] = mapped_column(String(200), nullable=True)
    sender_id: Mapped[str] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), index=True, nullable=False
    )
    receiver_id: Mapped[str] = mapped_column(
        ForeignKey('users.id', ondelete='CASCADE'), index=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(default=utcnow, index=True, nullable=False)

    sender: Mapped['User'] = relationship(
        back_populates='sent_transactions', foreign_keys=[sender_id]
    )
    receiver: Mapped['User'] = relationship(
        back_populates='received_transactions', foreign_keys=[receiver_id]
    )
