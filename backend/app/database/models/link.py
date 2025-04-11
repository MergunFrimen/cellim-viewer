from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.database.models.base import Base


class ShareLink(Base):
    __tablename__ = "share_links"

    entry_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("entries.id"))
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    link: Mapped[UUID] = mapped_column(Uuid, default=uuid4)
    editable: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(default=None)
