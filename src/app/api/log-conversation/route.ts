import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, conversationHistory, model, systemPromptVersion, timeSelected, completedAt } = await request.json()

    const transcript = conversationHistory
      .map((m: {role: string, content: string}) =>
        `[${m.role.toUpperCase()}]: ${m.content}`
      ).join('\n\n')

    const row = [
      completedAt || new Date().toISOString(),
      userProfile.name || '',
      userProfile.email || '',
      userProfile.phone || '',
      userProfile.company || '',
      userProfile.industry || '',
      userProfile.teamSize || '',
      `${timeSelected} minutes`,
      Math.floor(conversationHistory.length / 2).toString(),
      model || 'claude-sonnet-4-20250514',
      systemPromptVersion || '1.0',
      userProfile.mainChallenge || '',
      transcript
    ]

    console.log('Logging conversation for:', userProfile.name, userProfile.email)

    if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const sheets = await getSheets()
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'Sheet1!A:M',
        valueInputOption: 'RAW',
        requestBody: { values: [row] }
      })
      console.log('Successfully logged to Google Sheets')
    } else {
      console.log('Google Sheets not configured. Row data:', JSON.stringify(row))
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
