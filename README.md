# Waymate

Waymate is a student community mobility app. The existing React/Vite interface is preserved; persistence and application data are backed by MongoDB Atlas through the included Express/Mongoose API.

## Setup

1. In `backend/.env`, set:
   - `MONGODB_URI` to your MongoDB Atlas SRV URI for the `waymate` database.
   - `JWT_SECRET` to a long random secret.
   - `PORT=5000`
   - `CLIENT_ORIGIN=http://localhost:5173`
2. From `backend/`, run `npm install` and `npm run dev`.
3. From the project root, run `npm install` and `npm run dev`.
4. Open `http://localhost:5173`.

The root `.env` already points Vite at `/api`; the Vite development proxy forwards that path to the backend.

## Database

MongoDB is the source of truth. The backend creates the required collections and indexes and seeds the community dataset once when `profiles` is empty. Do not manually create empty collections.

The schema follows the Waymate data model: `profiles`, `vehicles`, `ride_offers`, `ride_requests`, `bike_requests`, `bookings`, `credit_transactions`, `notifications`, and `community_events`.

No MongoDB password or JWT secret is included in this project.

### Database seed
From `bike/backend`, run `npm.cmd run seed` to connect to MongoDB Atlas and upsert the demo data. Existing records are preserved.


## Deployment
See `DEPLOYMENT_READY.md` for the exact Render + Vercel settings.
