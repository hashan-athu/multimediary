---
sidebar_position: 4
---

# Data Model

## Entity overview

```
Movie ──belongs_to──▶ Category          (required)
Movie ──belongs_to──▶ Director          (optional — nullable)
Movie ──belongs_to──▶ Disk              (required) ──belongs_to──▶ DiskFormat
Movie ──HABTM──▶ Actor                  (join: actors_movies)
Movie ──HABTM──▶ Genre                  (join: genres_movies)
Movie ──HABTM──▶ Quality               (join: movies_qualities)
Rating ──belongs_to──▶ Movie            (via movie_id column)
Rating ──belongs_to──▶ Reviewer
Reviewer ──has_many──▶ Rating           (dependent: :destroy)
Director ──has_many──▶ Movie
Category ──has_many──▶ Movie
```

## Model field reference

### Movie

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `year` | integer | 1888 – current year + 2 |
| `language` | string | e.g. "English" |
| `country` | string | e.g. "USA" |
| `description` | text | Short synopsis (from TMDb `overview`) |
| `story` | text | Long-form plot |
| `tagline` | string | Marketing tagline |
| `runtime` | integer | Minutes. Must be > 0 if present. |
| `file_size` | string | Stored as a string, displayed as GB in the UI. The stats endpoint divides by 1024 to convert from MB → GB for the storage total. |
| `version` | string | e.g. "Extended Cut", "Director's Cut" |
| `poster_url` | string | TMDb image URL or manually entered |
| `backdrop_url` | string | Widescreen banner image URL |
| `tmdb_id` | integer | Unique — prevents duplicate TMDb imports |
| `disk_id` | integer | FK → Disk (required) |
| `category_id` | integer | FK → Category (required) |
| `director_id` | integer | FK → Director (**nullable** — some movies lack a director record) |

### Actor / Director

| Field | Type | Notes |
|---|---|---|
| `first_name` | string | Required |
| `last_name` | string | Required |
| `gender` | string | male / female / other |
| `date_of_birth` | date | Optional |
| `nationality` | string | Actor only |
| `image_url` | string | TMDb profile image URL |

`Actor#full_name` and `Director#full_name` are computed as `"#{first_name} #{last_name}".strip`.

### Disk

| Field | Type | Notes |
|---|---|---|
| `name` | string | Unique. e.g. "HDD-02" or "DVD-047" |
| `storage_type` | string | e.g. "HDD", "USB", "DVD" |
| `disk_format_id` | integer | FK → DiskFormat (required) |

### Rating

| Field | Type | Notes |
|---|---|---|
| `rating_value` | float | e.g. 8.5 |
| `rating_out_of` | float | e.g. 10.0 |
| `movie_id` | integer | Direct FK (belongs_to) |
| `reviewer_id` | integer | FK → Reviewer |

Unique constraint: `[movie_id, reviewer_id]` — one rating per reviewer per movie.

## Ratings — dual relationship

`Rating` has both:
- `belongs_to :movie` via the `movie_id` column (this is what the admin controller and public serializer use)
- `has_and_belongs_to_many :movies` via a legacy `movies_ratings` join table (unused — never populated)

Always query ratings via `movie.movie_ratings` (which uses `has_many :movie_ratings, class_name: "Rating", foreign_key: :movie_id`) — not `movie.ratings`.

## Join tables

These tables have no primary key and no join model:

| Table | Links |
|---|---|
| `actors_movies` | Actor ↔ Movie |
| `genres_movies` | Genre ↔ Movie |
| `movies_qualities` | Quality ↔ Movie |
| `movies_ratings` | Legacy HABTM — not actively used |

## Destroy guards

Enforced in controller `before_action` hooks (not model callbacks):

| Record | Blocked when | Response |
|---|---|---|
| `Genre` | Has associated movies | 422 |
| `Category` | Has associated movies | 422 |
| `Quality` | Has associated movies | 422 |
| `DiskFormat` | Has associated disks | 422 |
| `Disk` | Has associated movies | 422 |
| `Reviewer` | — | Ratings are cascade-deleted (`dependent: :destroy`) |
