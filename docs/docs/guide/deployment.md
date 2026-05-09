---
sidebar_position: 10
---

# Deployment

Multimediary uses **Kamal** for containerised deployment with Docker.

## Prerequisites

- Docker installed on the target server
- PostgreSQL accessible from the server
- A domain name or server IP

## Configuration

Deployment config lives in `backend/config/deploy.yml`. Edit it to set
your server IP, image registry, and environment variables.

## Deploy

```bash
cd backend

# First deploy — provisions the server and starts containers
bin/kamal setup

# Subsequent deploys (zero-downtime rolling update)
bin/kamal deploy
```

## Stack

| Component | Role |
|---|---|
| Puma | Rails application server |
| Thruster | In front of Puma — HTTP/2, asset caching, compression, X-Sendfile |
| Kamal | Docker-based zero-downtime deployment orchestration |
| PostgreSQL | Primary database + separate Solid Queue/Cache/Cable databases |

## Production databases

In production, each Solid adapter uses its own PostgreSQL database to isolate
traffic. Set these env vars on the server:

```
BACKEND_QUEUE_DATABASE_NAME=multimediary_queue
BACKEND_CACHE_DATABASE_NAME=multimediary_cache
BACKEND_CABLE_DATABASE_NAME=multimediary_cable
```

## CORS in production

Set `CORS_ALLOWED_ORIGINS` to your frontend URL(s):

```
CORS_ALLOWED_ORIGINS=https://admin.yourdomain.com
```

Multiple origins are comma-separated:

```
CORS_ALLOWED_ORIGINS=https://admin.yourdomain.com,https://www.yourdomain.com
```

## Health check

Kamal and any uptime monitoring should probe `GET /up`. It returns `200 OK`
with `{ "status": "ok", "database": "ok" }` when healthy, or `503 Service Unavailable`
if the database is unreachable.
