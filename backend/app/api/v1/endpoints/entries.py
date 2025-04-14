from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.entry import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entry import EntryWithViewsResponse, PublicEntryPreviewResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.models.mixins.timestamp_mixin import utcnow
from app.database.session_manager import get_async_session

router = APIRouter(prefix="/entries", tags=[Tags.entries])


# REQUIRE LOGIN
@router.post("", status_code=status.HTTP_201_CREATED, response_model=EntryWithViewsResponse)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    new_entry = Entry(**request.model_dump())
    session.add(new_entry)
    await session.commit()

    return new_entry


# PUBLIC
@router.get(
    "", status_code=status.HTTP_200_OK, response_model=PaginatedResponse[PublicEntryPreviewResponse]
)
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    query = select(Entry).where(Entry.is_public == True)

    if search_query.search_term:
        search_conditions = []
        for term in search_query.search_term:
            search_term = f"%{term}%"
            search_conditions.append(
                or_(Entry.name.ilike(search_term), Entry.description.ilike(search_term))
            )
        if search_conditions:
            query = query.filter(*search_conditions)

    count_query = select(func.count()).select_from(query.subquery())
    total_items = await session.scalar(count_query)
    query = query.order_by(Entry.created_at.desc())
    query = query.offset((search_query.page - 1) * search_query.per_page).limit(
        search_query.per_page
    )
    result = await session.execute(query)
    entries = result.scalars().all()
    total_pages = (total_items + search_query.per_page - 1) // search_query.per_page

    return PaginatedResponse(
        items=entries,
        total_items=total_items,
        page=search_query.page,
        per_page=search_query.per_page,
        total_pages=total_pages,
    )


# PUBLIC
@router.get("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryWithViewsResponse)
async def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    return entry


# REQUIRE LOGIN
@router.put("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryWithViewsResponse)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)
    await session.commit()

    return entry


# REQUIRE LOGIN
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
