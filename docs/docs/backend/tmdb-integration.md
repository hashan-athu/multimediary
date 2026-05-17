---
sidebar_position: 9
---

# TMDb Integration

Multimediary uses [The Movie Database (TMDb) API](https://developer.themoviedb.org)
to auto-fill movie metadata. Set `TMDB_API_KEY` in `.env` before using these endpoints.

## Two-step import flow

### Step 1 — Search

Present the admin user with a search interface. When they type a title, call:

```http
POST /api/v1/admin/movies/tmdb_search
Authorization: Bearer <token>
Content-Type: application/json

{ "query": "Inception" }
```

Returns raw TMDb results — display them as a picker list. Each result
includes a `tmdb_id` (the `id` field from TMDb) that you'll use in Step 2.

### Step 2 — Import

Once the user selects a result:

```http
POST /api/v1/admin/movies/tmdb_import
Authorization: Bearer <token>
Content-Type: application/json

{
  "tmdb_id": 27205,
  "disk_id": 3,
  "category_id": 1
}
```

This fetches full detail from TMDb and creates the movie record in a single
database transaction. Actors, directors, and genres are **found or created**
automatically — no duplicates are introduced.

**Duplicate protection:** If a movie with that `tmdb_id` already exists in the
database, the endpoint returns `409 Conflict` with the existing movie record.
The frontend should redirect to it instead of showing an error.

## What is imported automatically

| Field | Source |
|---|---|
| name | TMDb `title` |
| year | TMDb `release_date` (year extracted) |
| description | TMDb `overview` |
| tagline | TMDb `tagline` |
| runtime | TMDb `runtime` (minutes) |
| language | First spoken language name |
| country | First production country name |
| poster_url | TMDb `poster_path` prefixed with `https://image.tmdb.org/t/p/w500` |
| director | TMDb crew where `job = "Director"` |
| actors | First 10 TMDb cast members |
| genres | All TMDb genre names |
| tmdb_id | TMDb `id` |

## What must be set manually after import

| Field | Why it isn't auto-imported |
|---|---|
| `disk_id` | Which physical disk the file is on — only you know this |
| `category_id` | Hollywood / Bollywood / Kollywood / Sinhala — editorial choice |
| `quality_ids` | 720p / 1080p / 4K — depends on the actual file |
| `file_size` | Actual file size in MB — read from the filesystem |
| `version` | Director's Cut, Extended, Theatrical — editorial choice |
| `story` | Long-form plot — TMDb `overview` goes into `description` only |

## Service internals

`TmdbService` (`app/services/tmdb_service.rb`) is a plain Ruby service object.
It uses **Faraday** with `faraday-retry` (3 retries on connection failures).

```ruby
TmdbService.new.search("Inception")         # raw results array
TmdbService.new.movie_detail("27205")       # structured hash with :name, :actors, etc.
```
