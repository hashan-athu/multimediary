---
sidebar_position: 1
---

# Frontend Overview

The frontend is a unified **Next.js 16.2.6** application that serves both the public movie browser and the admin panel from a single app on **port 3000**.

## Route structure

| URL pattern | Location | Notes |
|---|---|---|
| `/` and all public pages | `src/app/(public)/` | Cinematic dark theme, no auth |
| `/admin/*` | `src/app/admin/` | Light theme, JWT required |
| `/admin/login` | `src/app/admin/login/` | Only unprotected admin route |

## Tech stack

| Package | Purpose |
|---|---|
| Next.js 16.2.6 | App Router, file-based routing |
| React 19 | UI framework |
| Tailwind CSS v4 | Utility-first styling |
| `@base-ui/react` | Tooltip, Select primitives |
| `@radix-ui/*` | Dialog, Dropdown, Tabs, and other primitives |
| TanStack Query v5 | Server state / data fetching |
| Zustand | Client state (auth store, cookie store) |
| Framer Motion | Animations |
| Embla Carousel | Hero carousel |
| React Hook Form + Zod | Admin forms and validation |
| Axios | HTTP client |
| Sonner | Toast notifications |

## API clients

Two separate modules — never mix them:

| Module | Path | Purpose |
|---|---|---|
| Public API | `src/lib/api.ts` | `/api/v1/public/*`, no auth |
| Admin API | `src/lib/adminApi.ts` | `/api/v1/admin/*`, JWT bearer token |

The Next.js proxy rewrites `/api/*` → backend URL (configurable via `BACKEND_URL` env var in `next.config.ts`).

## Theme system

All design tokens are in `src/styles/theme.css` using Tailwind v4 `@theme` blocks.

**Public (dark cinematic):**

| Token | Value | Usage |
|---|---|---|
| `--color-bg-deep` | `#05070A` | Page background |
| `--color-brand-primary` | `#E50914` | CTA buttons, active states |
| `--color-brand-secondary` | `#00D1FF` | Accent links, highlights |
| `--color-accent` | `#F5BD32` | Gold — ratings, stars |
| `.glass-panel` | utility | Glassmorphism card style |

**Admin (light):**

| Class | Hex | Usage |
|---|---|---|
| `bg-admin-sidebar` | `#16213E` | Sidebar background |
| `bg-admin-primary` | `#4299EB` | Buttons, active states |
| `bg-admin-danger` | `#F25959` | Delete actions |
| `text-admin-text-1` | `#1C2238` | Headings |
| `text-admin-text-2` | `#4F5C72` | Body text |

## Route protection

`src/proxy.ts` (Next.js 16 renames `middleware.ts` → `proxy.ts`) guards all `/admin/*` routes by checking for the `mm_token` cookie. Missing cookie → redirect to `/admin/login`.

## Key types

`src/types/index.ts` defines the shared type contract between API responses and UI components. Key distinction:
- `MovieList` — lightweight, used in cards and carousels
- `MovieDetail` — extends `MovieList` with `description`, `director`, `actors[]`, `ratings[]`

## Important gotchas

**`@base-ui/react` vs Radix UI:** `Tooltip` and `Select` in `src/components/ui/` are built on `@base-ui/react`, not Radix. `DropdownMenuItem` only fires `onClick`, never `onSelect`.

**Static image imports:** Placeholder images live in `src/assets/images/placeholders/`. Import them with `import X from "@/assets/..."`. For `<Image>` (next/image) pass the import directly; for plain `<img>` use `.src`.

**`ConfirmDialog`:** Always use controlled mode (`open`/`onOpenChange`) when triggering from inside a dropdown — the portal unmounts the trigger node otherwise.

**All admin pages are `"use client"`** — there are no Server Components in the admin section.
