from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import entries, views
from app.database.models.base import Base
from app.database.session import sessionmanager
from app.middleware.TestMiddleware import TestMiddleware
from app.shared.settings import settings


async def init_models():
    async with sessionmanager.engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await init_models()
    yield
    # shutdown
    if sessionmanager.engine is not None:
        await sessionmanager.close()


#
middleware: list[Middleware] = [
    Middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ),
    Middleware(TestMiddleware, number=1),
    Middleware(TestMiddleware, number=2),
]

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    middleware=middleware,
)


app.include_router(entries.router)
app.include_router(views.router)
