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
      .replace(/\{\{timeSelected\}\}/g, String(timeSelected))
      .replace(/\{\{maxTurns\}\}/g, String(maxTurns))
      + `\n\nCurrent exchange: ${turnCount + 1} of ${maxTurns}.${isLastTurn ? ' THIS IS THE FINAL EXCHANGE. Summarise the top 2-3 AI opportunities identified and tell them their report is being generated.' : ''}`

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
        messages: messages.length > 0 ? messages : [{ role: 'user', content: 'Please begin the assessment.' }]
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

    await supabaseAdmin.from('prompt_performance').insert([{
      prompt_version_id: activePrompt.id,
      total_turns: turnCount + 1,
      completed: isLastTurn
    }])

    return NextResponse.json({
      response: result.content[0].text,
      isLastTurn,
      modelUsed: activeModel.name,
      promptVersion: activePrompt.version_number
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      response: 'I apologise for the interruption. Your report will be generated from our conversation so far.',
      isLastTurn: false
    })
  }
}
