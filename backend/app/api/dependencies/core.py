from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session

DbSessionDependency = Annotated[AsyncSession, Depends(get_db_session)]
