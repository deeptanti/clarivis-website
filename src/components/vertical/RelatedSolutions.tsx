import Link from 'next/link'
import { getSolutionsByVertical } from '@/lib/verticals'

interface RelatedSolutionsProps {
  vertical: string
  currentSlug?: string
}

export default async function RelatedSolutions({ vertical, currentSlug }: RelatedSolutionsProps) {
  const solutions = await getSolutionsByVertical(vertical)
  const filtered = solutions
    .filter((s) => s.slug !== currentSlug)
    .slice(0, 3)

  if (filtered.length === 0) return null

  return (
    <section
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        paddingTop: '3rem',
        marginTop: '3rem',
      }}
    >
      <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
        <h2 className="text-white text-[22px] font-bold">
          AI solutions for this vertical
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filtered.map((solution) => (
          <div
            key={solution.id}
            style={{
              background: 'var(--v-fb)',
              borderLeft: '3px solid var(--v-accent)',
            }}
            className="rounded-2xl pl-6 p-7"
          >
            <p className="text-[17px] font-bold text-white mb-1">
              {solution.name}
            </p>
            {solution.tagline && (
              <p
                className="text-[13px] mb-3"
                style={{ color: 'var(--v-muted)' }}
              >
                {solution.tagline}
              </p>
            )}
            {solution.roi_claim && (
              <p
                className="text-[13px] font-medium"
                style={{ color: 'var(--v-signal)' }}
              >
                {solution.roi_claim}
              </p>
            )}
            <Link
              href={`/${vertical}/solutions/${solution.slug}`}
              className="inline-block text-[12px] font-medium mt-4 hover:opacity-75 transition-opacity"
              style={{ color: 'var(--v-accent)' }}
            >
              View solution →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
