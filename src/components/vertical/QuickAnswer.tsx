interface QuickAnswerProps {
  summary: string
}

export default function QuickAnswer({ summary }: QuickAnswerProps) {
  return (
    <div
      style={{
        background: 'color-mix(in srgb, var(--v-accent) 8%, transparent)',
        borderLeft: '3px solid var(--v-accent)',
        borderRadius: '0 12px 12px 0',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--v-signal)', flexShrink: 0 }}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
        </svg>
        <span
          className="text-[11px] uppercase tracking-widest font-semibold"
          style={{ color: 'var(--v-accent)' }}
        >
          Quick answer
        </span>
      </div>
      <p className="text-[16px] leading-[1.8] text-white font-medium">
        {summary}
      </p>
    </div>
  )
}
