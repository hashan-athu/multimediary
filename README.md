# Multimediary

Physical media library management system for DVD/Blu-ray collections. Admins manage a catalogue of movies stored across physical disks; a public API exposes the catalogue to frontends.

## Repository structure

| Directory | Contents |
|---|---|
| `backend/` | Rails 8.1 API-only backend (PostgreSQL, Devise JWT, CanCanCan) |
| `docs/` | Docusaurus developer documentation + OpenAPI spec |

## Quick start

### Backend

```bash
cd backend
cp .env.example .env     # fill in DB credentials and TMDB_API_KEY
bundle install
bin/rails db:create db:migrate db:seed
bin/dev                  # API at http://localhost:3000
```

### Documentation

```bash
cd docs
npm install
npm start                # http://localhost:3000/docs/
```

## What's built

- **Full CRUD** for movies, actors, directors, genres, categories, qualities, reviewers, disks, disk formats, and ratings
- **TMDb integration** — search and one-click import with auto-populated metadata (title, year, cast, genres, poster, etc.)
- **Role-based access control** — four roles: `super_admin`, `admin`, `editor`, `analyst`
- **Single-session enforcement** — one active JWT per user; second login is rejected until the first session is logged out
- **Search and pagination** — Ransack-powered filtering, sorting, and Kaminari pagination on all index endpoints
- **Dashboard** — summary stats (movie count, total storage, disk count, actor count) and 8 most recent movies
- **Rate limiting** — Rack::Attack: 5 login attempts/min, 300 API requests/min per IP
- **Health check** — `GET /up` pings the database and returns `200` or `503`
- **Deployment** — Kamal + Docker with zero-downtime rolling deploys

## What's planned

- Next.js frontend
- Proper public session tokens (current endpoint returns a static placeholder)
- `file_size` column migration from `string` to `decimal`

## Documentation

The `docs/` site covers architecture, authentication, authorization, data model, search/pagination, TMDb integration, deployment, and a full interactive API reference generated from `docs/api/openapi.yaml`.

See [`backend/README.md`](backend/README.md) for backend-specific setup and [`docs/README.md`](docs/README.md) for the documentation site.
