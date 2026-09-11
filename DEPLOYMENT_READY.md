# Waymate — Render + Vercel Deployment

## Backend — Render Web Service
- Root Directory: `bike/backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check: `/api/health`

Set these Render environment variables:
- `MONGODB_URI` = your MongoDB Atlas URI for the `waymate` database
- `JWT_SECRET` = generate a new long random secret for production
- `CLIENT_ORIGIN` = `*` initially; after Vercel deployment, replace with your exact Vercel URL

The backend binds to `0.0.0.0` and runs the database seed automatically at startup. You can also run `npm run seed` from `bike/backend`.

## Frontend — Vercel
- Root Directory: `bike`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

After Render gives you the backend URL, add this Vercel environment variable and redeploy:
`VITE_API_BASE_URL=https://YOUR-RENDER-BACKEND-URL/api`

The included `vercel.json` handles SPA fallback routing.

## Local
From `bike/backend`: `npm install` then `npm start`
From `bike`: `npm install` then `npm run dev`

## Important
The local `backend/.env` is configured with the MongoDB credentials supplied during setup. Do not commit `.env` to GitHub. For production, set secrets in Render/Vercel dashboards.
