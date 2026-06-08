import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContentBySlug, getAllPublishedSlugsByVertical, getRelatedGlossaryTerm } from '@/lib/content'
import { isValidVertical, getVertical } from '@/lib/verticals'
import ArticleLayout from '@/components/content/ArticleLayout'
import { CalcEmbed } from '@/components/vertical/calculators/CalcEmbed'
import SectionTag from '@/components/vertical/SectionTag'
import QuickAnswer from '@/components/vertical/QuickAnswer'
import ArticleStatRow from '@/components/vertical/ArticleStatRow'
import FAQSection from '@/components/vertical/FAQSection'
import RelatedSolutions from '@/components/vertical/RelatedSolutions'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'

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
        .filter((r) => r.content_type === 'guide')
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
      canonical: `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
    },
    openGraph: {
      title: content.seo_title ?? content.title,
      description: content.seo_description ?? content.description,
      url: `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
      type: 'article',
      publishedTime: content.published_at ?? undefined,
      modifiedTime: content.updated_at ?? undefined,
      authors: ['Deep Tanti'],
      images: [
        {
          url: 'https://clarivisintelligence.com/images/og-image.png',
          width: 1200,
          height: 630,
          alt: content.seo_title ?? content.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo_title ?? content.title,
      description: content.seo_description ?? content.description,
      images: ['https://clarivisintelligence.com/images/og-image.png'],
    },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, slug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [content, vertical] = await Promise.all([
    getContentBySlug(slug),
    getVertical(verticalSlug),
  ])

  if (!content || content.content_type !== 'guide') notFound()
  if (content.vertical && content.vertical !== verticalSlug) notFound()

  const glossaryTerm = content.related_glossary_slug
    ? await getRelatedGlossaryTerm(content.related_glossary_slug)
    : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
    headline: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    url: `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
    datePublished: content.published_at,
    dateModified: content.updated_at,
    author: {
      '@type': 'Person',
      '@id': 'https://clarivisintelligence.com/#founder',
      name: 'Deep Tanti',
      url: 'https://clarivisintelligence.com/about',
    },
    publisher: {
      '@id': 'https://clarivisintelligence.com/#organization',
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://clarivisintelligence.com/images/og-image.png',
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-IN',
    isPartOf: {
      '@id': 'https://clarivisintelligence.com/#website',
    },
  }

  const verticalName = vertical?.name ?? verticalSlug
  const articleUrl = `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`

  return (
    <main className="min-h-screen" style={{ background: 'var(--v-fa)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* SECTION 1 — Hero header */}
      <section style={{ background: 'var(--v-fa)' }} className="pt-[140px] pb-[80px]">
        <div className="max-w-[760px] mx-auto px-6">
          <SectionTag label={verticalName} />

          <h1 className="text-white text-[36px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-4">
            {content.title}
          </h1>

          <p className="text-[18px] leading-[1.8] mb-6" style={{ color: 'var(--v-muted)' }}>
            {content.description}
          </p>

          {content.summary && <QuickAnswer summary={content.summary} />}

          {/* Author + meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--v-accent)' }}
              >
                DT
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold">Deep Tanti</p>
                <p className="text-[12px]" style={{ color: '#6B7280' }}>
                  Founder, Clarivis Intelligence
                </p>
              </div>
            </div>
            {content.published_at && (
              <p className="text-[13px]" style={{ color: 'var(--v-muted)' }}>
                {new Date(content.published_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {content.read_time != null && <span> · {content.read_time} min read</span>}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Stat row (conditional) */}
      {content.stats && content.stats.length > 0 && (
        <section style={{ background: 'var(--v-fb)' }} className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <ArticleStatRow stats={content.stats} />
          </div>
        </section>
      )}

      {/* SECTION 3 — Body + FAQ */}
      <section style={{ background: 'var(--v-fa)' }} className="py-16">
        <div className="max-w-[760px] mx-auto px-6">
          <ArticleLayout
            content={content}
            glossaryTerm={glossaryTerm}
            verticalSlug={verticalSlug}
            embed={<CalcEmbed vertical={verticalSlug} />}
            showHeader={false}
            read_time={content.read_time}
          />

          {content.faq && content.faq.length > 0 && (
            <FAQSection items={content.faq} articleUrl={articleUrl} />
          )}
        </div>
      </section>

      {/* SECTION 5 — Related solutions */}
      <section style={{ background: 'var(--v-fb)' }} className="py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <RelatedSolutions vertical={verticalSlug} currentSlug={slug} />
        </div>
      </section>

      {/* SECTION 6 — Assessment CTA */}
      <AssessmentCTA verticalName={verticalName} />
    </main>
  )
}
