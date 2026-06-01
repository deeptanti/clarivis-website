/**
 * Clarivis Intelligence — Visit & Funnel Tracker
 * Generates a unique visit ID per session and fires lightweight events
 * to /api/track-visit on every phase/step transition.
 */

import { GA4_EVENTS, GA4EventPayload } from './ga4-events'

const VISIT_ID_KEY   = 'cv_visit_id'
const SESSION_START  = 'cv_session_start'
const SCREEN_ENTRY   = 'cv_screen_entry'
const LAST_SCREEN    = 'cv_last_screen'

// ─── ID Generation ─────────────────────────────────────────────────────────

function generateId(): string {
  const ts   = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `${ts}-${rand}`
}

export function getOrCreateVisitId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem(VISIT_ID_KEY)
  if (!id) {
    id = generateId()
    const now = new Date().toISOString()
    sessionStorage.setItem(VISIT_ID_KEY, id)
    sessionStorage.setItem(SESSION_START, now)
    sessionStorage.setItem(SCREEN_ENTRY, Date.now().toString())
  }
  return id
}

// ─── Screen Timer ───────────────────────────────────────────────────────────

/** Call this when the user lands on a new screen to start timing. */
export function markScreenEntry(): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SCREEN_ENTRY, Date.now().toString())
}

function getTimeOnCurrentScreen(): number {
  if (typeof window === 'undefined') return 0
  const entry = parseInt(sessionStorage.getItem(SCREEN_ENTRY) || '0', 10)
  if (!entry) return 0
  return Math.round((Date.now() - entry) / 1000)
}

// ─── Core Event Sender ──────────────────────────────────────────────────────

export interface TrackPayload {
  phase?:              number
  screenDetail?:       string
  stepNumber?:         number
  stepType?:           string
  timeValue?:          number | null   // time selected in Phase 2
  chatTurns?:          number
  name?:               string
  email?:              string
  phone?:              string
  industry?:           string
  company?:            string
  timeSelected?:       number | null
  [key: string]:       unknown
}

export function trackEvent(event: string, data: TrackPayload = {}): void {
  if (typeof window === 'undefined') return

  const visitId      = getOrCreateVisitId()
  const sessionStart = sessionStorage.getItem(SESSION_START) || ''
  const timeOnScreen = getTimeOnCurrentScreen()

  // Record last known screen for dropoff tracking
  if (data.screenDetail) {
    sessionStorage.setItem(LAST_SCREEN, data.screenDetail)
  }

  // Reset timer for the next screen
  markScreenEntry()

  // Map legacy event names to GA4 names
  let ga4EventName = event
  if (event === 'p1_start_clicked') ga4EventName = GA4_EVENTS.ASSESSMENT_STARTED
  else if (event.startsWith('p') && event.includes('_step_entered'))
    ga4EventName = GA4_EVENTS.ASSESSMENT_PHASE_PROGRESSED
  else if (event === 'assessment_completed')
    ga4EventName = GA4_EVENTS.ASSESSMENT_COMPLETED
  else if (event === 'contact_form_submitted')
    ga4EventName = GA4_EVENTS.CONTACT_FORM_SUBMITTED

  // Filter out null values from data to comply with GA4EventPayload type
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
  )

  const payload: GA4EventPayload = {
    visitId,
    sessionStart,
    event: ga4EventName,
    timestamp:          new Date().toISOString(),
    timeOnScreenSeconds: timeOnScreen,
    referrer:           document.referrer || '',
    pageUrl:            window.location.pathname,
    ...cleanData,
  }

  // Fire and forget — never blocks the UI
  fetch('/api/track-visit', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  }).catch(() => {})
}

// ─── Dropoff / Session-End Tracking ─────────────────────────────────────────

/**
 * Registers visibilitychange + pagehide listeners so we capture
 * the last screen the user was on when they left.
 *
 * @param getScreenLabel — lazily returns the current screen label
 * @returns cleanup function for useEffect
 */
export function setupDropoffTracking(getScreenLabel: () => string): () => void {
  if (typeof window === 'undefined') return () => {}

  const sendDropoff = () => {
    const visitId = sessionStorage.getItem(VISIT_ID_KEY)
    if (!visitId) return

    const lastScreen = getScreenLabel() ||
                       sessionStorage.getItem(LAST_SCREEN) ||
                       'Unknown'

    const payload = JSON.stringify({
      visitId,
      sessionStart:        sessionStorage.getItem(SESSION_START) || '',
      event:               'session_end',
      timestamp:           new Date().toISOString(),
      timeOnScreenSeconds: getTimeOnCurrentScreen(),
      screenDetail:        lastScreen,
      pageUrl:             window.location.pathname,
      referrer:            document.referrer || '',
    })

    // sendBeacon is reliable even when the page is unloading
    navigator.sendBeacon(
      '/api/track-visit',
      new Blob([payload], { type: 'application/json' })
    )
  }

  const onVisibility = () => {
    if (document.visibilityState === 'hidden') sendDropoff()
  }
  const onPageHide = () => sendDropoff()

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)

  return () => {
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pagehide', onPageHide)
  }
}
