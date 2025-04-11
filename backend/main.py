from contextlib import asynccontextmanager

from backend.app.api.v1.tags import v1_tags_metadata
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import v1_api_router
from app.core.settings import settings
from app.database.models.base import Base
from app.database.session_manager import sessionmanager


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
    openapi_tags=v1_tags_metadata,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

# routes
app.include_router(v1_api_router)

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.APP_HOST, port=settings.APP_PORT)
