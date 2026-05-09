# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multimediary is a physical media library management system (DVD/Blu-ray collections). It is a monorepo with a Rails 8.1 API-only backend in `backend/`. A Next.js frontend is planned but not yet started.

## Backend Commands

All commands run from `backend/`:

```bash
# Start development server
bin/dev

# Rails console
bin/rails console

# Database
bin/rails db:create && bin/rails db:migrate && bin/rails db:seed
bin/rails db:schema:load   # faster than replaying all migrations

# Generate a migration
bin/rails generate migration AddColumnToTable column:type

# Run all tests
bin/rails test

# Run a single test file
bin/rails test test/models/movie_test.rb

# Run a single test by line number
bin/rails test test/models/movie_test.rb:12

# Linting (auto-fix)
bin/rubocop -A

# Security scans
bin/brakeman --no-pager
bin/bundler-audit check --update
```

## Environment Setup

Copy `.env.example` to `.env`. All config is env-var driven:

| Env Var | Purpose |
|---|---|
| `BACKEND_DATABASE_HOST` | PostgreSQL host |
| `BACKEND_DATABASE_PORT` | PostgreSQL port (default 5432) |
| `BACKEND_DATABASE_NAME` | Dev database name |
| `BACKEND_DATABASE_USERNAME` | DB user |
| `BACKEND_DATABASE_PASSWORD` | DB password |
| `BACKEND_TEST_DATABASE_NAME` | Test database name |
| `TMDB_API_KEY` | TMDb API key — get one at https://developer.themoviedb.org |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins (default: `http://localhost:3000`) |

## Architecture

### Controller Inheritance

```
ApplicationController          (last-resort StandardError rescue → 500)
└── Api::V1::Admin::BaseController   (JWT auth, CanCanCan, pagination, rescue handlers)
    └── all admin resource controllers
└── Api::V1::Public::BaseController  (RecordNotFound rescue only)
    └── public controllers
```

`BaseController` provides: `paginate(collection)`, `pagination_meta(collection)`, `render_success(data, status:)`, `apply_sort(scope, default_column:, default_direction:)`.

`apply_sort` validates the sort column against the model's `ransackable_attributes` allowlist, then applies `ORDER BY column direction`. Clients pass `?sort=name&direction=asc`. Currently wired up on movies, actors, directors, and disks index actions.

### API Namespacing

All routes under `/api/v1`:

**Admin** (`/api/v1/admin/`) — JWT required (`authenticate_api_v1_admin_user!`):

| Method | Path | Action |
|---|---|---|
| POST | `/login` | Devise sessions#create |
| DELETE | `/logout` | Devise sessions#destroy |
| POST\|DELETE | `/sessions/reset_all` | super_admin: revoke all sessions |
| GET/POST/PATCH/DELETE | `/movies` | full CRUD |
| POST | `/movies/tmdb_search` | search TMDb by title |
| POST | `/movies/tmdb_import` | import full movie from TMDb |
| GET/POST/PATCH/DELETE | `/movies/:movie_id/ratings` | ratings nested under movie |
| GET/POST/PATCH/DELETE | `/actors`, `/directors`, `/genres`, `/categories`, `/qualities`, `/reviewers`, `/disks`, `/disk_formats` | full CRUD |
| GET/POST/PATCH/DELETE | `/users` | role management; only super_admin can create/destroy |
| GET | `/dashboard` | summary stats + 8 recent movies (all roles) |

**Public** (`/api/v1/public/`) — no auth:
| Method | Path | Action |
|---|---|---|
| POST | `/auth/session` | placeholder anonymous token |
| GET | `/movies`, `/movies/:id` | read-only, Ransack search, Kaminari pagination |

**Health check** (no auth): `GET /up` — pings the DB (`SELECT 1`) and returns `{ status, database, timestamp }` or `503` if unreachable.

### Authentication

**Devise + devise-jwt** with `jwt_authenticatable`. Scope name is `api_v1_admin_user` — Devise helpers are `current_api_v1_admin_user` and `authenticate_api_v1_admin_user!`.

Single-session enforcement: the current JWT is stored in `users.active_token`. A second login attempt while a valid token exists returns `403`. Logout clears `active_token`. `JwtDenylist` handles token revocation on logout.

Login params from clients use `{ user: { email, password } }` — `SessionsController#configure_sign_in_params` remaps this to `:api_v1_admin_user` for Warden.

### Authorization (CanCanCan)

`app/models/ability.rb` defines four roles for `User`:

| Role | Can |
|---|---|
| `super_admin` | everything |
| `admin` | manage all content; read users; cannot destroy users |
| `editor` | manage all content; cannot destroy lookup tables (Disk, DiskFormat, Category, Genre, Quality, Reviewer) |
| `analyst` | read-only on all content |

Default role on creation: `editor`. All admin controllers use `load_and_authorize_resource` except `UsersController` which calls `authorize!` manually.

### Serialization (Blueprinter)

All serializers live in `app/serializers/`. Pattern: `ModelSerializer.render_as_hash(record_or_collection, view: :name)`.

`MovieSerializer` has two named views:
- `:list` — lightweight (name, year, language, country, runtime, file_size, version, poster_url, tagline + category, disk compact, genres, qualities)
- `:detail` — extends `:list` with description, story, director, actors, ratings

`DiskSerializer` views:
- `:compact` — name, storage_type, disk_format
- `:detail` — extends `:compact` with movie_count and movies array (via `:list` view)

### Search & Pagination

**Ransack** handles search. Allowlisted attributes must be declared via `ransackable_attributes` / `ransackable_associations` on each model (Ransack 4+ requirement). Currently allowlisted: `Movie` (name, year, language, country, description, story, tagline, tmdb_id), `Actor` (first_name, last_name, nationality, gender), `Director` (first_name, last_name), `Disk` (name, storage_type).

**Kaminari** handles pagination. Admin controllers call `paginate(@collection)` and return `pagination_meta(@collection)` in the response. Default page size: 25.

### TMDb Integration

`app/services/tmdb_service.rb` — plain Ruby service object. Uses Faraday with `faraday-retry` (3 retries on timeout/connection failure).

- `TmdbService.new.search(query)` — returns raw TMDb results array
- `TmdbService.new.movie_detail(tmdb_id)` — returns a hash with `:name`, `:year`, `:description`, `:tagline`, `:runtime`, `:language`, `:country`, `:poster_url`, `:genres` (array of names), `:director` (hash), `:actors` (array of hashes, first 10 cast members)

`MoviesController#tmdb_import` runs in a transaction: finds/creates director, genres, and actors from TMDb data, then creates the movie. Requires `disk_id` and `category_id` params from the caller. Returns `409 Conflict` (with the existing movie) if a movie with that `tmdb_id` already exists.

### Data Model

**Associations:**
- `Movie` belongs_to `Category`, `Director`, `Disk`; HABTM `Actor`, `Genre`, `Rating`, `Quality`
- `Disk` belongs_to `DiskFormat`; has_many `Movie`
- `Rating` belongs_to `Reviewer`; HABTM `Movie`
- `Reviewer` has_many `Rating`
- `Director`, `Category` each has_many `Movie`
- `Actor`, `Genre`, `Quality` HABTM `Movie`

**Join tables** (no primary key, no join model): `actors_movies`, `genres_movies`, `movies_qualities`, `movies_ratings`

**Key model fields:**

| Model | Notable fields |
|---|---|
| `Movie` | `name`, `year`, `language`, `country`, `description`, `story`, `tagline`, `runtime`, `file_size`, `version`, `poster_url`, `tmdb_id` |
| `Actor` | `first_name`, `last_name`, `gender`, `date_of_birth`, `nationality`, `image_url` |
| `Director` | `first_name`, `last_name`, `date_of_birth`, `image_url` |
| `Disk` | `name`, `storage_type` (e.g. "HDD") |
| `DiskFormat` | `name` (e.g. "DVD", "Blu-ray") |
| `Rating` | `rating_value`, `rating_out_of`, `reviewer_id` |
| `Reviewer` | `name`, `website_url` |
| `Quality` | `name` |
| `Genre` | `name`, `description` |
| `Category` | `name` |

**Rating dual-relationship caveat**: `Rating` has both `belongs_to :movie` (via a `movie_id` column, set directly) AND `has_and_belongs_to_many :movies` (via `movies_ratings` join table). These are independent. The ratings controller queries via `Rating.where(movie_id: @movie.id)`, not `@movie.ratings` (which would use the join table). A `[movie_id, reviewer_id]` unique index enforces one rating per reviewer per movie.

**Destroy guards** (enforced in controllers via `before_action`, not model callbacks): Genre, Category, Quality, DiskFormat cannot be destroyed if associated movies/disks exist. Disk cannot be destroyed if it has movies.

### Testing

Tests use Minitest + FactoryBot. `fixtures :all` is NOT used — all test data is created via factories. Tests use `use_transactional_tests = true`.

- Factories: `test/factories/*.rb` (one per model, sequences on unique fields)
- Support: `test/support/auth_helpers.rb` — `auth_headers_for(user)` returns `{ "Authorization" => "Bearer <token>" }` using a real JWT for controller tests
- Model tests: `test/models/` — all domain models covered, including `AbilityTest` for all four roles
- Controller tests: `test/controllers/api/v1/admin/` — all admin resources (movies, actors, directors, genres, categories, qualities, disks, disk_formats, ratings, reviewers, users, sessions); `test/controllers/api/v1/public/` — public movies

**Mocking note**: Minitest 6.0.1 dropped `mock.rb` — `Minitest::Mock` and `Object#stub` are not available. Use plain Ruby for test doubles: `define_singleton_method` on an `Object.new` instance, and temporarily redefine the class's `.new` method via `define_singleton_method` with an `ensure` restore.

### Linting & Style

RuboCop with `rubocop-rails-omakase` preset. Run `bin/rubocop -A` to auto-fix. All files use `# frozen_string_literal: true`.

### Request Middleware

**CORS** (`config/initializers/cors.rb`): `Rack::Cors` scoped to `/api/*`. Allowed origins driven by `CORS_ALLOWED_ORIGINS` env var (comma-separated). Exposes the `Authorization` response header so the browser can read the JWT. `max_age: 600`.

**Rate limiting** (`config/initializers/rack_attack.rb`): `Rack::Attack` with two throttles — login endpoint (5 req/min per IP) and all `/api/*` endpoints (300 req/min per IP). Returns 429 JSON on breach.

### Seed Data

`db/seeds.rb` is idempotent (`find_or_create_by!`). Seeds: 1 Category, 1 DiskFormat, 1 Disk, 3 Genres, 3 Directors, 10 Actors, 6 Fast & Furious films (2001–2013).

### Background Infrastructure (installed, not yet used in app code)

Solid Queue, Solid Cache, Solid Cable — all DB-backed. In production they use separate databases (`BACKEND_QUEUE_DATABASE_NAME`, `BACKEND_CACHE_DATABASE_NAME`, `BACKEND_CABLE_DATABASE_NAME`).

### Deployment

Kamal + Docker (`config/deploy.yml`). Thruster in front of Puma for HTTP caching/compression.

## What Is Not Yet Built

- **No frontend** — Next.js app is planned but not started
- **Public sessions controller** is a placeholder (returns a static token from credentials); proper public auth (anonymous JWT or API key) not implemented
- **`file_size` column is a string** — validated as numeric by the model but stored as `string` in the schema. `Movie.sum(:file_size)` will fail in PostgreSQL; use `.pluck(:file_size).sum(&:to_f)` instead (as done in the dashboard). A migration to `decimal` is a future task.
