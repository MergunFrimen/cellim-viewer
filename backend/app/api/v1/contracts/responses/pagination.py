from pydantic import BaseModel, Field


class PaginatedResponse[T](BaseModel):
    current_page: int = Field(1, ge=1)
    per_page: int = Field(100, ge=1, le=100)
    total_pages: int
    total_items: int
    items: list[T]
