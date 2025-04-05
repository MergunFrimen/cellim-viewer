import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CELLIM Viewer"
    APP_DESCRIPTION: str = "API managing CELLIM data entries"
    APP_VERSION: str = "0.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: str = "8000"
    APP_RELOAD: bool = True

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # for frontend
        "http://localhost:8000",  # for OpenAPI docs
    ]

    # PostgreSQL
    POSTGRES_DIALECT: str = "postgresql"
    POSTGRES_DBAPI: str = "asyncpg"
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "cellim_viewer")
    DATABASE_URL: str = f"{POSTGRES_DIALECT}+{POSTGRES_DBAPI}://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    DATABASE_ECHO_SQL: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
