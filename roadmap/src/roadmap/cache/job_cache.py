import json
from roadmap.cache.redis_client import redis_client

JOB_TTL = 60 * 60 * 24  # 24 hours

def get_job(job_id: str):
    key = f"job:{job_id}"
    data = redis_client.get(key)
    return json.loads(data) if data else None

def save_job(job_id: str, data: dict):
    key = f"job:{job_id}"
    redis_client.setex(key, JOB_TTL, json.dumps(data))
