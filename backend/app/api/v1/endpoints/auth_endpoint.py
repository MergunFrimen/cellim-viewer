from typing import Annotated

from fastapi import APIRouter, Header, status

from app.api.v1.dependencies import RequireUser
from app.api.v1.tags import Tags
from app.core.security import get_admin_user_token, get_regular_user_token
from app.database.models.role_model import RoleEnum

router = APIRouter(prefix="/auth", tags=[Tags.auth])


@router.post("/login/admin")
async def login_admin():
    access_token = get_admin_user_token()
    return {"access_token": access_token, "token_type": "bearer", "role": RoleEnum.admin.value}


@router.post("/login/user")
async def login_user():
    access_token = get_regular_user_token()
    return {"access_token": access_token, "token_type": "bearer", "role": RoleEnum.user.value}


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    current_user: RequireUser,
):
    return current_user.id


@router.get("/get_current_user")
async def read_users_me(
    current_user: RequireUser,
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


@router.get("/check-auth")
async def check_auth(
    current_user: RequireUser,
):
    return {"authenticated": True}
