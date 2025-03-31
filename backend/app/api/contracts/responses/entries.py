from datetime import datetime
from typing import Optional

from server.app.api.contracts.base import EntryBase


class EntryResponse(EntryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
