'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { RefreshCw, MessageSquare, TrendingUp, CheckCircle, Clock } from 'lucide-react'

const COLORS = ['#0F6E56', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899']

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string, value: string | number, subtitle?: string, icon: React.ElementType }) {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm">{title}</p>
        <Icon size={16} className="text-[#0F6E56]" />
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('funnel')

  async function fetchData() {
    setLoading(true)
    const res = await fetch('/api/portal/analytics')
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const metrics = data?.metrics || {}

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-3xl font-bold">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Assessment funnel, conversation intelligence, and pain point analysis.</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-gray-400 hover:text-white text-sm transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Assessments" value={metrics.totalAssessments || 0} subtitle="All time" icon={TrendingUp} />
        <MetricCard title="Completed" value={metrics.completedAssessments || 0} subtitle="Reached chat phase" icon={CheckCircle} />
        <MetricCard title="Completion Rate" value={`${metrics.completionRate || 0}%`} subtitle="Start to finish" icon={TrendingUp} />
        <MetricCard title="Avg Chat Turns" value={metrics.avgTurns || 0} subtitle="Per session" icon={MessageSquare} />
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#1f2937] pb-4">
        {['funnel', 'trends', 'prompts', 'pain points'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-[#0F6E56] text-white' : 'text-gray-400 hover:text-white hover:bg-[#111827]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'funnel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">Industry Split</h3>
            {data?.industrySplit?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={data.industrySplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.industrySplit.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-56 flex items-center justify-center"><p className="text-gray-500 text-sm">No data yet</p></div>}
          </div>

          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">Time Selection</h3>
            {data?.timeSplit?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.timeSplit}>
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#0F6E56" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-56 flex items-center justify-center"><p className="text-gray-500 text-sm">No data yet</p></div>}
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-6">Sessions Over Time</h3>
          {data?.sessionsOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.sessionsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 8 }} />
                <Line type="monotone" dataKey="count" stroke="#0F6E56" strokeWidth={2} dot={{ fill: '#0F6E56', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-64 flex items-center justify-center"><p className="text-gray-500 text-sm">No data yet</p></div>}
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-[#1f2937]">
                <tr>
                  {['Version', 'Name', 'Total Uses', 'Avg Turns', 'Completion Rate'].map(h => (
                    <th key={h} className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.promptStats?.length > 0 ? data.promptStats.map((stat: any, i: number) => (
                  <tr key={i} className="border-b border-[#1f2937] last:border-0">
                    <td className="px-6 py-4 text-[#0F6E56] font-mono font-bold text-sm">v{stat.version}</td>
                    <td className="px-6 py-4 text-white text-sm">{stat.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{stat.uses}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{stat.uses > 0 ? Math.round(stat.totalTurns / stat.uses) : 0}</td>
                    <td className="px-6 py-4">
                      <span className="text-[#0F6E56] text-sm font-medium">
                        {stat.uses > 0 ? Math.round((stat.completed / stat.uses) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">No prompt performance data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pain points' && (
        <div className="space-y-3">
          {data?.challenges?.length > 0 ? data.challenges.map((item: any, i: number) => (
            <div key={i} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 hover:border-[#374151] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-300 text-sm leading-relaxed flex-1">{item.challenge}</p>
                <div className="flex-shrink-0 text-right">
                  {item.company && <p className="text-white text-xs font-medium">{item.company}</p>}
                  {item.industry && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-lg text-xs" style={{ background: item.industry === 'Real Estate' ? '#0F6E5620' : '#3B82F620', color: item.industry === 'Real Estate' ? '#0F6E56' : '#3B82F6' }}>
                      {item.industry}
                    </span>
                  )}
                  <p className="text-gray-600 text-xs mt-1">{new Date(item.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-12 text-center">
              <p className="text-gray-500 text-sm">No pain points captured yet. They will appear here once assessments are completed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
