import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const isEarlyCapture = !data.industry

    if (isEarlyCapture) {
      console.log('=== EARLY CONTACT CAPTURE ===')
      console.log('Name:', data.name)
      console.log('Email:', data.email)
      console.log('Phone:', data.phone)
      console.log('Time Selected:', data.timeSelected, 'minutes')
      console.log('Captured at:', new Date().toISOString())
      console.log('=============================')
    } else {
      console.log('=== FULL ASSESSMENT SUBMISSION ===')
      console.log('Name:', data.name)
      console.log('Email:', data.email)
      console.log('Phone:', data.phone)
      console.log('Industry:', data.industry)
      console.log('Company:', data.company)
      console.log('Team Size:', data.teamSize)
      console.log('Main Challenge:', data.mainChallenge)
      console.log('Time Selected:', data.timeSelected, 'minutes')
      console.log('Submitted at:', new Date().toISOString())
      console.log('==================================')
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Assessment submission error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
