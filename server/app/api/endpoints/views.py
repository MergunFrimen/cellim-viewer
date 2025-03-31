from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.models import Entry, View
from app.database.session import get_db

router = APIRouter()


# Request Models
class ViewBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=50)
    description: str
    mvsj: Optional[Dict[str, Any]] = None


class ViewCreate(ViewBase):
    entry_id: int


class ViewUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    mvsj: Optional[Dict[str, Any]] = None


# Response Models
class ViewResponse(ViewBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.post("", response_model=ViewResponse, status_code=201)
def create_view(view: ViewCreate, db: Session = Depends(get_db)):
    """Create a new view for an entry."""
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == view.entry_id, Entry.deleted_at.is_(None)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Create new view
    new_view = View(
        title=view.title,
        description=view.description,
        mvsj=view.mvsj,
        entry_id=view.entry_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(new_view)
    db.commit()
    db.refresh(new_view)

    return new_view


@router.get("/entry/{entry_id}", response_model=List[ViewResponse])
def get_views_for_entry(entry_id: int, db: Session = Depends(get_db)):
    """Get all views for a specific entry."""
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Get views
    views = db.query(View).filter(View.entry_id == entry_id, View.deleted_at.is_(None)).all()

    return views


@router.get("/{view_id}", response_model=ViewResponse)
def get_view(view_id: int, db: Session = Depends(get_db)):
    """Get a single view by ID."""
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    return view


@router.put("/{view_id}", response_model=ViewResponse)
def update_view(view_id: int, view_data: ViewUpdate, db: Session = Depends(get_db)):
    """Update a view."""
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    # Update fields if they are provided
    if view_data.title is not None:
        view.title = view_data.title
    if view_data.description is not None:
        view.description = view_data.description
    if view_data.mvsj is not None:
        view.mvsj = view_data.mvsj

    view.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(view)

    return view


@router.delete("/{view_id}", status_code=204)
def delete_view(view_id: int, db: Session = Depends(get_db)):
    """Soft delete a view."""
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    # Soft delete
    view.deleted_at = datetime.utcnow()

    db.commit()

    return None
