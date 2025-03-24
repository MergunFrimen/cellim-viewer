from pydantic import BaseModel

from app.models.base.views import ViewBase


class EntryBase(BaseModel):
    name: str
    description: str | None
    author_email: str | None
    thumbnail_path: str | None
    is_public: bool
    sharing_uuid: str
    edit_uuid: str
    views: list[ViewBase]
