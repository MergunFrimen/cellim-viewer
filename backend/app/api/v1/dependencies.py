from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.session_manager import get_async_session

SessionDependency = Annotated[AsyncSession, Depends(get_async_session)]

RequireRegularUser = Annotated[User, Depends(get_current_user(allowed_roles=[RoleEnum.user]))]
RequireAdminUser = Annotated[User, Depends(get_current_user(allowed_roles=[RoleEnum.admin]))]
RequireAnyUser = Annotated[
    User, Depends(get_current_user(allowed_roles=[RoleEnum.user, RoleEnum.admin]))
]
