from pydantic import BaseModel


class EntryBase(BaseModel):
    name: str
    description: str | None = None


class ViewBase(BaseModel):
    title: str
    description: str | None = None
