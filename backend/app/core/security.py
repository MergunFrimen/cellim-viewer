from datetime import timedelta
from functools import lru_cache
from typing import Any

from fastapi import Depends, HTTPException, status
from jwt import DecodeError, ExpiredSignatureError, MissingRequiredClaimError, decode, encode
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.bearer import CustomAuthorizationCodeBearer
from app.core.settings import get_settings
from app.database.models.mixins.timestamp_mixin import utcnow
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.seeding.seed_database import get_admin_user_id, get_regular_user_id
from app.database.session_manager import get_session_manager

oauth2_scheme = CustomAuthorizationCodeBearer(
    authorizationUrl=f"{get_settings().API_V1_PREFIX}/token",
    tokenUrl=f"{get_settings().API_V1_PREFIX}/token",
    auto_error=False,
)


def create_access_token(sub: str | Any) -> str:
    expire = utcnow() + timedelta(minutes=get_settings().JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(sub),
        "exp": expire,
        "type": "access",
    }

    return encode(
        payload=to_encode,
        key=get_settings().JWT_SECRET_KEY,
        algorithm=get_settings().JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict[str, Any]:
    return decode(
        jwt=token,
        key=get_settings().JWT_SECRET_KEY,
        algorithms=[get_settings().JWT_ALGORITHM],
    )


@lru_cache
def get_regular_user_token():
    return create_access_token(get_regular_user_id())


@lru_cache
def get_admin_user_token():
    return create_access_token(get_admin_user_id())


def get_current_user(
    required_role: RoleEnum | None = None,
) -> User:
    async def _get_current_user(user: str | None = Depends(get_user(required_role))) -> User:
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    return _get_current_user


def get_optional_user(required_role: RoleEnum | None = None) -> User | None:
    async def _get_optional_user(user: str | None = Depends(get_user(required_role))) -> User:
        return user

    return _get_optional_user


def get_user(required_role: RoleEnum | None = None) -> User | None:
    async def _get_user(token: str | None = Depends(oauth2_scheme)):
        print("token", token)
        if token is None:
            return None
        try:
            payload = decode_token(token)
        except ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your token has expired. Please log in again.",
            )
        except DecodeError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Error when decoding the token. Please check your request.",
            )
        except MissingRequiredClaimError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="There is no required field in your token. Please contact the administrator.",
            )

        user_id = payload["sub"]

        async with get_session_manager().session() as session:
            result = await session.execute(
                select(User).where(User.id == user_id).options(selectinload(User.role))
            )
            user: User | None = result.scalar()
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
            if required_role is not None and required_role.value != user.role.name:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Require {required_role.value} role for access.",
                )
            return user

    return _get_user
