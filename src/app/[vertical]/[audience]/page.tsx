import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  isValidVertical,
  getVertical,
  getAudienceBySlug,
  getSolutionsByVertical,
  getAllPublishedAudiences,
} from '@/lib/verticals'
import SectionTag from '@/components/vertical/SectionTag'
import ProblemCard from '@/components/vertical/ProblemCard'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'

export const revalidate = 3600

const RESERVED_SLUGS = ['solutions', 'insights']

interface Params {
  vertical: string
  audience: string
}

export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const all = await getAllPublishedAudiences()
    return all.map((a) => ({ vertical: a.vertical, audience: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { vertical: verticalSlug, audience: audienceSlug } = await params
  if (RESERVED_SLUGS.includes(audienceSlug)) return { title: 'Not Found' }
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const audience = await getAudienceBySlug(verticalSlug, audienceSlug)
  if (!audience) return { title: 'Not Found' }
  return {
    title: audience.seo_title ?? audience.name,
    description: audience.seo_description ?? audience.description ?? undefined,
    robots: audience.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/${audienceSlug}`,
    },
    other: {
      'schema-org': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clarivisintelligence.com' },
          { '@type': 'ListItem', position: 2, name: verticalSlug, item: `https://clarivisintelligence.com/${verticalSlug}` },
          { '@type': 'ListItem', position: 3, name: audience.name, item: `https://clarivisintelligence.com/${verticalSlug}/${audienceSlug}` },
        ],
      }),
    },
  }
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, audience: audienceSlug } = await params
  if (RESERVED_SLUGS.includes(audienceSlug)) notFound()
  if (!isValidVertical(verticalSlug)) notFound()

  const [audience, solutions, vertical] = await Promise.all([
    getAudienceBySlug(verticalSlug, audienceSlug),
    getSolutionsByVertical(verticalSlug),
    getVertical(verticalSlug),
  ])

  if (!audience) notFound()

  return (
    <main className="w-full min-h-screen">
      {/* SECTION 1 — HERO */}
      <section style={{ backgroundColor: 'var(--v-fa)' }} className="w-full pt-[140px] pb-[80px]">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <SectionTag label={vertical?.name ?? verticalSlug} />
          <h1 className="text-white text-[40px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-4">
            {audience.name}
          </h1>
          {audience.description && (
            <p style={{ color: 'var(--v-muted)' }} className="text-[18px] leading-relaxed max-w-[600px] mx-auto mb-10">
              {audience.description}
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

      {/* SECTION 2 — THE PROBLEM */}
      {audience.pain_points && audience.pain_points.length > 0 && (
        <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-10">
              <h2 className="text-white text-[26px] font-bold">What this costs you</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audience.pain_points.map((point, i) => (
                <ProblemCard key={i} problem={point} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3 — BODY CONTENT */}
      {audience.body && (
        <section style={{ backgroundColor: 'var(--v-fa)' }} className="py-20">
          <div className="max-w-[760px] mx-auto px-6">
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4 prose-h2:text-[24px] prose-strong:text-white"
              style={{ color: 'var(--v-muted)' }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{audience.body}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4 — SOLUTIONS FOR THIS AUDIENCE */}
      {solutions.length > 0 && (
        <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-10">
              <h2 className="text-white text-[26px] font-bold">
                What we build for {audience.name}
              </h2>
            </div>
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
          </div>
        </section>
      )}

      {/* SECTION 5 — ASSESSMENT CTA */}
      <AssessmentCTA verticalName={vertical?.name ?? verticalSlug} />
    </main>
  )
}
