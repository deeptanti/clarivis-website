import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userProfile, conversationHistory, model, systemPromptVersion, timeSelected, completedAt } = await request.json()

    const logEntry = {
      timestamp: completedAt || new Date().toISOString(),
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      company: userProfile.company || '',
      industry: userProfile.industry,
      teamSize: userProfile.teamSize || '',
      timeSelected: timeSelected,
      mainChallenge: userProfile.mainChallenge || '',
      model: model,
      systemPromptVersion: systemPromptVersion,
      totalTurns: Math.floor(conversationHistory.length / 2),
      fullTranscript: conversationHistory
        .map((m: {role: string, content: string}) =>
          `[${m.role.toUpperCase()}]: ${m.content}`
        ).join('\n\n'),
      conversationHistory: JSON.stringify(conversationHistory)
    }

    // Log to console for Vercel logs
    console.log('=== CONVERSATION LOG ===')
    console.log('User:', logEntry.name, '|', logEntry.email)
    console.log('Company:', logEntry.company, '|', logEntry.industry)
    console.log('Time selected:', logEntry.timeSelected, 'minutes')
    console.log('Total turns:', logEntry.totalTurns)
    console.log('Model:', logEntry.model)
    console.log('System prompt version:', logEntry.systemPromptVersion)
    console.log('Transcript:')
    console.log(logEntry.fullTranscript)
    console.log('=======================')

    // TODO: Add Google Sheets logging here when sheets integration is ready
    // The logEntry object has all fields needed for a spreadsheet row

    return NextResponse.json({ success: true, logged: true })

  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
