OintmentPro Booking System
Full-stack appointment booking platform for doctors, tutors, and consultants.
Clients can discover professionals, view available slots, and book sessions.
Professionals can manage profiles, create availability, and update booking statuses.

Project Summary
OintmentPro is a role-based booking application with:

Client flow: sign up/login, browse professionals, filter by specialty/service/date, create/cancel bookings.
Professional flow: sign up/login, update professional profile, manage time slots, confirm/cancel/complete bookings.
Authentication: JWT-based auth with protected backend routes.
Persistence: MongoDB (Mongoose models for users, professionals, services, time slots, bookings).
Dev UX: run frontend + backend together with one command.
Tech Stack
Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router.
Backend: Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs.
Database: MongoDB (local or Atlas).
Monorepo tooling: npm workspaces (frontend, backend).
Deployment shape: Vercel-compatible setup with serverless API entry under api/.
Repository Structure
.
├─ frontend/                 # React + Vite application
├─ backend/                  # Express + Mongoose API
│  └─ server/
│     ├─ config/db.ts        # MongoDB connection logic
│     ├─ routes/             # auth, professionals, services, time-slots, bookings
│     ├─ models/             # Mongoose models
│     ├─ app.ts              # Express app + warmup + middleware
│     └─ server.ts           # Backend bootstrap
├─ api/                      # Vercel serverless entry point
├─ vanilla/                  # Optional vanilla frontend
├─ supabase/                 # Legacy/parallel SQL migration artifacts
├─ .env.example
└─ package.json              # Workspace scripts
Architecture Overview
Frontend runs on Vite (http://localhost:5173).
API runs on Express (http://localhost:5000).
Frontend calls /api/*; Vite proxies these requests to backend in local development.
Backend startup/warmup:
connects to MongoDB,
ensures core services exist,
backfills missing service provider types.
Mongoose models manage booking domain data.
Core Domain Models
User: identity, credentials, role (client or professional).
Professional: profile linked to a user (specialty, bio, rate, rating metadata, provider type).
Service: catalog entries (name, category, duration, price, provider type, active status).
TimeSlot: professional availability (startTime, endTime, isAvailable).
Booking: relations among client, professional, service, and time slot with status lifecycle.
API Surface (High-Level)
GET /api/health - health status.
POST /api/auth/register - user registration.
POST /api/auth/login - user login.
GET /api/professionals - list/filter professionals.
GET /api/services - list services.
GET /api/time-slots - query slots (by professional/date/availability).
POST /api/bookings - create booking.
Role-protected endpoints for profile/slot/booking management.
Environment Variables
Create /.env from .env.example:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ointment-booking?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRATION=7d
# CORS_ORIGIN=http://localhost:5173
# VITE_API_URL=https://your-api.example.com/api
MongoDB Atlas Notes
Ensure Atlas Database User exists.
Add your IP (or temporary 0.0.0.0/0) in Network Access.
URL-encode password if it contains special characters.
Keep DB name in URI (for example /ointment-booking).
Getting Started
1) Install dependencies
npm install
2) Ensure executable permissions (if needed on macOS/Linux)
chmod -R +x node_modules/.bin
3) Run app (frontend + backend)
npm run dev:full
Or run separately:

npm run server   # backend
npm run client   # frontend
Available Scripts
npm run dev - run frontend only.
npm run client - run frontend workspace dev script.
npm run server - run backend via nodemon + tsx.
npm run dev:full - run backend and frontend concurrently.
npm run seed - seed database with sample data.
npm run build - sync vanilla assets + build frontend.
npm run build:server - compile backend TypeScript.
npm start - run built backend (dist/server/server.js).
Seeded Test Accounts
When running npm run seed:

Professional: dr.smith@ointmentpro.com / password123
Client: client1@example.com / password123
Troubleshooting
MONGODB_URI is not defined
Make sure /.env exists at project root.
Restart dev server after editing env.
Backend now explicitly loads root .env and then fallback env.
Permission denied for scripts in node_modules/.bin
chmod -R +x node_modules/.bin
Frontend shows http proxy error / ECONNREFUSED
Backend is down; check backend terminal logs first.
Confirm PORT is available and MongoDB is reachable.
Deployment Notes
For production/Vercel, set environment variables in project settings:
MONGODB_URI
JWT_SECRET
JWT_EXPIRATION
CORS_ORIGIN (recommended)
Atlas must allow inbound connections from deployment environment.
Current Status
Main runtime stack is Express + MongoDB (Mongoose).
Repository still includes supabase/ migration files as legacy/parallel artifacts.

