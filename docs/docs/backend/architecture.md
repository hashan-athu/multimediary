---
sidebar_position: 1
---

# Architecture

## System overview

```
Browser / Mobile
      │
      │  HTTPS (Caddy auto-TLS)
      ▼
┌─────────────────────────────────┐
│           Caddy 2               │  ← reverse proxy + Let's Encrypt
│  /docs/*  →  docs (Nginx)      │
│  /api/*   →  backend (Rails)   │
│  /*       →  backend (Rails)   │
└─────────────────────────────────┘
      │                  │
      ▼                  ▼
┌──────────┐      ┌──────────────┐
│  Nginx   │      │  Thruster    │  ← HTTP/2, compression, asset cache
│  (docs)  │      │  + Puma      │  ← Rails app server
└──────────┘      └──────┬───────┘
                         │
               ┌─────────┴──────────┐
               ▼                    ▼
        PostgreSQL            PostgreSQL
        (primary)      (Solid Queue / Cache / Cable)

External:
  TMDb API  ◀──▶  Rails (metadata import via Faraday)
```

The Next.js frontend is deployed separately (Vercel or standalone) and communicates with the Rails API via the public domain.

## Controller hierarchy

```
ApplicationController
  └── last-resort StandardError rescue → 500 JSON

Api::V1::Admin::BaseController
  ├── authenticate_api_v1_admin_user! (Devise JWT)
  ├── CanCanCan authorization
  ├── paginate() / pagination_meta()
  ├── apply_sort() — validates column against ransackable_attributes
  ├── render_success()
  └── rescue_from: RecordNotFound → 404, AccessDenied → 403, RecordInvalid → 422
      └── all admin resource controllers

Api::V1::Public::BaseController
  ├── rescue_from: RecordNotFound → 404, ParameterMissing → 400
  ├── paginate() / pagination_meta()
  └── apply_sort()
      └── all public controllers
```

## API namespacing

All routes under `/api/v1/`.

**Admin** (JWT required) — `/api/v1/admin/`:

| Resource | Notes |
|---|---|
| `POST /login`, `DELETE /logout` | Session management |
| `POST /sessions/reset_all` | super_admin: revoke all sessions |
| `/movies` | Full CRUD + `tmdb_search` + `tmdb_import` |
| `/movies/:id/ratings` | Ratings nested under movie |
| `/actors`, `/directors`, `/genres`, `/categories`, `/qualities`, `/reviewers` | Full CRUD |
| `/disks`, `/disk_formats` | Full CRUD |
| `/users` | Role management; only super_admin can create/destroy |
| `GET /dashboard` | Summary stats + 8 recent movies |

**Public** (no auth) — `/api/v1/public/`:

| Resource | Notes |
|---|---|
| `GET /movies` | Paginated, Ransack filtering, sort |
| `GET /movies/:id` | Full detail with cast, ratings |
| `GET /movies/recent?count=N` | N most recently added (max 48) |
| `GET /movies/random?count=N` | N random movies (max 24) |
| `GET /actors`, `/actors/:id` | Actor list + filmography |
| `GET /directors/:id` | Director profile + filmography |
| `GET /categories`, `/categories/:id` | Category + paginated movies |
| `GET /genres`, `/genres/:id` | Genre + paginated movies |
| `GET /disks`, `/disks/:id` | Disk inventory |
| `GET /search?q=term` | Cross-resource: movies, actors, directors |
| `GET /stats` | Collection totals, by_category, by_format, top_genres |

## Key gems

| Gem | Purpose |
|---|---|
| `devise` + `devise-jwt` | Authentication, JWT issuance and revocation |
| `cancancan` | Role-based authorization |
| `blueprinter` | JSON serialization with named views |
| `ransack` | Search and sorting via query params |
| `kaminari` | Pagination |
| `faraday` + `faraday-retry` | HTTP client for TMDb (3 retries on timeout) |
| `rack-cors` | CORS headers for the frontend origin |
| `rack-attack` | Rate limiting (5/min login, 300/min general) |
| `solid_queue` / `solid_cache` / `solid_cable` | DB-backed background infrastructure |

## Serialization

All serializers live in `app/serializers/public/` (public) or `app/serializers/` (admin), using **Blueprinter**.

Pattern: `ModelSerializer.render_as_hash(record_or_collection, view: :name)`.

`MovieSerializer` named views:
- `:list` — lightweight (name, year, poster, category, disk, genres, qualities)
- `:detail` — extends `:list` with description, story, director, actors, ratings

Public serializers are namespaced `Public::*`. Reference them as `::Public::*` inside controllers to avoid Rails resolving `Api::V1::Public::*`.

## Request lifecycle (admin)

1. Request arrives with `Authorization: Bearer <jwt>` header
2. `authenticate_api_v1_admin_user!` validates JWT against `users.active_token`
3. `load_and_authorize_resource` loads the record and checks `Ability`
4. Controller action runs
5. Blueprinter serializer shapes the JSON response
