from fastapi import APIRouter, Request, Response, status

from app.api.v1.contracts.responses.user_responses import UserResponse
from app.api.v1.deps import RequireUserDep
from app.api.v1.tags import Tags
from app.core.security import get_regular_user_token
from app.database.models.role_model import RoleEnum

router = APIRouter(prefix="/auth", tags=[Tags.auth])


@router.post("/login/user")
async def login_user(response: Response):
    access_token = get_regular_user_token()

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=36000,
        httponly=True,  # TODO: set to TRUE
        secure=False,  # TODO: set to TRUE
        samesite="lax",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": RoleEnum.user.value,
        "message": "Login successful, token set in cookie",
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,  # TODO: set to TRUE
        secure=False,  # TODO: set to TRUE
        samesite="lax",
    )
    return {
        "message": "Logged out successfully",
    }


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
    response_model=str,
)
async def get_users_token(
    request: Request,
):
    return request.cookies.get("access_token")


@router.get("/verify")
async def verify_auth(
    current_user: RequireUserDep,
):
    return {"authenticated": True}
