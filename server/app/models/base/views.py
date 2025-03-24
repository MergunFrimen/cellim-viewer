from pydantic import BaseModel


class ViewBase(BaseModel):
    title: str
    description: str | None = None
