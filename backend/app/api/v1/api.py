from fastapi import APIRouter

from app.api.v1.endpoints import auth, entries, files, views
from app.core import settings

v1_api_router = APIRouter(prefix=settings.API_V1_PREFIX)

v1_api_router.include_router(auth.router)
v1_api_router.include_router(entries.router)
v1_api_router.include_router(files.router)
v1_api_router.include_router(views.router)
