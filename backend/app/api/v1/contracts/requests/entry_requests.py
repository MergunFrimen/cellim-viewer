from uuid import UUID

from pydantic import BaseModel, Field


class EntryCreateRequest(BaseModel):
    volseg_entry_id: UUID = Field()
    name: str = Field(min_length=1, max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    is_public: bool | None = Field(default=False)

    model_config = {"extra": "forbid"}


class EntryUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255, examples=["Entry Name"])
    description: str | None = Field(default=None, examples=["Markdown description."])
    is_public: bool | None = Field(default=None)

    model_config = {"extra": "forbid"}


class SearchQueryParams(BaseModel):
    search_term: str | None = Field(
        default=None,
        description="Keywords to search by in entry titles and descriptions.",
    )
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=10, ge=1, le=100)

    model_config = {"extra": "forbid"}
