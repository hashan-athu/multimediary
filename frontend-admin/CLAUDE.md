# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important**: This is Next.js 16.2.6 — it has breaking changes from older versions. Check `node_modules/next/dist/docs/` before writing any Next.js-specific code and heed deprecation notices.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 3000

# Build & production
npm run build
npm run start

# Lint
npm run lint
```

## Environment & API Proxy

The Next.js dev server proxies `/api/*` to `http://127.0.0.1:3001/api/*` (configured in `next.config.ts`). There is no `.env` file needed for local dev — the backend URL is hardcoded in the rewrite rule.

The API client base URL (`src/lib/api.ts`) is `http://localhost:3001/api/v1`. If the backend runs on a different port, update the rewrite in `next.config.ts` and the `BASE_URL` in `api.ts`.

## Architecture

### Auth Flow

`src/middleware.ts` guards `/admin/*` routes — redirects to `/login` if the `mm_token` cookie is absent. `AdminShell` (`src/components/layout/AdminShell.tsx`) also restores session on mount: it reads the `mm_token` cookie, decodes the JWT to extract the user ID, calls the users API to hydrate the Zustand store, then renders the layout.

Zustand auth store (`src/store/authStore.ts`) persists to localStorage under key `mm-auth`. Clearing auth also deletes the `mm_token` cookie.

### API Client

All API calls go through `src/lib/api.ts`. The `api` Axios instance attaches the Bearer token on every request and redirects to `/login` on 401. Use `apiClient.<resource>.<method>()` — never call `api.get/post` directly from pages. Use `extractApiError(err)` for user-facing error messages.

### State Management

- **Auth**: `useAuthStore()` from `src/store/authStore.ts` — `user`, `token`, `clearAuth()`
- **UI**: `useUIStore()` from `src/store/uiStore.ts` — `sidebarCollapsed`, `toggleSidebar()`
- **Server state**: TanStack Query v5 everywhere. Query client config is in `src/lib/queryClient.ts` (staleTime: 5 min, retry: 1).

### Component Conventions

**`"use client"` on every page and interactive component** — this app has no server components beyond layouts.

**Shared components** (`src/components/shared/`):
- `PageHeader` — standard page title + subtitle + actions slot
- `DataTable` + `SortableHeader` — TanStack Table v8 wrapper; pass `columns: ColumnDef<T>[]` and `data`
- `ConfirmDialog` — supports both uncontrolled (renders its own trigger) and controlled (`open`/`onOpenChange` props) modes. Always use controlled mode when triggering from inside a dropdown to avoid the portal unmounting the dialog.
- `ImageUploadField` — URL input or file upload (`POST /api/v1/admin/upload`); uses plain `<img>` for preview (not `next/image`) to avoid hostname restrictions

**UI primitives** are in `src/components/ui/` — these are shadcn components built on **`@base-ui/react`** (not Radix UI). Critical difference: `DropdownMenuItem` only fires `onClick`, not `onSelect`. Never use `onSelect` on dropdown items.

### Styling

Tailwind CSS v4. Design tokens are defined as CSS custom properties in `src/app/globals.css`. Always use the project's color palette (hex values or token names) rather than Tailwind's default colors:

| Token | Hex | Usage |
|---|---|---|
| Sidebar bg | `#16213E` | Sidebar background |
| Primary | `#4299EB` | Buttons, links, active states |
| Danger | `#F25959` | Delete actions |
| Text primary | `#1C2238` | Headings |
| Text secondary | `#4F5C72` | Body text |
| Text muted | `#9AA5B8` | Placeholders, secondary labels |
| Surface | `#EDF1F7` | Input backgrounds, chips, tags |
| Border | `#E0E8EF` | Card/table borders |

Class names are composed with `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`).

### Types

All shared TypeScript types live in `src/types/index.ts`. Key distinction:
- `MovieList` — lightweight, used in list/grid views and the `Disk.movies` array
- `MovieDetail` — extends `MovieList` with `description`, `director`, `actors[]`, `ratings[]`

### TMDb Integration

`apiClient.movies.tmdbSearch(query)` and `apiClient.movies.tmdbImport({tmdb_id, disk_id, category_id})`. Import runs entirely on the backend — it creates the director, genres, actors, and a TMDb rating automatically. Returns `409` if the movie was already imported (response includes the existing movie).

### Image Uploads

`POST /api/v1/admin/upload` — accepts `multipart/form-data` with a `file` field; returns `{ url: "/uploads/filename" }`. Only `admin` and `editor` roles are authorized. Uploaded files are stored in the backend's `public/uploads/` directory.
