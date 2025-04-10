from datetime import datetime
from typing import Any

from sqlalchemy import JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, Str255, UuidFk, UuidPk


class View(Base):
    __tablename__ = "views"

    # Attributes
    id: Mapped[UuidPk]
    name: Mapped[Str255]
    description: Mapped[str | None]
    snapshot: Mapped[dict[str, Any] | None] = mapped_column(JSON)

    # Relationships
    entry_id: Mapped[UuidFk] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship()

    thumbnail_uri: Mapped[str | None] = mapped_column(default=None)
    snapshot_uri: Mapped[str | None] = mapped_column(default=None)

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)
