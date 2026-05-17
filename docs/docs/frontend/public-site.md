---
sidebar_position: 3
---

# Public Site

The public site at `src/app/(public)/` is a cinematic dark-themed movie browser. No authentication is required for any page in this route group.

## Pages

| Route | Component | Description |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | Home — hero carousel, search filter, movie sections, genre/category grids, collection stats |
| `/movies` | `src/app/(public)/movies/page.tsx` | Full catalogue with Ransack filtering |
| `/movies/[id]` | `src/app/(public)/movies/[id]/page.tsx` | Movie detail — backdrop, cast, director, ratings, disk info |
| `/actors` | `src/app/(public)/actors/page.tsx` | Actor list with search |
| `/actors/[id]` | `src/app/(public)/actors/[id]/page.tsx` | Actor profile with filmography |
| `/directors/[id]` | `src/app/(public)/directors/[id]/page.tsx` | Director profile with filmography |
| `/categories` | `src/app/(public)/categories/page.tsx` | Category list |
| `/categories/[id]` | `src/app/(public)/categories/[id]/page.tsx` | All movies in a category |
| `/genres` | `src/app/(public)/genres/page.tsx` | Genre list |
| `/genres/[id]` | `src/app/(public)/genres/[id]/page.tsx` | All movies in a genre |
| `/disks/[id]` | `src/app/(public)/disks/[id]/page.tsx` | Disk detail — all movies on a physical disk |

## Key components

| Component | Purpose |
|---|---|
| `Header` | Fixed navigation with active link highlighting, expandable search, mobile menu |
| `HeroCarousel` | Embla-powered auto-playing carousel for featured movies |
| `MovieCard` | Poster card with hover overlay, genre badges, Watch Now tooltip |
| `MovieSection` | Scrollable movie grid with heading and "View All" link |
| `SearchFilter` | Ransack-powered filter panel (genre, category, year, text search) |
| `Footer` | Navigation links, Documentation external link, cookie settings |
| `GenreBentoGrid` | Masonry-style genre browsing grid on the home page |
| `CategoryBentoGrid` | Category browsing grid on the home page |

## Active navigation

`Header` and `Footer` use `usePathname()` from Next.js to highlight the active nav section. The matching is prefix-based — visiting `/movies/123` keeps the "Movies" link active.

Home uses exact matching (`pathname === "/"`) to avoid being active on every page.

## Data fetching

All public pages use **TanStack Query** with `apiClient` from `src/lib/api.ts`:

```ts
const { data, isLoading } = useQuery({
  queryKey: ["public-movie", id],
  queryFn: () => apiClient.movies.get(Number(id)),
  enabled: !!id,
});
```

The public API client sends no `Authorization` header and calls `/api/v1/public/*`.

## Search and filtering

The `SearchFilter` component builds a Ransack `q` object from its form state and passes it up via an `onFilter` callback. The home page passes this to the movies query:

```ts
const { data } = useQuery({
  queryKey: ["public-movies", filterParams],
  queryFn: () => apiClient.movies.list({ per_page: 24, ...filterParams }),
});
```

Supported filter params: `q[name_cont]`, `q[category_id_eq]`, `q[genre_id_eq]`, `q[year_eq]`.

## Collection stats

The home page fetches `/api/v1/public/stats` to display live counts (movies, actors, directors, disks, storage GB), format breakdown, and top genres in the "The Collection" section above the footer.

## SEO

- `src/app/robots.ts` — generated `robots.txt` (blocks `/admin` and `/api`)
- `src/app/sitemap.ts` — dynamic sitemap built from live API data, revalidates every hour
- Root layout has full Open Graph and Twitter card metadata
- `public/llms.txt` and `public/llms-full.txt` for LLM crawlers
- `public/.well-known/security.txt` for security disclosures
