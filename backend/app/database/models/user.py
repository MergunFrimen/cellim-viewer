from uuid import UUID

from sqlalchemy.orm import Mapped

from app.database.models.base import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class User(Base, UuidMixin, TimestampMixin):
    __tablename__ = "users"

    openid: Mapped[UUID]
    email: Mapped[str]
    is_superuser: Mapped[bool] = False

    # entries: list["Entry"] = Relationship(back_populates="user", passive_deletes="all")
