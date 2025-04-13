from typing import Annotated
from uuid import UUID, uuid4

from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, Path, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.api.v1.contracts.requests.view import ViewUpdateRequest
from app.api.v1.contracts.responses.views import ViewResponse
from app.api.v1.tags import Tags
from app.database.models.entry import Entry
from app.database.models.view import View
from app.database.session_manager import get_async_session
from app.services.files.upload import file_storage

router = APIRouter(prefix="/entry/{entry_id}/views", tags=[Tags.views])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ViewResponse)
async def create_view_with_image(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
    name: Annotated[str, Form(max_length=255, examples=["View Name"])],
    description: Annotated[str, Form(max_length=255, examples=["View Description"])],
    session: Annotated[AsyncSession, Depends(get_async_session)],
    thumbnail_image: Annotated[UploadFile | None, File()] = None,
    snapshot_json: Annotated[UploadFile | None, File()] = None,
) -> ViewResponse:
    result = await session.get(Entry, entry_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")

    view_id = uuid4()
    thumbnail_url: str | None = None
    snapshot_url: str | None = None

    # save snapshot
    if snapshot_json:
        try:
            snapshot_url = await file_storage.save_view_snapshot(
                view_id,
                snapshot_json.file,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving JSON snapshot: {str(e)}")

    # save image
    if thumbnail_image:
        try:
            thumbnail_url = await file_storage.save_view_image(
                view_id,
                thumbnail_image.file,
                thumbnail_image.filename,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

    new_view = View(
        id=view_id,
        name=name,
        description=description,
        snapshot_url=snapshot_url,
        thumbnail_url=thumbnail_url,
    )

    session.add(new_view)
    await session.commit()

    return new_view


@router.get("", status_code=status.HTTP_200_OK)
def list_views_for_entry(
    entry_id: Annotated[UUID, Path(title="Entry ID")],
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
