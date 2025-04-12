from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Body, Path, Query, status, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from app.api.v1.contracts.requests.entry import (
    EntryCreateRequest,
    SearchQueryParams,
    EntryUpdateRequest,
)
from app.api.v1.contracts.responses.entries import EntryResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.tags import Tags
from app.database.models import Entry
from app.database.session_manager import get_async_session

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=EntryResponse)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry = Entry(**request.model_dump())
    session.add(entry)
    await session.commit()
    await session.refresh(entry)
    return entry

@router.get("", status_code=status.HTTP_200_OK, response_model=list[EntryResponse])
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    result = await session.execute(select(Entry).limit(5))
    entries = result.scalars().all()
    return entries


@router.get("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryResponse)
async def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    result = await session.get(Entry, entry_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")
    return result


@router.put("/{entry_id}", status_code=status.HTTP_200_OK, response_model=EntryResponse)
async def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
):
    entry_db = await session.get(Entry, entry_id)
    if not entry_db:
        raise HTTPException(status_code=404, detail="Entry not found")
    entry_data = request.model_dump(exclude_unset=True)
    print(entry_data)
    entry_db.sqlmodel_update(entry_data)
    session.add(entry_db)
    await session.commit()
    await session.refresh(entry_db)
    return entry_db


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