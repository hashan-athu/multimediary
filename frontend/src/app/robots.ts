import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
      {
        // Block common AI training scrapers from the admin panel
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web"],
        allow: ["/", "/movies", "/actors", "/categories", "/genres"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
