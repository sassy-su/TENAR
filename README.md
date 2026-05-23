# TENAR

TENAR is an AI-powered export compliance and monitoring system built with FastAPI, PostgreSQL, and Next.js.

## What Is Included

- FastAPI backend with health, entity, screening, and monitoring APIs
- SQLAlchemy models for parties, products, shipments, screenings, and watchlist hits
- PostgreSQL configuration through Docker Compose
- Next.js dashboard with compliance overview, screening form, and monitoring queue
- Basic CI workflow for backend and frontend checks

## Quick Start

Copy environment defaults:

```bash
cp .env.example .env
```

Run the full stack:

```bash
docker compose up --build
```

If your Docker install uses the legacy CLI, run `docker-compose up --build`.

Services:

- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## Local Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg://tenar:tenar@localhost:5433/tenar
uvicorn app.main:app --reload
```

## Local Frontend

```bash
cd frontend
npm install
npm run dev
```

## Next Steps

- Replace the sample in-memory screening logic with provider-backed denied-party data.
- Add Alembic migrations once the schema stabilizes.
- Wire authentication and role-based review queues.
- Add document ingestion for invoices, packing lists, and export declarations.
