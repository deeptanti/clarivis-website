interface StatBlockProps {
  figure: string
  label: string
  description: string
}

export default function StatBlock({ figure, label, description }: StatBlockProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--v-fb)',
        borderLeft: '3px solid var(--v-accent)',
      }}
      className="p-8 rounded-2xl"
    >
      <p
        style={{ color: 'var(--v-accent)' }}
        className="text-[13px] uppercase tracking-widest font-semibold mb-2"
      >
        {label}
      </p>
      <p
        style={{ color: 'var(--v-signal)', fontFamily: 'var(--font-dm-sans, sans-serif)' }}
        className="text-[64px] font-extrabold leading-none mb-3"
      >
        {figure}
      </p>
      <p
        style={{ color: 'var(--v-muted)' }}
        className="text-[14px] leading-relaxed"
      >
        {description}
      </p>
    </div>
  )
}
