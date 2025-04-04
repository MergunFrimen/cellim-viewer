from datetime import datetime
from uuid import UUID

from app.schemas import Entry


class EntryResponse(Entry):
    id: UUID
    created_at: datetime
    updated_at: datetime
