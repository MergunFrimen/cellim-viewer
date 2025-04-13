from uuid import UUID

from sqlmodel import Field, Relationship, SQLModel

from app.database.models.mixins import WithTimestamp, WithUuid


class EntryBase(SQLModel):
    name: str = Field(max_length=255)
    description: str | None = None
    is_public: bool = False


class Entry(EntryBase, WithUuid, WithTimestamp, table=True):
    __tablename__ = "entries"

    user_id: UUID = Field(foreign_key="user.id", ondelete="CASCADE")
    user: ["User"] = Relationship(back_populates="entries")
    views: ["View"] = Relationship(back_populates="entry", passive_deletes="all")
    link: ["Link"] = Relationship(back_populates="entry", passive_deletes="all")
