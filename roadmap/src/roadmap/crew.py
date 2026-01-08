from crewai import Crew, Agent, Task
from crewai.project import CrewBase, agent, task

@CrewBase
class RoadmapCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # -------- AGENTS --------

    @agent
    def job_agent(self) -> Agent:
        return Agent(
            role=self.agents_config["job_agent"]["role"],
            goal=self.agents_config["job_agent"]["goal"],
            backstory=self.agents_config["job_agent"]["backstory"],
            verbose=True,
        )

    @agent
    def company_agent(self) -> Agent:
        return Agent(
            role=self.agents_config["company_agent"]["role"],
            goal=self.agents_config["company_agent"]["goal"],
            backstory=self.agents_config["company_agent"]["backstory"],
            verbose=True,
        )

    @agent
    def roadmap_agent(self) -> Agent:
        return Agent(
            role=self.agents_config["roadmap_agent"]["role"],
            goal=self.agents_config["roadmap_agent"]["goal"],
            backstory=self.agents_config["roadmap_agent"]["backstory"],
            verbose=True,
        )

    # -------- TASKS --------

    @task
    def job_analysis(self) -> Task:
        return Task(
            description=self.tasks_config["job_analysis"]["description"],
            expected_output=self.tasks_config["job_analysis"]["expected_output"],
            agent=self.job_agent(),
        )

    @task
    def company_analysis(self) -> Task:
        return Task(
            description=self.tasks_config["company_analysis"]["description"],
            expected_output=self.tasks_config["company_analysis"]["expected_output"],
            agent=self.company_agent(),
        )

    @task
    def roadmap_creation(self) -> Task:
        return Task(
            description=self.tasks_config["roadmap_creation"]["description"],
            expected_output=self.tasks_config["roadmap_creation"]["expected_output"],
            agent=self.roadmap_agent(),
        )

    # -------- CREW --------

    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.job_agent(),
                self.company_agent(),
                self.roadmap_agent(),
            ],
            tasks=[
                self.job_analysis(),
                self.company_analysis(),
                self.roadmap_creation(),
            ],
            verbose=True,
        )
