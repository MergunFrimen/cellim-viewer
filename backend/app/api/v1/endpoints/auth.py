from fastapi import APIRouter

from app.api.v1.tags import Tags

router = APIRouter(prefix="/auth", tags=[Tags.auth])
