from typing import Type
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.models.entry import Entry
from app.database.models.view import View
from app.database.session import get_db

router = APIRouter()


@router.get("/entry/{entry_id}")
def list_views_for_entry(entry_id: UUID, db: Session = Depends(get_db)) -> list[Type[View]]:
    entry = db.query(Entry).filter(Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    views = db.query(View).filter(View.entry == entry_id).all()

    return views
