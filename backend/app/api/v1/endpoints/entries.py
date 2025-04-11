from datetime import datetime
from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, HTTPException, Path, Query, status
from sqlalchemy import select

from app.api.v1.contracts.requests.entry import EntryCreateRequest, EntryUpdateRequest, SearchParams
from app.api.v1.contracts.responses.entries import EntryResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.dependencies.core import DbSessionDependency
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.models.link import ShareLink
from app.database.models.user import User

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()], session: DbSessionDependency
) -> EntryResponse:
    async with session.begin():
        stmt = select(User).where(User.id == request.user_id)
        result = await session.execute(stmt)
        user: User | None = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        entry_id = uuid4()

        new_link = ShareLink(
            id=uuid4(),
            active=False,
            editable=False,
            link=uuid4(),
            entry_id=entry_id,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        new_entry = Entry(
            id=entry_id,
            name=request.name,
            description=request.description,
            is_public=request.is_public,
            link=new_link,
            user=user,
            user_id=user.id,
            views=[],
        )

        session.add(new_link)
        session.add(new_entry)

    return {"entry": new_entry.id, "link": new_link.id}


@router.get("")
async def list_entries(
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    return entry


@router.put("/{entry_id}")
def update_entry(
    entry_id: UUID, entry_data: EntryUpdateRequest, db: DbSessionDependency
) -> EntryResponse:
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

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


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: UUID, db: DbSessionDependency) -> None:
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()

    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    # Soft delete
    entry.deleted_at = datetime.now()

    db.commit()
