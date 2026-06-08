import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidVertical, getVertical, getSolutionsByVertical } from '@/lib/verticals'
import SectionTag from '@/components/vertical/SectionTag'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'

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
    title: `AI Solutions for ${vertical.name} | Clarivis Intelligence`,
    description: vertical.seo_description ?? undefined,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/solutions`,
    },
  }
}

export default async function SolutionsOverviewPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [vertical, solutions] = await Promise.all([
    getVertical(verticalSlug),
    getSolutionsByVertical(verticalSlug),
  ])

  if (!vertical) notFound()

  return (
    <main className="w-full min-h-screen">
      {/* SECTION 1 — HERO */}
      <section style={{ backgroundColor: 'var(--v-fa)' }} className="w-full pt-[140px] pb-[80px]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <SectionTag label={vertical.name} />
          <h1 className="text-white text-[40px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-4">
            AI Solutions for {vertical.name}
          </h1>
          <p style={{ color: 'var(--v-muted)' }} className="text-[18px] leading-relaxed mb-8">
            Purpose-built systems deployed in 4 to 6 weeks. ROI tracked from day one.
          </p>
          <a
            href="#solutions"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors"
          >
            See What We Build
          </a>
        </div>
      </section>

      {/* SECTION 2 — SOLUTIONS GRID */}
      <section id="solutions" style={{ backgroundColor: 'var(--v-fb)' }} className="py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          {solutions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solutions.map((solution) => (
                <Link
                  key={solution.id}
                  href={`/${verticalSlug}/solutions/${solution.slug}`}
                  className="block pl-6 p-8 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--v-fa)',
                    borderLeft: '3px solid var(--v-accent)',
                  }}
                >
                  <h2 className="text-white text-[20px] font-bold mb-2">{solution.name}</h2>
                  {solution.tagline && (
                    <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mb-4">
                      {solution.tagline}
                    </p>
                  )}
                  {solution.problem && (
                    <p style={{ color: 'var(--v-muted)' }} className="text-[13px] mb-5 leading-relaxed">
                      {solution.problem.length > 140 ? solution.problem.slice(0, 140) + '…' : solution.problem}
                    </p>
                  )}
                  {solution.roi_claim && (
                    <p style={{ color: 'var(--v-signal)' }} className="text-[13px] font-medium">
                      {solution.roi_claim}
                    </p>
                  )}
                  {solution.build_price_min != null && (
                    <p style={{ color: 'var(--v-accent)' }} className="text-[12px] mt-3">
                      From Rs {solution.build_price_min.toLocaleString('en-IN')}
                    </p>
                  )}
                  <p style={{ color: 'var(--v-accent)' }} className="text-[13px] font-medium mt-4">
                    View full solution →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--v-fa)',
                border: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
              }}
              className="rounded-2xl p-12 text-center"
            >
              <p style={{ color: 'var(--v-muted)' }} className="text-[15px] mb-6">
                Solution pages are being configured. Start an assessment to find the right solution for your business.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-7 py-3 rounded-md font-medium text-sm transition-colors"
              >
                Start Free Assessment
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 — ASSESSMENT CTA */}
      <AssessmentCTA verticalName={vertical.name} />
    </main>
  )
}
