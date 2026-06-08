import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  isValidVertical,
  getVertical,
  getSolutionBySlug,
  getAllPublishedSolutions,
} from '@/lib/verticals'

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

  return (
    <main className="w-full min-h-screen bg-[#0A0F1A]">
      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] bg-[#111827]">
        <div className="container mx-auto px-6 max-w-[800px] text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              {vertical?.name ?? verticalSlug}
            </span>
          </div>
          <h1 className="text-white text-[36px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight mb-4">
            {solution.name}
          </h1>
          {solution.tagline && (
            <p className="text-[#9CA3AF] text-[20px] leading-[1.6] mb-4">{solution.tagline}</p>
          )}
          {solution.roi_claim && (
            <p className="text-[#0F6E56] text-[16px] font-semibold mb-8">{solution.roi_claim}</p>
          )}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-8 py-3.5 rounded-md font-medium text-sm transition-colors shadow-lg shadow-[#0F6E56]/20"
          >
            Start Your Free Assessment
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-[860px] py-[60px] space-y-16">
        {/* Problem */}
        {solution.problem && (
          <section>
            <h2 className="text-white text-[24px] font-bold mb-4">The problem</h2>
            <p className="text-[#CBD5E1] text-[16px] leading-[1.8]">{solution.problem}</p>
          </section>
        )}

        {/* How it works */}
        {solution.how_it_works && solution.how_it_works.length > 0 && (
          <section>
            <h2 className="text-white text-[24px] font-bold mb-6">How it works</h2>
            <ol className="space-y-4">
              {solution.how_it_works.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-5 bg-[#111827] border border-[#1f2937] rounded-[12px] p-6"
                >
                  <span className="w-8 h-8 rounded-full bg-[#0F6E56]/20 border border-[#0F6E56]/40 flex items-center justify-center text-[#0F6E56] text-[13px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-white font-semibold text-[15px] mb-1">{item.step}</p>
                    <p className="text-[#6B7280] text-[14px] leading-[1.6]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Outcomes */}
        {solution.outcomes && solution.outcomes.length > 0 && (
          <section>
            <h2 className="text-white text-[24px] font-bold mb-6">What you get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.outcomes.map((outcome, i) => (
                <div
                  key={i}
                  className="bg-[#111827] border border-[#1f2937] rounded-[12px] p-6"
                >
                  <h3 className="text-white font-bold text-[16px] mb-2">{outcome.title}</h3>
                  <p className="text-[#6B7280] text-[14px] leading-[1.6]">{outcome.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        {(solution.build_price_min || solution.retainer_min) && (
          <section className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8">
            <h2 className="text-white text-[20px] font-bold mb-6">Investment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {solution.build_price_min && (
                <div>
                  <p className="text-[#4B5563] text-[12px] uppercase tracking-wider mb-1">Build</p>
                  <p className="text-white text-[24px] font-bold">
                    Rs {solution.build_price_min.toLocaleString('en-IN')}
                    {solution.build_price_max && (
                      <span className="text-[#6B7280]">
                        {' '}— Rs {solution.build_price_max.toLocaleString('en-IN')}
                      </span>
                    )}
                  </p>
                  <p className="text-[#4B5563] text-[13px] mt-1">Fixed scope, deployed in 4 to 6 weeks</p>
                </div>
              )}
              {solution.retainer_min && (
                <div>
                  <p className="text-[#4B5563] text-[12px] uppercase tracking-wider mb-1">Monthly retainer</p>
                  <p className="text-white text-[24px] font-bold">
                    Rs {solution.retainer_min.toLocaleString('en-IN')}
                    {solution.retainer_max && (
                      <span className="text-[#6B7280]">
                        {' '}— Rs {solution.retainer_max.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[16px] text-[#6B7280]">/mo</span>
                  </p>
                  <p className="text-[#4B5563] text-[13px] mt-1">Monitoring, optimisation, and support</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="rounded-[20px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-10 text-center">
          <h2 className="text-white text-[22px] font-bold mb-3">
            Ready to see if this is right for your business?
          </h2>
          <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[480px] mx-auto leading-relaxed">
            Start with the free Clarivis Assessment. It takes 5 to 20 minutes and identifies your highest-impact AI opportunity.
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
