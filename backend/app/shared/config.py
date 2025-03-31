import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # React frontend
        "http://localhost:8000",  # FastAPI backend (for OpenAPI docs)
    ]

    # PostgreSQL
    POSTGRES_DIALECT: str = "postgresql"
    POSTGRES_DBAPI: str = "psycopg"
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "cellim_viewer")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"{POSTGRES_DIALECT}+{POSTGRES_DBAPI}://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}",
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
