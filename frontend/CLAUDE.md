# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

No `.env` file needed for local dev. The Next.js proxy rewrites `/api/*` → `http://127.0.0.1:3001/api/*`. Override with `NEXT_PUBLIC_API_URL`. Set `NEXT_PUBLIC_SITE_URL` for the admin "Visit Site" link.

## Route Structure

```
src/app/
  layout.tsx              # root layout (QueryClientProvider, TooltipProvider)
  (public)/               # cinematic dark theme, no auth
    page.tsx              # home (hero carousel + movie rows)
    movies/               # list + [id] detail
    actors/[id]/
    directors/[id]/
    disks/[id]/
    categories/[id]/
    genres/[id]/
  admin/                  # light theme, JWT required
    login/
    (shell)/              # AdminShell layout (sidebar + topbar)
      dashboard/, movies/, actors/, directors/, ...
```

Route protection: `src/proxy.ts` (Next.js 16 renames `middleware.ts` → `proxy.ts`) guards `/admin/*` using the `mm_token` cookie.

## API Clients

Two separate modules — never mix them:

- **`src/lib/api.ts`** — public API (`/api/v1/public/*`), no auth. Exports `apiClient` with `movies`, `actors`, `directors`, `disks`, `categories`, `genres`, `search`, `stats`.
- **`src/lib/adminApi.ts`** — admin API (`/api/v1/admin/*`), JWT auth. Exports `apiClient`, `extractApiError`, `getCookieToken`, `api` (axios instance). Use `apiClient.<resource>.<method>()` — never call the axios instance directly.

## Critical Gotchas

**`@base-ui/react` vs Radix UI:** `Tooltip` and `Select` in `src/components/ui/` are built on `@base-ui/react`, NOT Radix UI. `DropdownMenuItem` only fires `onClick`, not `onSelect`. Never use `onSelect` on dropdown items.

**Static image imports:** All placeholder images live in `src/assets/images/placeholders/`. Import them via `import X from "@/assets/images/placeholders/file.ext"`. For `<Image>` (next/image) pass the import directly; for plain `<img>` use `.src`. Do not reference `/assets/...` as a string — those files aren't in `public/`.

**`ConfirmDialog`:** Always use controlled mode (`open`/`onOpenChange` props) when triggering from inside a dropdown — the portal unmounts the trigger otherwise.

**`ImageUploadField`:** Uses plain `<img>` not `next/image`. `POST /api/v1/admin/upload` accepts `multipart/form-data` with a `file` field; returns `{ url: "/uploads/filename" }`.

**All admin pages use `"use client"`** — no server components in admin.

## Auth Flow (Admin)

1. `proxy.ts` redirects to `/admin/login` when `mm_token` cookie absent.
2. `AdminShell` restores session on mount: reads `mm_token` → decodes JWT → hydrates Zustand store (`src/store/authStore.ts`, persisted to localStorage under `mm-auth`).
3. On 401, axios interceptor calls `clearAuth()`, deletes cookie, redirects to `/admin/login`.

## Theme System

Tokens in `src/styles/theme.css` (Tailwind v4 `@theme` + `:root`).

**Public (dark cinematic):** `bg-bg-deep` (#05070A), `brand-primary` (#E50914 red), `brand-secondary` (#00D1FF cyan), `accent` (#F5BD32 gold), `.glass-panel` utility.

**Admin (light):** `bg-admin-sidebar` (#16213E), `bg-admin-primary` (#4299EB), `bg-admin-danger` (#F25959), `text-admin-text-1` (#1C2238), `text-admin-text-2` (#4F5C72), `bg-admin-plate` (#EDF1F7), `border-admin-border` (#E0E8EF).

## Key Types

`src/types/index.ts` — `MovieList` (lightweight) vs `MovieDetail` (extends with `description`, `director`, `actors[]`, `ratings[]`). Public pages use `MovieList` in cards/carousels and `MovieDetail` on the `[id]` detail page.

## Component Locations

| Path | Contents |
|---|---|
| `src/components/` | Public components (Header, Footer, HeroCarousel, MovieCard, PublicStates) |
| `src/components/layout/` | Admin layout (AdminShell, Sidebar, Topbar, GlobalSearch) |
| `src/components/movies/` | Admin movie forms (UnifiedMovieForm, TMDbEnrichmentPanel, CastSelector) |
| `src/components/shared/` | Admin shared (DataTable, ConfirmDialog, PageHeader, StatCard, EmptyState, ImageUploadField) |
| `src/components/ui/` | shadcn/ui base components (some use @base-ui/react — see gotcha above) |
