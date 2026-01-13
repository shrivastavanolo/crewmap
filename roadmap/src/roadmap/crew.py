from crewai import Crew, Agent, Task, LLM, Process
from crewai.project import CrewBase, agent, task
import os
from crewai_tools import SerperDevTool, WebsiteSearchTool

# Instantiate tools
search_tool = SerperDevTool()

@CrewBase
class RoadmapCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # -------- AGENTS --------

    @agent
    def company_agent(self) -> Agent:
        return Agent(
            role=self.agents_config["company_agent"]["role"],
            goal=self.agents_config["company_agent"]["goal"],
            backstory=self.agents_config["company_agent"]["backstory"],
            tools=[search_tool],
            verbose=False,
        )

    @agent
    def roadmap_agent(self) -> Agent:
        return Agent(
            role=self.agents_config["roadmap_agent"]["role"],
            goal=self.agents_config["roadmap_agent"]["goal"],
            backstory=self.agents_config["roadmap_agent"]["backstory"],
            verbose=False,
            allow_delegation=False,
        )

    # -------- TASKS --------

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
            context=[self.company_analysis()],
        )

    # -------- CREW --------

    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.company_agent(),
                self.roadmap_agent(),
            ],
            tasks=[
                self.company_analysis(),
                self.roadmap_creation(),
            ],
            llm=LLM(model=os.getenv("MODEL"), temperature=0.2),
            verbose=True,
            memory=False,
            process=Process.sequential,
        )
