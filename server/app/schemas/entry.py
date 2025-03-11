from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


# Base schemas for creation
class ViewBase(BaseModel):
    title: str
    description: Optional[str] = None


class EntryBase(BaseModel):
    name: str
    description: Optional[str] = None


# Read schemas (returned from API)
class ViewRead(ViewBase):
    id: UUID
    entry_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class EntryRead(EntryBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    views: List[ViewRead] = []

    class Config:
        orm_mode = True


# Schema for search results
class SearchResults(BaseModel):
    results: List[EntryRead]
    total: int
    page: int
    per_page: int
    total_pages: int
