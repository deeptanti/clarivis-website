import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/content";
import { getAllPublishedAudiences, getAllPublishedSolutions } from "@/lib/verticals";
import type { ContentRow } from "@/types/content";

const BASE = "https://clarivisintelligence.com";

const CONTENT_TYPE_SEGMENT: Record<string, string> = {
  guide: "guides",
  article: "articles",
  glossary: "glossary",
  faq: "faq",
};

function contentUrl(
  row: Pick<ContentRow, "slug" | "content_type" | "vertical">
): string {
  const segment = CONTENT_TYPE_SEGMENT[row.content_type] ?? row.content_type;
  return `${BASE}/${row.vertical}/insights/${segment}/${row.slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/how-it-works`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/assessment`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/contact`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date("2026-01-01"), changeFrequency: "yearly", priority: 0.3 },
    // Vertical hubs
    { url: `${BASE}/real-estate`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/healthcare`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/agribusiness`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.9 },
    // Solutions overviews
    { url: `${BASE}/real-estate/solutions`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/healthcare/solutions`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/agribusiness/solutions`, lastModified: new Date("2026-05-13"), changeFrequency: "monthly", priority: 0.8 },
    // Insights hubs
    { url: `${BASE}/real-estate/insights`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/healthcare/insights`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/agribusiness/insights`, lastModified: new Date("2026-05-13"), changeFrequency: "weekly", priority: 0.7 },
  ];

  let slugs: Awaited<ReturnType<typeof getAllPublishedSlugs>> = []
  let audiences: Awaited<ReturnType<typeof getAllPublishedAudiences>> = []
  let solutions: Awaited<ReturnType<typeof getAllPublishedSolutions>> = []
  try {
    ;[slugs, audiences, solutions] = await Promise.all([
      getAllPublishedSlugs(),
      getAllPublishedAudiences(),
      getAllPublishedSolutions(),
    ])
  } catch {
    // Supabase unavailable — return static pages only
  }

  const contentPages: MetadataRoute.Sitemap = slugs
    .filter((row) => row.vertical !== null)
    .map((row) => ({
      url: contentUrl(row),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: row.content_type === "guide" || row.content_type === "article" ? 0.7 : 0.6,
    }));

  const audiencePages: MetadataRoute.Sitemap = audiences.map((a) => ({
    url: `${BASE}/${a.vertical}/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const solutionPages: MetadataRoute.Sitemap = solutions.map((s) => ({
    url: `${BASE}/${s.vertical}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...audiencePages, ...solutionPages, ...contentPages];
}
