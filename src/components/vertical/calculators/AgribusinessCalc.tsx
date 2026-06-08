'use client'
import { useState } from 'react'

function formatInr(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 10000000) return `Rs ${(rounded / 10000000).toFixed(2)} crore`
  if (rounded >= 100000) return `Rs ${(rounded / 100000).toFixed(2)} lakh`
  return `Rs ${rounded.toLocaleString('en-IN')}`
}

export function AgribusinessCalc() {
  const [workers, setWorkers] = useState(200)
  const [wage, setWage] = useState(450)
  const discrepancy = Math.round(workers * wage * 26 * 0.04)

  return (
    <div style={{ background: 'var(--v-fb)' }} className="rounded-2xl p-8">
      <p style={{ color: 'var(--v-muted)' }} className="text-[14px] mb-8">
        How much are attendance discrepancies costing you each month?
      </p>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Field workers
          </span>
          <span className="text-[13px] font-semibold text-white">{workers}</span>
        </div>
        <input
          type="range"
          min={20}
          max={600}
          step={10}
          value={workers}
          onChange={(e) => setWorkers(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span style={{ color: 'var(--v-muted)' }} className="text-[13px]">
            Average daily wage
          </span>
          <span className="text-[13px] font-semibold text-white">Rs {wage}</span>
        </div>
        <input
          type="range"
          min={200}
          max={2000}
          step={50}
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
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
          Estimated monthly payroll discrepancy
        </p>
        <p
          style={{ color: 'var(--v-signal)' }}
          className="text-[44px] font-extrabold leading-none"
        >
          {formatInr(discrepancy)}
        </p>
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px] mt-3">
          4% average attendance discrepancy in distributed field operations without digital tracking
        </p>
      </div>

      <p style={{ color: 'var(--v-muted)' }} className="text-[11px] mt-3 italic">
        Source: NABARD operational field survey 2023
      </p>

      <div
        style={{
          background: 'color-mix(in srgb, var(--v-fa) 80%, transparent)',
          border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        }}
        className="rounded-xl p-5 mt-5 flex items-center justify-between gap-4"
      >
        <p style={{ color: 'var(--v-muted)' }} className="text-[13px]">
          A Workforce Management System costs Rs 10,000 to Rs 18,000 per month.
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
