## Check it out Live Here : https://beydaah.tech/todolist
# ToDoList (Frontend + Backend)

This repository contains a small ToDo List app with separate `backend/` and `frontend/` directories.

This document explains how to start the backend and frontend, how to create necessary `.env` files, and how to view API routes via the provided Swagger output.

**Prerequisites**
- Node.js (v16+ recommended)
- npm (or yarn)
- Git (optional)

**Project layout**
- `backend/` — Express API server and swagger output
- `frontend/` — Vite + React frontend

**Quick start (Windows PowerShell)**

1) Backend

- Create a backend `.env` file at `backend/.env` with values for your environment. Example:

```powershell
# backend/.env (example)
MONGODB_URI=your_database_uri
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret_here
ACCESS_TOKEN_EXPIRY=15min
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=7d
DB_NAME=ToDoList
CORS_ORIGIN_IP=your_frontend_ip
PORT=your_port
```

- Install and start:

```powershell
cd backend
npm install
# try these, choose whichever script exists in your package.json:
npm run dev   # commonly used for nodemon or concurrent development
# or
npm start
```

Notes:
- If you normally run `nodemon .\index.js`, `npm run dev` often maps to that. If startup fails, inspect `backend/package.json` to see available scripts.

2) Frontend

- Create a frontend `.env` file at `frontend/.env` (Vite requires env vars to start with `VITE_` if you want them exposed to client code):

```powershell
# frontend/.env (example)
BACKEND_URL=http://BACKEND_IP:PORT
```

- Install and start the frontend:

```powershell
cd frontend
npm install
npm run dev
# or
npm start
```

By default Vite serves on `http://localhost:5173` (or another port displayed in the terminal).

**Swagger / API documentation**
- The backend includes a `swagger-output.json` file at `backend/swagger-output.json` describing the API routes.
- To view the routes:
  - Option A (quick): Open `http://your_ip:port_num/api-docs/#/default` in your browser and import the `backend/swagger-output.json` file.
  - Option B (local): Serve the `swagger-output.json` file using a simple static server and open it with a local Swagger UI, or install/enable `swagger-ui-express` if you prefer an integrated UI (no code changes are required to use the `swagger-output.json` file in any Swagger UI instance).

**Common troubleshooting tips**
- If you see `Error: todoList is required for write operation` or similar, check that your `.env` is set and any required DB entries or initialization steps are done.
- If `nodemon` isn't found, install it as a dev dependency: `npm i -D nodemon`.
- If the frontend can't reach the backend, confirm `VITE_API_URL` matches backend base URL and that CORS is enabled on the backend.

**Where to look in the repo**
- Backend entry points: `backend/index.js`, `backend/app.js`.
- Backend routes/controllers: `backend/src/routes/*`, `backend/src/controllers/*`.
- Swagger output: `backend/swagger-output.json` (open in Swagger Editor).

