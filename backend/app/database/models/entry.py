from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlmodel import SQLModel

from app.database.models.base import UuidFk
from app.database.models.common import WithTimestamp, WithUuid


class Entry(SQLModel, WithUuid, WithTimestamp, table=True):
    __tablename__ = "entries"

    name: str
    description: str | None
    is_public: bool = False

    # user_id: Mapped[UuidFk] = mapped_column(ForeignKey("users.id"))
    # views: Mapped[list["View"]] = relationship()
    # link: Mapped["ShareLink"] = relationship()
    # user: Mapped["User"] = relationship()
