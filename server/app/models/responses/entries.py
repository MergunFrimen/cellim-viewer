from datetime import datetime

from app.models.base.base import EntryBase
from pydantic import BaseModel

from app.models.responses.views import ViewRead


class EntryRead(EntryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    views: list[ViewRead] = []


class SearchResults(BaseModel):
    results: list[EntryRead]
    total: int
    page: int
    per_page: int
    total_pages: int
