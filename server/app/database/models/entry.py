from datetime import datetime
from typing import List

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models import View
from app.database.models.base import intpk, str255, Base


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    id: Mapped[intpk]
    name: Mapped[str255]
    is_public: Mapped[bool] = mapped_column(default=False)
    description: Mapped[str | None]
    author_email: Mapped[str | None]
    thumbnail_path: Mapped[str | None]
    sharing_uuid: Mapped[str | None]
    edit_uuid: Mapped[str | None]

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now())
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)

    # Relationship with views
    views: Mapped[List["View"]] = relationship(back_populates="entry")
