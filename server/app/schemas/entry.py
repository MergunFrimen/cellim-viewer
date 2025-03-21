from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel


# Base schemas for creation
class ViewBase(BaseModel):
    title: str
    description: str | None = None


class EntryBase(BaseModel):
    name: str
    description: str | None = None


# Read schemas (returned from API)
class ViewRead(ViewBase):
    id: UUID
    entry_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EntryRead(EntryBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    views: List[ViewRead] = []

    class Config:
        from_attributes = True


# Schema for search results
class SearchResults(BaseModel):
    results: List[EntryRead]
    total: int
    page: int
    per_page: int
    total_pages: int
