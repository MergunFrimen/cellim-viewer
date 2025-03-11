from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entry import Entry, View
from app.schemas.entry import ViewRead

router = APIRouter()


@router.get("/entry/{entry_id}", response_model=List[ViewRead])
def list_views_for_entry(entry_id: UUID, db: Session = Depends(get_db)):
    """List all views for a specific entry"""
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Get all views for the entry
    views = db.query(View).filter(View.entry_id == entry_id).all()
    return views
