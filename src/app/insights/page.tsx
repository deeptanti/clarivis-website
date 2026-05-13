import type { Metadata } from "next";
import InsightsContent from "./page-client";
import { listRecentContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights: AI for Real Estate, Healthcare and Agribusiness in India",
  description:
    "Practical guides, glossary, and analysis on AI automation for Indian businesses. Covers real estate, healthcare, and agribusiness verticals.",
  alternates: { canonical: "https://clarivisintelligence.com/insights" },
};

export const revalidate = 3600;

export default async function InsightsPage() {
  const recent = await listRecentContent(12);
  return <InsightsContent recent={recent} />;
}
