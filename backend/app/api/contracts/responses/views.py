from datetime import datetime
from uuid import UUID

from app.schemas.view import View


class ViewResponse(View):
    id: UUID
    created_at: datetime
    updated_at: datetime
