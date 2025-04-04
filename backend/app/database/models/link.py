from datetime import datetime

from sqlalchemy import ForeignKey, Mapped, mapped_column, relationship

from app.database.models import Base, Entry, uuidpk


class Link(Base):
    __tablename__ = "links"

    # Attributes
    id: Mapped[uuidpk]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    entry_id: Mapped[int] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship()
