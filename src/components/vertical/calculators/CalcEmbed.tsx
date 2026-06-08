import type { ReactNode } from 'react'
import { RealEstateCalc } from './RealEstateCalc'
import { HealthcareCalc } from './HealthcareCalc'
import { AgribusinessCalc } from './AgribusinessCalc'

type Props = { vertical: string }

export function CalcEmbed({ vertical }: Props) {
  const map: Record<string, ReactNode> = {
    'real-estate': <RealEstateCalc />,
    'healthcare': <HealthcareCalc />,
    'agribusiness': <AgribusinessCalc />,
  }
  const calc = map[vertical]
  if (!calc) return null
  return (
    <section className="my-16">
      <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
        <h2 className="text-white text-[22px] font-bold">Calculate your current cost</h2>
        <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mt-1">
          Enter your numbers and see the monthly impact.
        </p>
      </div>
      {calc}
    </section>
  )
}
