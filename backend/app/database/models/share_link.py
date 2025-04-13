from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import String

from app.database.models.base import Base
from app.database.models.mixins import TimestampMixin, UuidMixin


class ShareLink(Base, UuidMixin, TimestampMixin):
    __tablename__ = "share_links"

    url: Mapped[str | None] = mapped_column(String(255), default=None)
    editable: Mapped[bool] = False
    active: Mapped[bool] = False

    # entry_id: UUID = Field(foreign_key="entries.id", ondelete="CASCADE")
    # entry: "Entry" = Relationship(back_populates="link")
