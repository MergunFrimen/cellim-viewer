from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session_manager import get_session_manager

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login/access-token")


async def get_async_session():
    async with get_session_manager().session() as session:
        yield session


SessionDependency = Annotated[AsyncSession, Depends(get_async_session)]
