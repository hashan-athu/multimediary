---
sidebar_position: 4
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

---

## Docs deployment

The Docusaurus documentation site is containerised with Docker and deployed as a separate service on the same Oracle VM. Caddy routes `yourdomain.com/docs/*` to the docs container.

### How it works

| Component | Role |
|---|---|
| `docs/Dockerfile` | Multi-stage build: Node 20 builds the static site, Nginx serves it |
| `docs/nginx.conf` | Nginx configuration — serves the static build under `/docs/` |
| `deploy/docker-compose.prod.yml` | `docs` service alongside `backend`, `db`, and `caddy` |
| `deploy/Caddyfile` | Routes `/docs/*` to the `docs` container; all other traffic to `backend` |

### Build and push the docs image

The docs image is built from the `docs/` directory. Add this to your CI/CD pipeline (GitHub Actions example):

```yaml
- name: Build and push docs image
  uses: docker/build-push-action@v6
  with:
    context: ./docs
    push: true
    tags: ghcr.io/hashan-athu/multimediary/docs:dev
    build-args: |
      NODE_VERSION=20
```

Set `DOCS_SITE_URL` as a build arg to embed the correct canonical URL:

```yaml
build-args: |
  NODE_VERSION=20
  DOCS_SITE_URL=https://yourdomain.com
```

And pass it through in the Dockerfile — or set it as an environment variable before `npm run build`.

### Deploy

Add `DOCS_IMAGE` to your GitHub Environment secrets (or `.env.production` on the VM):

```
DOCS_IMAGE=ghcr.io/hashan-athu/multimediary/docs:dev
```

Pull and restart on the VM:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml pull docs
docker compose --env-file .env.production -f docker-compose.prod.yml up -d docs
```

Or just run the full `up -d` — Compose only restarts containers whose image changed.

### Local build verification

Before pushing, verify the Docker build locally from the `docs/` directory:

```bash
cd docs
npm run gen-api-docs   # regenerate API reference if openapi.yaml changed
npm run build          # verify the Docusaurus build passes
docker build -t docs-local .
docker run -p 8080:80 docs-local
# Open http://localhost:8080/docs/
```

### Important: commit generated API docs before building

The Dockerfile does **not** run `gen-api-docs` during build — it uses the already-committed files in `docs/api-reference/`. Always run `npm run clean-api-docs && npm run gen-api-docs` locally and commit the output whenever `api/openapi.yaml` changes.
