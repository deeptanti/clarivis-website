import { notFound } from 'next/navigation'
import { isValidVertical, getVertical } from '@/lib/verticals'

const colorTokens: Record<string, Record<string, string>> = {
  'real-estate': {
    '--v-fa':     '#1A1A2E',
    '--v-fb':     '#0A0F1A',
    '--v-accent': '#0D5C45',
    '--v-signal': '#C89B3C',
    '--v-muted':  '#D1D5DB',
  },
  'healthcare': {
    '--v-fa':     '#0A1120',
    '--v-fb':     '#111827',
    '--v-accent': '#185FA5',
    '--v-signal': '#7AB3D6',
    '--v-muted':  '#CBD5E1',
  },
  'agribusiness': {
    '--v-fa':     '#1C1208',
    '--v-fb':     '#111827',
    '--v-accent': '#BA7517',
    '--v-signal': '#EF9F27',
    '--v-muted':  '#D6C4A8',
  },
}

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

  const tokens = colorTokens[verticalSlug] ?? colorTokens['real-estate']

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
