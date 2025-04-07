from datetime import datetime
from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, HTTPException, Path, Query, Response, status

from app.api.contracts.requests.entry import EntryCreateRequest, EntryUpdateRequest, SearchParams
from app.api.contracts.responses.entries import EntryResponse
from app.api.contracts.responses.pagination import PaginatedResponse
from app.api.dependencies.core import DbSessionDependency
from app.schemas.entry import Entry

router = APIRouter(tags=["entries"])


@router.post("")
async def create_entry(
    entry: Annotated[EntryCreateRequest, Body()], db: DbSessionDependency
) -> Annotated[EntryResponse, Response(status_code=status.HTTP_201_CREATED)]:
    new_entry = Entry(
        id=uuid4(),
        name=entry.name,
        description=entry.description,
        is_public=entry.is_public,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        deleted_at=None,
        views=[],
    )

    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)

    return new_entry


@router.get("")
def list_entries(
    search_query: Annotated[SearchParams, Query()],
    db: DbSessionDependency,
) -> PaginatedResponse[EntryResponse]:
    query = db.query(Entry).filter(Entry.deleted_at.is_(None), Entry.is_public.is_(True))

    if search_term:
        search_term = f"%{search_term}%"
        query = query.filter(
            (Entry.name.ilike(search_term)) | (Entry.description.ilike(search_term))
        )

    total_items = query.count()
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((search_query.page - 1) * search_query.per_page).limit(per_page)
    items = query.all()
    total_pages = (
        total_items + search_query.per_page - 1
    ) // search_query.per_page  # Ceiling division

    return {
        "items": items,
        "total_items": total_items,
        "total_pages": total_pages,
        "current_page": search_query.page,
        "per_page": search_query.per_page,
    }


@router.get("/{entry_id}")
def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")], db: DbSessionDependency
) -> EntryResponse:
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    return entry


@router.put("/{entry_id}")
def update_entry(
    entry_id: UUID, entry_data: EntryUpdateRequest, db: DbSessionDependency
) -> EntryResponse:
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


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: UUID, db: DbSessionDependency
) -> Annotated[None, Response(status_code=204)]:
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Soft delete
    entry.deleted_at = datetime.now()

    db.commit()

    return None
