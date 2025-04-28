from pydantic import BaseModel, Field

from app.api.v1.contracts.responses.common import DebugModelName


class PaginatedResponse[T](DebugModelName, BaseModel):
    page: int = Field(ge=1)
    per_page: int = Field(ge=1, le=100)
    total_pages: int
    total_items: int
    items: list[T]

    # model_config = ConfigDict(from_attributes=True)
