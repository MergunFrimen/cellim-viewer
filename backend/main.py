from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import lifespan
from app.api.endpoints import entries, files, views
from app.api.tags import tags_metadata
from app.database.models.base import Base
from app.database.session import sessionmanager
from app.middleware.test_middleware import TestMiddleware
from app.shared.settings import settings


# TODO: move this somewhere else
async def init_models():
    async with sessionmanager.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# TODO: move this somewhere else
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await init_models()
    yield
    # shutdown
    if sessionmanager.engine is not None:
        await sessionmanager.close()


app = FastAPI(
    root_path=settings.APP_ROOT_PATH,
    title=settings.APP_NAME,
    summary=settings.APP_SUMMARY,
    contact=settings.APP_CONTACT,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    openapi_tags=tags_metadata,
)

# routes
app.include_router(entries.router, prefix="/v1")
app.include_router(views.router, prefix="/v1")
app.include_router(files.router, prefix="/v1")

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TestMiddleware, number=1)
app.add_middleware(TestMiddleware, number=2)
