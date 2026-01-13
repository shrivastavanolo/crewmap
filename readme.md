<div align="center">

<img src="roadmap/misc/crewmap_logo.png" alt="Crewmap Logo" width="120"/>

# Crewmap

## Agentic Job Roadmap Generator

**Crewmap converts real job listings into structured, role-specific learning roadmaps using an agentic AI system.**

[Live Demo](https://your-demo-site-link.com) · [API Docs](https://your-demo-site-link.com/docs)

</div>

---

## Overview

Crewmap is an end-to-end system that takes a job listing (such as a LinkedIn job URL) and returns a clear, actionable learning roadmap tailored to that role.

It is designed as a system with emphasis on correctness, performance, concurrency safety, and cost-efficient AI usage.

---

## Key Features

* Job-specific roadmap generation
* Agent-based AI reasoning with clear separation of concerns
* Redis caching and distributed locking
* Stateless, horizontally scalable backend
* Modern React frontend with local history
* Export roadmaps as Markdown or PDF

---

## Architecture

**Frontend**

* React + TypeScript
* Tailwind CSS
* LocalStorage for history
* Collapsible and interactive roadmap UI

**Backend**

* FastAPI (Python)
* Redis for caching and locks
* Stateless API design

**AI Layer**

* CrewAI orchestration
* Two agents:

  * Job Analysis Agent (uses Serper for search context)
  * Roadmap Generation Agent
* Gemini as the LLM provider

---

## AI Design

The AI system is split into two agents:

1. **Job Agent**

   * Analyzes the job description
   * Uses Serper to fetch company and role context
   * Condenses relevant information to reduce token usage and latency

2. **Roadmap Agent**

   * Receives enriched job context
   * Focuses on generating a structured learning roadmap
   * Produces phased or time-based learning guidance

This design improves speed, reduces cost, and keeps agent responsibilities clearly separated.

---

## Request Flow

1. User submits a job URL via the frontend
2. Backend extracts job ID and checks Redis cache
3. If cached, the roadmap is returned immediately
4. If not cached:

   * A Redis lock is acquired
   * The AI workflow is executed
   * The result is cached
5. The roadmap is returned to the frontend for rendering and export

---

## Tech Stack

**Frontend**

* React 18+
* TypeScript
* Tailwind CSS

**Backend**

* Python 3.11+
* FastAPI
* Pydantic
* Redis

**AI**

* CrewAI
* Gemini
* Serper

---

## Running Locally

### Backend

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn roadmap.api:app --reload
```

* API: [http://localhost:8000](http://localhost:8000)
* Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
npm install
npm run dev
```

* App: [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
crewmap/
├── frontend/        # React frontend
├── roadmap/         # Backend service
│   ├── api.py
│   ├── crew.py
│   ├── services/
│   ├── cache/
│   └── utils/
└── README.md
```

---

## Use Cases

* Developers preparing for specific roles
* Students planning structured learning paths
* Career switchers entering new domains
* Engineers exploring agentic AI system design

---

## Contributing

Contributions are welcome.

* Bug fixes and improvements
* Feature additions
* UI/UX enhancements
* Agent logic and prompt improvements
* Documentation updates

**PRs welcome!**

---