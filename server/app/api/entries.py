from datetime import datetime
import random
from typing import Annotated, List, Optional, Dict, Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.database.models import Entry
from app.database.session import get_db

router = APIRouter()


# Request Models
class EntryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    author_email: Optional[EmailStr] = None
    thumbnail_path: Optional[str] = None
    is_public: bool = True


class EntryCreate(EntryBase):
    pass


class EntryUpdate(EntryBase):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    is_public: Optional[bool] = None


# Response Models
class EntryResponse(EntryBase):
    id: int
    sharing_uuid: Optional[str] = None
    edit_uuid: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EntryListResponse(BaseModel):
    items: List[EntryResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


@router.post("", response_model=EntryResponse, status_code=201)
def create_entry(entry: EntryCreate, db: Session = Depends(get_db)):
    new_entry = Entry(
        id=random.randint(100,1000), # TODO: replace with UUID
        name=entry.name,
        description=entry.description,
        author_email=entry.author_email,
        thumbnail_path=entry.thumbnail_path,
        is_public=entry.is_public,
        sharing_uuid=str(uuid4()) if entry.is_public else None,
        edit_uuid=str(uuid4()),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        deleted_at=None,
        views=[]
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return new_entry


@router.get("", response_model=EntryListResponse)
def list_entries(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Entry).filter(Entry.deleted_at.is_(None), Entry.is_public.is_(True))
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Entry.name.ilike(search_term)) | (Entry.description.ilike(search_term))
        )
    
    total = query.count()
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)
    entries = query.all()
    total_pages = (total + per_page - 1) // per_page  # Ceiling division
    
    return {
        "items": entries,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }


@router.get("/{entry_id}", response_model=EntryResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return entry


@router.get("/by-sharing-uuid/{uuid}", response_model=EntryResponse)
def get_entry_by_sharing_uuid(uuid: str, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(
        Entry.sharing_uuid == uuid, 
        Entry.is_public.is_(True),
        Entry.deleted_at.is_(None)
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return entry


@router.get("/by-edit-uuid/{uuid}", response_model=EntryResponse)
def get_entry_by_edit_uuid(uuid: str, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(
        Entry.edit_uuid == uuid,
        Entry.deleted_at.is_(None)
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    return entry


@router.put("/{entry_id}", response_model=EntryResponse)
def update_entry(entry_id: int, entry_data: EntryUpdate, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # Update fields if they are provided
    if entry_data.name is not None:
        entry.name = entry_data.name
    if entry_data.description is not None:
        entry.description = entry_data.description
    if entry_data.author_email is not None:
        entry.author_email = entry_data.author_email
    if entry_data.thumbnail_path is not None:
        entry.thumbnail_path = entry_data.thumbnail_path
    if entry_data.is_public is not None:
        entry.is_public = entry_data.is_public
        # If changing to public, create a sharing UUID if it doesn't exist
        if entry_data.is_public and not entry.sharing_uuid:
            entry.sharing_uuid = str(uuid4())
        # If changing to private, remove the sharing UUID
        elif not entry_data.is_public:
            entry.sharing_uuid = None
    
    entry.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(entry)
    
    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    # Soft delete
    entry.deleted_at = datetime.utcnow()
    
    db.commit()
    
    return None