# app/api/v1/endpoints/task_endpoint.py
from typing import Annotated

from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from app.celery.tasks import process_large_dataset

router = APIRouter(prefix="/tasks", tags=["Tasks"])


class TaskRequest(BaseModel):
    seconds: int = Field()


@router.post("")
def start_processing(request: Annotated[TaskRequest, Body()]):
    task = process_large_dataset.delay(request.seconds)
    return {"task_id": task.id}
