from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Body, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.api.v1.contracts.requests.view import ViewCreateRequest, ViewUpdateRequest
from app.api.v1.contracts.responses.views import ViewResponse
from app.api.v1.tags import Tags
from app.database.session_manager import get_async_session

router = APIRouter(prefix="/views", tags=[Tags.views])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_view_with_image(
    request: Annotated[ViewCreateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> ViewResponse:
    pass


@router.get("entry/{view_id}", status_code=status.HTTP_200_OK)
def list_views_for_entry(
    view_id: Annotated[UUID, Path(title="Entry ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> list[ViewResponse]:
    pass


@router.get("/{view_id}", status_code=status.HTTP_200_OK)
def get_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> ViewResponse:
    pass


@router.put("/{view_id}", status_code=status.HTTP_200_OK)
def update_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    request: Annotated[ViewUpdateRequest, Body()],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> ViewResponse:
    pass


@router.delete("/{view_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_view(
    view_id: Annotated[UUID, Path(title="View ID")],
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> None:
    pass
