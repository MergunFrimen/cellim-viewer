from datetime import datetime
from uuid import UUID

from app.schemas.view import View


class ViewResponse(View):
    id: UUID
    image_path: str | None
    created_at: datetime
    updated_at: datetime
