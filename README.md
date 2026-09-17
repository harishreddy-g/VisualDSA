# VisualDSA

VisualDSA is a DSA learning and practice platform inspired by LeetCode and NeetCode. The client is now local-first: learners can browse the roadmap, solve curated problems, run JavaScript test cases, save drafts, bookmark problems, track progress, and use visualizers even before the backend is running.

## Core Experience

- Today dashboard with next problem, daily challenge, roadmap progress, and visualizer shortcuts.
- Pattern-first roadmap for arrays, hashing, two pointers, binary search, stack, linked lists, trees, graphs, and dynamic programming.
- LeetCode-style problems table with search, difficulty, status, tag, and track filters.
- Split-pane problem workspace with Monaco editor, local JavaScript judge fallback, curated hints, complexity notes, timer, and local submission history.
- Study plans for starter practice, core patterns, visual-first learning, and DP/graph review.
- Visualizer lab for sorting, searching, linked lists, stacks, queues, trees, and graphs.
- Cheatsheet with complexity tables, pattern notes, and starter templates.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Monaco Editor, Framer Motion, Lucide icons.
- Backend: Express, MongoDB, Redis, Solr, OpenAI API.
- DevOps: Docker Compose.

## Folder Structure

- `client/`: React/Vite frontend.
- `server/`: Express/MongoDB API for auth, problem persistence, submissions, stats, hints, Redis caching, and Solr search.

## Install

```bash
npm install
cd client && npm install
cd ../server && npm install
```

Create `server/.env` with your backend values when you want API-backed auth, submissions, stats, Redis, Solr, or OpenAI hints.

For password reset and signup verification email delivery, also configure `FRONTEND_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and optionally `MAIL_FROM`. Copy `server/.env.example` to `server/.env`. For Gmail, enable 2-Step Verification and use a Google App Password, not your normal Gmail password. Without SMTP settings, development logs codes in the server terminal without sending mail.

## Run Locally

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`

You can also run only the client:

```bash
npm run client
```

## Build

```bash
npm run build
```

## Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000/api`
- Solr admin: `http://localhost:8983/solr`

## Useful Routes

- `/`: Today dashboard
- `/roadmap`: pattern-first learning roadmap
- `/problems`: problem bank
- `/problems/:slug`: problem workspace
- `/study-plans`: curated practice tracks
- `/visualizers`: visualizer lab
- `/cheatsheet`: DSA quick reference
- `/dashboard`: progress dashboard

Legacy routes such as `/learning`, `/sorting`, `/modules`, `/leaderboard`, and `/admin` redirect into the new product surface.
