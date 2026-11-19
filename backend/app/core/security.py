"""Password and session-token helpers used by the Phase 2 auth API."""

import hashlib
import secrets
from datetime import datetime, timezone

import bcrypt


def utcnow() -> datetime:
    """Timezone-naive UTC value, portable across PostgreSQL and SQLite."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def hash_password(password: str) -> str:
    """Return a bcrypt hash. Callers validate the 72-byte bcrypt limit."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except (ValueError, TypeError):
        return False


def generate_session_token() -> str:
    """Create a high-entropy opaque token returned to the client."""
    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    """Only hashes are stored in the database, so stolen DB rows cannot be replayed."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
