import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/content";
import type { ContentRow } from "@/types/content";

const BASE = "https://clarivisintelligence.com";

function contentUrl(
  row: Pick<ContentRow, "slug" | "content_type" | "vertical">
): string {
  switch (row.content_type) {
    case "guide":
      return `${BASE}/insights/guides/${row.vertical}/${row.slug}`;
    case "article":
      return `${BASE}/insights/${row.vertical}/${row.slug}`;
    case "glossary":
      return `${BASE}/insights/glossary/${row.slug}`;
    case "faq":
      return `${BASE}/insights/faq/${row.vertical}/${row.slug}`;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/how-it-works`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/solutions`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/solutions/real-estate`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/solutions/healthcare`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/solutions/agribusiness`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/assessment`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/insights`, lastModified: new Date("2026-05-13"), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const slugs = await getAllPublishedSlugs();
  const contentPages: MetadataRoute.Sitemap = slugs.map((row) => ({
    url: contentUrl(row),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: row.content_type === "guide" ? 0.8 : 0.6,
  }));

  return [...staticPages, ...contentPages];
}