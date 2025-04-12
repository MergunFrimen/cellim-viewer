from pydantic import BaseModel, Field, ConfigDict

from app.database.models.entry import EntryBase


class EntryRequest(EntryBase):
    name: str = Field(max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])


class EntryCreateRequest(EntryRequest):
    pass


class EntryUpdateRequest(EntryRequest):
    pass


class SearchQueryParams(BaseModel):
    search_term: list[str] | None = Field(
        default=None, description="Keywords to search by in entry titles and descriptions."
    )
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=100)
