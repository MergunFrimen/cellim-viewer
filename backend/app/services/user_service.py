from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.entry_model import Entry
from app.database.models.user_model import User
from app.database.session_manager import get_async_session


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_id(self, id: UUID) -> User | None:
        result = await self.session.execute(select(User).where(User.id == id))
        user: User | None = result.scalar()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    async def get_user_by_email(self, email: str) -> User | None:
        user: User | None = await self.session.get(Entry, id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    async def get_user_by_email(self, email: str) -> User | None:
        user: User | None = await self.session.get(Entry, id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    async def create_user(self) -> User:
        pass  # TODO

    async def delete_user(self) -> User:
        pass  # TODO


async def get_user_service(
    session: AsyncSession = Depends(get_async_session),
) -> UserService:
    return UserService(session)
