import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidVertical, getVertical } from '@/lib/verticals'
import { listContentByVertical } from '@/lib/content'
import SectionTag from '@/components/vertical/SectionTag'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'
import type { ContentSummary } from '@/types/content'

export const revalidate = 3600

interface Params {
  vertical: string
}

export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  return [
    { vertical: 'real-estate' },
    { vertical: 'healthcare' },
    { vertical: 'agribusiness' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const vertical = await getVertical(verticalSlug)
  if (!vertical) return { title: 'Not Found' }
  return {
    title: `${vertical.name} Insights | Clarivis Intelligence`,
    description: `Practical guides, articles, and analysis on AI for ${vertical.name.toLowerCase()} businesses in India.`,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/insights`,
    },
  }
}

const TYPE_URL_SEGMENT: Record<string, string> = {
  guide: 'guides',
  article: 'articles',
  glossary: 'glossary',
  faq: 'faq',
}

const TYPE_DISPLAY: Record<string, string> = {
  guide: 'Guides',
  article: 'Articles',
  glossary: 'Glossary',
  faq: 'FAQ',
}

function contentHref(item: ContentSummary, verticalSlug: string): string {
  const segment = TYPE_URL_SEGMENT[item.content_type] ?? item.content_type
  return `/${verticalSlug}/insights/${segment}/${item.slug}`
}

export default async function VerticalInsightsPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [vertical, content] = await Promise.all([
    getVertical(verticalSlug),
    listContentByVertical(verticalSlug),
  ])

  if (!vertical) notFound()

  const guides = content.filter((c) => c.content_type === 'guide')
  const articles = content.filter((c) => c.content_type === 'article')
  const glossary = content.filter((c) => c.content_type === 'glossary')
  const faq = content.filter((c) => c.content_type === 'faq')

  const sections = [
    { key: 'guide', label: TYPE_DISPLAY['guide'], items: guides },
    { key: 'article', label: TYPE_DISPLAY['article'], items: articles },
    { key: 'glossary', label: TYPE_DISPLAY['glossary'], items: glossary },
    { key: 'faq', label: TYPE_DISPLAY['faq'], items: faq },
  ].filter((s) => s.items.length > 0)

  const bgOrder = ['var(--v-fb)', 'var(--v-fa)', 'var(--v-fb)', 'var(--v-fa)']

  return (
    <main className="w-full min-h-screen">
      {/* SECTION 1 — HERO */}
      <section style={{ backgroundColor: 'var(--v-fa)' }} className="w-full pt-[140px] pb-[80px]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <SectionTag label={vertical.name} />
          <h1 className="text-white text-[40px] font-extrabold leading-[1.1] mt-5 mb-4">
            {vertical.name} Insights
          </h1>
          <p style={{ color: 'var(--v-muted)' }} className="text-[18px] leading-relaxed">
            Practical guides, analysis, and reference material on AI automation for{' '}
            {vertical.name.toLowerCase()} businesses in India.
          </p>
        </div>
      </section>

      {/* SECTION 2 — CONTENT BY TYPE */}
      {sections.length > 0 ? (
        sections.map((section, idx) => (
          <section
            key={section.key}
            style={{ backgroundColor: bgOrder[idx % bgOrder.length] }}
            className="py-20"
          >
            <div className="max-w-[1100px] mx-auto px-6">
              <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-10">
                <h2 className="text-white text-[26px] font-bold">{section.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={contentHref(item, verticalSlug)}
                    className="block rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'var(--v-fa)' : 'var(--v-fb)',
                      border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
                    }}
                  >
                    <SectionTag label={item.content_type} />
                    <h3 className="text-white text-[17px] font-bold mt-3 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--v-muted)' }} className="text-[13px] leading-relaxed">
                      {item.description
                        ? item.description.length > 120
                          ? item.description.slice(0, 120) + '…'
                          : item.description
                        : ''}
                    </p>
                    <p style={{ color: 'var(--v-signal)' }} className="text-[13px] font-medium mt-4">
                      Read →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
          <div className="max-w-[1100px] mx-auto px-6 text-center">
            <p style={{ color: 'var(--v-muted)' }} className="text-[16px]">
              Content for {vertical.name} is coming soon. Check back next week.
            </p>
          </div>
        </section>
      )}

      {/* SECTION 3 — ASSESSMENT CTA */}
      <AssessmentCTA verticalName={vertical.name} />
    </main>
  )
}
