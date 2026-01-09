from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

from roadmap.crew import RoadmapCrew
from roadmap.utils.linkedin import extract_job_id
from roadmap.services.job_fetcher import fetch_linkedin_job
from roadmap.cache.job_cache import get_job, save_job
from roadmap.cache.roadmap_cache import get_roadmap, save_roadmap

app = FastAPI(
    title="Job Roadmap Generator API",
    description="Generates a personalized learning roadmap using CrewAI",
    version="1.0.0"
)

# ---------- REQUEST SCHEMAS ----------

class RoadmapRequest(BaseModel):
    job_id: str
    company_name: str
    job_description: str


class JobURLRequest(BaseModel):
    job_url: str


# ---------- RESPONSE SCHEMAS ----------

class RoadmapResponse(BaseModel):
    roadmap: str


class JobIngestResponse(BaseModel):
    job_id: str
    company_name: str
    job_title: str
    job_description: str


# ---------- ENDPOINTS ----------

@app.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    try:
        job_id = request.job_id
        cached = get_roadmap(job_id)
        if cached:
            return RoadmapResponse(roadmap=cached["roadmap"])
        
        crew = RoadmapCrew().crew()

        result = await run_in_threadpool(crew.kickoff,
            {
                "company_name": request.company_name,
                "job_description": request.job_description
            }
        )

        roadmap_text = str(result)

        save_roadmap(job_id, {
            "roadmap": roadmap_text
        })

        return RoadmapResponse(roadmap=roadmap_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Roadmap generation failed: {str(e)}"
        )


@app.post("/job/ingest", response_model=JobIngestResponse)
async def ingest_job(payload: JobURLRequest):
    try:
        job_id = extract_job_id(payload.job_url)

        cached = get_job(job_id)
        if cached:
            return cached

        job = await run_in_threadpool(fetch_linkedin_job, payload.job_url)
        save_job(job_id, job.dict())

        return job

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Job ingestion failed: {str(e)}"
        )
