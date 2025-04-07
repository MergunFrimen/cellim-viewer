from pydantic import BaseModel, Field

from app.schemas import Entry


class EntryCreateRequest(Entry):
    pass


class EntryUpdateRequest(Entry):
    pass


class SearchParams(BaseModel):
    search_term: list[str] | None = Field(
        default=None, description="Keywords to search by in entry titles and descriptions."
    )
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=100)
