import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.api.routes import auth, dashboard, health, transactions, wallet
from app.core.config import settings

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.project_name,
    version='0.2.0',
    description='GRAMPay Phase 2 API: authentication, roles, wallets and dashboards.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router, prefix=settings.api_v1_prefix)
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(wallet.router, prefix=settings.api_v1_prefix)
app.include_router(transactions.router, prefix=settings.api_v1_prefix)
app.include_router(dashboard.router, prefix=settings.api_v1_prefix)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = [
        {
            'field': '.'.join(str(part) for part in error['loc'] if part != 'body'),
            'message': error['msg'],
        }
        for error in exc.errors()
    ]
    return JSONResponse(status_code=422, content={'detail': 'Invalid request data.', 'errors': errors})


@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    logger.warning('Database integrity error on %s: %s', request.url.path, exc)
    return JSONResponse(status_code=409, content={'detail': 'The request conflicts with existing data.'})


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.exception('Database error on %s', request.url.path)
    return JSONResponse(status_code=503, content={'detail': 'Database is temporarily unavailable.'})


@app.exception_handler(Exception)
async def unexpected_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception('Unhandled error on %s', request.url.path)
    return JSONResponse(status_code=500, content={'detail': 'Internal server error.'})


@app.get('/', tags=['meta'])
def read_root() -> dict[str, str]:
    return {
        'name': settings.project_name,
        'status': 'ok',
        'version': '0.2.0',
        'docs': '/docs',
    }
