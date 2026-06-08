'use client'

import { usePathname } from 'next/navigation'
import { getVerticalColors } from '@/lib/vertical-colors'

export function VerticalThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const colors = getVerticalColors(pathname)

  return (
    <div style={colors as React.CSSProperties} className="flex flex-col min-h-full">
      {children}
    </div>
  )
}
