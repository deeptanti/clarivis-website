'use client'
import { useState } from 'react'
import { useCalcContext } from './CalcContext'

function formatInr(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 10000000) return `Rs ${(rounded / 10000000).toFixed(2)} crore`
  if (rounded >= 100000) return `Rs ${(rounded / 100000).toFixed(2)} lakh`
  return `Rs ${rounded.toLocaleString('en-IN')}`
}

export function HealthcareCalc() {
  const ctx = useCalcContext()
  const [localAppts, setLocalAppts] = useState(60)
  const [fee, setFee] = useState(500)
  const [rate, setRate] = useState(35)

  const appointments = ctx != null ? ctx.primaryValue : localAppts

  function handleApptsChange(n: number) {
    if (ctx != null) ctx.setPrimaryValue(n)
    else setLocalAppts(n)
  }

  const loss = Math.round(appointments * (rate / 100) * fee * 26)

  return (
    <div style={{ background: 'var(--v-fb)' }} className="rounded-2xl p-8">
      <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mb-8">
        How much is your clinic losing to no-shows each month?
      </p>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Daily appointments
          </span>
          <span className="text-[13px] font-semibold text-white">{appointments}</span>
        </div>
        <input
          type="range"
          min={10}
          max={200}
          step={5}
          value={appointments}
          onChange={(e) => handleApptsChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Average consultation fee
          </span>
          <span className="text-[13px] font-semibold text-white">Rs {fee}</span>
        </div>
        <input
          type="range"
          min={100}
          max={3000}
          step={50}
          value={fee}
          onChange={(e) => setFee(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            No-show rate
          </span>
          <span className="text-[13px] font-semibold text-white">{rate}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={55}
          step={1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div
        style={{
          background: 'color-mix(in srgb, var(--v-accent) 10%, transparent)',
          borderLeft: '3px solid var(--v-accent)',
        }}
        className="rounded-xl p-6 mt-6"
      >
        <p
          style={{ color: 'var(--v-accent)' }}
          className="text-[11px] uppercase tracking-widest font-semibold mb-2"
        >
          Monthly revenue lost to no-shows
        </p>
        <p
          style={{ color: 'var(--v-signal)' }}
          className="text-[44px] font-extrabold leading-none"
        >
          {formatInr(loss)}
        </p>
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px] mt-3">
          38% average no-show rate for clinics without automated reminders
        </p>
      </div>

      <p style={{ color: 'var(--v-muted)' }} className="text-[11px] mt-3 italic">
        Source: National Health Authority 2024
      </p>

      <div
        style={{
          background: 'color-mix(in srgb, var(--v-fa) 80%, transparent)',
          border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        }}
        className="rounded-xl p-5 mt-5 flex items-center justify-between gap-4"
      >
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px]">
          An AI Appointment Agent costs Rs 8,000 to Rs 12,000 per month.
        </p>
        <a
          href="/assessment"
          style={{ color: 'var(--v-signal)' }}
          className="text-[13px] font-semibold whitespace-nowrap"
        >
          See the fix →
        </a>
      </div>
    </div>
  )
}
