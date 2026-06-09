import Link from 'next/link'
import { getRelatedGuides } from '@/lib/content'
import SectionTag from '@/components/vertical/SectionTag'

interface RelatedGuidesProps {
  vertical: string
  currentSlug: string
}

export default async function RelatedGuides({
  vertical,
  currentSlug,
}: RelatedGuidesProps) {
  const guides = await getRelatedGuides(vertical, currentSlug)
  if (guides.length === 0) return null

  const verticalLabel = vertical
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <section
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        paddingTop: '3rem',
        marginTop: '3rem',
      }}
    >
      <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
        <h2 className="text-white text-[20px] font-bold">
          More from {verticalLabel} insights
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/${vertical}/insights/guides/${guide.slug}`}
            className="block rounded-2xl p-6 transition-opacity hover:opacity-85"
            style={{
              background: 'var(--v-fb)',
              border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
              borderTop: '2px solid var(--v-accent)',
            }}
          >
            <SectionTag label="Guide" />
            <p className="text-[16px] font-bold text-white mt-3 mb-2">{guide.title}</p>
            {guide.description && (
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: 'var(--v-muted)' }}
              >
                {guide.description.length > 100
                  ? `${guide.description.slice(0, 100)}…`
                  : guide.description}
              </p>
            )}
            {guide.read_time != null && (
              <p className="text-[11px] mt-3" style={{ color: 'var(--v-accent)' }}>
                {guide.read_time} min read
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
