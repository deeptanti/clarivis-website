'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AssessmentCTAProps {
  verticalName: string
}

export default function AssessmentCTA({ verticalName }: AssessmentCTAProps) {
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <section
      style={{
        backgroundColor: 'var(--v-fa)',
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
      }}
      className="w-full py-20 px-6"
    >
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="text-white text-[28px] font-extrabold leading-tight">
          Start your free {verticalName} AI Assessment
        </h2>
        <p style={{ color: 'var(--v-muted)' }} className="text-[16px] leading-relaxed mt-3">
          Free, takes 5 to 20 minutes, ends with a personalised AI Opportunity Snapshot. No credit card. No commitment.
        </p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-md font-medium text-sm mt-8 transition-opacity"
          style={{
            backgroundColor: 'var(--v-accent)',
            opacity: ctaHovered ? 0.85 : 1,
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          Start Free Assessment
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}
