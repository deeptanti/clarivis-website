import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      userProfile,
      conversationHistory,
      model,
      systemPromptVersion,
      timeSelected,
      completedAt,
      assessmentId,
      // Richer IDs now passed from the client via logData
      promptVersionId,
      modelId,
    } = await request.json()

    const transcript = conversationHistory
      .map((m: { role: string, content: string }) => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n\n')

    const totalTurns = Math.floor(conversationHistory.length / 2)

    // If the client passed IDs directly, use them; otherwise look them up
    let resolvedPromptVersionId = promptVersionId || null
    let resolvedModelId = modelId || null

    if (!resolvedPromptVersionId || !resolvedModelId) {
      const [{ data: activePrompt }, { data: activeModel }] = await Promise.all([
        supabaseAdmin.from('prompt_versions').select('id, version_number').eq('is_active', true).single(),
        supabaseAdmin.from('models').select('id').eq('is_active', true).single()
      ])
      resolvedPromptVersionId = resolvedPromptVersionId || activePrompt?.id || null
      resolvedModelId = resolvedModelId || activeModel?.id || null
    }

    // Log the conversation transcript
    await supabaseAdmin.from('conversations').insert([{
      assessment_id: assessmentId || null,
      model_id: resolvedModelId,
      prompt_version_id: resolvedPromptVersionId,
      total_turns: totalTurns,
      completed: true,
      completed_at: completedAt || new Date().toISOString(),
      transcript,
      raw_messages: conversationHistory
    }])

    // Write prompt_performance exactly once per completed assessment
    if (resolvedPromptVersionId) {
      await supabaseAdmin.from('prompt_performance').insert([{
        prompt_version_id: resolvedPromptVersionId,
        total_turns: totalTurns,
        completed: true
      }])
    }

    console.log('Conversation logged to Supabase for:', userProfile?.name)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
