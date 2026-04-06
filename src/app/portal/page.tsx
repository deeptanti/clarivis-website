'use client'

import { useEffect, useState } from 'react'
import { Users, BarChart2, Briefcase, TrendingUp, Activity, AlertCircle, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STAGE_COLORS: Record<string, string> = {
  'New': '#6B7280',
  'Contacted': '#3B82F6',
  'Assessment Sent': '#8B5CF6',
  'Call Scheduled': '#F59E0B',
  'Call Done': '#EAB308',
  'Proposal Sent': '#EC4899',
  'Converted': '#0F6E56',
  'Lost': '#EF4444'
}

function MetricCard({ title, value, subtitle, icon: Icon, color = '#0F6E56' }: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color?: string
}) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <div className="p-2 rounded-xl" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}

export default function PortalDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch('/api/portal/dashboard')
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const metrics = data?.metrics || {}
  const pipeline = data?.pipeline || []
  const recentLeads = data?.recentLeads || []
  const activityFeed = data?.activityFeed || []

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Last updated {lastUpdated.toLocaleTimeString('en-IN')}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-gray-400 hover:text-white hover:border-[#0F6E56] transition-all text-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Total Leads" value={metrics.totalLeads || 0} subtitle={`${metrics.monthLeads || 0} this month`} icon={Users} />
        <MetricCard title="Active Clients" value={metrics.totalClients || 0} subtitle="Paying clients" icon={Briefcase} />
        <MetricCard title="Assessments This Week" value={metrics.weekAssessments || 0} subtitle="Completed sessions" icon={Activity} />
        <MetricCard title="Total Assessments" value={metrics.totalAssessments || 0} subtitle="All time completed" icon={BarChart2} />
        <MetricCard title="Completion Rate" value={`${metrics.completionRate || 0}%`} subtitle="Assessment to lead" icon={TrendingUp} />
        <MetricCard title="Overdue Follow-ups" value={0} subtitle="Needs attention" icon={AlertCircle} color="#EF4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline Chart */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Lead Pipeline</h2>
          {pipeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={pipeline} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis type="category" dataKey="stage" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#0F6E56' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {pipeline.map((entry: {stage: string}) => (
                    <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#0F6E56'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No leads yet. Complete an assessment to see data here.</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Recent Activity</h2>
          {activityFeed.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {activityFeed.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1f2937] last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.completed ? 'bg-[#0F6E56]' : 'bg-[#6B7280]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{item.name || 'Anonymous'} {item.completed ? 'completed assessment' : 'started assessment'}</p>
                    <p className="text-gray-500 text-xs">{item.company || item.industry || 'Unknown company'}</p>
                  </div>
                  <p className="text-gray-600 text-xs flex-shrink-0">
                    {new Date(item.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No activity yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold">Recent Leads</h2>
          <a href="/portal/leads" className="text-[#0F6E56] text-sm hover:underline">View all</a>
        </div>
        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937]">
                  <th className="text-left text-gray-400 text-xs uppercase tracking-wider pb-3">Name</th>
                  <th className="text-left text-gray-400 text-xs uppercase tracking-wider pb-3">Company</th>
                  <th className="text-left text-gray-400 text-xs uppercase tracking-wider pb-3">Industry</th>
                  <th className="text-left text-gray-400 text-xs uppercase tracking-wider pb-3">Stage</th>
                  <th className="text-left text-gray-400 text-xs uppercase tracking-wider pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="border-b border-[#1f2937] last:border-0 hover:bg-[#1f2937] transition-colors">
                    <td className="py-3 text-white text-sm font-medium">{lead.name}</td>
                    <td className="py-3 text-gray-400 text-sm">{lead.company || '—'}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{
                        background: lead.industry === 'Real Estate' ? '#0F6E5620' : '#3B82F620',
                        color: lead.industry === 'Real Estate' ? '#0F6E56' : '#3B82F6'
                      }}>
                        {lead.industry || '—'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{
                        background: `${STAGE_COLORS[lead.stage] || '#6B7280'}20`,
                        color: STAGE_COLORS[lead.stage] || '#6B7280'
                      }}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">No leads yet. They will appear here once someone completes the assessment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
