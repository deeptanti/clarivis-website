import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidVertical, getVertical } from '@/lib/verticals'
import { listContentByVertical } from '@/lib/content'
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

const TYPE_LABELS: Record<string, string> = {
  guide: 'Guide',
  article: 'Article',
  glossary: 'Glossary',
  faq: 'FAQ',
}

const TYPE_URL_SEGMENT: Record<string, string> = {
  guide: 'guides',
  article: 'articles',
  glossary: 'glossary',
  faq: 'faq',
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
    { label: 'Guides', items: guides },
    { label: 'Articles', items: articles },
    { label: 'Glossary', items: glossary },
    { label: 'FAQ', items: faq },
  ].filter((s) => s.items.length > 0)

  return (
    <main className="w-full min-h-screen bg-[#0A0F1A]">
      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] bg-[#111827]">
        <div className="container mx-auto px-6 max-w-[800px] text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              Insights
            </span>
          </div>
          <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mb-4">
            {vertical.name} Insights
          </h1>
          <p className="text-[#9CA3AF] text-[18px] leading-[1.8] max-w-[580px] mx-auto">
            Practical guides and analysis on AI for {vertical.name.toLowerCase()} businesses in India.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-[1100px] py-[60px] space-y-16">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.label}>
              <h2 className="text-white text-[22px] font-bold mb-6">{section.label}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={contentHref(item, verticalSlug)}
                    className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-6 h-full transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span className="text-[#0F6E56] text-[11px] font-semibold uppercase tracking-wider block mb-3">
                      {TYPE_LABELS[item.content_type]}
                    </span>
                    <h3 className="text-white text-[16px] font-bold mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[#6B7280] text-[13px] leading-[1.6] line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 text-[#4B5563] text-[16px]">
            Content for {vertical.name} is coming soon. Check back next week.
          </div>
        )}

        {/* Bottom CTA */}
        <section className="rounded-[20px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-10 text-center">
          <h2 className="text-white text-[22px] font-bold mb-3">
            Ready to see what AI can do for your business?
          </h2>
          <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[480px] mx-auto leading-relaxed">
            The Clarivis Assessment is free, takes 5 to 20 minutes, and ends with a personalised AI Opportunity Snapshot.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors"
          >
            Start Your Free Assessment
          </Link>
        </section>
      </div>
    </main>
  )
}
