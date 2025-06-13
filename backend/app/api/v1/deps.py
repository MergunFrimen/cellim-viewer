from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_optional_user, get_required_user
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.session_manager import get_async_session
from app.services.entry_service import EntryService, get_entry_service
from app.services.share_link_service import ShareLinkService, get_share_link_service
from app.services.user_service import UserService, get_user_service
from app.services.view_service import ViewService, get_view_service
from app.services.volseg_service import VolsegService, get_volseg_service

DbSessionDep = Annotated[AsyncSession, Depends(get_async_session)]

UserServiceDep = Annotated[UserService, Depends(get_user_service)]
EntryServiceDep = Annotated[EntryService, Depends(get_entry_service)]
ViewServiceDep = Annotated[ViewService, Depends(get_view_service)]
VolsegServiceDep = Annotated[VolsegService, Depends(get_volseg_service)]

ShareLinkServiceDep = Annotated[ShareLinkService, Depends(get_share_link_service)]
RequireUserDep = Annotated[User, Depends(get_required_user(required_role=RoleEnum.user))]
OptionalUserDep = Annotated[User | None, Depends(get_optional_user(required_role=RoleEnum.user))]
