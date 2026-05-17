import type { MetadataRoute } from "next";

export const revalidate = 3600; // rebuild the sitemap at most once per hour

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
// Server-side: call the backend directly, bypassing the Next.js rewrite proxy
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

async function fetchIds(path: string, key: string): Promise<number[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}${path}?per_page=1000`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data[key] as any[])?.map((r: { id: number }) => r.id) ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movieIds, actorIds, directorIds, categoryIds, genreIds, diskIds] =
    await Promise.all([
      fetchIds("/api/v1/public/movies", "movies"),
      fetchIds("/api/v1/public/actors", "actors"),
      fetchIds("/api/v1/public/directors", "directors"),
      fetchIds("/api/v1/public/categories", "categories"),
      fetchIds("/api/v1/public/genres", "genres"),
      fetchIds("/api/v1/public/disks", "disks"),
    ]);

  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                           lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/movies`,               lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/actors`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/categories`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/genres`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`,       lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/terms`,                lastModified: now, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/cookie-policy`,        lastModified: now, changeFrequency: "monthly", priority: 0.2 },
  ];

  const dynamicPages = (ids: number[], prefix: string, priority: number, freq: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    ids.map((id) => ({
      url: `${SITE_URL}/${prefix}/${id}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
    }));

  return [
    ...staticPages,
    ...dynamicPages(movieIds,    "movies",     0.8, "monthly"),
    ...dynamicPages(actorIds,    "actors",     0.6, "monthly"),
    ...dynamicPages(directorIds, "directors",  0.5, "monthly"),
    ...dynamicPages(categoryIds, "categories", 0.6, "weekly"),
    ...dynamicPages(genreIds,    "genres",     0.6, "weekly"),
    ...dynamicPages(diskIds,     "disks",      0.4, "monthly"),
  ];
}
