from datetime import datetime
from typing import Any

from sqlalchemy import ForeignKey, Mapped, mapped_column, relationship

from app.database.models import Base, Entry, str255, uuidpk


class View(Base):
    __tablename__ = "views"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str]
    mvsj: Mapped[dict[str, Any] | None]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    entry_id: Mapped[int] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship()
