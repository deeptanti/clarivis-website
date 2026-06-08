interface ProblemCardProps {
  problem: string
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--v-fb)',
        borderLeft: '2px solid var(--v-signal)',
      }}
      className="p-5 rounded-xl flex gap-3 items-start"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 mt-0.5"
        style={{ color: 'var(--v-signal)' }}
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12" y1="9" x2="12" y2="13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="12" y1="17" x2="12.01" y2="17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-white text-[15px] leading-relaxed">{problem}</p>
    </div>
  )
}
