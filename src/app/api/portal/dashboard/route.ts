import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const auth = request.cookies.get('portal_auth')
  if (auth?.value !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString()

    const [
      { count: totalLeads },
      { count: monthLeads },
      { count: weekAssessments },
      { count: totalClients },
      { count: completedAssessments },
      { data: recentLeads },
      { data: recentAssessments },
      { data: pipelineData },
      { data: activityFeed }
    ] = await Promise.all([
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      supabaseAdmin.from('assessments').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek).eq('completed', true),
      supabaseAdmin.from('clients').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('assessments').select('*', { count: 'exact', head: true }).eq('completed', true),
      supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('assessments').select('*').order('created_at', { ascending: false }).limit(10),
      supabaseAdmin.from('leads').select('stage').order('created_at', { ascending: false }),
      supabaseAdmin.from('assessments').select('name, company, industry, created_at, completed').order('created_at', { ascending: false }).limit(20)
    ])

    const stageCounts = {
      'New': 0, 'Contacted': 0, 'Assessment Sent': 0,
      'Call Scheduled': 0, 'Call Done': 0, 'Proposal Sent': 0,
      'Converted': 0, 'Lost': 0
    }
    pipelineData?.forEach((lead: {stage: string}) => {
      if (lead.stage in stageCounts) stageCounts[lead.stage as keyof typeof stageCounts]++
    })

    const totalAssessments = recentAssessments?.length || 0
    const completionRate = totalLeads && totalLeads > 0 
      ? Math.round(((completedAssessments || 0) / totalLeads) * 100) 
      : 0

    return NextResponse.json({
      metrics: {
        totalLeads: totalLeads || 0,
        monthLeads: monthLeads || 0,
        weekAssessments: weekAssessments || 0,
        totalClients: totalClients || 0,
        completionRate,
        totalAssessments: completedAssessments || 0
      },
      pipeline: Object.entries(stageCounts).map(([stage, count]) => ({ stage, count })),
      recentLeads: recentLeads || [],
      activityFeed: activityFeed || []
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
