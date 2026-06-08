import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  isValidVertical,
  getVertical,
  getAudiencesByVertical,
  getSolutionsByVertical,
} from '@/lib/verticals'

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

export default async function VerticalHubPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [vertical, audiences, solutions] = await Promise.all([
    getVertical(verticalSlug),
    getAudiencesByVertical(verticalSlug),
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
            {vertical.seo_title ?? `AI for ${vertical.name}`}
          </h1>
          {vertical.tagline && (
            <p className="text-[#9CA3AF] text-[20px] leading-[1.6] mb-4">
              {vertical.tagline}
            </p>
          )}
          {vertical.description && (
            <p className="text-[#6B7280] text-[16px] leading-[1.8] max-w-[600px] mx-auto mb-8">
              {vertical.description}
            </p>
          )}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors shadow-lg shadow-[#0F6E56]/20"
          >
            Start Your Free Assessment
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-[1100px] py-[60px] space-y-20">
        {/* Audiences section */}
        {audiences.length > 0 ? (
          <section>
            <h2 className="text-white text-[26px] font-bold mb-2">Who we work with</h2>
            <p className="text-[#6B7280] text-[15px] mb-8">
              Select your business type for a tailored view.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {audiences.map((audience) => (
                <Link
                  key={audience.id}
                  href={`/${verticalSlug}/${audience.slug}`}
                  className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-7 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-white text-[18px] font-bold mb-2">{audience.name}</h3>
                  {audience.description && (
                    <p className="text-[#6B7280] text-[14px] leading-[1.6] line-clamp-2">
                      {audience.description}
                    </p>
                  )}
                  <span className="inline-block mt-4 text-[#0F6E56] text-[13px] font-medium">
                    See solutions →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-white text-[26px] font-bold mb-4">Who we work with</h2>
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-8 text-center">
              <p className="text-[#4B5563] text-[15px]">
                Detailed audience guides are coming soon. Contact us to discuss your specific business type.
              </p>
            </div>
          </section>
        )}

        {/* Solutions section */}
        {solutions.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-[26px] font-bold mb-2">AI solutions</h2>
                <p className="text-[#6B7280] text-[15px]">
                  Purpose-built systems deployed in 4 to 6 weeks.
                </p>
              </div>
              <Link
                href={`/${verticalSlug}/solutions`}
                className="text-[#0F6E56] text-[14px] font-medium hover:opacity-75 transition-opacity shrink-0"
              >
                View all solutions →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {solutions.map((solution) => (
                <Link
                  key={solution.id}
                  href={`/${verticalSlug}/solutions/${solution.slug}`}
                  className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-7 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-white text-[17px] font-bold mb-2">{solution.name}</h3>
                  {solution.tagline && (
                    <p className="text-[#6B7280] text-[13px] leading-[1.6] mb-3">
                      {solution.tagline}
                    </p>
                  )}
                  {solution.roi_claim && (
                    <p className="text-[#0F6E56] text-[13px] font-medium">{solution.roi_claim}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-white text-[26px] font-bold mb-4">AI solutions</h2>
            <div className="rounded-[16px] border border-[#1f2937] bg-[#111827] p-8 text-center">
              <p className="text-[#4B5563] text-[15px]">
                Solution pages are being configured. Start an assessment to see what is possible for your business.
              </p>
            </div>
          </section>
        )}

        {/* Insights section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-[26px] font-bold">
              {vertical.name} insights
            </h2>
            <Link
              href={`/${verticalSlug}/insights`}
              className="text-[#0F6E56] text-[14px] font-medium hover:opacity-75 transition-opacity"
            >
              All insights →
            </Link>
          </div>
          <p className="text-[#6B7280] text-[15px] mb-0">
            Practical guides and analysis on AI for {vertical.name.toLowerCase()} businesses in India.
          </p>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-[20px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-10 text-center">
          <h2 className="text-white text-[26px] font-bold mb-3">
            Ready to see what AI can do for your {vertical.name.toLowerCase()} business?
          </h2>
          <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[500px] mx-auto leading-relaxed">
            The Clarivis Assessment is free, takes 5 to 20 minutes, and ends with a personalised AI Opportunity Snapshot. No credit card, no commitment.
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
