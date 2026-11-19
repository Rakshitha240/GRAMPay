from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = 'customer'
    MERCHANT = 'merchant'


class TransactionStatus(str, Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    REJECTED = 'rejected'
