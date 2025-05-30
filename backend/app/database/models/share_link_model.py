from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base_model import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class ShareLink(Base, UuidMixin, TimestampMixin):
    __tablename__ = "share_links"

    is_editable: Mapped[bool] = mapped_column(default=False)
    is_active: Mapped[bool] = mapped_column(default=False)

    entry_id: Mapped[UUID] = mapped_column(ForeignKey("entries.id", ondelete="CASCADE"))

    entry: Mapped["Entry"] = relationship(back_populates="link") # type: ignore
