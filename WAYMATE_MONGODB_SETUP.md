# Waymate MongoDB Atlas setup

## Backend environment

Edit `backend/.env` only:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/waymate?retryWrites=true&w=majority
JWT_SECRET=replace-with-your-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

Replace only `USERNAME`, `PASSWORD`, and the Atlas host with your own values. If the password contains URL-reserved characters, URL-encode them.

## Frontend environment

The root `.env` contains:

```env
VITE_API_BASE_URL=/api
```

The Vite proxy sends `/api/*` to `http://localhost:5000` during development.

## Collections

The backend creates the collections from the application schema automatically. The application is responsible for all writes; do not paste frontend demo records manually into Atlas.
