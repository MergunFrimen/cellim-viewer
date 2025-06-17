from fastapi import APIRouter, Request, Response, status

from app.api.v1.contracts.responses.user_responses import UserResponse
from app.api.v1.deps import OptionalUserDep, RequireUserDep
from app.api.v1.tags import Tags
from app.core.security import get_regular_user_token
from app.core.settings import get_settings

router = APIRouter(prefix="/auth", tags=[Tags.auth])


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def login_user(response: Response):
    access_token = get_regular_user_token()

    response.set_cookie(
        key=get_settings().ACCESS_TOKEN_COOKIE,
        value=access_token,
        max_age=36000,
        httponly=True,  # TODO: set to TRUE
        secure=False,  # TODO: set to TRUE
        samesite="lax",
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def logout(response: Response):
    response.delete_cookie(
        key=get_settings().ACCESS_TOKEN_COOKIE,
        httponly=True,  # TODO: set to TRUE
        secure=False,  # TODO: set to TRUE
        samesite="lax",
    )


@router.get(
    "/me/user",
    status_code=status.HTTP_200_OK,
    response_model=UserResponse,
)
async def read_users_me(
    current_user: RequireUserDep,
):
    return UserResponse.model_validate(current_user)


@router.get(
    "/me/token",
    status_code=status.HTTP_200_OK,
    response_model=str | None,
)
async def get_users_token(
    request: Request,
):
    return request.cookies.get(
        get_settings().ACCESS_TOKEN_COOKIE,
    )


@router.get(
    "/verify",
    status_code=status.HTTP_200_OK,
    response_model=bool,
)
async def verify_auth(
    current_user: OptionalUserDep,
):
    return current_user is not None
