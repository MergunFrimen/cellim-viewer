from pydantic import BaseModel, Field


class PaginatedResponse[T](BaseModel):
    items: list[T]
    total_items: int
    total_pages: int
    current_page: int = Field(1, ge=1)
    per_page: int = Field(100, ge=1, le=100)
