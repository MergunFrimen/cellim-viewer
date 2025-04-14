from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class View(Base, UuidMixin, TimestampMixin):
    __tablename__ = "views"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = None
    thumbnail_url: Mapped[str] = mapped_column(String(2083))
    snapshot_url: Mapped[str] = mapped_column(String(2083))

    entry_id: Mapped[UUID] = mapped_column(ForeignKey("entries.id", ondelete="CASCADE"))
    entry: Mapped["Entry"] = relationship(back_populates="views")
