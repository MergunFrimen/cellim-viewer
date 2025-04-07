from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.contracts.requests.view import ViewCreateRequest, ViewUpdateRequest
from app.api.contracts.responses.views import ViewResponse
from app.api.dependencies.core import DbSessionDependency
from app.database.models.entry import Entry
from app.database.models.view import View

router = APIRouter(tags=["views"])


@router.post("", response_model=ViewResponse, status_code=201)
def create_view(view: ViewCreateRequest, db: AsyncSession = Depends(DbSessionDependency)):
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == view.entry_id, Entry.deleted_at.is_(None)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Create new view
    new_view = View(
        id=uuid4(),
        name=view.name,
        description=view.description,
        mvsj=view.mvsj,
        entry_id=view.entry_id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        deleted_at=None,
        entry=entry,
    )

    db.add(new_view)
    db.commit()
    db.refresh(new_view)

    return new_view


@router.get("/entry/{entry_id}", response_model=list[ViewResponse])
def get_views_for_entry(entry_id: UUID, db: AsyncSession = Depends(DbSessionDependency)):
    # Check if entry exists
    entry = db.query(Entry).filter(Entry.id == entry_id, Entry.deleted_at.is_(None)).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    # Get views
    views = db.query(View).filter(View.entry_id == entry_id, View.deleted_at.is_(None)).all()

    return views


@router.get("/{view_id}", response_model=ViewResponse)
def get_view(view_id: UUID, db: AsyncSession = Depends(DbSessionDependency)):
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    return view


@router.put("/{view_id}", response_model=ViewResponse)
def update_view(
    view_id: UUID, view_data: ViewUpdateRequest, db: AsyncSession = Depends(DbSessionDependency)
):
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    # Update fields if they are provided
    if view_data.name is not None:
        view.name = view_data.name
    if view_data.description is not None:
        view.description = view_data.description
    if view_data.mvsj is not None:
        view.mvsj = view_data.mvsj

    view.updated_at = datetime.now()

    db.commit()
    db.refresh(view)

    return view


@router.delete("/{view_id}", status_code=204)
def delete_view(view_id: UUID, db: AsyncSession = Depends(DbSessionDependency)):
    view = db.query(View).filter(View.id == view_id, View.deleted_at.is_(None)).first()

    if not view:
        raise HTTPException(status_code=404, detail="View not found")

    # Soft delete
    view.deleted_at = datetime.now()

    db.commit()

    return None
