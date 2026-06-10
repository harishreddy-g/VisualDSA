# DSAFlow Platform

## Folder Structure
client/  # React + Tailwind frontend
server/  # Express + MongoDB backend

## Database Schemas
- User
- Progress
- Topic
- Problem
- Submission

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/topics
- POST /api/topics
- GET /api/problems
- POST /api/problems
- GET /api/progress/:userId
- PUT /api/progress/:userId
- GET /api/admin/users
- PUT /api/admin/users/:id

## Installation
1. npm install
2. cd client && npm install
3. cd server && npm install
4. Copy server/.env.example to server/.env and configure MONGO_URI and JWT_SECRET.

## Run
npm run dev

## Deployment
- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas
