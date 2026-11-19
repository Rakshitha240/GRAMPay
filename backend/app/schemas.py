"""Pydantic request and response schemas for the Phase 2 API."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.enums import TransactionStatus, UserRole


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


def _validate_bcrypt_length(password: str) -> str:
    if len(password.encode('utf-8')) > 72:
        raise ValueError('Password must be at most 72 bytes long.')
    return password


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: UserRole
    business_name: str | None = Field(default=None, max_length=120)

    @field_validator('password')
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        return _validate_bcrypt_length(value)

    @field_validator('full_name', 'business_name')
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if not stripped:
            raise ValueError('Text fields cannot be empty.')
        return stripped

    @field_validator('email')
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return str(value).strip().lower()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)

    @field_validator('password')
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        return _validate_bcrypt_length(value)

    @field_validator('email')
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return str(value).strip().lower()


class UserRead(ORMModel):
    id: str
    email: str
    full_name: str
    business_name: str | None
    role: UserRole
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserRead


class WalletRead(ORMModel):
    balance: Decimal
    offline_spending_limit: Decimal
    updated_at: datetime


class TransactionRead(ORMModel):
    id: str
    reference: str
    amount: Decimal
    status: TransactionStatus
    note: str | None
    direction: str
    counterparty_name: str
    created_at: datetime


class SalesOverview(BaseModel):
    total_received: Decimal
    completed_count: int
    pending_count: int


class CustomerDashboardRead(BaseModel):
    user: UserRead
    wallet: WalletRead
    recent_transactions: list[TransactionRead]


class MerchantDashboardRead(BaseModel):
    user: UserRead
    wallet: WalletRead
    sales_overview: SalesOverview
    recent_transactions: list[TransactionRead]


class MessageResponse(BaseModel):
    message: str
