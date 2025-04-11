import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CELLIM Viewer API"
    APP_SUMMARY: str = "API managing CELLIM data entries"
    APP_VERSION: str = "0.0.0"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: str = "8000"
    APP_RELOAD: bool = True
    APP_CONTACT: dict[str, str] = {
        "name": "CELLIM Viewer developers",
        "url": "https://github.com/MergunFrimen/cellim-viewer",
        "email": "492772@mail.muni.cz",
    }
    APP_LICENCE: dict[str, str] = {
        "name": "Apache 2.0",
        "identifier": "MIT",
    }

    # API
    API_V1_PREFIX: str = "/api"

    # CORS
    CORS_ORIGINS: list[str] = [
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

    # MinIO
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    MINIO_BUCKET: str = os.getenv("MINIO_BUCKET", "cellim-viewer")
    MINIO_SECURE: bool = os.getenv("MINIO_SECURE", "False") == "True"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )


@lru_cache
def get_settings():
    return Settings()
