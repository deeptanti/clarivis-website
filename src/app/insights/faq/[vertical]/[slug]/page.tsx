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
    .filter((r) => r.content_type === "faq" && r.vertical !== null)
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
      canonical: `https://clarivisintelligence.com/insights/faq/${content.vertical}/${content.slug}`,
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content || content.content_type !== "faq") notFound();

  const glossaryTerm = content.related_glossary_slug
    ? await getRelatedGlossaryTerm(content.related_glossary_slug)
    : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: content.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: content.description,
        },
      },
    ],
  };

  return (
    <main className="bg-[#0d1117] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ArticleLayout content={content} glossaryTerm={glossaryTerm} />
    </main>
  );
}
