from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import auth, entries, files, views
from app.api.tags import tags_metadata
from app.core.settings import settings
from app.database.models.base import Base
from app.database.session_manager import sessionmanager
from app.middleware.test_middleware import TestMiddleware


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
    title=settings.APP_NAME,
    summary=settings.APP_SUMMARY,
    version=settings.APP_VERSION,
    contact=settings.APP_CONTACT,
    license_info=settings.APP_LICENCE,
    openapi_tags=tags_metadata,
    lifespan=lifespan,
)

# routes
app.include_router(auth.router, prefix=settings.API_V1_PATH)
app.include_router(entries.router, prefix=settings.API_V1_PATH)
app.include_router(files.router, prefix=settings.API_V1_PATH)
app.include_router(views.router, prefix=settings.API_V1_PATH)

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.APP_HOST, port=settings.APP_PORT)
