---
sidebar_position: 2
---

# Installation

## Prerequisites

| Tool | Version |
|---|---|
| Ruby | 3.3+ |
| Rails | 8.1 |
| PostgreSQL | 15+ |
| Node.js | 20+ (for docs only) |

## Clone the repository

```bash
git clone <your-repo-url>
cd multimediary
```

## Backend setup

```bash
cd backend

# Install Ruby dependencies
bundle install

# Configure environment
cp .env.example .env
# Edit .env — fill in all required values (see Environment page)

# Create and migrate the database
bin/rails db:create && bin/rails db:migrate

# Seed initial data (Fast & Furious demo collection)
bin/rails db:seed

# Start the development server
bin/dev
```

The API is now running at `http://localhost:3001` (or the port configured in `Procfile.dev`).

## Docs setup

```bash
cd docs
npm install
npm run gen-api-docs   # generate API reference pages from openapi.yaml
npm start              # runs on http://localhost:3000/docs/
```

## Verify the install

```bash
# Health check — should return { "status": "ok", "database": "ok" }
curl http://localhost:3001/up

# Login (replace with your seeded credentials)
curl -X POST http://localhost:3001/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "admin@example.com", "password": "password"}}'
```

## Common development commands

All run from `backend/`:

```bash
bin/rails test                                  # full test suite
bin/rails test test/models/movie_test.rb        # single file
bin/rails test test/models/movie_test.rb:12     # single test by line
bin/rubocop -A                                  # lint + auto-fix
bin/brakeman --no-pager                         # security scan
bin/bundler-audit check --update                # gem vulnerability check
```
