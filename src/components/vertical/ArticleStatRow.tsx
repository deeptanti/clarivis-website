import type { ArticleStat } from '@/types/content'

interface ArticleStatRowProps {
  stats: ArticleStat[]
}

export default function ArticleStatRow({ stats }: ArticleStatRowProps) {
  return (
    <section className="my-12">
      <h2 className="text-white text-[18px] font-bold mb-6">Key numbers</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'var(--v-fb)',
              border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
              borderTop: '2px solid var(--v-accent)',
            }}
            className="rounded-xl p-6"
          >
            <p
              className="text-[42px] font-extrabold leading-none"
              style={{ color: 'var(--v-signal)' }}
            >
              {stat.value}
            </p>
            <p
              className="text-[12px] uppercase tracking-widest font-semibold mt-2 mb-3"
              style={{ color: 'var(--v-accent)' }}
            >
              {stat.label}
            </p>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: 'var(--v-muted)' }}
            >
              {stat.description}
            </p>
            <p
              className="text-[11px] italic mt-3 opacity-60"
              style={{ color: 'var(--v-muted)' }}
            >
              {stat.source}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
