from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

from roadmap.cache.redis_client import redis_client
from roadmap.crew import RoadmapCrew
from roadmap.utils.linkedin import extract_job_id
from roadmap.services.job_fetcher import fetch_linkedin_job
from roadmap.cache.roadmap_cache import get_roadmap, save_roadmap

app = FastAPI(
    title="Job Roadmap Generator API",
    description="Generates a personalized learning roadmap using CrewAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://crewmap-ecru.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- REQUEST SCHEMAS ----------

class RoadmapRequest(BaseModel):
    job_url: str


# ---------- RESPONSE SCHEMAS ----------

class RoadmapResponse(BaseModel):
    roadmap: str


# ---------- ENDPOINTS ----------

@app.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    job_id = extract_job_id(request.job_url)
    lock_key = f"roadmap:lock:{job_id}"
    lock_acquired = False
    try:

        cached = get_roadmap(job_id)
        if cached:
            return RoadmapResponse(roadmap=cached["roadmap"])
        
        job = await run_in_threadpool(fetch_linkedin_job, request.job_url)

        lock_acquired = redis_client.setnx(lock_key, "1")
        if not lock_acquired:
            raise HTTPException(
                status_code=409,
                detail="Roadmap is already being generated for this job"
            )

        redis_client.expire(lock_key, 120)  # safety TTL

        crew = RoadmapCrew().crew()

        result = await run_in_threadpool(crew.kickoff,
            {
                "company_name": job.company_name,
                "job_description": job.job_description
            }
        )

        roadmap_text = str(result)
        save_roadmap(job_id, {
            "roadmap": roadmap_text
        })

        return RoadmapResponse(roadmap=roadmap_text)
    
    except Exception as e:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Roadmap generation failed: {str(e)}"
        )
    
    finally:
        redis_client.delete(lock_key)
