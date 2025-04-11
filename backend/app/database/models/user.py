from uuid import UUID

from pydantic import EmailStr
from sqlmodel import SQLModel, Field

from app.database.models.mixins import WithUuid, WithTimestamp


class User(WithUuid, WithTimestamp, table=True):
    __tablename__ = "users"

    openid: UUID = Field(unique=True, index=True)
    email: EmailStr
    is_superuser: bool = False
