from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class ShareLink(Base, UuidMixin, TimestampMixin):
    __tablename__ = "share_links"

    link_url: Mapped[str] = mapped_column(String(255))
    editable: Mapped[bool] = False
    active: Mapped[bool] = False

    entry_id: Mapped[UUID] = mapped_column(ForeignKey("entries.id", ondelete="CASCADE"))

    entry: Mapped["Entry"] = relationship(back_populates="link")
