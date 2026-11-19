from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get('/health')
def health_check() -> dict[str, str]:
    """Liveness endpoint. It does not query the database."""
    return {
        'status': 'ok',
        'environment': settings.environment,
        'database': 'configured',
    }


@router.get('/health/db')
def database_health(db: Session = Depends(get_db)) -> dict[str, str]:
    """Readiness endpoint that verifies a real database round trip."""
    try:
        db.execute(text('SELECT 1'))
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail='Database connection failed.',
        ) from exc
    return {'status': 'ok', 'database': 'reachable'}
