from datetime import datetime

from app.models.base.base import ViewBase


class ViewRead(ViewBase):
    id: int
    entry_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

