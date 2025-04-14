from uuid import UUID

from sqlalchemy.orm import Mapped, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class User(Base, UuidMixin, TimestampMixin):
    __tablename__ = "users"

    openid: Mapped[UUID]
    email: Mapped[str]
    is_superuser: Mapped[bool] = False

    entries: Mapped[list["Entry"]] = relationship(back_populates="user", passive_deletes="all")
