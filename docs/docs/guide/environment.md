---
sidebar_position: 3
---

# Environment Variables

All configuration is driven by environment variables. Copy `.env.example`
to `.env` inside the `backend/` directory and fill in each value.

## Required

| Variable | Description |
|---|---|
| `BACKEND_DATABASE_HOST` | PostgreSQL host (e.g. `localhost`) |
| `BACKEND_DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `BACKEND_DATABASE_NAME` | Development database name |
| `BACKEND_DATABASE_USERNAME` | PostgreSQL username |
| `BACKEND_DATABASE_PASSWORD` | PostgreSQL password |
| `BACKEND_TEST_DATABASE_NAME` | Test database name (separate from dev) |
| `TMDB_API_KEY` | TMDb API key — get one at https://developer.themoviedb.org |

## CORS

| Variable | Description |
|---|---|
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins. Example: `http://localhost:3000`. In production set this to your actual frontend URL. |

## Production only

| Variable | Description |
|---|---|
| `BACKEND_PROD_DATABASE_NAME` | Production primary database |
| `BACKEND_PROD_DATABASE_USERNAME` | Production DB user |
| `BACKEND_PROD_DATABASE_PASSWORD` | Production DB password |
| `BACKEND_QUEUE_DATABASE_NAME` | Solid Queue database (background jobs) |
| `BACKEND_CACHE_DATABASE_NAME` | Solid Cache database |
| `BACKEND_CABLE_DATABASE_NAME` | Solid Cable database (WebSockets) |

## Getting a TMDb API key

1. Create an account at [https://www.themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API**
3. Request a Developer API key
4. Copy the **API Key (v3 auth)** value into `TMDB_API_KEY`
