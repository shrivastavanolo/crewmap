import warnings
from roadmap.crew import RoadmapCrew

warnings.filterwarnings("ignore", category=SyntaxWarning)

# Main program for testing crew

def run():
    """
    Run the job roadmap crew locally.
    """

    inputs = {
        "job_description": """
        We are hiring a Backend Engineer with experience in:
        Python, FastAPI, PostgreSQL, Docker, and AWS.
        Experience with system design and REST APIs is required.
        """,
        "company_name": "Stripe"
    }

    try:
        crew = RoadmapCrew().crew()
        result = crew.kickoff(inputs=inputs)

        print("\n================ FINAL ROADMAP ================\n")
        print(result)

    except Exception as e:
        raise Exception(f"Error while running the crew: {e}")

if __name__ == "__main__":
    run()
