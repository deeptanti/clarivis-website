# Guide Page Rebuild — Session 7a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the guide page from a plain prose column into a rich, two-column reading experience with sticky TOC, early calculator, custom markdown components, mid-article CTA, and new GEO/schema signals.

**Architecture:** The guide page becomes a self-contained layout (no ArticleLayout) that splits the markdown body at its midpoint H2, renders a full-width calculator before any prose, places a visual CTA break mid-article, and wraps the prose column with a sticky sidebar containing auto-generated TOC and a single-slider MiniCalc. ArticleLayout stays untouched (still used by glossary, article, and faq routes). All new components are framework-agnostic server components except where interactivity is required (TableOfContents, MiniCalc).

**Tech Stack:** Next.js 16.2.2 App Router, TypeScript strict, Tailwind CSS v4, react-markdown v10, remark-gfm, Supabase anon client, CSS custom properties for vertical colors.

---

## File Map

| Action | File |
|---|---|
| Modify | `src/lib/content.ts` |
| Modify | `src/components/vertical/QuickAnswer.tsx` |
| Modify | `src/components/vertical/FAQSection.tsx` |
| Create | `src/components/vertical/markdown/MarkdownComponents.tsx` |
| Create | `src/components/vertical/TableOfContents.tsx` |
| Create | `src/components/vertical/MiniCalc.tsx` |
| Create | `src/components/vertical/MidArticleCTA.tsx` |
| Create | `src/components/vertical/RelatedGuides.tsx` |
| Modify | `src/app/[vertical]/insights/guides/[slug]/page.tsx` |

---

## Task 1: Extend content.ts with getRelatedGuides

**Files:**
- Modify: `src/lib/content.ts`

Read the full file before editing. The existing pattern uses `getSupabase()` — match it. Add a `ContentGuideSummary` export type and a `getRelatedGuides` function.

- [ ] **Step 1: Read the current file**

Read `src/lib/content.ts` fully before editing. Confirm it uses `getSupabase()` from `@/lib/supabase` and imports `ContentRow`, `ContentSummary`, `ContentType`, `Vertical` from `@/types/content`.

- [ ] **Step 2: Add the export type and function**

Append to the bottom of `src/lib/content.ts`:

```typescript
export type ContentGuideSummary = Pick<
  ContentRow,
  'slug' | 'vertical' | 'title' | 'description' | 'read_time' | 'content_type'
>

export async function getRelatedGuides(
  vertical: string,
  currentSlug: string,
  limit = 3
): Promise<ContentGuideSummary[]> {
  const { data } = await getSupabase()
    .from('content')
    .select('slug, vertical, title, description, read_time, content_type')
    .eq('vertical', vertical)
    .eq('content_type', 'guide')
    .eq('published', true)
    .neq('slug', currentSlug)
    .limit(limit)
  return data ?? []
}
```

- [ ] **Step 3: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: no errors related to content.ts.

---

## Task 2: Add quick-answer class to QuickAnswer.tsx

**Files:**
- Modify: `src/components/vertical/QuickAnswer.tsx`

The outer `<div>` needs `className="quick-answer"` so the speakable JSON-LD cssSelector can target it.

- [ ] **Step 1: Read the file**

Read `src/components/vertical/QuickAnswer.tsx` fully.

- [ ] **Step 2: Add className**

The outer `<div>` currently has only `style={{...}}`. Change it to add `className="quick-answer"`:

```tsx
<div
  className="quick-answer"
  style={{
    background: 'color-mix(in srgb, var(--v-accent) 8%, transparent)',
    borderLeft: '3px solid var(--v-accent)',
    borderRadius: '0 12px 12px 0',
    padding: '1.25rem 1.5rem',
    marginBottom: '2rem',
  }}
>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors.

---

## Task 3: Add faq-answer class to FAQSection.tsx

**Files:**
- Modify: `src/components/vertical/FAQSection.tsx`

Each answer `<p>` needs `className="faq-answer"` so the speakable JSON-LD cssSelector can target it.

- [ ] **Step 1: Read the file**

Read `src/components/vertical/FAQSection.tsx` fully.

- [ ] **Step 2: Add className**

The answer paragraph currently reads:
```tsx
<p
  className="text-[15px] leading-relaxed"
  style={{ color: 'var(--v-muted)' }}
>
  {item.answer}
</p>
```

Change it to:
```tsx
<p
  className="faq-answer text-[15px] leading-relaxed"
  style={{ color: 'var(--v-muted)' }}
>
  {item.answer}
</p>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors.

---

## Task 4: Create MarkdownComponents.tsx

**Files:**
- Create: `src/components/vertical/markdown/MarkdownComponents.tsx`

No `'use client'` directive. This exports a `components` object passed to ReactMarkdown. Overrides: blockquote (callout), table (before/after detector), h2 (anchored), strong (signal color), p (prose style).

For the `table` override, the `node` prop from react-markdown carries the hast AST. We inspect it with a local interface (no external hast import needed — we define our own minimal interface matching the shape we need).

For the `h2` override, we generate an `id` slug from the children text so TOC anchors work.

- [ ] **Step 1: Create the file**

Create `src/components/vertical/markdown/MarkdownComponents.tsx`:

```tsx
import type { ReactNode } from 'react'
import type { Components } from 'react-markdown'

// Minimal hast-compatible node shape for table header inspection
interface HastChild {
  type: string
  tagName?: string
  value?: string
  children?: HastChild[]
}

function getFirstHeaderText(node: unknown): string {
  if (typeof node !== 'object' || node === null) return ''
  const el = node as { children?: HastChild[] }
  const thead = el.children?.find((c) => c.tagName === 'thead')
  if (!thead) return ''
  const firstRow = thead.children?.find((c) => c.tagName === 'tr')
  if (!firstRow) return ''
  const firstCell = firstRow.children?.find(
    (c) => c.tagName === 'th' || c.tagName === 'td'
  )
  if (!firstCell) return ''
  const textNode = firstCell.children?.find((c) => c.type === 'text')
  return typeof textNode?.value === 'string' ? textNode.value : ''
}

function childrenToText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return (node as ReactNode[]).map(childrenToText).join('')
  if (node !== null && typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement<{ children?: ReactNode }>
    return childrenToText(el.props.children)
  }
  return ''
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export const markdownComponents: Components = {
  blockquote({ children }) {
    return (
      <div
        style={{
          background: 'color-mix(in srgb, var(--v-signal) 8%, transparent)',
          borderLeft: '3px solid var(--v-signal)',
          borderRadius: '0 12px 12px 0',
          padding: '1rem 1.25rem',
          margin: '2rem 0',
        }}
      >
        <div className="flex items-start gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: 'var(--v-signal)', flexShrink: 0, marginTop: '2px' }}
          >
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </svg>
          <div className="text-[15px] leading-relaxed text-white font-medium">
            {children}
          </div>
        </div>
      </div>
    )
  },

  table({ node, children }) {
    const firstHeader = getFirstHeaderText(node)
    const isBeforeAfter = firstHeader.toLowerCase().includes('before')

    if (!isBeforeAfter) {
      return (
        <div
          style={{
            background: 'var(--v-fb)',
            border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
            borderRadius: '12px',
            overflowX: 'auto',
            margin: '2rem 0',
          }}
        >
          <table className="w-full text-[14px] border-collapse">{children}</table>
        </div>
      )
    }

    // Before/After two-column layout — extract rows from node AST
    const nodeEl = node as { children?: HastChild[] } | undefined
    const tbody = nodeEl?.children?.find((c) => c.tagName === 'tbody')
    const rows = tbody?.children?.filter((c) => c.tagName === 'tr') ?? []

    return (
      <div
        style={{
          margin: '2rem 0',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        }}
      >
        <div className="grid grid-cols-2">
          {/* Before column header */}
          <div
            style={{ background: 'var(--v-fb)', borderRight: '1px solid color-mix(in srgb, var(--v-accent) 15%, transparent)' }}
            className="px-5 py-3 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-400 flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wider text-red-400">Before</span>
          </div>
          {/* After column header */}
          <div
            style={{ background: 'var(--v-fb)' }}
            className="px-5 py-3 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-400 flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wider text-green-400">After</span>
          </div>
        </div>
        {rows.map((row, i) => {
          const cells = row.children?.filter((c) => c.tagName === 'td' || c.tagName === 'th') ?? []
          const beforeText = cells[0]?.children?.find((c) => c.type === 'text')?.value ?? ''
          const afterText = cells[1]?.children?.find((c) => c.type === 'text')?.value ?? ''
          return (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{
                borderTop: '1px solid color-mix(in srgb, var(--v-accent) 10%, transparent)',
              }}
            >
              <div
                className="px-5 py-3 text-[14px]"
                style={{
                  color: 'var(--v-muted)',
                  borderRight: '1px solid color-mix(in srgb, var(--v-accent) 15%, transparent)',
                  background: 'var(--v-fa)',
                }}
              >
                {beforeText}
              </div>
              <div
                className="px-5 py-3 text-[14px] font-medium text-white"
                style={{ background: 'var(--v-fa)' }}
              >
                {afterText}
              </div>
            </div>
          )
        })}
      </div>
    )
  },

  // Override thead, th, td to prevent default rendering inside our custom table override
  thead() { return null },
  tbody() { return null },
  tr() { return null },
  th() { return null },
  td() { return null },

  h2({ children }) {
    const text = childrenToText(children)
    const slug = generateSlug(text)
    return (
      <h2
        id={slug}
        className="text-white text-[26px] font-bold mt-14 mb-5 scroll-mt-[140px]"
        style={{ borderLeft: '3px solid var(--v-accent)', paddingLeft: '1rem' }}
      >
        {children}
      </h2>
    )
  },

  strong({ children }) {
    return (
      <strong style={{ color: 'var(--v-signal)', fontWeight: '600' }}>
        {children}
      </strong>
    )
  },

  p({ children }) {
    return (
      <p
        className="text-[16px] leading-[1.9] mb-6"
        style={{ color: 'var(--v-muted)' }}
      >
        {children}
      </p>
    )
  },
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: no errors. If `Components` type from react-markdown complains about the `table` override signature, adjust: the `table` component in `Components` accepts `HTMLAttributes<HTMLTableElement> & ExtraProps`. The `node` in `ExtraProps` is typed as `Element` from hast. Since we cast to `unknown` first and then to our local interface, this compiles without `any`.

---

## Task 5: Create TableOfContents.tsx

**Files:**
- Create: `src/components/vertical/TableOfContents.tsx`

`'use client'` — requires `useState`, `useEffect`, `useRef`, `IntersectionObserver`. Extracts H2 headings from raw markdown body, generates anchor slugs, tracks active heading via IntersectionObserver, renders sticky sidebar TOC with inline CTA.

- [ ] **Step 1: Create the file**

Create `src/components/vertical/TableOfContents.tsx`:

```tsx
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
                  borderLeft: `2px solid ${isActive ? 'var(--v-signal)' : 'color-mix(in srgb, var(--v-accent) 20%, transparent)'}`,
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
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: no errors.

---

## Task 6: Create MiniCalc.tsx

**Files:**
- Create: `src/components/vertical/MiniCalc.tsx`

`'use client'` — single slider per vertical, compact for sidebar. Renders nothing if vertical is unrecognised.

- [ ] **Step 1: Create the file**

Create `src/components/vertical/MiniCalc.tsx`:

```tsx
'use client'

import { useState } from 'react'

interface MiniCalcProps {
  vertical: string
}

function formatInr(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 10000000) return `Rs ${(rounded / 10000000).toFixed(2)} crore`
  if (rounded >= 100000) return `Rs ${(rounded / 100000).toFixed(2)} lakh`
  return `Rs ${rounded.toLocaleString('en-IN')}`
}

function RealEstateMiniCalc() {
  const [leads, setLeads] = useState(150)
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
        max={300}
        step={5}
        value={leads}
        onChange={(e) => setLeads(Number(e.target.value))}
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

function HealthcareMiniCalc() {
  const [appointments, setAppointments] = useState(60)
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
        max={150}
        step={5}
        value={appointments}
        onChange={(e) => setAppointments(Number(e.target.value))}
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

function AgribusinessMiniCalc() {
  const [workers, setWorkers] = useState(200)
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
        max={400}
        step={10}
        value={workers}
        onChange={(e) => setWorkers(Number(e.target.value))}
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

const CALC_MAP: Record<string, React.ComponentType> = {
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
        borderRadius: 'var(--border-radius-lg, 16px)',
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
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: no errors.

---

## Task 7: Create MidArticleCTA.tsx

**Files:**
- Create: `src/components/vertical/MidArticleCTA.tsx`

Server component (no `'use client'`). Full-width visual break that interrupts the prose at the midpoint.

- [ ] **Step 1: Create the file**

Create `src/components/vertical/MidArticleCTA.tsx`:

```tsx
import Link from 'next/link'

interface MidArticleCTAProps {
  verticalName: string
}

export default function MidArticleCTA({ verticalName }: MidArticleCTAProps) {
  return (
    <div
      className="relative my-12 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--v-fb)',
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        margin: '3rem -2rem',
        padding: '2.5rem 2rem',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'var(--v-signal)',
          borderRadius: '0 3px 3px 0',
        }}
      />

      <div className="max-w-[480px] mx-auto">
        <p
          className="text-[11px] uppercase tracking-widest font-semibold mb-3"
          style={{ color: 'var(--v-signal)' }}
        >
          The cost of doing nothing
        </p>
        <h3 className="text-[20px] font-bold text-white mb-2">
          Most businesses know the problem exists.
        </h3>
        <p className="text-[14px] mb-6" style={{ color: 'var(--v-muted)' }}>
          Very few quantify it. Start with a free 20-minute {verticalName} assessment
          and we will calculate the exact revenue impact for your operation.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
            Free. 20 minutes. No commitment.
          </span>
          <Link
            href="/assessment"
            className="text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ backgroundColor: 'var(--v-accent)' }}
          >
            Start Free Assessment →
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors.

---

## Task 8: Create RelatedGuides.tsx

**Files:**
- Create: `src/components/vertical/RelatedGuides.tsx`

Async server component. Fetches other published guides in the same vertical (excluding current). Renders up to 3 cards in a 3-column grid. Returns null if no related guides exist.

- [ ] **Step 1: Create the file**

Create `src/components/vertical/RelatedGuides.tsx`:

```tsx
import Link from 'next/link'
import { getRelatedGuides } from '@/lib/content'
import SectionTag from '@/components/vertical/SectionTag'

interface RelatedGuidesProps {
  vertical: string
  currentSlug: string
}

export default async function RelatedGuides({ vertical, currentSlug }: RelatedGuidesProps) {
  const guides = await getRelatedGuides(vertical, currentSlug)
  if (guides.length === 0) return null

  const verticalLabel = vertical
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <section
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        paddingTop: '3rem',
        marginTop: '3rem',
      }}
    >
      <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
        <h2 className="text-white text-[20px] font-bold">
          More from {verticalLabel} insights
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/${vertical}/insights/guides/${guide.slug}`}
            className="block rounded-2xl p-6 transition-opacity hover:opacity-85"
            style={{
              background: 'var(--v-fb)',
              border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
              borderTop: '2px solid var(--v-accent)',
            }}
          >
            <SectionTag label="Guide" />
            <p className="text-[16px] font-bold text-white mt-3 mb-2">{guide.title}</p>
            {guide.description && (
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--v-muted)' }}>
                {guide.description.length > 100
                  ? `${guide.description.slice(0, 100)}…`
                  : guide.description}
              </p>
            )}
            {guide.read_time != null && (
              <p className="text-[11px] mt-3" style={{ color: 'var(--v-accent)' }}>
                {guide.read_time} min read
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -30`
Expected: no errors.

---

## Task 9: Rebuild the guide page

**Files:**
- Modify: `src/app/[vertical]/insights/guides/[slug]/page.tsx`

This is the main assembly. Read the file in full before touching it. Keep `generateStaticParams` and `generateMetadata` with their existing logic; add two new JSON-LD blocks inside the page component. Completely replace the page body.

Key split logic: find the H2 heading whose character-position in the body string is closest to the midpoint, then split there.

Key imports to add (beyond what already exists):
- `ReactMarkdown` from `'react-markdown'`
- `remarkGfm` from `'remark-gfm'`
- `{ markdownComponents }` from `'@/components/vertical/markdown/MarkdownComponents'`
- `{ CalcEmbed }` from `'@/components/vertical/calculators/CalcEmbed'`
- `TableOfContents` from `'@/components/vertical/TableOfContents'`
- `MiniCalc` from `'@/components/vertical/MiniCalc'`
- `MidArticleCTA` from `'@/components/vertical/MidArticleCTA'`
- `RelatedGuides` from `'@/components/vertical/RelatedGuides'`

Remove the import of `ArticleLayout` (it's no longer used in this file).

- [ ] **Step 1: Read the current file fully**

Read `src/app/[vertical]/insights/guides/[slug]/page.tsx` lines 1-224 before making any changes.

- [ ] **Step 2: Write the complete replacement file**

Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getContentBySlug, getAllPublishedSlugsByVertical } from '@/lib/content'
import { isValidVertical, getVertical } from '@/lib/verticals'
import { CalcEmbed } from '@/components/vertical/calculators/CalcEmbed'
import SectionTag from '@/components/vertical/SectionTag'
import QuickAnswer from '@/components/vertical/QuickAnswer'
import ArticleStatRow from '@/components/vertical/ArticleStatRow'
import FAQSection from '@/components/vertical/FAQSection'
import RelatedSolutions from '@/components/vertical/RelatedSolutions'
import AssessmentCTA from '@/components/vertical/AssessmentCTA'
import TableOfContents from '@/components/vertical/TableOfContents'
import MiniCalc from '@/components/vertical/MiniCalc'
import MidArticleCTA from '@/components/vertical/MidArticleCTA'
import RelatedGuides from '@/components/vertical/RelatedGuides'
import { markdownComponents } from '@/components/vertical/markdown/MarkdownComponents'
import Link from 'next/link'

export const revalidate = 3600
export const dynamicParams = true

interface Params {
  vertical: string
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const verticals = ['real-estate', 'healthcare', 'agribusiness'] as const
    const results: Params[] = []
    for (const v of verticals) {
      const rows = await getAllPublishedSlugsByVertical(v)
      rows
        .filter((r) => r.content_type === 'guide')
        .forEach((r) => results.push({ vertical: v, slug: r.slug }))
    }
    return results
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { vertical: verticalSlug, slug } = await params
  if (!isValidVertical(verticalSlug)) return { title: 'Not Found' }
  const content = await getContentBySlug(slug)
  if (!content) return { title: 'Not Found' }
  return {
    title: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    alternates: {
      canonical: `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
    },
    openGraph: {
      title: content.seo_title ?? content.title,
      description: content.seo_description ?? content.description,
      url: `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`,
      type: 'article',
      publishedTime: content.published_at ?? undefined,
      modifiedTime: content.updated_at ?? undefined,
      authors: ['Deep Tanti'],
      images: [
        {
          url: 'https://clarivisintelligence.com/images/og-image.png',
          width: 1200,
          height: 630,
          alt: content.seo_title ?? content.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo_title ?? content.title,
      description: content.seo_description ?? content.description,
      images: ['https://clarivisintelligence.com/images/og-image.png'],
    },
  }
}

function extractH2Headings(body: string): Array<{ text: string; slug: string }> {
  return body
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '')
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      return { text, slug }
    })
}

function splitBodyAtMidpoint(body: string): [string, string] {
  const lines = body.split('\n')
  const midChar = body.length / 2

  let charCount = 0
  let bestSplitLine = -1
  let bestDist = Infinity

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      const dist = Math.abs(charCount - midChar)
      if (dist < bestDist) {
        bestDist = dist
        bestSplitLine = i
      }
    }
    charCount += lines[i].length + 1
  }

  if (bestSplitLine <= 0) return [body, '']

  const firstHalf = lines.slice(0, bestSplitLine).join('\n')
  const secondHalf = lines.slice(bestSplitLine).join('\n')
  return [firstHalf, secondHalf]
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { vertical: verticalSlug, slug } = await params
  if (!isValidVertical(verticalSlug)) notFound()

  const [content, vertical] = await Promise.all([
    getContentBySlug(slug),
    getVertical(verticalSlug),
  ])

  if (!content || content.content_type !== 'guide') notFound()
  if (content.vertical && content.vertical !== verticalSlug) notFound()

  const canonicalUrl = `https://clarivisintelligence.com/${verticalSlug}/insights/guides/${slug}`
  const verticalName = vertical?.name ?? verticalSlug

  const headings = extractH2Headings(content.body ?? '')
  const [bodyFirst, bodySecond] = splitBodyAtMidpoint(content.body ?? '')

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': canonicalUrl,
    headline: content.seo_title ?? content.title,
    description: content.seo_description ?? content.description,
    url: canonicalUrl,
    datePublished: content.published_at,
    dateModified: content.updated_at,
    author: {
      '@type': 'Person',
      '@id': 'https://clarivisintelligence.com/#founder',
      name: 'Deep Tanti',
      url: 'https://clarivisintelligence.com/about',
    },
    publisher: {
      '@id': 'https://clarivisintelligence.com/#organization',
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://clarivisintelligence.com/images/og-image.png',
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-IN',
    isPartOf: {
      '@id': 'https://clarivisintelligence.com/#website',
    },
  }

  const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.quick-answer', '.faq-answer'],
    },
    url: canonicalUrl,
  }

  const hasPartJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': canonicalUrl,
    hasPart: headings.map((h) => ({
      '@type': 'WebPageElement',
      name: h.text,
      url: `${canonicalUrl}#${h.slug}`,
    })),
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--v-fa)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hasPartJsonLd) }}
      />

      {/* SECTION 1 — Hero */}
      <section style={{ background: 'var(--v-fa)' }} className="pt-[140px] pb-12">
        <div className="max-w-[900px] mx-auto px-6">
          <SectionTag label={verticalName} />

          <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight mt-5 mb-5">
            {content.title}
          </h1>

          {/* Breadcrumb */}
          <nav
            className="flex flex-wrap items-center gap-2 text-[13px] mb-6"
            style={{ color: 'var(--v-muted)' }}
            aria-label="Breadcrumb"
          >
            <Link
              href={`/${verticalSlug}/insights`}
              className="transition-opacity hover:opacity-75"
              style={{ color: 'var(--v-accent)' }}
            >
              {verticalName} Insights
            </Link>
            <span>/</span>
            <span>Guide</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{content.title}</span>
          </nav>

          {/* Author + meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--v-accent)' }}
              >
                DT
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold">Deep Tanti</p>
                <p className="text-[12px]" style={{ color: 'var(--v-muted)' }}>
                  Founder, Clarivis Intelligence
                </p>
              </div>
            </div>
            {content.published_at && (
              <p className="text-[13px]" style={{ color: 'var(--v-muted)' }}>
                {new Date(content.published_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {content.read_time != null && (
                  <span> · {content.read_time} min read</span>
                )}
              </p>
            )}
          </div>

          {content.summary && <QuickAnswer summary={content.summary} />}
        </div>
      </section>

      {/* SECTION 2 — Calculator (before prose) */}
      <section style={{ background: 'var(--v-fb)' }} className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
            <h2 className="text-white text-[22px] font-bold">
              Calculate your cost right now
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'var(--v-muted)' }}>
              Enter your numbers and see the monthly impact before reading further.
            </p>
          </div>
          <CalcEmbed vertical={verticalSlug} />
        </div>
      </section>

      {/* SECTION 3 — Stat row (conditional) */}
      {content.stats && content.stats.length > 0 && (
        <section style={{ background: 'var(--v-fa)' }} className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto">
            <ArticleStatRow stats={content.stats} />
          </div>
        </section>
      )}

      {/* SECTION 4 — Two-column reading layout */}
      <section style={{ background: 'var(--v-fa)' }} className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex gap-12 items-start">
            {/* Left column — article body */}
            <div className="flex-1 min-w-0" style={{ maxWidth: '680px' }}>
              {/* First half of body */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {bodyFirst}
              </ReactMarkdown>

              {/* Mid-article CTA break */}
              {bodySecond && (
                <MidArticleCTA verticalName={verticalName} />
              )}

              {/* Second half of body */}
              {bodySecond && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {bodySecond}
                </ReactMarkdown>
              )}

              {/* FAQ section */}
              {content.faq && content.faq.length > 0 && (
                <FAQSection items={content.faq} articleUrl={canonicalUrl} />
              )}

              {/* Related solutions */}
              <RelatedSolutions vertical={verticalSlug} />

              {/* Related guides */}
              <RelatedGuides vertical={verticalSlug} currentSlug={slug} />
            </div>

            {/* Right column — sticky sidebar */}
            <aside className="w-[280px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-[120px] flex flex-col gap-6">
                <TableOfContents body={content.body ?? ''} title={content.title} />
                <MiniCalc vertical={verticalSlug} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Assessment CTA */}
      <AssessmentCTA verticalName={verticalName} />
    </main>
  )
}
```

- [ ] **Step 3: Verify TypeScript is clean**

Run: `npx tsc --noEmit 2>&1 | head -40`
Expected: zero errors. Common issues to watch:
- `remarkGfm` import — confirm `import remarkGfm from 'remark-gfm'` works (it's a default export in remark-gfm v4)
- `markdownComponents` type must satisfy `Components` from react-markdown

- [ ] **Step 4: Run build**

Run: `npm run build 2>&1 | tail -40`
Expected: zero errors, all `[vertical]/insights/guides/[slug]` routes compile.

---

## Task 10: Final verification

- [ ] **Step 1: Full TypeScript check**

Run: `npx tsc --noEmit 2>&1`
Expected: clean exit, zero errors.

- [ ] **Step 2: Build**

Run: `npm run build 2>&1 | tail -60`
Expected: clean build, no errors on guide routes.

- [ ] **Step 3: Verify ArticleLayout is untouched**

Run: `git diff src/components/content/ArticleLayout.tsx`
Expected: no diff (file must be unchanged, still used by glossary, article, and faq routes).

- [ ] **Step 4: Check all new files exist**

Run: `ls src/components/vertical/markdown/ src/components/vertical/TableOfContents.tsx src/components/vertical/MiniCalc.tsx src/components/vertical/MidArticleCTA.tsx src/components/vertical/RelatedGuides.tsx`
Expected: all 5 paths resolve.

- [ ] **Step 5: Verify JSON-LD blocks**

Run: `grep -c "application/ld+json" src/app/\\[vertical\\]/insights/guides/\\[slug\\]/page.tsx`
Expected: 3 (articleJsonLd, speakableJsonLd, hasPartJsonLd).

- [ ] **Step 6: Verify no hardcoded colors**

Run: `grep -n "#0F6E56\|#1A1A2E\|forest\|#251A09" src/components/vertical/TableOfContents.tsx src/components/vertical/MiniCalc.tsx src/components/vertical/MidArticleCTA.tsx src/components/vertical/RelatedGuides.tsx src/components/vertical/markdown/MarkdownComponents.tsx`
Expected: no output (zero hardcoded vertical colors; all use CSS variables).

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Two-column layout with sticky sidebar | Task 9 (Section 4) |
| Auto-generated TOC from H2 headings | Task 5 (TableOfContents) |
| Calculator before prose body | Task 9 (Section 2) |
| Blockquote callouts | Task 4 (MarkdownComponents blockquote) |
| Before/After tables | Task 4 (MarkdownComponents table) |
| Pull quotes (strong highlight) | Task 4 (MarkdownComponents strong) |
| Mid-article CTA break | Tasks 7 + 9 |
| Speakable schema | Task 9 (speakableJsonLd) |
| Article hasPart schema | Task 9 (hasPartJsonLd) |
| quick-answer CSS class | Task 2 |
| faq-answer CSS class | Task 3 |
| Related solutions as visual break | Existing RelatedSolutions component, used in Task 9 |
| "What to read next" / related guides | Tasks 1 + 8 + 9 |
| All colors via CSS variables | Tasks 4, 5, 6, 7, 8 (verified in Task 10 Step 6) |
| ArticleLayout untouched | Task 7 (read routes first; confirmed not modified) |
| getRelatedGuides in content.ts | Task 1 |
| npx tsc --noEmit + npm run build pass | Task 10 |

**No placeholders detected.** Every step has complete code.

**Type consistency check:**
- `ContentGuideSummary` defined in Task 1, used in `getRelatedGuides` return type and in `RelatedGuides.tsx` Task 8.
- `generateSlug` function defined independently in both `MarkdownComponents.tsx` (Task 4) and `TableOfContents.tsx` (Task 5) — these are co-located utility functions, intentionally duplicated rather than shared (YAGNI: no shared utility file needed for a two-line function).
- `markdownComponents` exported from `MarkdownComponents.tsx` as `Components` type, imported in guide page as `{ markdownComponents }`.

---

*Plan saved. Execute with superpowers:executing-plans or superpowers:subagent-driven-development.*
