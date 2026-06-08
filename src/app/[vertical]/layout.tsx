import { notFound } from 'next/navigation'
import { isValidVertical, getVertical } from '@/lib/verticals'
import { VERTICAL_COLORS } from '@/lib/vertical-colors'

export default async function VerticalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ vertical: string }>
}) {
  const { vertical: verticalSlug } = await params
  if (!isValidVertical(verticalSlug)) notFound()
  const vertical = await getVertical(verticalSlug)
  if (!vertical) notFound()

  const tokens = VERTICAL_COLORS[verticalSlug] ?? {}

  return (
    <div
      style={tokens as React.CSSProperties}
      className="min-h-screen"
      // background via inline style so it picks up the CSS var
    >
      <div style={{ backgroundColor: 'var(--v-fa)' }} className="min-h-screen">
        {children}
      </div>
    </div>
  )
}
