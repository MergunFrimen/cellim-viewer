from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session_manager import get_async_session

DbSessionDependency = Annotated[AsyncSession, Depends(get_async_session)]
