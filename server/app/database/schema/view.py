from datetime import datetime

from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON, DateTime

from app.database.schema.base import intpk, str255, Base
from app.database.schema.entry import Entry


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
    entry_id: Mapped[intpk] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship(back_populates="views")
