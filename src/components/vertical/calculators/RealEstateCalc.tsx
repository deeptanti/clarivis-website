'use client'
import { useState } from 'react'

function formatInr(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 10000000) return `Rs ${(rounded / 10000000).toFixed(2)} crore`
  if (rounded >= 100000) return `Rs ${(rounded / 100000).toFixed(2)} lakh`
  return `Rs ${rounded.toLocaleString('en-IN')}`
}

function formatLabel(n: number): string {
  if (n >= 10000000) return `Rs ${(n / 10000000).toFixed(1)} crore`
  if (n >= 100000) return `Rs ${(n / 100000).toFixed(0)} lakh`
  return `Rs ${n.toLocaleString('en-IN')}`
}

export function RealEstateCalc() {
  const [leads, setLeads] = useState(150)
  const [dealValue, setDealValue] = useState(4500000)
  const loss = Math.round(leads * 0.35 * dealValue)

  return (
    <div style={{ background: 'var(--v-fb)' }} className="rounded-2xl p-8">
      <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mb-8">
        How much revenue is slow lead response costing you each month?
      </p>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Monthly inbound leads
          </span>
          <span className="text-[13px] font-semibold text-white">{leads}</span>
        </div>
        <input
          type="range"
          min={20}
          max={500}
          step={10}
          value={leads}
          onChange={(e) => setLeads(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Average deal value
          </span>
          <span className="text-[13px] font-semibold text-white">{formatLabel(dealValue)}</span>
        </div>
        <input
          type="range"
          min={1000000}
          max={50000000}
          step={500000}
          value={dealValue}
          onChange={(e) => setDealValue(Number(e.target.value))}
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
          Monthly pipeline lost to slow response
        </p>
        <p
          style={{ color: 'var(--v-signal)' }}
          className="text-[44px] font-extrabold leading-none"
        >
          {formatInr(loss)}
        </p>
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px] mt-3">
          35% of leads go cold within 2 hours of submitting an enquiry
        </p>
      </div>

      <p style={{ color: 'var(--v-muted)' }} className="text-[11px] mt-3 italic">
        Source: ANAROCK Residential Research 2024
      </p>

      <div
        style={{
          background: 'color-mix(in srgb, var(--v-fa) 80%, transparent)',
          border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        }}
        className="rounded-xl p-5 mt-5 flex items-center justify-between gap-4"
      >
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px]">
          An AI Lead Qualifier costs Rs 8,000 to Rs 15,000 per month.
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
