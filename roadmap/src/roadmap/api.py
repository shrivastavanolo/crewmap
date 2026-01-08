from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from roadmap.crew import RoadmapCrew

app = FastAPI(
    title="Job Roadmap Generator API",
    description="Generates a personalized learning roadmap using CrewAI",
    version="1.0.0"
)

# -------- Request Schema --------
class RoadmapRequest(BaseModel):
    company_name: str
    job_description: str


# -------- Response Schema --------
class RoadmapResponse(BaseModel):
    roadmap: str


@app.post("/generate-roadmap", response_model=RoadmapResponse)
def generate_roadmap(request: RoadmapRequest):
    try:
        crew = RoadmapCrew().crew()

        result = crew.kickoff(
            inputs={
                "company_name": request.company_name,
                "job_description": request.job_description
            }
        )

        return RoadmapResponse(roadmap=str(result))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Roadmap generation failed: {str(e)}"
        )
