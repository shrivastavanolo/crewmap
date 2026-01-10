import re

def extract_job_id(url: str) -> str:
    match = re.search(r"/jobs/view/(?:[^/]+-)?(\d+)", url)
    print(match.group(1))
    if not match:
        raise ValueError("Invalid LinkedIn job URL")
    return match.group(1)
