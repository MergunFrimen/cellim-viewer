import uuid
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.contracts.requests.entries import EntryCreateRequest, EntryUpdateRequest
from app.api.contracts.responses.common import PaginatedResponse
from app.api.contracts.responses.entries import EntryResponse
from app.database.models import Entry
from app.database.session import get_db

router = APIRouter()


@router.post("", response_model=EntryResponse, status_code=201)
def create_entry(entry: EntryCreateRequest, db: Session = Depends(get_db)):
    new_entry = Entry(
        id=uuid.uuid4(),
        name=entry.name,
        description=entry.description,
        is_public=entry.is_public,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        deleted_at=None,
        views=[],
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@router.get("", response_model=PaginatedResponse[EntryResponse])
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
def get_entry(entry_id: UUID, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    return entry


@router.put("/{entry_id}", response_model=EntryResponse)
def update_entry(entry_id: UUID, entry_data: EntryUpdateRequest, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Update fields if they are provided
    if entry_data.name is not None:
        entry.name = entry_data.name
    if entry_data.description is not None:
        entry.description = entry_data.description
    if entry_data.is_public is not None:
        entry.is_public = entry_data.is_public

    entry.updated_at = datetime.now()

    db.commit()
    db.refresh(entry)

    return entry


@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: UUID, db: Session = Depends(get_db)):
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Soft delete
    entry.deleted_at = datetime.now()

    db.commit()

    return None
