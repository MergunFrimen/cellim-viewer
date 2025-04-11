from contextlib import asynccontextmanager
from functools import lru_cache
from typing import Any, AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.settings import get_settings


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self.engine: AsyncEngine | None = create_async_engine(host, **engine_kwargs)
        self._session_factory = async_sessionmaker(
            bind=self.engine,
            autocommit=False,
            autoflush=False,
            expire_on_commit=False,
        )

    async def close(self):
        if self.engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self.engine.dispose()

        self.engine = None

    @asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self.engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self.engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        session = self._session_factory()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@lru_cache
def get_session_manager():
    return DatabaseSessionManager(get_settings().DATABASE_URL, {"echo": get_settings().DATABASE_ECHO_SQL})


async def get_async_session():
    async with get_session_manager().session() as session:
        yield session
