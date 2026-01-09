import redis
import os

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    raise RuntimeError("REDIS_URL not set")

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True,
    socket_timeout=5,
    socket_connect_timeout=5,
)
