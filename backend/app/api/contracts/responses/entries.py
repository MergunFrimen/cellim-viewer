from datetime import datetime
from typing import Optional
from uuid import UUID

from app.api.contracts.base import EntryBase


class EntryResponse(EntryBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
