---
sidebar_position: 8
---

# Search and Pagination

## Search (Ransack)

Search is powered by **Ransack**. Pass query params under the `q` key.
Ransack 4+ requires explicit allowlisting — only fields declared in each
model's `ransackable_attributes` can be searched.

### Search movies by name (contains)

```
GET /api/v1/admin/movies?q[name_cont]=inception
```

### Filter by exact year

```
GET /api/v1/admin/movies?q[year_eq]=2010
```

### Search actors by first or last name

```
GET /api/v1/admin/actors?q[first_name_or_last_name_cont]=tom
```

### Ransack predicates

| Predicate suffix | Meaning |
|---|---|
| `_cont` | Contains (LIKE %value%) |
| `_eq` | Equals |
| `_start` | Starts with |
| `_gt` / `_lt` | Greater / less than |
| `_in` | IN list |

### Allowlisted searchable fields

| Model | Searchable fields |
|---|---|
| Movie | name, year, language, country, description, story, tagline, tmdb_id |
| Actor | first_name, last_name, nationality, gender |
| Director | first_name, last_name |
| Disk | name, storage_type |

## Sorting

Two sorting conventions are supported:

### Ransack sort

```
GET /api/v1/admin/movies?q[s]=year+desc
GET /api/v1/admin/movies?q[s]=name+asc
```

### Simple sort params

```
GET /api/v1/admin/movies?sort=name&direction=asc
GET /api/v1/admin/actors?sort=last_name&direction=asc
```

The `sort` column is validated against the model's `ransackable_attributes` allowlist.
Unknown columns fall back to the default ordering. Supported on: movies, actors,
directors, disks.

## Pagination (Kaminari)

All index endpoints return paginated results.

### Request params

```
GET /api/v1/admin/movies?page=2&per_page=10
```

Default page size: **25**. There is no enforced maximum, but keep it reasonable
(under 100) to avoid slow responses.

### Response shape

Every paginated response includes a `meta` object:

```json
{
  "movies": [...],
  "meta": {
    "current_page": 2,
    "total_pages": 14,
    "total_count": 342,
    "per_page": 25
  }
}
```

Use `meta.total_pages` to decide whether to show a "next page" button.
Use `meta.total_count` to display a record count.
