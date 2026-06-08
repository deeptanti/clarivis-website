import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentBySlug, getAllPublishedSlugsByVertical } from '@/lib/content'
import { isValidVertical } from '@/lib/verticals'
import ArticleLayout from '@/components/content/ArticleLayout'

export const revalidate = 3600
export const dynamicParams = true

interface Params {
  vertical: string
  term: string
}

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const verticals = ['real-estate', 'healthcare', 'agribusiness'] as const
    const results: Params[] = []
    for (const v of verticals) {
      const rows = await getAllPublishedSlugsByVertical(v)
      rows
        .filter((r) => r.content_type === 'glossary')
        .forEach((r) => results.push({ vertical: v, term: r.slug }))
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
  const { vertical: verticalSlug, term } = await params
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const content = await getContentBySlug(term)
  if (!content) return { title: 'Not Found' }
  return {
    title: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/insights/glossary/${term}`,
    },
  }
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, term } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const content = await getContentBySlug(term)
  if (!content || content.content_type !== 'glossary') notFound()

  return (
    <main className="bg-[#0d1117] min-h-screen">
      <ArticleLayout content={content} glossaryTerm={null} verticalSlug={verticalSlug} />
    </main>
  )
}
