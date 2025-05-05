from celery import Celery

from app.core.settings import get_settings

app = Celery(
    "tasks",
    include=["app.celery.tasks"],
    broker=get_settings().REDIS_URL,
)
