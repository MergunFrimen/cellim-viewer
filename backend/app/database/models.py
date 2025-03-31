from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedAsDataclass, mapped_column, relationship
from sqlalchemy.types import JSON, String
from typing_extensions import Annotated

str255 = Annotated[str, 255]
uuidpk = Annotated[UUID, mapped_column(primary_key=True)]


class Base(DeclarativeBase, MappedAsDataclass):
    type_annotation_map = {
        dict[str, Any]: JSON,
        str255: String(50),
    }


class Entry(Base):
    __tablename__ = "entries"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str | None]
    is_public: Mapped[bool]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    views: Mapped[list["View"]] = relationship(back_populates="entry", cascade="all, delete")


class View(Base):
    __tablename__ = "views"

    # Attributes
    id: Mapped[uuidpk]
    name: Mapped[str255]
    description: Mapped[str]
    mvsj: Mapped[dict[str, Any] | None]
    created_at: Mapped[datetime | None]
    updated_at: Mapped[datetime | None]
    deleted_at: Mapped[datetime | None]

    # Relationships
    entry_id: Mapped[int] = mapped_column(ForeignKey("entries.id"))
    entry: Mapped["Entry"] = relationship(back_populates="views")
