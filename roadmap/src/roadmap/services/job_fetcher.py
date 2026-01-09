import requests
from bs4 import BeautifulSoup
from roadmap.models.job import JobData

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def fetch_linkedin_job(job_url: str) -> JobData:
    response = requests.get(job_url, headers=HEADERS, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.find("h1")
    company = soup.find("a", {"class": "topcard__org-name-link"})
    description = soup.find("div", {"class": "description__text"})

    return JobData(
        job_id="extracted",
        job_url=job_url,
        job_title=title.text.strip() if title else "",
        company_name=company.text.strip() if company else "",
        job_description=description.text.strip() if description else "",
    )
