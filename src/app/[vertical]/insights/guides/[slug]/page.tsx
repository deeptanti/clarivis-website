import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { getContentBySlug, getAllPublishedSlugsByVertical } from '@/lib/content'
import { isValidVertical, getVertical } from '@/lib/verticals'
import { CalcEmbed } from '@/components/vertical/calculators/CalcEmbed'
import SectionTag from '@/components/vertical/SectionTag'
import QuickAnswer from '@/components/vertical/QuickAnswer'
import ArticleStatRow from '@/components/vertical/ArticleStatRow'
import FAQSection from '@/components/vertical/FAQSection'
import RelatedSolutions from '@/components/vertical/RelatedSolutions'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'
import TableOfContents from '@/components/vertical/TableOfContents'
import MiniCalc from '@/components/vertical/MiniCalc'
import MidArticleCTA from '@/components/vertical/MidArticleCTA'
import RelatedGuides from '@/components/vertical/RelatedGuides'
import { markdownComponents } from '@/components/vertical/markdown/MarkdownComponents'

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

function extractH2Headings(body: string): Array<{ text: string; slug: string }> {
  return body
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '')
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      return { text, slug }
    })
}

function splitBodyAtMidpoint(body: string): [string, string] {
  const lines = body.split('\n')
  const midChar = body.length / 2

  let charCount = 0
  let bestSplitLine = -1
  let bestDist = Infinity

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      const dist = Math.abs(charCount - midChar)
      if (dist < bestDist) {
        bestDist = dist
        bestSplitLine = i
      }
    }
    charCount += lines[i].length + 1
  }

  if (bestSplitLine <= 0) return [body, '']

  const firstHalf = lines.slice(0, bestSplitLine).join('\n')
  const secondHalf = lines.slice(bestSplitLine).join('\n')
  return [firstHalf, secondHalf]
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

  const canonicalUrl = `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`
  const verticalName = vertical?.name ?? verticalSlug

  const headings = extractH2Headings(content.body ?? '')
  const [bodyFirst, bodySecond] = splitBodyAtMidpoint(content.body ?? '')

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': canonicalUrl,
    headline: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    url: canonicalUrl,
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

  const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.quick-answer', '.faq-answer'],
    },
    url: canonicalUrl,
  }

  const hasPartJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': canonicalUrl,
    hasPart: headings.map((h) => ({
      '@type': 'WebPageElement',
      name: h.text,
      url: `${canonicalUrl}#${h.slug}`,
    })),
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--v-fa)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hasPartJsonLd) }}
      />

      {/* SECTION 1 — Hero */}
      <section style={{ background: 'var(--v-fa)' }} className="pt-[140px] pb-12">
        <div className="max-w-[900px] mx-auto px-6">
          <SectionTag label={verticalName} />

          <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-5">
            {content.title}
          </h1>

          {/* Breadcrumb */}
          <nav
            className="flex flex-wrap items-center gap-2 text-[13px] mb-6"
            style={{ color: 'var(--v-muted)' }}
            aria-label="Breadcrumb"
          >
            <Link
              href={`/${verticalSlug}/insights`}
              className="transition-opacity hover:opacity-75"
              style={{ color: 'var(--v-accent)' }}
            >
              {verticalName} Insights
            </Link>
            <span>/</span>
            <span>Guide</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{content.title}</span>
          </nav>

          {/* Author and meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--v-accent)' }}
              >
                DT
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold">Deep Tanti</p>
                <p className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
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
                {content.read_time != null && (
                  <span> · {content.read_time} min read</span>
                )}
              </p>
            )}
          </div>

          {content.summary && <QuickAnswer summary={content.summary} />}
        </div>
      </section>

      {/* SECTION 2 — Calculator (before prose) */}
      <section style={{ background: 'var(--v-fb)' }} className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
            <h2 className="text-white text-[22px] font-bold">
              Calculate your cost right now
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--v-muted)' }}>
              Enter your numbers and see the monthly impact before reading further.
            </p>
          </div>
          <CalcEmbed vertical={verticalSlug} />
        </div>
      </section>

      {/* SECTION 3 — Stat row (conditional) */}
      {content.stats && content.stats.length > 0 && (
        <section style={{ background: 'var(--v-fa)' }} className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <ArticleStatRow stats={content.stats} />
          </div>
        </section>
      )}

      {/* SECTION 4 — Two-column reading layout */}
      <section style={{ background: 'var(--v-fa)' }} className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex gap-12 items-start">
            {/* Left column — article body */}
            <div className="flex-1 min-w-0" style={{ maxWidth: '680px' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {bodyFirst}
              </ReactMarkdown>

              {bodySecond && <MidArticleCTA verticalName={verticalName} />}

              {bodySecond && (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {bodySecond}
                </ReactMarkdown>
              )}

              {content.faq && content.faq.length > 0 && (
                <FAQSection items={content.faq} articleUrl={canonicalUrl} />
              )}

              <RelatedSolutions vertical={verticalSlug} />

              <RelatedGuides vertical={verticalSlug} currentSlug={slug} />
            </div>

            {/* Right column — sticky sidebar */}
            <aside className="w-[280px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-[120px] flex flex-col gap-6">
                <TableOfContents body={content.body ?? ''} title={content.title} />
                <MiniCalc vertical={verticalSlug} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Assessment CTA */}
      <AssessmentCTA verticalName={verticalName} />
    </main>
  )
}
