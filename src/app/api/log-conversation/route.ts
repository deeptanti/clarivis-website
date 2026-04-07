import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userProfile, conversationHistory, model, systemPromptVersion, timeSelected, completedAt, assessmentId } = await request.json()

    const transcript = conversationHistory
      .map((m: {role: string, content: string}) => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n\n')

    const { data: activePrompt } = await supabaseAdmin
      .from('prompt_versions')
      .select('id, version_number')
      .eq('is_active', true)
      .single()

    const { data: activeModel } = await supabaseAdmin
      .from('models')
      .select('id')
      .eq('is_active', true)
      .single()

    await supabaseAdmin.from('conversations').insert([{
      assessment_id: assessmentId || null,
      model_id: activeModel?.id || null,
      prompt_version_id: activePrompt?.id || null,
      total_turns: Math.floor(conversationHistory.length / 2),
      completed: true,
      completed_at: completedAt || new Date().toISOString(),
      transcript,
      raw_messages: conversationHistory
    }])

    if (activePrompt?.id) {
      await supabaseAdmin.from('prompt_performance').insert([{
        prompt_version_id: activePrompt.id,
        total_turns: Math.floor(conversationHistory.length / 2),
        completed: true
      }])
    }

    console.log('Conversation logged to Supabase for:', userProfile.name)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
