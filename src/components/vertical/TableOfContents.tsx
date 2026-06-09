'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface TocItem {
  text: string
  slug: string
}

interface TableOfContentsProps {
  body: string
  title: string
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

function extractHeadings(body: string): TocItem[] {
  return body
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '')
      return { text, slug: generateSlug(text) }
    })
}

export default function TableOfContents({ body, title }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(body), [body])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-140px 0px -40% 0px' }
    )

    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      style={{
        position: 'sticky',
        top: '120px',
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
      }}
      aria-label={`Table of contents for ${title}`}
    >
      <p
        className="text-[11px] uppercase tracking-widest font-semibold mb-4"
        style={{ color: 'var(--v-accent)' }}
      >
        In this guide
      </p>

      <ul className="space-y-0">
        {headings.map(({ text, slug }) => {
          const isActive = activeId === slug
          return (
            <li key={slug}>
              <button
                onClick={() => {
                  const el = document.getElementById(slug)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="w-full text-left py-2 pl-3 text-[13px] transition-all duration-200"
                style={{
                  borderLeft: `2px solid ${
                    isActive
                      ? 'var(--v-signal)'
                      : 'color-mix(in srgb, var(--v-accent) 20%, transparent)'
                  }`,
                  color: isActive ? 'white' : 'var(--v-muted)',
                  fontWeight: isActive ? '500' : '400',
                }}
              >
                {text}
              </button>
            </li>
          )
        })}
      </ul>

      <div
        style={{
          borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
          paddingTop: '1rem',
          marginTop: '1rem',
        }}
      >
        <p className="text-[12px] mb-3" style={{ color: 'var(--v-muted)' }}>
          Ready to fix this?
        </p>
        <Link
          href="/assessment"
          className="block w-full text-center text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--v-accent)' }}
        >
          Start Free Assessment
        </Link>
      </div>
    </nav>
  )
}
