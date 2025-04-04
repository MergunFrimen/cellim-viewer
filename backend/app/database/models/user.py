from datetime import datetime

from sqlalchemy import Mapped, relationship

from app.database.models import Base, Entry, uuidpk


class User(Base):
    __tablename__ = "users"

    # Attributes
    id: Mapped[uuidpk]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    entries: Mapped[list["Entry"]] = relationship()
