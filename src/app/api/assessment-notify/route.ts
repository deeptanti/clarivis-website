import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log('=== NEW CLARIVIS ASSESSMENT SUBMISSION ===')
    console.log('Name:', data.name)
    console.log('Email:', data.email)
    console.log('Phone:', data.phone)
    console.log('Industry:', data.industry)
    console.log('Company:', data.company)
    console.log('Team Size:', data.teamSize)
    console.log('Main Challenge:', data.mainChallenge)
    console.log('Time Selected:', data.timeSelected, 'minutes')
    console.log('Submitted at:', new Date().toISOString())
    console.log('==========================================')

    // TODO: Add Resend email notification when RESEND_API_KEY is configured
    // TODO: Add Google Sheets logging when sheets integration is set up
    // TODO: Add Claude API call to generate AI Opportunity Snapshot

    return NextResponse.json({
      success: true,
      message: 'Assessment received successfully'
    })

  } catch (error) {
    console.error('Assessment submission error:', error)
    return NextResponse.json({
      error: 'Failed to process submission'
    }, { status: 500 })
  }
}
