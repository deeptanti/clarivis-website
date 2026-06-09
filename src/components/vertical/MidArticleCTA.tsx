import Link from 'next/link'

interface MidArticleCTAProps {
  verticalName: string
  stats?: Array<{ value: string; label: string }> | null
}

export default function MidArticleCTA({ verticalName, stats }: MidArticleCTAProps) {
  const firstStat = stats?.[0] ?? null

  return (
    <div
      className="my-12 rounded-2xl px-6 py-8"
      style={{
        background: 'var(--v-fb)',
        borderLeft: '3px solid var(--v-signal)',
      }}
    >
      <div className="flex items-start gap-5">
        {/* Stat accent */}
        <div style={{ flexShrink: 0, minWidth: '80px' }}>
          <p
            style={{
              color: 'var(--v-signal)',
              fontSize: '48px',
              fontWeight: '800',
              lineHeight: 1,
            }}
          >
            {firstStat?.value ?? '90'}
          </p>
          <p
            className="text-[10px] uppercase tracking-widest mt-1 leading-tight"
            style={{ color: 'var(--v-accent)', maxWidth: '90px' }}
          >
            {firstStat?.label ?? 'days to ROI'}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            alignSelf: 'stretch',
            background: 'color-mix(in srgb, var(--v-signal) 20%, transparent)',
            flexShrink: 0,
          }}
        />

        {/* Copy + CTA */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] uppercase tracking-widest font-semibold mb-2"
            style={{ color: 'var(--v-signal)' }}
          >
            The cost of doing nothing
          </p>
          <p className="text-[17px] font-bold text-white mb-2 leading-snug">
            Most businesses know the problem exists.
          </p>
          <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--v-muted)' }}>
            Very few quantify it. Start with a free 20-minute {verticalName} assessment
            and we will calculate the exact revenue impact for your operation.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/assessment"
              className="text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: 'var(--v-accent)' }}
            >
              Start Free Assessment →
            </Link>
            <span className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
              Free. 20 minutes. No commitment.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
