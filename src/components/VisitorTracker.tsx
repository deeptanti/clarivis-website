'use client'

/**
 * VisitorTracker — mounted in the root layout so every page load
 * fires a lightweight page_view event to the Visit Tracking sheet.
 * Initialises the session visit ID on first touch.
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getOrCreateVisitId, trackEvent } from '@/lib/tracker'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Ensures the visit ID exists from the very first page load
    getOrCreateVisitId()

    trackEvent('page_view', {
      phase:        0,
      screenDetail: `Page: ${pathname}`,
      pageUrl:      pathname,
    })
  // We intentionally only track the initial mount for each page navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
