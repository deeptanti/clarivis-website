interface OutcomeCardProps {
  title: string
  description: string
}

export default function OutcomeCard({ title, description }: OutcomeCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--v-fb)',
        borderTop: '2px solid var(--v-accent)',
      }}
      className="p-6 rounded-xl"
    >
      <div className="flex items-start gap-3 mb-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 mt-0.5"
          style={{ color: 'var(--v-signal)' }}
        >
          <polyline
            points="20 6 9 17 4 12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-white text-[15px] font-bold">{title}</h3>
      </div>
      <p style={{ color: 'var(--v-muted)' }} className="text-[14px] leading-relaxed pl-7">
        {description}
      </p>
    </div>
  )
}
