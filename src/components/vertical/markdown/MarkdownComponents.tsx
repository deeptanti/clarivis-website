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
          <div
            style={{
              background: 'var(--v-fb)',
              borderRight: '1px solid color-mix(in srgb, var(--v-accent) 15%, transparent)',
            }}
            className="px-5 py-3 flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-400 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wider text-red-400">
              Before
            </span>
          </div>
          <div
            style={{ background: 'var(--v-fb)' }}
            className="px-5 py-3 flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-green-400 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-wider text-green-400">
              After
            </span>
          </div>
        </div>
        {rows.map((row, i) => {
          const cells =
            row.children?.filter((c) => c.tagName === 'td' || c.tagName === 'th') ?? []
          const beforeText =
            cells[0]?.children?.find((c) => c.type === 'text')?.value ?? ''
          const afterText =
            cells[1]?.children?.find((c) => c.type === 'text')?.value ?? ''
          return (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{
                borderTop:
                  '1px solid color-mix(in srgb, var(--v-accent) 10%, transparent)',
              }}
            >
              <div
                className="px-5 py-3 text-[14px]"
                style={{
                  color: 'var(--v-muted)',
                  borderRight:
                    '1px solid color-mix(in srgb, var(--v-accent) 15%, transparent)',
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

  // Suppress default rendering — before/after table handles its own children via AST
  thead() {
    return null
  },
  tbody() {
    return null
  },
  tr() {
    return null
  },
  th() {
    return null
  },
  td() {
    return null
  },

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
