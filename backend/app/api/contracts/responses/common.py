from typing import List

from pydantic import BaseModel


class PaginatedResponse[T](BaseModel):
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int
