from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class User(Base, UuidMixin, TimestampMixin):
    __tablename__ = "users"

    openid: Mapped[UUID]
    email: Mapped[str]

    role_id: Mapped[UUID] = mapped_column(ForeignKey("roles.id"))

    role: Mapped["Role"] = relationship(back_populates="users")  # type: ignore
    entries: Mapped[list["Entry"]] = relationship(  # type: ignore
        back_populates="user",
        cascade="all, delete-orphan",
    )
