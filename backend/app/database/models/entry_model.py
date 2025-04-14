from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class Entry(Base, UuidMixin, TimestampMixin):
    __tablename__ = "entries"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = None
    is_public: Mapped[bool] = False

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    user: Mapped["User"] = relationship(back_populates="entries")
    views: Mapped[list["View"]] = relationship(back_populates="entry")
    link: Mapped["ShareLink"] = relationship(back_populates="entry")
