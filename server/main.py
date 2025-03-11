from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import entries, views
from app.database import create_tables
from app.shared.config import settings

app = FastAPI(
    title="CELLIM View API",
    description="API for visualizing and managing CELLIM data",
    version="0.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(entries.router, prefix="/api/entries", tags=["entries"])
app.include_router(views.router, prefix="/api/views", tags=["views"])


async def startup_event():
    # Create database tables on startup if they don't exist
    create_tables()


app.add_event_handler("startup", startup_event)


@app.get("/")
async def root():
    return {"message": "Welcome to CELLIM View API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
