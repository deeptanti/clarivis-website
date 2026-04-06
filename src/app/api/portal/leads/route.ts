import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get('stage')
  const industry = searchParams.get('industry')
  const search = searchParams.get('search')

  let query = supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false })

  if (stage && stage !== 'all') query = query.eq('stage', stage)
  if (industry && industry !== 'all') query = query.eq('industry', industry)
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data || [] })
}

export async function POST(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { data, error } = await supabaseAdmin.from('leads').insert([body]).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lead: data })
}

export async function PATCH(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body
  const { data, error } = await supabaseAdmin.from('leads').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lead: data })
}
