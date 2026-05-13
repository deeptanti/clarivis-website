import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllPublishedSlugs } from "@/lib/content";
import ArticleLayout from "@/components/content/ArticleLayout";

export const revalidate = 3600;
export const dynamicParams = true;

interface Params {
  term: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getAllPublishedSlugs();
  return all
    .filter((r) => r.content_type === "glossary")
    .map((r) => ({ term: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { term } = await params;
  const content = await getContentBySlug(term);
  if (!content) return { title: "Not Found" };
  return {
    title: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    alternates: {
      canonical: `https://clarivisintelligence.com/insights/glossary/${content.slug}`,
    },
  };
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { term } = await params;
  const content = await getContentBySlug(term);
  if (!content || content.content_type !== "glossary") notFound();

  return (
    <main className="bg-[#0d1117] min-h-screen">
      <ArticleLayout content={content} glossaryTerm={null} />
    </main>
  );
}
