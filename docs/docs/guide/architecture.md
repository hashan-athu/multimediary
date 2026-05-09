---
sidebar_position: 4
---

# Architecture

## Overview

Multimediary is a monorepo with a Rails API backend and a planned Next.js frontend.
All communication happens over JSON REST API calls secured with JWT bearer tokens.

```
Browser (Next.js admin)
        │
        │ HTTPS / JSON REST
        ▼
  Nginx + Thruster     ← asset cache, compression, TLS termination
        │
        ├──▶ Rails 8.1 API
        │         │
        │         ├──▶ PostgreSQL (primary database)
        │         ├──▶ Solid Queue DB (background jobs)
        │         ├──▶ Solid Cache DB (caching)
        │         └──▶ Solid Cable DB (WebSockets)
        │
        └──▶ Physical storage (HDD / DVD → future NAS)

External:
  TMDb API  ◀──▶  Rails (metadata import)
```

## Controller hierarchy

```
ApplicationController
  └── last-resort StandardError rescue → 500 JSON

Api::V1::Admin::BaseController
  ├── authenticate_api_v1_admin_user! (Devise + JWT)
  ├── CanCanCan authorization
  ├── paginate() / pagination_meta()
  ├── apply_sort() — validates column against ransackable_attributes
  ├── render_success()
  └── rescue_from: RecordNotFound → 404, AccessDenied → 403, RecordInvalid → 422
      └── all admin resource controllers

Api::V1::Public::BaseController
  └── rescue_from: RecordNotFound → 404
      └── public movies controller
```

## Request lifecycle (admin)

1. Request arrives with `Authorization: Bearer <jwt>` header
2. `authenticate_api_v1_admin_user!` validates JWT against `users.active_token`
3. `load_and_authorize_resource` loads the record from DB and checks `Ability`
4. Controller action runs business logic
5. Blueprinter serializer shapes the JSON response
6. Response returned with consistent `{ data }` or `{ data, meta }` structure

## Key gems

| Gem | Purpose |
|---|---|
| `devise` + `devise-jwt` | Authentication, JWT issuance and revocation |
| `cancancan` | Role-based authorization |
| `blueprinter` | JSON serialization with named views |
| `ransack` | Search and sorting via query params |
| `kaminari` | Pagination |
| `faraday` + `faraday-retry` | HTTP client for TMDb API (3 retries on timeout) |
| `rack-cors` | CORS headers for frontend origin |
| `rack-attack` | Rate limiting (5/min login, 300/min general) |
| `solid_queue` / `solid_cache` / `solid_cable` | DB-backed background infrastructure |
| `kamal` | Docker deployment |
