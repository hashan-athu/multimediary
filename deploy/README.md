# Backend Deployment

## Architecture

```
Internet → Caddy (Docker, ports 80/443, Let's Encrypt) → backend (Docker, internal) → PostgreSQL (Docker, internal)
```

Everything runs in Docker Compose. Caddy handles SSL automatically. Nothing is exposed on the host except ports 80 and 443 via Caddy.

## Deployment flow

1. GitHub Actions builds `backend/Dockerfile` and pushes to GHCR as `:dev`.
2. The workflow SSHes in, pulls the new image **while old containers keep serving**.
3. `docker compose up -d` swaps the backend container (brief downtime during Rails boot + migration).
4. A health check polls `GET /up` until Rails confirms it's up.

## GitHub Secrets (dev environment)

| Secret | Value |
|---|---|
| `ORACLE_VM_HOST` | Public IP or DNS of the Oracle VM |
| `ORACLE_VM_USER` | SSH user (`ubuntu` on Ubuntu 24.04) |
| `ORACLE_VM_SSH_KEY` | Full PEM private key including `-----BEGIN/END-----` lines |
| `RAILS_MASTER_KEY` | Contents of `backend/config/master.key` |
| `POSTGRES_USER` | PostgreSQL user, e.g. `multimediary` |
| `POSTGRES_PASSWORD` | Strong PostgreSQL password |
| `POSTGRES_DB` | Primary DB name, e.g. `multimediary_production` |
| `POSTGRES_CACHE_DB` | Solid Cache DB, e.g. `multimediary_cache` |
| `POSTGRES_QUEUE_DB` | Solid Queue DB, e.g. `multimediary_queue` |
| `POSTGRES_CABLE_DB` | Solid Cable DB, e.g. `multimediary_cable` |
| `TMDB_API_KEY` | TMDb API key |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend/admin URLs (Vercel) |
| `BACKEND_DOMAIN` | **New** — your API domain, e.g. `api.yourdomain.com` |

## Fresh VM setup

Run once from your workstation after creating the Oracle VM:

```bash
ssh ubuntu@YOUR_VM_IP 'bash -s' < deploy/oracle-vm-bootstrap.sh
```

This installs Docker, creates 2 GB swap, and opens firewall ports 80/443.

**Also required in Oracle Cloud Console:**
Go to Networking → Virtual Cloud Networks → your VCN → Security Lists and add:
- Ingress: TCP port 80 from 0.0.0.0/0
- Ingress: TCP port 443 from 0.0.0.0/0
- Ingress: UDP port 443 from 0.0.0.0/0 (for HTTP/3)

Log out and back in after bootstrap so `ubuntu` can run Docker without sudo.

## DNS

Point `BACKEND_DOMAIN` (e.g. `api.yourdomain.com`) as an A record to the VM's public IP **before the first deploy**. Caddy obtains the Let's Encrypt certificate on first startup via HTTP-01 challenge — it needs port 80 accessible from the internet.

## Trigger a deploy

Push backend or deploy file changes to the `dev` branch, or run the workflow manually in GitHub Actions.

## Useful VM commands

```bash
cd /opt/multimediary

# Container status
docker compose --env-file .env.production -f docker-compose.prod.yml ps

# Live backend logs
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend

# Live Caddy logs (SSL cert issues show here)
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f caddy

# Health check
curl -i https://api.yourdomain.com/up

# Rails console
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend bin/rails console

# Memory check
free -h && docker stats --no-stream
```

## Troubleshooting

**Caddy can't get SSL cert** — DNS isn't pointed at the VM yet, or Oracle Cloud Security Lists are blocking port 80. Check `logs -f caddy`.

**Backend OOMed** — Run `docker stats --no-stream` to check memory. Oracle Free Tier AMD has 1 GB RAM. The compose limits are: PostgreSQL 192 MB, backend 400 MB, Caddy 64 MB. Total ≈ 656 MB + 2 GB swap buffer. If Rails is consistently hitting the limit, reduce `RAILS_MAX_THREADS` to 2.

**SSH frozen during deploy** — This was the old problem. New flow splits pull (8 min timeout) from restart (6 min timeout), both well under Oracle's TCP idle timeout. If SSH still freezes, check VM memory: `free -h` — swap should show usage, not OOM.
