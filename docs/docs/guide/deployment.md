---
sidebar_position: 10
---

# Deployment

Multimediary deploys the Rails backend with **GitHub Actions**, **GitHub Container Registry**, and **Docker Compose** on an Oracle VM.

## Prerequisites

- Oracle Linux VM with SSH access
- Docker Engine and the Docker Compose plugin installed
- GitHub Actions secrets configured for the `dev` environment
- A domain name or public server IP

## Configuration

Deployment files live in `deploy/`:

| File | Purpose |
|---|---|
| `deploy/docker-compose.prod.yml` | Runs PostgreSQL and the Rails API container |
| `deploy/.env.production.example` | Reference list of env keys generated from GitHub Secrets |
| `deploy/oracle-vm-bootstrap.sh` | One-time VM bootstrap script |
| `deploy/README.md` | Operational deployment checklist |

GitHub Actions uses `.github/workflows/deploy-backend.yml`.

## Deploy

```bash
# One-time VM setup from your workstation
ssh opc@YOUR_VM_IP 'bash -s' < deploy/oracle-vm-bootstrap.sh
```

After bootstrap, configure the `dev` GitHub Environment secrets. The deployment workflow writes `/opt/multimediary/.env.production` on every deploy.

Push backend or deploy changes to `dev`, or run the `Deploy Backend -> Oracle VM` workflow manually from GitHub Actions.

## Stack

| Component | Role |
|---|---|
| Puma | Rails application server |
| Thruster | In front of Puma — HTTP/2, asset caching, compression, X-Sendfile |
| GitHub Actions | Builds, pushes, and deploys the backend image |
| GHCR | Stores the backend Docker image |
| Docker Compose | Runs the API and PostgreSQL services on the VM |
| PostgreSQL | Primary database + separate Solid Queue/Cache/Cable databases |

## Production databases

In production, each Solid adapter uses its own PostgreSQL database to isolate traffic. Set these values as GitHub Environment secrets:

```
POSTGRES_DB=multimediary_production
POSTGRES_CACHE_DB=multimediary_cache
POSTGRES_QUEUE_DB=multimediary_queue
POSTGRES_CABLE_DB=multimediary_cable
```

## CORS in production

Set `CORS_ALLOWED_ORIGINS` as a GitHub Environment secret with your frontend URL(s):

```
CORS_ALLOWED_ORIGINS=https://admin.yourdomain.com
```

Multiple origins are comma-separated:

```
CORS_ALLOWED_ORIGINS=https://admin.yourdomain.com,https://www.yourdomain.com
```

## Health check

The deployment workflow and any uptime monitoring should probe `GET /up`. It returns `200 OK`
with `{ "status": "ok", "database": "ok" }` when healthy, or `503 Service Unavailable`
if the database is unreachable.
