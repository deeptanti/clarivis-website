interface SectionTagProps {
  label: string
}

export default function SectionTag({ label }: SectionTagProps) {
  return (
    <span
      style={{
        backgroundColor: 'color-mix(in srgb, var(--v-accent) 15%, transparent)',
        border: '1px solid color-mix(in srgb, var(--v-accent) 40%, transparent)',
        color: 'var(--v-accent)',
      }}
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-widest font-semibold"
    >
      {label}
    </span>
  )
}
