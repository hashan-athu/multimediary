# Multimediary — Backend

Rails 8.1 API-only backend for Multimediary, a physical media library management system (DVD/Blu-ray collections).

## Requirements

- Ruby 3.4.7
- PostgreSQL 14+
- A [TMDb API key](https://developer.themoviedb.org) (for movie import)

## Setup

```bash
cd backend
cp .env.example .env     # fill in database credentials and TMDB_API_KEY
bundle install
bin/rails db:create db:migrate db:seed
```

## Running

```bash
bin/dev                  # starts Puma on http://localhost:3000
```

## Environment variables

| Variable | Description |
|---|---|
| `BACKEND_DATABASE_HOST` | PostgreSQL host |
| `BACKEND_DATABASE_PORT` | PostgreSQL port (default `5432`) |
| `BACKEND_DATABASE_NAME` | Development database name |
| `BACKEND_DATABASE_USERNAME` | DB user |
| `BACKEND_DATABASE_PASSWORD` | DB password |
| `BACKEND_TEST_DATABASE_NAME` | Test database name |
| `TMDB_API_KEY` | TMDb API key — required for movie search/import |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins (default `http://localhost:3000`) |

## Testing

```bash
bin/rails test                               # all tests
bin/rails test test/models/movie_test.rb    # single file
bin/rails test test/models/movie_test.rb:12 # single test by line
```

## Linting and security

```bash
bin/rubocop -A                    # auto-fix RuboCop offenses
bin/brakeman --no-pager           # static security scan
bin/bundler-audit check --update  # dependency vulnerability check
```

## API overview

All routes are under `/api/v1`.

**Authentication:** `POST /api/v1/admin/users/sign_in` returns a JWT in the `Authorization` response header. Pass it as `Authorization: Bearer <token>` on subsequent requests.

**Admin endpoints** (JWT required):

| Resource | Base path |
|---|---|
| Auth | `/api/v1/admin/users/sign_in`, `sign_out`, `/sessions/reset_all` |
| Dashboard | `GET /api/v1/admin/dashboard` |
| Movies | `/api/v1/admin/movies` + TMDb search/import |
| Ratings | `/api/v1/admin/movies/:movie_id/ratings` |
| Actors, Directors, Genres, Categories, Qualities, Reviewers | `/api/v1/admin/<resource>` |
| Disks, Disk Formats | `/api/v1/admin/disks`, `/api/v1/admin/disk_formats` |
| Users | `/api/v1/admin/users` |

**Public endpoints** (no auth):

| Endpoint | Description |
|---|---|
| `GET /api/v1/public/movies` | Paginated, searchable movie list |
| `GET /api/v1/public/movies/:id` | Movie detail |
| `POST /api/v1/public/auth/session` | Placeholder anonymous token |
| `GET /up` | Health check — returns `200` or `503` |

Full interactive API reference: run the docs site and visit `http://localhost:3000/docs/api-reference/multimediary-api`.

## Roles

| Role | Permissions |
|---|---|
| `super_admin` | Full access including user management |
| `admin` | Manage all content; read users |
| `editor` | Manage all content; cannot destroy lookup tables |
| `analyst` | Read-only |

Default role for new users: `editor`.

## Deployment

The active backend deployment path is GitHub Actions + Docker Compose on the Oracle VM. The workflow builds `backend/Dockerfile`, pushes the image to GHCR, SSHes into the VM, and restarts the compose stack in `/opt/multimediary`.

See [`../deploy/README.md`](../deploy/README.md) for VM bootstrap, GitHub secrets, and operational commands.
