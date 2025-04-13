from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.contracts.requests.entry import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entries import EntryResponse, EntryWithViewsResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.models.share_link import ShareLink
from app.database.session_manager import get_async_session

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=EntryWithViewsResponse)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    new_entry = Entry(**request.model_dump())
    new_link = ShareLink()
    new_entry.link = new_link
    session.add(new_entry)
    await session.commit()

    stmt = (
        select(Entry)
        .where(Entry.id == new_entry.id)
        .options(selectinload(Entry.link), selectinload(Entry.views))
    )
    result = await session.execute(stmt)
    entry_with_views = result.scalar_one()

    return entry_with_views


@router.get("", status_code=status.HTTP_200_OK, response_model=PaginatedResponse[EntryResponse])
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    query = select(Entry).where(Entry.is_public == True)

    if search_query.search_term:
        search_term = f"%{search_query.search_term}%"
        query = query.filter(Entry.name.ilike(search_term) | Entry.description.ilike(search_term))

    count_query = select(func.count()).select_from(query.subquery())
    total_items = await session.scalar(count_query)
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((search_query.page - 1) * search_query.per_page).limit(
        search_query.per_page
    )
    result = await session.execute(query)
    entries = result.scalars().all()
    total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

    return {
        "items": entries,
        "total_items": total_items,
        "page": search_query.page,
        "per_page": search_query.per_page,
        "total_pages": total_pages,
    }


@router.get("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryWithViewsResponse)
async def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    stmt = (
        select(Entry)
        .where(Entry.id == entry_id)
        .options(selectinload(Entry.link), selectinload(Entry.views))
    )
    result = await session.execute(stmt)
    entry_with_views = result.scalar_one()

    return entry_with_views


@router.put("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryWithViewsResponse)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry_db = await session.get(Entry, entry_id)
    if not entry_db:
        raise HTTPException(status_code=404, detail="Entry not found")

    entry_data = request.model_dump(exclude_unset=True)
    entry_db.sqlmodel_update(entry_data)
    session.add(entry_db)

    await session.commit()

    stmt = select(Entry).where(Entry.id == entry_id).options(selectinload(Entry.views))
    entry = await session.execute(stmt)
    entry_with_views = entry.scalar_one()

    return entry_with_views


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> None:
    result = await session.get(Entry, entry_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")
    await session.delete(result)
    await session.commit()
