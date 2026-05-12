# Backend Deployment

This is the active backend deployment path:

1. GitHub Actions builds `backend/Dockerfile`.
2. The image is pushed to GitHub Container Registry as `ghcr.io/hashan-athu/multimediary/backend:dev`.
3. GitHub Actions SSHes into the Oracle VM.
4. The VM pulls the new image and restarts `deploy/docker-compose.prod.yml`.

## GitHub Secrets

Create these secrets in the `dev` GitHub Environment if the workflow uses `environment: dev`:

| Secret | Value |
|---|---|
| `ORACLE_VM_HOST` | Public IP or DNS name of the Oracle VM |
| `ORACLE_VM_USER` | SSH user, usually `opc` on Oracle Linux |
| `ORACLE_VM_SSH_KEY` | Full private SSH key, including `-----BEGIN ... PRIVATE KEY-----` and `-----END ... PRIVATE KEY-----` |
| `RAILS_MASTER_KEY` | Contents of `backend/config/master.key` |
| `POSTGRES_USER` | PostgreSQL user, e.g. `multimediary` |
| `POSTGRES_PASSWORD` | Strong PostgreSQL password |
| `POSTGRES_DB` | Primary production DB, e.g. `multimediary_production` |
| `POSTGRES_CACHE_DB` | Solid Cache DB, e.g. `multimediary_cache` |
| `POSTGRES_QUEUE_DB` | Solid Queue DB, e.g. `multimediary_queue` |
| `POSTGRES_CABLE_DB` | Solid Cable DB, e.g. `multimediary_cable` |
| `TMDB_API_KEY` | TMDb API key |
| `CORS_ALLOWED_ORIGINS` | Comma-separated Vercel frontend/admin URLs |

The error `can't connect without a private SSH key or password` means `ORACLE_VM_SSH_KEY` was empty or not available to the `dev` environment.

## Oracle VM Bootstrap

Run this once from your workstation:

```bash
ssh opc@YOUR_VM_IP 'bash -s' < deploy/oracle-vm-bootstrap.sh
```

Log out and back in after the bootstrap so the Docker group membership is active.

## Server Environment

The workflow creates `/opt/multimediary/.env.production` from GitHub Secrets on every deploy. Do not edit that file manually on the VM; update the `dev` GitHub Environment secrets instead.

## Deploy

Push backend/deploy changes to `dev`, or run the `Deploy Backend -> Oracle VM` workflow manually from GitHub Actions.

Useful VM checks:

```bash
cd /opt/multimediary
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
curl -i http://localhost/up
```
