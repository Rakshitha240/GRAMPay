from decimal import Decimal
from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / '.env'


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding='utf-8',
        case_sensitive=False,
        extra='ignore',
    )

    project_name: str = 'GRAMPay API'
    environment: str = 'development'
    api_v1_prefix: str = '/api/v1'
    backend_cors_origins: list[str] = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]

    postgres_server: str = 'localhost'
    postgres_port: int = 5432
    postgres_user: str = 'grampay'
    postgres_password: str = 'grampay'
    postgres_db: str = 'grampay'
    database_url: str | None = None

    # Auth settings. Override SECRET_KEY in any shared environment.
    secret_key: str = 'grampay-phase2-development-secret'
    access_token_expire_minutes: int = 60 * 24 * 7

    # Demo wallet values shown on the Phase 2 dashboards.
    demo_customer_balance: Decimal = Decimal('2500.00')
    demo_merchant_balance: Decimal = Decimal('0.00')
    demo_offline_spending_limit: Decimal = Decimal('500.00')
    registration_balance: Decimal = Decimal('1000.00')
    demo_account_password: str = 'Demo@1234'

    @computed_field
    @property
    def sqlalchemy_database_url(self) -> str:
        """Return a SQLAlchemy-compatible PostgreSQL URL.

        Credentials are URL-encoded so special characters in environment
        variables are handled safely. The database is not contacted here.
        """
        if self.database_url:
            url = self.database_url.strip()
            if url.startswith('postgres://'):
                return 'postgresql+psycopg://' + url[len('postgres://') :]
            if url.startswith('postgresql://'):
                return 'postgresql+psycopg://' + url[len('postgresql://') :]
            return url

        user = quote_plus(self.postgres_user)
        password = quote_plus(self.postgres_password)
        return (
            f'postgresql+psycopg://{user}:{password}@'
            f'{self.postgres_server}:{self.postgres_port}/{self.postgres_db}'
        )

    @property
    def cors_origins(self) -> list[str]:
        return self.backend_cors_origins


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
