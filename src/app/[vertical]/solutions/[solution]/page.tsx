import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  isValidVertical,
  getVertical,
  getSolutionBySlug,
  getAllPublishedSolutions,
} from '@/lib/verticals'
import SectionTag from '@/components/vertical/SectionTag'
import StepSequence from '@/components/vertical/StepSequence'
import OutcomeCard from '@/components/vertical/OutcomeCard'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'

export const revalidate = 3600

interface Params {
  vertical: string
  solution: string
}

export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const all = await getAllPublishedSolutions()
    return all.map((s) => ({ vertical: s.vertical, solution: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { vertical: verticalSlug, solution: solutionSlug } = await params
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const solution = await getSolutionBySlug(verticalSlug, solutionSlug)
  if (!solution) return { title: 'Not Found' }
  return {
    title: solution.seo_title ?? solution.name,
    description: solution.seo_description ?? solution.description ?? undefined,
    robots: solution.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/solutions/${solutionSlug}`,
    },
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, solution: solutionSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [solution, vertical] = await Promise.all([
    getSolutionBySlug(verticalSlug, solutionSlug),
    getVertical(verticalSlug),
  ])

  if (!solution) notFound()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clarivisintelligence.com' },
      { '@type': 'ListItem', position: 2, name: vertical?.name ?? verticalSlug, item: `https://clarivisintelligence.com/${verticalSlug}` },
      { '@type': 'ListItem', position: 3, name: 'Solutions', item: `https://clarivisintelligence.com/${verticalSlug}/solutions` },
      { '@type': 'ListItem', position: 4, name: solution.name, item: `https://clarivisintelligence.com/${verticalSlug}/solutions/${solutionSlug}` },
    ],
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.name,
    description: solution.description ?? solution.tagline ?? '',
    provider: { '@id': 'https://clarivisintelligence.com/#organization' },
    areaServed: 'IN',
    ...(solution.build_price_min != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        priceRange: `Rs ${solution.build_price_min} to Rs ${solution.build_price_max ?? solution.build_price_min}`,
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <main className="w-full min-h-screen">
        {/* SECTION 1 — HERO */}
        <section style={{ backgroundColor: 'var(--v-fa)' }} className="w-full pt-[140px] pb-[80px]">
          <div className="max-w-[760px] mx-auto px-6 text-center">
            <SectionTag label={vertical?.name ?? verticalSlug} />
            <h1 className="text-white text-[40px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-4">
              {solution.name}
            </h1>
            {solution.tagline && (
              <p style={{ color: 'var(--v-muted)' }} className="text-[20px] mb-6 leading-relaxed">
                {solution.tagline}
              </p>
            )}
            {solution.roi_claim && (
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--v-signal) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--v-signal) 30%, transparent)',
                  color: 'var(--v-signal)',
                }}
                className="text-[16px] font-semibold px-6 py-3 rounded-xl inline-block mb-8"
              >
                {solution.roi_claim}
              </div>
            )}
            <div>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors"
              >
                Start Free Assessment
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2 — THE PROBLEM */}
        {solution.problem && (
          <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
            <div className="max-w-[760px] mx-auto px-6">
              <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
                <h2 className="text-white text-[26px] font-bold">The problem</h2>
              </div>
              <p style={{ color: 'var(--v-muted)' }} className="text-[17px] leading-[1.9]">
                {solution.problem}
              </p>
            </div>
          </section>
        )}

        {/* SECTION 3 — HOW IT WORKS */}
        {solution.how_it_works && solution.how_it_works.length > 0 && (
          <section style={{ backgroundColor: 'var(--v-fa)' }} className="py-20">
            <div className="max-w-[760px] mx-auto px-6">
              <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
                <h2 className="text-white text-[26px] font-bold">How it works</h2>
              </div>
              <StepSequence steps={solution.how_it_works} />
            </div>
          </section>
        )}

        {/* SECTION 4 — OUTCOMES */}
        {solution.outcomes && solution.outcomes.length > 0 && (
          <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
            <div className="max-w-[1100px] mx-auto px-6">
              <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-10">
                <h2 className="text-white text-[26px] font-bold">What changes</h2>
              </div>
              <div className={`grid grid-cols-1 ${solution.outcomes.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
                {solution.outcomes.map((outcome, i) => (
                  <OutcomeCard key={i} title={outcome.title} description={outcome.description} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5 — BODY CONTENT */}
        {solution.body && (
          <section style={{ backgroundColor: 'var(--v-fa)' }} className="py-20">
            <div className="max-w-[760px] mx-auto px-6">
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4 prose-h2:text-[24px] prose-strong:text-white"
                style={{ color: 'var(--v-muted)' }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{solution.body}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6 — PRICING */}
        {solution.build_price_min != null && (
          <section style={{ backgroundColor: 'var(--v-fb)' }} className="py-16">
            <div className="max-w-[760px] mx-auto px-6">
              <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
                <h2 className="text-white text-[26px] font-bold">Investment</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p style={{ color: 'var(--v-muted)' }} className="text-[12px] uppercase tracking-wider mb-1">
                    One-time build
                  </p>
                  <p className="text-white text-[22px] font-bold">
                    Rs {solution.build_price_min.toLocaleString('en-IN')}
                    {solution.build_price_max != null && (
                      <span style={{ color: 'var(--v-muted)' }}>
                        {' '}to Rs {solution.build_price_max.toLocaleString('en-IN')}
                      </span>
                    )}
                  </p>
                </div>
                {solution.retainer_min != null && (
                  <div>
                    <p style={{ color: 'var(--v-muted)' }} className="text-[12px] uppercase tracking-wider mb-1">
                      Monthly retainer
                    </p>
                    <p className="text-white text-[22px] font-bold">
                      Rs {solution.retainer_min.toLocaleString('en-IN')}
                      {solution.retainer_max != null && (
                        <span style={{ color: 'var(--v-muted)' }}>
                          {' '}to Rs {solution.retainer_max.toLocaleString('en-IN')}
                        </span>
                      )}/month
                    </p>
                  </div>
                )}
              </div>
              <p style={{ color: 'var(--v-muted)' }} className="text-[12px] mt-6">
                Exact pricing confirmed during the audit.
              </p>
            </div>
          </section>
        )}

        {/* SECTION 7 — ASSESSMENT CTA */}
        <AssessmentCTA verticalName={vertical?.name ?? verticalSlug} />
      </main>
    </>
  )
}
