---
sidebar_position: 3
---

# Environment Variables

## Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in the values.

### Database

| Variable | Description |
|---|---|
| `BACKEND_DATABASE_HOST` | PostgreSQL host (e.g. `localhost`) |
| `BACKEND_DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `BACKEND_DATABASE_NAME` | Dev database name |
| `BACKEND_DATABASE_USERNAME` | PostgreSQL user |
| `BACKEND_DATABASE_PASSWORD` | PostgreSQL password |
| `BACKEND_TEST_DATABASE_NAME` | Test database (separate from dev) |

### External services

| Variable | Description |
|---|---|
| `TMDB_API_KEY` | TMDb v3 API key — get one at [developer.themoviedb.org](https://developer.themoviedb.org) |

### CORS

| Variable | Description |
|---|---|
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins. Example: `http://localhost:3000`. In production set to your actual frontend URL(s). |

### Production only

| Variable | Description |
|---|---|
| `BACKEND_PROD_DATABASE_NAME` | Production primary DB |
| `BACKEND_PROD_DATABASE_USERNAME` | Production DB user |
| `BACKEND_PROD_DATABASE_PASSWORD` | Production DB password |
| `BACKEND_QUEUE_DATABASE_NAME` | Solid Queue database |
| `BACKEND_CACHE_DATABASE_NAME` | Solid Cache database |
| `BACKEND_CABLE_DATABASE_NAME` | Solid Cable database |
| `BACKEND_DOMAIN` | Public domain (used by Caddy for TLS, e.g. `api.yourdomain.com`) |

## Frontend (`frontend/.env.local`)

No `.env` file is needed for local development — the proxy handles routing automatically.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Override the backend URL (default: proxy to `http://127.0.0.1:3001`) |
| `NEXT_PUBLIC_SITE_URL` | Public frontend URL — used for sitemap, Open Graph, and the admin "Visit Site" link |
| `NEXT_PUBLIC_DOCS_URL` | URL to the documentation site — shown in the public footer |
| `BACKEND_URL` | Server-side backend URL for Next.js Route Handlers (sitemap generation). Defaults to `http://127.0.0.1:3001`. |

## Docs (`docs/`)

| Variable | Description |
|---|---|
| `DOCS_SITE_URL` | Full URL where docs are deployed (e.g. `https://yourdomain.com`). Set at build time. |

## Getting a TMDb API key

1. Create an account at [themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API**
3. Request a Developer API key
4. Copy the **API Key (v3 auth)** value into `TMDB_API_KEY`
