import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  isValidVertical,
  getVertical,
  getAudiencesByVertical,
  getSolutionsByVertical,
} from '@/lib/verticals'
import { listContentByVertical } from '@/lib/content'
import SectionTag from '@/components/vertical/SectionTag'
import StatBlock from '@/components/vertical/StatBlock'
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
    title: vertical.seo_title ?? vertical.name,
    description: vertical.seo_description ?? vertical.description ?? undefined,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}`,
    },
  }
}

const VERTICAL_STATS: Record<string, Array<{ figure: string; label: string; description: string }>> = {
  'real-estate': [
    { figure: '60s', label: 'Lead response time', description: 'After 5 minutes, response rate drops 80 percent. Speed determines whether you get the lead or lose it.' },
    { figure: '40%', label: 'Broker dropout rate', description: 'Firms with no channel partner portal lose channel partners within 6 months of onboarding.' },
    { figure: '22%', label: 'Collections gap', description: 'Average instalment delay on projects running manual payment follow-up.' },
  ],
  'healthcare': [
    { figure: '38%', label: 'Appointment no-show rate', description: 'Average for clinics running no automated patient reminder or follow-up system.' },
    { figure: '4.5x', label: 'ROI on reminders', description: 'Clinics using AI follow-up see 4.5x return on the system cost within 90 days.' },
    { figure: '12m', label: 'Manual billing cycle', description: 'Automated billing reduces this to under 2 minutes per patient encounter.' },
  ],
  'agribusiness': [
    { figure: '200+', label: 'Average field team size', description: 'Managed with just 1 to 2 HR staff handling attendance and appraisals across the whole team.' },
    { figure: '0', label: 'Structured task records', description: 'Most firms have no daily task tracking system across distributed field operations.' },
    { figure: '4hrs', label: 'Investor response lag', description: 'Average delay on investor leads managed through WhatsApp and spreadsheets.' },
  ],
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

export default async function VerticalHubPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [vertical, audiences, solutions, allContent] = await Promise.all([
    getVertical(verticalSlug),
    getAudiencesByVertical(verticalSlug),
    getSolutionsByVertical(verticalSlug),
    listContentByVertical(verticalSlug),
  ])

  if (!vertical) notFound()

  const stats = VERTICAL_STATS[verticalSlug] ?? VERTICAL_STATS['real-estate']
  const insightPreview = allContent.slice(0, 3)

  return (
    <main className="w-full min-h-screen">
      {/* SECTION 1 — HERO */}
      <section
        style={{ backgroundColor: 'var(--v-fa)' }}
        className="w-full pt-[140px] pb-[80px]"
      >
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <SectionTag label={vertical.name} />
          <h1 className="text-white text-[40px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-4">
            {vertical.seo_title ?? `AI for ${vertical.name}`}
          </h1>
          {vertical.tagline && (
            <p
              style={{ color: 'var(--v-muted)' }}
              className="text-[20px] leading-relaxed max-w-[560px] mx-auto mb-10"
            >
              {vertical.tagline}
            </p>
          )}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors"
          >
            Start Free Assessment
          </Link>
        </div>
      </section>

      {/* SECTION 2 — STAT ROW */}
      <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatBlock
                key={stat.label}
                figure={stat.figure}
                label={stat.label}
                description={stat.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHO WE WORK WITH */}
      <section style={{ backgroundColor: 'var(--v-fa)' }} className="py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div
            style={{ borderLeft: '3px solid var(--v-accent)' }}
            className="pl-4 mb-10"
          >
            <h2 className="text-white text-[26px] font-bold">Who we work with</h2>
            <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mt-1">
              Select your business type for a view of what we build for you.
            </p>
          </div>
          {audiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {audiences.map((audience) => (
                <Link
                  key={audience.id}
                  href={`/${verticalSlug}/${audience.slug}`}
                  className="block rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5 group"
                  style={{ backgroundColor: 'var(--v-fb)', border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)' }}
                >
                  <h3 className="text-white text-[18px] font-bold mb-2">{audience.name}</h3>
                  {audience.description && (
                    <p
                      style={{ color: 'var(--v-muted)' }}
                      className="text-[13px] leading-relaxed mb-3"
                    >
                      {audience.description.length > 100
                        ? audience.description.slice(0, 100) + '…'
                        : audience.description}
                    </p>
                  )}
                  {audience.pain_points && audience.pain_points.length > 0 && (
                    <p
                      style={{ color: 'var(--v-accent)' }}
                      className="text-[12px] font-medium mt-3"
                    >
                      {audience.pain_points.length} known pain points
                    </p>
                  )}
                  <p
                    style={{ color: 'var(--v-signal)' }}
                    className="text-[13px] mt-4 font-medium"
                  >
                    See how we solve this →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{ backgroundColor: 'var(--v-fb)', border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)' }}
              className="rounded-2xl p-8 text-center"
            >
              <p style={{ color: 'var(--v-muted)' }} className="text-[15px]">
                Detailed audience guides are coming soon. Contact us to discuss your specific business type.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — AI SOLUTIONS */}
      <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4">
              <h2 className="text-white text-[26px] font-bold">AI solutions</h2>
              <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mt-1">
                Purpose-built systems deployed in 4 to 6 weeks.
              </p>
            </div>
            <Link
              href={`/${verticalSlug}/solutions`}
              style={{ color: 'var(--v-accent)' }}
              className="text-[13px] font-medium hover:opacity-75 transition-opacity shrink-0"
            >
              View all →
            </Link>
          </div>
          {solutions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {solutions.map((solution) => (
                <Link
                  key={solution.id}
                  href={`/${verticalSlug}/solutions/${solution.slug}`}
                  className="block pl-6 p-7 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--v-fa)',
                    borderLeft: '3px solid var(--v-accent)',
                  }}
                >
                  <h3 className="text-white text-[17px] font-bold mb-1">{solution.name}</h3>
                  {solution.tagline && (
                    <p style={{ color: 'var(--v-muted)' }} className="text-[13px] mb-4">
                      {solution.tagline}
                    </p>
                  )}
                  {solution.roi_claim && (
                    <p style={{ color: 'var(--v-signal)' }} className="text-[13px] font-medium flex items-center gap-1.5">
                      <span>✓</span> {solution.roi_claim}
                    </p>
                  )}
                  <p style={{ color: 'var(--v-accent)' }} className="text-[12px] font-medium mt-4">
                    View solution →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{ backgroundColor: 'var(--v-fa)', border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)' }}
              className="rounded-2xl p-8 text-center"
            >
              <p style={{ color: 'var(--v-muted)' }} className="text-[15px]">
                Solution pages are being configured. Start an assessment to see what is possible for your business.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5 — INSIGHTS PREVIEW */}
      {insightPreview.length > 0 && (
        <section style={{ backgroundColor: 'var(--v-fa)' }} className="py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-10">
              <h2 className="text-white text-[26px] font-bold">{vertical.name} insights</h2>
              <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mt-1">
                Practical guides and analysis on AI for {vertical.name.toLowerCase()} businesses.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {insightPreview.map((item) => (
                <Link
                  key={item.id}
                  href={contentHref(item, verticalSlug)}
                  className="block rounded-2xl p-7 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--v-fb)',
                    border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
                  }}
                >
                  <SectionTag label={item.content_type} />
                  <h3 className="text-white text-[17px] font-bold mt-3 mb-2">{item.title}</h3>
                  <p style={{ color: 'var(--v-muted)' }} className="text-[13px] leading-relaxed">
                    {item.description
                      ? item.description.length > 120
                        ? item.description.slice(0, 120) + '…'
                        : item.description
                      : ''}
                  </p>
                  <p style={{ color: 'var(--v-signal)' }} className="text-[13px] font-medium mt-4">
                    Read guide →
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/${verticalSlug}/insights`}
                style={{ color: 'var(--v-accent)' }}
                className="font-medium text-[14px] hover:opacity-75 transition-opacity"
              >
                All {vertical.name} insights →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6 — ASSESSMENT CTA */}
      <AssessmentCTA verticalName={vertical.name} />
    </main>
  )
}
