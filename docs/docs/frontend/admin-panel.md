---
sidebar_position: 2
---

# Admin Panel

The admin panel lives at `/admin/*` and is a fully client-rendered React application. All pages are `"use client"` — there are no Server Components in the admin section.

## Authentication flow

1. `src/proxy.ts` checks for the `mm_token` cookie on every `/admin/*` request. Missing → redirect to `/admin/login`.
2. On the login page, `POST /api/v1/admin/login` returns the JWT in the `Authorization` response header.
3. The token is stored in two places:
   - **Zustand store** (`src/store/authStore.ts`, persisted to `localStorage` under `mm-auth`) for in-app access
   - **`mm_token` cookie** (7-day, SameSite=Lax) so the middleware can read it on the next navigation
4. `AdminShell` (`src/components/layout/AdminShell.tsx`) hydrates the store on mount by reading the cookie, decoding the JWT, and restoring the user session.
5. The Axios interceptor in `src/lib/adminApi.ts` calls `clearAuth()` on any `401` response, deletes the cookie, and redirects to `/admin/login`.

## Layout

All protected admin pages render inside `src/app/admin/(shell)/layout.tsx`, which wraps content with `AdminShell`. This provides:

- **Sidebar** — navigation to all resources
- **Topbar** — user info, "Visit Site" link, notifications, sign-out
- **GlobalSearch** — keyboard-shortcut search across movies, actors, directors

## Pages and features

| Page | Path | Key features |
|---|---|---|
| Dashboard | `/admin/dashboard` | Collection stats, 8 recent movies |
| Movies | `/admin/movies` | Paginated DataTable, search/filter, TMDb import |
| Movie detail/edit | `/admin/movies/:id/edit` | `UnifiedMovieForm` with TMDb enrichment panel |
| Actors | `/admin/actors` | CRUD, image upload |
| Directors | `/admin/directors` | CRUD, image upload |
| Genres | `/admin/genres` | CRUD |
| Categories | `/admin/categories` | CRUD |
| Qualities | `/admin/qualities` | CRUD |
| Disks | `/admin/disks` | CRUD, disk format assignment |
| Disk Formats | `/admin/disk-formats` | CRUD |
| Reviewers | `/admin/reviewers` | CRUD |
| Users | `/admin/users` | Role management (super_admin only for create/destroy) |

## TMDb import flow

1. On the movie create page, type a title in the **TMDb Search** field.
2. `POST /api/v1/admin/movies/tmdb_search` returns candidate results as a list.
3. Select a result → `POST /api/v1/admin/movies/tmdb_import` with `{ tmdb_id, disk_id, category_id }`.
4. Rails creates the movie and all referenced actors/director/genres in a single transaction.
5. `409 Conflict` if the movie already exists — the UI redirects to the existing record.

## Key components

| Component | Location | Purpose |
|---|---|---|
| `AdminShell` | `src/components/layout/AdminShell.tsx` | Root layout with sidebar + topbar |
| `DataTable` | `src/components/shared/DataTable.tsx` | Sortable, paginated table (TanStack Table) |
| `UnifiedMovieForm` | `src/components/movies/UnifiedMovieForm.tsx` | Create/edit form for movies |
| `TMDbEnrichmentPanel` | `src/components/movies/TMDbEnrichmentPanel.tsx` | TMDb search + import UI |
| `CastSelector` | `src/components/movies/CastSelector.tsx` | Multi-select actors for a movie |
| `ConfirmDialog` | `src/components/shared/ConfirmDialog.tsx` | Deletion confirmation (always use controlled mode) |
| `ImageUploadField` | `src/components/shared/ImageUploadField.tsx` | Upload to `POST /api/v1/admin/upload` |

## Role-based UI

The frontend reads the `role` field from the decoded JWT. Some UI elements are conditionally shown:
- **super_admin only**: user management, session reset
- **analyst**: all forms are read-only (enforced by the API, not just the UI)
