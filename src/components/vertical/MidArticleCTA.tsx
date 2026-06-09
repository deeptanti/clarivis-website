import Link from 'next/link'

interface MidArticleCTAProps {
  verticalName: string
}

export default function MidArticleCTA({ verticalName }: MidArticleCTAProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'var(--v-fb)',
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        margin: '3rem -2rem',
        padding: '2.5rem 2rem',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'var(--v-signal)',
          borderRadius: '0 3px 3px 0',
        }}
      />

      <div className="max-w-[480px] mx-auto">
        <p
          className="text-[11px] uppercase tracking-widest font-semibold mb-3"
          style={{ color: 'var(--v-signal)' }}
        >
          The cost of doing nothing
        </p>
        <h3 className="text-[20px] font-bold text-white mb-2">
          Most businesses know the problem exists.
        </h3>
        <p className="text-[14px] mb-6" style={{ color: 'var(--v-muted)' }}>
          Very few quantify it. Start with a free 20-minute {verticalName} assessment
          and we will calculate the exact revenue impact for your operation.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
            Free. 20 minutes. No commitment.
          </span>
          <Link
            href="/assessment"
            className="text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ backgroundColor: 'var(--v-accent)' }}
          >
            Start Free Assessment →
          </Link>
        </div>
      </div>
    </div>
  )
}
