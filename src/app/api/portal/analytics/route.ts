import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [
      { data: assessments },
      { data: conversations },
      { data: events },
      { data: promptPerformance }
    ] = await Promise.all([
      supabaseAdmin.from('assessments').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('conversations').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('events').select('*').order('created_at', { ascending: false }).limit(1000),
      supabaseAdmin.from('prompt_performance').select('*, prompt_versions(version_number, name)').order('created_at', { ascending: false })
    ])

    const totalAssessments = assessments?.length || 0
    const completedAssessments = assessments?.filter(a => a.completed)?.length || 0
    const completionRate = totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0
    const avgTurns = conversations && conversations.length > 0
      ? Math.round(conversations.reduce((sum: number, c: any) => sum + (c.total_turns || 0), 0) / conversations.length)
      : 0

    const industrySplit = assessments?.reduce((acc: any, a: any) => {
      if (a.industry) acc[a.industry] = (acc[a.industry] || 0) + 1
      return acc
    }, {}) || {}

    const timeSplit = assessments?.reduce((acc: any, a: any) => {
      if (a.time_selected) {
        const key = `${a.time_selected} min`
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    }, {}) || {}

    const sessionsOverTime = assessments?.reduce((acc: any, a: any) => {
      const date = new Date(a.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {}) || {}

    const phaseFunnel = events?.reduce((acc: any, e: any) => {
      if (e.phase && e.event_type === 'session_end') {
        acc[e.phase] = (acc[e.phase] || 0) + 1
      }
      return acc
    }, {}) || {}

    const challenges = assessments
      ?.filter(a => a.main_challenge)
      ?.map(a => ({ challenge: a.main_challenge, company: a.company, industry: a.industry, date: a.created_at }))
      ?.slice(0, 20) || []

    const promptStats = promptPerformance?.reduce((acc: any, p: any) => {
      const key = p.prompt_versions?.version_number || 'unknown'
      if (!acc[key]) acc[key] = { version: key, name: p.prompt_versions?.name, uses: 0, totalTurns: 0, completed: 0 }
      acc[key].uses++
      acc[key].totalTurns += p.total_turns || 0
      if (p.completed) acc[key].completed++
      return acc
    }, {}) || {}

    return NextResponse.json({
      metrics: { totalAssessments, completedAssessments, completionRate, avgTurns },
      industrySplit: Object.entries(industrySplit).map(([name, value]) => ({ name, value })),
      timeSplit: Object.entries(timeSplit).map(([name, value]) => ({ name, value })),
      sessionsOverTime: Object.entries(sessionsOverTime).slice(-14).map(([date, count]) => ({ date, count })),
      phaseFunnel: Object.entries(phaseFunnel).map(([phase, count]) => ({ phase, count })),
      challenges,
      promptStats: Object.values(promptStats)
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
