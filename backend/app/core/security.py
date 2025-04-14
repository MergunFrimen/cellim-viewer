from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.session_manager import get_session_manager


def get_current_user(user_id: UUID, role: RoleEnum | None = None) -> User:
    async def _get_current_user() -> User:
        async with get_session_manager().session() as session:
            result = await session.execute(
                select(User).where(User.id == user_id).options(selectinload(User.role))
            )
            user: User | None = result.scalar()
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")

            if role and role != user.role.name:
                raise HTTPException(
                    status_code=403,
                    detail=f"Require role for access: {role.value}",
                )
            return user

    return _get_current_user
