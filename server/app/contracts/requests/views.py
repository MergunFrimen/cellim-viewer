from pydantic import BaseModel, Json

class ViewBase(BaseModel):
    id: int
    title: str
    description: str
    mvsj: Json | None
    entry_id: int
