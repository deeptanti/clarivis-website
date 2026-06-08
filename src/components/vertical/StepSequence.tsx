interface Step {
  step: string
  description: string
}

interface StepSequenceProps {
  steps: Step[]
}

export default function StepSequence({ steps }: StepSequenceProps) {
  return (
    <div className="space-y-4">
      {steps.map((item, i) => (
        <div
          key={i}
          style={{ backgroundColor: 'var(--v-fb)' }}
          className="p-6 rounded-xl"
        >
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center shrink-0">
              <span
                style={{ backgroundColor: 'var(--v-accent)' }}
                className="text-white text-[13px] font-bold px-2 py-0.5 rounded"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {i < steps.length - 1 && (
                <div
                  style={{ borderLeft: '1px solid color-mix(in srgb, var(--v-accent) 30%, transparent)' }}
                  className="flex-1 mt-2 h-6 ml-[1px]"
                />
              )}
            </div>
            <div>
              <p className="text-white text-[16px] font-bold mb-1">{item.step}</p>
              <p style={{ color: 'var(--v-muted)' }} className="text-[14px] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
