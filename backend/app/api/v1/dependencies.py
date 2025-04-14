from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.database.session_manager import get_session_manager


async def get_async_session():
    async with get_session_manager().session() as session:
        yield session


SessionDependency = Annotated[AsyncSession, Depends(get_async_session)]
