from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entry import Entry
from app.schemas.entry import SearchResults

router = APIRouter()


@router.get("/", response_model=SearchResults)
def list_entries(
    search: Optional[str] = None,
    public_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List entries with optional keyword search"""
    query = db.query(Entry)

    # Apply public filter
    # if public_only:
    #     query = query.filter(Entry.is_public == True)

    # Apply search if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(Entry.name.ilike(search_term), Entry.description.ilike(search_term))
        )

    # Count results
    total = query.count()

    # Apply pagination
    entries = query.order_by(Entry.created_at.desc()).offset(skip).limit(limit).all()

    # Calculate pagination info
    page = skip // limit + 1 if limit > 0 else 1
    total_pages = (total + limit - 1) // limit if limit > 0 else 1

    return {
        "results": entries,
        "total": total,
        "page": page,
        "per_page": limit,
        "total_pages": total_pages,
    }
