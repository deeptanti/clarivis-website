import Link from 'next/link'

interface MidArticleCTAProps {
  verticalName: string
  stats?: Array<{ value: string; label: string }> | null
}

export default function MidArticleCTA({ verticalName, stats }: MidArticleCTAProps) {
  const firstStat = stats?.[0] ?? null

  return (
    <div
      style={{
        background: 'var(--v-fb)',
        borderTop: '1px solid color-mix(in srgb, var(--v-signal) 20%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--v-signal) 20%, transparent)',
      }}
      className="py-14 my-14"
    >
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Left: large stat + copy */}
        <div style={{ flex: '0 0 60%' }}>
          <p
            style={{
              color: 'var(--v-signal)',
              fontSize: '80px',
              fontWeight: '800',
              lineHeight: 1,
            }}
          >
            {firstStat?.value ?? '90'}
          </p>
          <p
            className="text-[13px] uppercase tracking-widest mt-1 mb-6"
            style={{ color: 'var(--v-accent)' }}
          >
            {firstStat?.label ?? 'days to measurable ROI'}
          </p>
          <p
            className="text-[11px] uppercase tracking-widest font-semibold mb-3"
            style={{ color: 'var(--v-signal)' }}
          >
            The cost of doing nothing
          </p>
          <h3 className="text-[20px] font-bold text-white mb-2">
            Most businesses know the problem exists.
          </h3>
          <p className="text-[14px]" style={{ color: 'var(--v-muted)' }}>
            Very few quantify it. Start with a free 20-minute {verticalName} assessment
            and we will calculate the exact revenue impact for your operation.
          </p>
        </div>

        {/* Right: CTA */}
        <div style={{ flex: '0 0 40%' }} className="flex flex-col gap-3 justify-center pt-2">
          <span className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
            Free. 20 minutes. No commitment.
          </span>
          <Link
            href="/assessment"
            className="w-full text-center text-white px-6 py-3 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: 'var(--v-accent)' }}
          >
            Start Free Assessment →
          </Link>
        </div>
      </div>
    </div>
  )
}
