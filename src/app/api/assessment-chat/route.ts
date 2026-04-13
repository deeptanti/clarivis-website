import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { messages, userProfile, timeSelected, maxTurns } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        response: 'Thank you for completing the assessment. Your AI Opportunity Snapshot will be sent to your email shortly.',
        isLastTurn: true
      })
    }

    const [{ data: activeModel }, { data: activePrompt }] = await Promise.all([
      supabaseAdmin.from('models').select('*').eq('is_active', true).single(),
      supabaseAdmin.from('prompt_versions').select('*').eq('is_active', true).single()
    ])

    if (!activeModel || !activePrompt) {
      return NextResponse.json({
        response: 'Assessment configuration not found. Please contact hello@clarivisintelligence.com.',
        isLastTurn: true
      })
    }

    const turnCount = Math.floor(messages.length / 2)
    const isLastTurn = turnCount >= maxTurns - 1

    const systemPrompt = activePrompt.system_prompt
      .replace(/\{\{name\}\}/g, userProfile.name || '')
      .replace(/\{\{company\}\}/g, userProfile.company || 'their company')
      .replace(/\{\{industry\}\}/g, userProfile.industry || '')
      .replace(/\{\{teamSize\}\}/g, userProfile.teamSize || 'not specified')
      .replace(/\{\{mainChallenge\}\}/g, userProfile.mainChallenge || '')
      .replace(/\{\{tools\}\}/g, Array.isArray(userProfile.tools) ? userProfile.tools.join(', ') : (userProfile.tools || 'not specified'))
      .replace(/\{\{aiExperience\}\}/g, userProfile.aiExperience || 'not specified')
      .replace(/\{\{successDefinition\}\}/g, userProfile.successDefinition || 'not provided')
      .replace(/\{\{timeSelected\}\}/g, String(timeSelected))
      .replace(/\{\{maxTurns\}\}/g, String(maxTurns))
      + `\n\nCurrent exchange: ${turnCount + 1} of ${maxTurns}.${isLastTurn ? ' THIS IS THE FINAL EXCHANGE. Summarise the top 2-3 AI opportunities identified and tell them their report is being generated.' : ''}`

    // For the opening message, give Claude a rich context signal rather than
    // the generic "Please begin the assessment." fallback. This produces a
    // personalised greeting that references the user's name and industry.
    const messagesToSend = messages.length > 0
      ? messages
      : [{
          role: 'user',
          content: `Please begin the assessment for ${userProfile.name || 'this user'} who works in ${userProfile.industry || 'their industry'} at ${userProfile.company || 'their company'} with a team of ${userProfile.teamSize || 'unspecified size'}. Their main challenge: "${userProfile.mainChallenge || 'not yet provided'}". Greet them warmly by first name and ask your first discovery question.`
        }]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: activeModel.model_string,
        max_tokens: activeModel.max_tokens,
        system: systemPrompt,
        messages: messagesToSend
      })
    })

    const result = await response.json()

    if (result.error) {
      console.error('Anthropic API error:', result.error)
      return NextResponse.json({
        response: 'I apologise for the interruption. Please continue and our team will follow up.',
        isLastTurn: false
      })
    }

    // NOTE: We do NOT write to prompt_performance here.
    // That write happens once, at the end, in log-conversation/route.ts.
    // Writing here on every turn was producing inflated and duplicate records.

    return NextResponse.json({
      response: result.content[0].text,
      isLastTurn,
      logData: {
        model: activeModel.model_string,
        systemPromptVersion: activePrompt.version_number,
        promptVersionId: activePrompt.id,
        modelId: activeModel.id,
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      response: 'I apologise for the interruption. Your report will be generated from our conversation so far.',
      isLastTurn: false
    })
  }
}
