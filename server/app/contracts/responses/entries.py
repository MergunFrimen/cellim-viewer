from datetime import datetime

from app.contracts.common.base import EntryBase
from app.schemas.entry import ViewRead
from pydantic import BaseModel


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
