from pydantic import BaseModel
from typing import List, Optional

class JobData(BaseModel):
    job_id: str
    job_url: str
    company_name: str
    job_title: str
    job_description: str
    location: Optional[str] = None
    skills: List[str] = []
