from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Path, Query, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.contracts.requests.entry import (
    EntryCreateRequest,
    SearchQueryParams,
    EntryUpdateRequest,
)
from app.api.v1.contracts.responses.entries import EntryResponse
from app.api.v1.contracts.responses.pagination import PaginatedResponse
from app.api.v1.tags import Tags
from app.database.session_manager import get_async_session

router = APIRouter(prefix="/entries", tags=[Tags.entries])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_entry(
    request: Annotated[EntryCreateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> EntryResponse:
    pass


@router.get("", status_code=status.HTTP_200_OK)
async def list_entries(
    search_query: Annotated[SearchQueryParams, Query()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> PaginatedResponse[EntryResponse]:
    pass


@router.get("/{entry_id}", status_code=status.HTTP_200_OK)
def get_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> EntryResponse:
    pass


@router.put("/{entry_id}", status_code=status.HTTP_200_OK)
def update_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    request: Annotated[EntryUpdateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> EntryResponse:
    pass


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> None:
    pass
