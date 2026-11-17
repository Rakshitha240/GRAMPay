from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get('/health')
def health_check() -> dict[str, str]:
    """Liveness endpoint. It does not query the database."""
    return {
        'status': 'ok',
        'environment': settings.environment,
        'database': 'configured',
    }
