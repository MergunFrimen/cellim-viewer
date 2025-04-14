from datetime import timedelta
from functools import lru_cache
from typing import Any

from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, ExpiredSignatureError, MissingRequiredClaimError, decode, encode
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.settings import get_settings
from app.database.models.mixins.timestamp_mixin import utcnow
from app.database.models.role_model import RoleEnum
from app.database.models.user_model import User
from app.database.seeding.seed_database import get_admin_user_id, get_regular_user_id
from app.database.session_manager import get_session_manager

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{get_settings().API_V1_PREFIX}/token")


def create_access_token(sub: str | Any) -> str:
    expire = utcnow() + timedelta(minutes=get_settings().JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(sub),
        "exp": expire,
        "type": "access",
    }

    return encode(
        payload=to_encode,
        key=get_settings().JWT_ENCRYPT_KEY,
        algorithm=get_settings().JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict[str, Any]:
    return decode(
        jwt=token,
        key=get_settings().JWT_ENCRYPT_KEY,
        algorithms=[get_settings().JWT_ALGORITHM],
    )


@lru_cache
def get_regular_user_token():
    return create_access_token(get_regular_user_id())


@lru_cache
def get_admin_user_token():
    return create_access_token(get_admin_user_id())


def get_current_user(role: RoleEnum | None = None) -> User:
    # TODO: uncomment once oidc works
    # async def _get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    async def _get_current_user() -> User:
        token = get_regular_user_token()
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
                    status_code=404,
                    detail="User not found",
                )
            if role and role != user.role.name:
                raise HTTPException(
                    status_code=403,
                    detail=f'Require "{role.value}" role access.',
                )
            return user

    return _get_current_user
