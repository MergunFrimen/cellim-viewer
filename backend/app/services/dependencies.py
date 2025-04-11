from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session_manager import get_async_session
from app.services.entries import EntryService


async def get_entry_service(session: AsyncSession = Depends(get_async_session)) -> EntryService:
    return EntryService(session=session)
