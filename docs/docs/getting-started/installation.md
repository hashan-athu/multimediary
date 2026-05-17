---
sidebar_position: 2
---

# Installation

## Prerequisites

| Tool | Version |
|---|---|
| Ruby | 3.4+ |
| Rails | 8.1 |
| PostgreSQL | 15+ |
| Node.js | 20+ |

## Clone

```bash
git clone <your-repo-url>
cd multimediary
```

## Backend setup

```bash
cd backend

# Install gems
bundle install

# Configure environment
cp .env.example .env
# Edit .env — fill in all required values (see Environment Variables)

# Create database, run migrations, seed demo data
bin/rails db:create && bin/rails db:migrate && bin/rails db:seed

# Start dev server (Puma on port 3001)
bin/dev
```

Health check: `GET http://localhost:3001/up` → `{ "status": "ok", "database": "ok" }`

## Frontend setup

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

The frontend proxies `/api/*` → `http://127.0.0.1:3001/api/*` automatically. No `.env` file is needed for local development.

## Docs setup

```bash
cd docs
npm install
npm run gen-api-docs   # generate API reference from api/openapi.yaml
npm start              # http://localhost:3002/docs/
```

## Common backend commands

All run from `backend/`:

```bash
bin/rails test                             # full test suite
bin/rails test test/models/movie_test.rb   # single file
bin/rails test test/models/movie_test.rb:12 # single test by line number
bin/rubocop -A                             # lint + auto-fix
bin/brakeman --no-pager                    # security scan
bin/bundler-audit check --update           # gem vulnerability check
bin/rails console                          # interactive Rails console
```

## Common frontend commands

All run from `frontend/`:

```bash
npm run dev     # dev server on port 3000
npm run build   # production build
npm run lint    # ESLint
```

## Verify the install

```bash
# Backend health
curl http://localhost:3001/up

# Admin login (credentials match seeds)
curl -X POST http://localhost:3001/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "admin@example.com", "password": "password"}}'
```
