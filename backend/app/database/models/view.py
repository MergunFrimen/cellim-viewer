from datetime import datetime
from typing import Any

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base, snapshot, str255, uuidfk, uuidpk


class View(Base):
    __tablename__ = "views"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str | None]
    snapshot: Mapped[snapshot | None]

    # Relationships
    entry_id: Mapped[uuidfk] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship()

    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)
