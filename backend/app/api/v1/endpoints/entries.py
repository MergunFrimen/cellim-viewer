from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, HTTPException, Path, Query, status
from sqlalchemy import func, or_, select

from app.api.v1.contracts.requests.entry import (
    EntryCreateRequest,
    EntryUpdateRequest,
    SearchQueryParams,
)
from app.api.v1.contracts.responses.entry import EntryPreviewResponse, EntryWithViewsResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.dependencies import OptionalUser, RequireUser, SessionDependency
from app.api.v1.tags import Tags
from app.database.models import Entry

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=EntryWithViewsResponse,
)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: SessionDependency,
    current_user: RequireUser,
):
    new_entry = Entry(user=current_user, **request.model_dump())
    session.add(new_entry)
    await session.commit()

    return new_entry


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=PaginatedResponse[EntryPreviewResponse],
)
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: SessionDependency,
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


@router.get(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=EntryWithViewsResponse,
)
async def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
    current_user: OptionalUser,
):
    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    if current_user is not None:
        if not entry.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return EntryPreviewResponse(**entry)
    else:
        if not entry.is_public:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        return EntryPreviewResponse(**entry)


@router.put(
    "/{entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=EntryWithViewsResponse,
)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: SessionDependency,
    current_user: RequireUser,
):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    entry = await session.get(Entry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(entry, key, value)
    await session.commit()

    return entry


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: SessionDependency,
    current_user: RequireUser,
):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    result = await session.get(Entry, entry_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    await session.delete(result)
    await session.commit()
