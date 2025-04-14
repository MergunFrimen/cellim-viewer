from typing import Annotated

from fastapi import APIRouter, Depends, Header

from app.api.v1.tags import Tags
from app.core.security import get_current_user
from app.database.models.user_model import User

router = APIRouter(prefix="/auth", tags=[Tags.auth])


@router.get("/get_current_user")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user())],
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
