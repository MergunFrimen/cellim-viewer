# app/celery/tasks.py
import asyncio
import json
from typing import Any

from redis import Redis

from app.celery.celery_app import app


@app.task(bind=True)
def process_large_dataset(self, seconds: int) -> dict[str, Any]:
    redis = Redis.from_url("redis://redis:6379/0")
    channel = f"task_updates:{self.request.id}"

    for i in range(seconds):
        progress = (i + 1) / seconds * 100
        message = {"status": "PROGRESS", "progress": progress, "current": i + 1, "total": seconds}
        redis.publish(channel, json.dumps(message))
        asyncio.sleep(1)

    result = {"status": "COMPLETED", "message": "Task completed successfully"}
    redis.publish(channel, json.dumps(result))
    return result
