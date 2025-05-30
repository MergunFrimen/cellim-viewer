from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.entry_model import Entry
from app.database.session_manager import get_async_session


class EntryService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_entry_by_id(self, entry_id: UUID) -> Entry:
        entry: Entry | None = await self.session.get(Entry, entry_id)
        if entry is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entry not found",
            )
        return entry

    async def get_entries_by_user(self, user_id: UUID) -> list[Entry]:
        result = await self.session.execute(select(Entry).where(Entry.user_id == user_id))
        entries: list[Entry] = result.all()
        if entries is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entry not found",
            )
        return entries

    async def is_owner(self, user_id: UUID, entry_id: UUID) -> bool:
        entry: Entry | None = self.get_entry_by_id(entry_id)
        if not entry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entry not found",
            )
        return entry.user_id == user_id


async def get_entry_service(
    session: AsyncSession = Depends(get_async_session),
) -> EntryService:
    return EntryService(session)
