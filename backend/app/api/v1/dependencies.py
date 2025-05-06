from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_optional_user, get_required_user
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.session_manager import get_async_session
from app.services.files.dependency import FileStorage, get_file_storage

SessionDependency = Annotated[AsyncSession, Depends(get_async_session)]
FileStorageDependency = Annotated[FileStorage, Depends(get_file_storage)]

RequireUser = Annotated[User, Depends(get_required_user(required_role=RoleEnum.user))]
OptionalUser = Annotated[User | None, Depends(get_optional_user(required_role=RoleEnum.user))]
