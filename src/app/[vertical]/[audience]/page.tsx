import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  isValidVertical,
  getVertical,
  getAudienceBySlug,
  getSolutionsByVertical,
  getAllPublishedAudiences,
} from '@/lib/verticals'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
            {audience.name}
          </h1>
          {audience.description && (
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] max-w-[600px] mx-auto mb-8">
              {audience.description}
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

      <div className="container mx-auto px-6 max-w-[860px] py-[60px] space-y-16">
        {/* Pain points */}
        {audience.pain_points && audience.pain_points.length > 0 && (
          <section>
            <h2 className="text-white text-[24px] font-bold mb-6">Key challenges</h2>
            <ul className="space-y-3">
              {audience.pain_points.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-3 bg-[#111827] border border-[#1f2937] rounded-[12px] p-5"
                >
                  <span className="text-[#0F6E56] font-bold text-[16px] shrink-0">—</span>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">{point}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Body markdown */}
        {audience.body && (
          <section className="prose prose-invert prose-p:text-[#CBD5E1] prose-headings:text-white prose-a:text-[#0F6E56] prose-strong:text-white prose-li:text-[#CBD5E1] max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{audience.body}</ReactMarkdown>
          </section>
        )}

        {/* Solutions for this audience */}
        {solutions.length > 0 && (
          <section>
            <h2 className="text-white text-[24px] font-bold mb-6">AI solutions for your business</h2>
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
        )}

        {/* Bottom CTA */}
        <section className="rounded-[20px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-10 text-center">
          <h2 className="text-white text-[22px] font-bold mb-3">
            Ready to see what AI can do for your business?
          </h2>
          <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[480px] mx-auto leading-relaxed">
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
