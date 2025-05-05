from fastapi import APIRouter

from app.celery.tasks import process_large_dataset

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("")
async def start_processing(seconds: int):
    process_large_dataset.delay(seconds)

    return "OK"
