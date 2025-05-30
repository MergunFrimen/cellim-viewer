from uuid import UUID

from fastapi import HTTPException, status

from app.api.v1.dependencies import DbSession
from app.database.models.entry_model import Entry
from app.database.models.user_model import User


async def create_user(*, session: DbSession) -> User:
    pass  # TODO


async def delete_user(*, session: DbSession) -> User:
    pass  # TODO


async def get_user_by_email(*, session: DbSession, email: str) -> User | None:
    pass  # TODO


async def is_owner(*, session: DbSession, entry_id: UUID, user_id: UUID) -> bool:
    entry: Entry | None = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    return entry.user_id == user_id
