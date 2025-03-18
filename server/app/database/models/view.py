from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON, DateTime

from app.database.models.base import intpk, str255
from app.database.models.entry import Entry
from app.database.session import Base


class View(Base):
    __tablename__ = "views"

    id: Mapped[intpk]
    title: Mapped[str255]
    description: Mapped[str]
    mvsj: Mapped[JSON]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)

    # Relationship with entry
    entry: Mapped[Entry] = relationship("Entry")
