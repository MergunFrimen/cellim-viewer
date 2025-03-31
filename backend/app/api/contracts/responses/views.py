from datetime import datetime
from typing import Optional
from uuid import UUID

from app.api.contracts.base import ViewBase


class ViewResponse(ViewBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
