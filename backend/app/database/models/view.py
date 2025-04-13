from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.models.base import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class View(Base, UuidMixin, TimestampMixin):
    __tablename__ = "views"

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = None
    thumbnail_url: Mapped[str | None] = mapped_column(String(2083), default=None)
    snapshot_url: Mapped[str | None] = mapped_column(String(2083), default=None)

    # entry_id: UUID = Field(foreign_key="entries.id", ondelete="CASCADE")
    # entry: Entry = Relationship(back_populates="views")
