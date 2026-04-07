import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data } = await supabaseAdmin.from('models').select('*').order('created_at')
  return NextResponse.json({ models: data || [] })
}

export async function POST(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { data, error } = await supabaseAdmin.from('models').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ model: data })
}

export async function PATCH(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { id, ...updates } = body
  if (updates.is_active) {
    await supabaseAdmin.from('models').update({ is_active: false }).neq('id', id)
  }
  const { data, error } = await supabaseAdmin.from('models').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ model: data })
}
