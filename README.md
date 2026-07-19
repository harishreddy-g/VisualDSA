# DSAFlow Platform

Interactive DSA learning platform with visualizers, LeetCode-style problem solving, Redis caching, Solr search, OpenAI hints, Docker, and CI/CD.

## Folder Structure
- `client/` — React + Tailwind frontend
- `server/` — Express + MongoDB backend

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Express, MongoDB, Redis, Solr, OpenAI API
- DevOps: Docker Compose, GitHub Actions CI/CD

## Installation
1. `npm install`
2. `cd client && npm install`
3. `cd server && npm install`
4. Copy `server/.env.example` to `server/.env` and configure values.

## Run locally
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

## Run with Docker
```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:5000/api
- Solr admin: http://localhost:8983/solr

## Problems Workspace
- Browse problems at `/problems`
- LeetCode-style split-pane editor at `/problems/:slug`
- Run/submit JavaScript solutions
- AI hints via OpenAI (fallback hints when API key is missing)

## API Endpoints
- `GET /api/health`
- `GET /api/problems`
- `GET /api/problems/:slug`
- `POST /api/problems/:slug/run`
- `POST /api/problems/:slug/submit`
- `POST /api/problems/:slug/hint`
- Auth, topics, progress, and admin routes remain available under `/api/*`

## CI/CD
GitHub Actions workflow at `.github/workflows/ci.yml` builds the frontend, starts the backend against MongoDB/Redis services, and validates Docker Compose config.

## Deployment
- Frontend: Vercel / Netlify / Docker nginx container
- Backend: Render / Railway / Docker
- Database: MongoDB Atlas or Docker Mongo service
