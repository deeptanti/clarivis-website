import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

/* ─── Config ─────────────────────────────────────────────────────────────── */

const VISIT_SHEET = 'Visit Tracking'

const HEADERS = [
  'Visit ID',
  'Timestamp',
  'Session Start',
  'Event',
  'Phase',
  'Screen Detail',
  'Step Number',
  'Step Type',
  'Time on Screen (s)',
  'Contact Name',
  'Contact Email',
  'Contact Phone',
  'Industry',
  'Company',
  'Time Selected (min)',
  'Chat Turns',
  'Referrer',
  'Page URL',
]

/* ─── Google Sheets Auth ─────────────────────────────────────────────────── */

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key:  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

/* ─── Auto-create sheet tab with headers ────────────────────────────────── */

// Warm-start flag — avoids the existence check on every event (after first cold start)
let tabReady = false

async function ensureVisitTab(
  sheets:         ReturnType<typeof google.sheets>,
  spreadsheetId:  string
): Promise<void> {
  if (tabReady) return

  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const exists = meta.data.sheets?.some(
    s => s.properties?.title === VISIT_SHEET
  )

  if (!exists) {
    // Create the tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: VISIT_SHEET } } }],
      },
    })
    // Write header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:            `'${VISIT_SHEET}'!A1`,
      valueInputOption: 'RAW',
      requestBody:      { values: [HEADERS] },
    })
  }

  tabReady = true
}

/* ─── Route Handler ──────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      visitId,
      timestamp,
      sessionStart,
      event,
      phase,
      screenDetail,
      stepNumber,
      stepType,
      timeOnScreenSeconds,
      name,
      email,
      phone,
      industry,
      company,
      timeSelected,
      chatTurns,
      referrer,
      pageUrl,
    } = body

    const row = [
      visitId             ?? '',
      timestamp           ?? new Date().toISOString(),
      sessionStart        ?? '',
      event               ?? '',
      phase               ?? '',
      screenDetail        ?? '',
      stepNumber          ?? '',
      stepType            ?? '',
      timeOnScreenSeconds ?? '',
      name                ?? '',
      email               ?? '',
      phone               ?? '',
      industry            ?? '',
      company             ?? '',
      timeSelected        ?? '',
      chatTurns           ?? '',
      referrer            ?? '',
      pageUrl             ?? '',
    ]

    const { GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env

    if (GOOGLE_SHEETS_ID && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY) {
      const sheets = await getSheets()
      await ensureVisitTab(sheets, GOOGLE_SHEETS_ID)
      await sheets.spreadsheets.values.append({
        spreadsheetId:   GOOGLE_SHEETS_ID,
        range:           `'${VISIT_SHEET}'!A:R`,
        valueInputOption: 'RAW',
        requestBody:     { values: [row] },
      })
    } else {
      // Local dev — log to console instead
      console.log('[track-visit]', event, { visitId, screenDetail, timeOnScreenSeconds })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    // Never block the client for a tracking failure
    console.error('[track-visit] error:', error)
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
