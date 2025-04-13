from uuid import UUID

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid


class UserBase(SQLModel):
    openid: UUID = Field(unique=True, index=True)
    email: EmailStr
    is_superuser: bool = False


class User(UserBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "users"

    entries: list["Entry"] = Relationship(back_populates="user", cascade_delete=True)
