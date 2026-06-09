'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import { useCalcContext } from './calculators/CalcContext'

interface MiniCalcProps {
  vertical: string
}

function formatInr(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 10000000) return `Rs ${(rounded / 10000000).toFixed(2)} crore`
  if (rounded >= 100000) return `Rs ${(rounded / 100000).toFixed(2)} lakh`
  return `Rs ${rounded.toLocaleString('en-IN')}`
}

function RealEstateMiniCalc(): JSX.Element {
  const ctx = useCalcContext()
  const [local, setLocal] = useState(150)
  const leads = ctx != null ? ctx.primaryValue : local

  function handleChange(n: number) {
    if (ctx != null) ctx.setPrimaryValue(n)
    else setLocal(n)
  }

  const result = leads * 0.35 * 4500000
  return (
    <>
      <div className="flex justify-between text-[12px] mt-1 mb-1">
        <span style={{ color: 'var(--v-muted)' }}>Monthly inbound leads</span>
        <span className="text-white font-medium">{leads}</span>
      </div>
      <input
        type="range"
        min={20}
        max={500}
        step={10}
        value={leads}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-4"
        aria-label="Monthly inbound leads"
      />
      <p
        className="text-[32px] font-extrabold leading-none"
        style={{ color: 'var(--v-signal)' }}
      >
        {formatInr(result)}
      </p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--v-muted)' }}>
        per month at current settings
      </p>
    </>
  )
}

function HealthcareMiniCalc(): JSX.Element {
  const ctx = useCalcContext()
  const [local, setLocal] = useState(60)
  const appointments = ctx != null ? ctx.primaryValue : local

  function handleChange(n: number) {
    if (ctx != null) ctx.setPrimaryValue(n)
    else setLocal(n)
  }

  const result = appointments * 0.35 * 500 * 26
  return (
    <>
      <div className="flex justify-between text-[12px] mt-1 mb-1">
        <span style={{ color: 'var(--v-muted)' }}>Daily appointments</span>
        <span className="text-white font-medium">{appointments}</span>
      </div>
      <input
        type="range"
        min={10}
        max={200}
        step={5}
        value={appointments}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-4"
        aria-label="Daily appointments"
      />
      <p
        className="text-[32px] font-extrabold leading-none"
        style={{ color: 'var(--v-signal)' }}
      >
        {formatInr(result)}
      </p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--v-muted)' }}>
        per month at current settings
      </p>
    </>
  )
}

function AgribusinessMiniCalc(): JSX.Element {
  const ctx = useCalcContext()
  const [local, setLocal] = useState(200)
  const workers = ctx != null ? ctx.primaryValue : local

  function handleChange(n: number) {
    if (ctx != null) ctx.setPrimaryValue(n)
    else setLocal(n)
  }

  const result = workers * 450 * 26 * 0.04
  return (
    <>
      <div className="flex justify-between text-[12px] mt-1 mb-1">
        <span style={{ color: 'var(--v-muted)' }}>Field workers</span>
        <span className="text-white font-medium">{workers}</span>
      </div>
      <input
        type="range"
        min={20}
        max={600}
        step={10}
        value={workers}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-full mb-4"
        aria-label="Field workers"
      />
      <p
        className="text-[32px] font-extrabold leading-none"
        style={{ color: 'var(--v-signal)' }}
      >
        {formatInr(result)}
      </p>
      <p className="text-[11px] mt-1" style={{ color: 'var(--v-muted)' }}>
        per month at current settings
      </p>
    </>
  )
}

const CALC_MAP: Record<string, () => JSX.Element> = {
  'real-estate': RealEstateMiniCalc,
  'healthcare': HealthcareMiniCalc,
  'agribusiness': AgribusinessMiniCalc,
}

export default function MiniCalc({ vertical }: MiniCalcProps) {
  const CalcComponent = CALC_MAP[vertical]
  if (!CalcComponent) return null

  return (
    <div
      style={{
        background: 'var(--v-fb)',
        border: '0.5px solid color-mix(in srgb, var(--v-accent) 30%, transparent)',
        borderRadius: '16px',
        padding: '1rem',
      }}
    >
      <p
        className="text-[11px] uppercase tracking-widest font-semibold mb-3"
        style={{ color: 'var(--v-accent)' }}
      >
        Your estimated cost
      </p>
      <CalcComponent />
    </div>
  )
}
