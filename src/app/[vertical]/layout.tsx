import { notFound } from 'next/navigation'
import { isValidVertical, getVertical } from '@/lib/verticals'

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

  return (
    <div
      style={{ '--vertical-accent': vertical.accent_color ?? '#0F6E56' } as React.CSSProperties}
      className="min-h-screen bg-[#0A0F1A]"
    >
      {children}
    </div>
  )
}
