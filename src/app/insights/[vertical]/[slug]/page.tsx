import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllPublishedSlugs, getRelatedGlossaryTerm } from "@/lib/content";
import ArticleLayout from "@/components/content/ArticleLayout";

export const revalidate = 3600;
export const dynamicParams = true;

interface Params {
  vertical: string;
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getAllPublishedSlugs();
  return all
    .filter((r) => r.content_type === "article" && r.vertical !== null)
    .map((r) => ({ vertical: r.vertical!, slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) return { title: "Not Found" };
  return {
    title: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    alternates: {
      canonical: `https://clarivisintelligence.com/insights/${content.vertical}/${content.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content || content.content_type !== "article") notFound();

  const glossaryTerm = content.related_glossary_slug
    ? await getRelatedGlossaryTerm(content.related_glossary_slug)
    : null;

  return (
    <main className="bg-[#0d1117] min-h-screen">
      <ArticleLayout content={content} glossaryTerm={glossaryTerm} />
    </main>
  );
}
