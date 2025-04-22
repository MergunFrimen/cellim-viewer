from typing import Annotated

from fastapi import APIRouter, Depends, Header

from app.api.v1.tags import Tags
from app.core.security import get_admin_user_token, get_regular_user_token, get_required_user
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User

router = APIRouter(prefix="/auth", tags=[Tags.auth])


@router.get("/login/admin")
async def login_admin():
    access_token = get_admin_user_token()
    return {"access_token": access_token, "token_type": "bearer", "role": RoleEnum.admin.value}


@router.get("/login/user")
async def login_user():
    access_token = get_regular_user_token()
    return {"access_token": access_token, "token_type": "bearer", "role": RoleEnum.user.value}


@router.get("/get_current_user")
async def read_users_me(
    current_user: Annotated[User, Depends(get_required_user())],
):
    return current_user


@router.get("/get_auth_header")
async def protected_route(
    authorization: Annotated[str | None, Header()] = None,
):
    return {
        "message": "This is protected",
        "raw_header": authorization,
    }
