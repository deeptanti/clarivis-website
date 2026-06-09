import { AnimatedSection } from './AnimatedSection'
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
          <AnimatedSection key={i} delay={i * 0.1}>
            <div
              style={{
                background:
                  'linear-gradient(135deg, var(--v-fb) 0%, color-mix(in srgb, var(--v-accent) 6%, var(--v-fb)) 100%)',
                border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
                borderTop: '2px solid var(--v-accent)',
              }}
              className={`rounded-xl px-6 ${i === 1 ? 'py-10' : 'py-6'}`}
            >
              <p
                className="text-[42px] font-extrabold leading-none"
                style={{
                  color: 'var(--v-signal)',
                  textShadow:
                    '0 0 40px color-mix(in srgb, var(--v-signal) 30%, transparent)',
                }}
              >
                {stat.value}
              </p>
              <div
                style={{
                  width: '24px',
                  height: '2px',
                  background: 'var(--v-signal)',
                  opacity: 0.4,
                  marginTop: '0.75rem',
                  marginBottom: '0.35rem',
                }}
              />
              <p
                className="text-[12px] uppercase tracking-widest font-semibold mb-3"
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
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}
