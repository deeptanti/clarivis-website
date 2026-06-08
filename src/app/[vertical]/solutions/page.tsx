import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isValidVertical, getVertical, getSolutionsByVertical } from '@/lib/verticals'

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
    <main className="w-full min-h-screen bg-[#0A0F1A]">
      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] bg-[#111827]">
        <div className="container mx-auto px-6 max-w-[800px] text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              {vertical.name}
            </span>
          </div>
          <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mb-4">
            AI Solutions for {vertical.name}
          </h1>
          {vertical.tagline && (
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] max-w-[600px] mx-auto">
              {vertical.tagline}
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-[1100px] py-[60px]">
        {solutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                href={`/${verticalSlug}/solutions/${solution.slug}`}
                className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-8 transition-all duration-200 hover:-translate-y-0.5"
              >
                <h2 className="text-white text-[20px] font-bold mb-2">{solution.name}</h2>
                {solution.tagline && (
                  <p className="text-[#9CA3AF] text-[14px] mb-3">{solution.tagline}</p>
                )}
                {solution.description && (
                  <p className="text-[#6B7280] text-[14px] leading-[1.6] mb-4 line-clamp-3">
                    {solution.description}
                  </p>
                )}
                {solution.roi_claim && (
                  <p className="text-[#0F6E56] text-[13px] font-medium mb-4">{solution.roi_claim}</p>
                )}
                {(solution.build_price_min || solution.build_price_max) && (
                  <p className="text-[#4B5563] text-[12px]">
                    Build from{' '}
                    <span className="text-[#9CA3AF]">
                      Rs {solution.build_price_min?.toLocaleString('en-IN')}
                    </span>
                    {solution.retainer_min && (
                      <>
                        {' '}· Retainer from{' '}
                        <span className="text-[#9CA3AF]">
                          Rs {solution.retainer_min?.toLocaleString('en-IN')}/mo
                        </span>
                      </>
                    )}
                  </p>
                )}
                <span className="inline-block mt-5 text-[#0F6E56] text-[13px] font-medium">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-12 text-center">
            <p className="text-[#4B5563] text-[15px] mb-6">
              Solution pages are being configured. Start an assessment to find the right solution for your business.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-7 py-3 rounded-md font-medium text-sm transition-colors"
            >
              Start Your Free Assessment
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 rounded-[20px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-10 text-center">
          <h2 className="text-white text-[24px] font-bold mb-3">
            Not sure which solution fits your business?
          </h2>
          <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[480px] mx-auto leading-relaxed">
            The Clarivis Assessment identifies your highest-impact AI opportunity in 5 to 20 minutes. Free, no commitment.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors"
          >
            Start Your Free Assessment
          </Link>
        </div>
      </div>
    </main>
  )
}
