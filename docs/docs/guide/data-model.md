---
sidebar_position: 7
---

# Data Model

## Entity overview

```
Movie ──belongs_to──▶ Category
Movie ──belongs_to──▶ Director
Movie ──belongs_to──▶ Disk ──belongs_to──▶ DiskFormat
Movie ──HABTM──▶ Actor       (join table: actors_movies)
Movie ──HABTM──▶ Genre       (join table: genres_movies)
Movie ──HABTM──▶ Quality     (join table: movies_qualities)
Rating ──belongs_to──▶ Movie  (via movie_id column)
Rating ──belongs_to──▶ Reviewer
Reviewer ──has_many──▶ Rating
```

## Ratings — dual relationship note

`Rating` has both `belongs_to :movie` (via a `movie_id` column) AND
`has_and_belongs_to_many :movies` (via a `movies_ratings` join table).
These are independent relationships. The admin ratings controller uses
`Rating.where(movie_id: @movie.id)` — not `@movie.ratings` — because the
`movie_id` column is what gets set by the create action.

A unique index on `[movie_id, reviewer_id]` prevents one reviewer from
rating the same movie twice.

## Model field reference

### Movie

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `year` | integer | 1888–present+2 |
| `language` | string | e.g. "English" |
| `country` | string | e.g. "USA" |
| `description` | text | Short synopsis |
| `story` | text | Full plot |
| `tagline` | string | Marketing tagline |
| `runtime` | integer | Minutes |
| `file_size` | string | Stored as a string, validated as numeric (MB). Use `.to_f` — `Movie.sum(:file_size)` will fail in PostgreSQL. |
| `version` | string | e.g. "Extended Cut" |
| `poster_url` | string | TMDb image URL |
| `tmdb_id` | integer | Unique; prevents duplicate TMDb imports |
| `disk_id` | integer | FK → Disk (required) |
| `category_id` | integer | FK → Category (required) |
| `director_id` | integer | FK → Director (required) |

### Actor / Director

| Field | Type | Notes |
|---|---|---|
| `first_name` | string | Required |
| `last_name` | string | Required for Director |
| `gender` | string | male / female / other |
| `date_of_birth` | date | |
| `nationality` | string | Actor only |
| `image_url` | string | TMDb profile image |

### Disk

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique; e.g. "DVD-047" or "HDD-02" |
| `storage_type` | string | e.g. "HDD", "DVD", "USB" |
| `disk_format_id` | integer | FK → DiskFormat (required) |

### Rating

| Field | Type | Notes |
|---|---|---|
| `rating_value` | float | e.g. 8.5 |
| `rating_out_of` | float | e.g. 10.0 |
| `movie_id` | integer | Scoping FK (belongs_to) |
| `reviewer_id` | integer | FK → Reviewer |

Unique constraint: `[movie_id, reviewer_id]` — one rating per reviewer per movie.

## Join tables

These tables have no primary key and no join model:

| Table | Links |
|---|---|
| `actors_movies` | Actor ↔ Movie |
| `genres_movies` | Genre ↔ Movie |
| `movies_qualities` | Quality ↔ Movie |
| `movies_ratings` | Rating ↔ Movie (legacy HABTM, separate from `ratings.movie_id`) |
