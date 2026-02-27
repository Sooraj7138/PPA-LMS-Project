# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## PPA-LMS-Project

PPA-LMS-Project is a small full-stack application that provides dashboards and mapping for an LMS-style land mapping workflow. It includes a Vite + React frontend and a lightweight Node/Express backend API. The app supports three roles: Admin, Manager, and User, and uses Leaflet for map views and MSSQL for data storage.

Key features

- Admin, Manager and User dashboards
- Map visualization using Leaflet
- Simple Node/Express API for authentication and data access
- Utilities for password hashing and JWT-based auth

Tech stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: Microsoft SQL Server (via `mssql`)
- Map: Leaflet + react-leaflet

Quick start

Prerequisites: Node.js (v14+ recommended) and an MSSQL instance if you want to connect to a database.

Install dependencies:

```bash
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

Start the backend API (in a separate terminal):

```bash
npm run dev:api
```

Build for production:

```bash
npm run build
npm run preview
```

Helpful scripts:

- `npm run dev` — starts Vite dev server (frontend)
- `npm run dev:api` — starts the Node/Express API (`server.js`)
- `npm run build` — builds the frontend for production
- `npm run preview` — serves the built frontend locally
- `npm run auth:hash` — helper to hash passwords (`scripts/hash-password.mjs`)

Environment

This project uses `dotenv`. Create a `.env` at the project root with the required values for your setup. Typical variables the app expects include:

- `PORT` — API port
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` — MSSQL connection
- `JWT_SECRET` — secret for signing JSON Web Tokens

Project structure (high level):

- [src/main.jsx](src/main.jsx) — app entry
- [src/App.jsx](src/App.jsx) — top-level routes and layout
- [src/utils.js](src/utils.js) — shared helpers
- [src/Admin](src/Admin) — Admin UI components (DemandsSection, UserDataSection, etc.)
- [src/Manager](src/Manager) — Manager UI components
- [src/User](src/User) — User-facing pages (MapPage, HomePage, UserProfile)
- [server.js](server.js) — simple Express API used in development
- [scripts/hash-password.mjs](scripts/hash-password.mjs) — password hashing utility
- [package.json](package.json) — scripts & dependencies

Development notes:

- Frontend routing and role-based views live in `src/*` — look at `AdminDashboard.jsx`, `ManagerDashboard.jsx`, and `UserDashboard.jsx` for role entry points.
- Map functionality is implemented in `src/User/MapPage.jsx` using `react-leaflet`.
- The backend uses `express`, `jsonwebtoken`, and `mssql` — adjust `.env` and connection strings before running against a real database.

