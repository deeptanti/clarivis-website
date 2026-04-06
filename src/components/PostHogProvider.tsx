'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/assessment') || pathname?.startsWith('/portal')) return
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true
      },
      persistence: 'localStorage'
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
