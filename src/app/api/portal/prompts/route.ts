import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const url = new URL(request.url)
  const channel = url.searchParams.get('channel') || 'assessment'
  
  const { data } = await supabaseAdmin.from('prompt_versions').select('*').eq('channel', channel).order('version_number', { ascending: false })
  return NextResponse.json({ prompts: data || [] })
}

export async function POST(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { data: latest } = await supabaseAdmin.from('prompt_versions').select('version_number').eq('channel', body.channel || 'assessment').order('version_number', { ascending: false }).limit(1).single()
  const nextVersion = (latest?.version_number || 0) + 1
  if (body.is_active) {
    await supabaseAdmin.from('prompt_versions').update({ is_active: false }).eq('channel', body.channel || 'assessment').neq('id', 'none')
  }
  const { data, error } = await supabaseAdmin.from('prompt_versions').insert([{ ...body, version_number: nextVersion }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prompt: data })
}

export async function PATCH(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { id, channel, ...updates } = body
  if (updates.is_active && channel) {
    await supabaseAdmin.from('prompt_versions').update({ is_active: false }).eq('channel', channel).neq('id', id)
  }
  const { data, error } = await supabaseAdmin.from('prompt_versions').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prompt: data })
}
