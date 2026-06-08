import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentBySlug, getAllPublishedSlugsByVertical, getRelatedGlossaryTerm } from '@/lib/content'
import { isValidVertical } from '@/lib/verticals'
import ArticleLayout from '@/components/content/ArticleLayout'

export const revalidate = 3600
export const dynamicParams = true

interface Params {
  vertical: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const verticals = ['real-estate', 'healthcare', 'agribusiness'] as const
    const results: Params[] = []
    for (const v of verticals) {
      const rows = await getAllPublishedSlugsByVertical(v)
      rows
        .filter((r) => r.content_type === 'faq')
        .forEach((r) => results.push({ vertical: v, slug: r.slug }))
    }
    return results
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { vertical: verticalSlug, slug } = await params
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const content = await getContentBySlug(slug)
  if (!content) return { title: 'Not Found' }
  return {
    title: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/insights/faq/${slug}`,
    },
  }
}

export default async function FAQPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, slug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const content = await getContentBySlug(slug)
  if (!content || content.content_type !== 'faq') notFound()
  if (content.vertical && content.vertical !== verticalSlug) notFound()

  const glossaryTerm = content.related_glossary_slug
    ? await getRelatedGlossaryTerm(content.related_glossary_slug)
    : null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: content.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: content.description,
        },
      },
    ],
  }

  return (
    <main className="bg-[#0d1117] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ArticleLayout content={content} glossaryTerm={glossaryTerm} verticalSlug={verticalSlug} />
    </main>
  )
}
