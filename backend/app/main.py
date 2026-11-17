from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.core.config import settings

app = FastAPI(
    title=settings.project_name,
    version='0.1.0',
    description=(
        'GRAMPay Phase 1 API scaffold. No payment functionality is implemented.'
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router, prefix=settings.api_v1_prefix)


@app.get('/', tags=['meta'])
def read_root() -> dict[str, str]:
    return {
        'name': settings.project_name,
        'status': 'ok',
        'docs': '/docs',
    }
