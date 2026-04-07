'use client'

import { ExternalLink, BarChart2, Eye, MousePointer, Globe } from 'lucide-react'

export default function WebsitePage() {
  const tools = [
    {
      name: 'Google Analytics 4',
      description: 'Traffic sources, page views, user journeys, and conversion tracking.',
      url: 'https://analytics.google.com',
      icon: BarChart2,
      color: '#F59E0B',
      metrics: ['Sessions and users', 'Traffic sources', 'Top pages', 'Conversion events', 'Geographic data']
    },
    {
      name: 'Microsoft Clarity',
      description: 'Session recordings, heatmaps, and rage click detection.',
      url: 'https://clarity.microsoft.com',
      icon: MousePointer,
      color: '#3B82F6',
      metrics: ['Session recordings', 'Click heatmaps', 'Scroll depth', 'Rage clicks', 'Dead clicks']
    },
    {
      name: 'PostHog',
      description: 'Product analytics, assessment funnel tracking, and LLM observability.',
      url: 'https://app.posthog.com',
      icon: Eye,
      color: '#8B5CF6',
      metrics: ['Assessment funnel', 'Feature usage', 'LLM costs per session', 'User paths', 'Drop-off points']
    },
    {
      name: 'Google Search Console',
      description: 'Search performance, indexed pages, and SEO health.',
      url: 'https://search.google.com/search-console',
      icon: Globe,
      color: '#22c55e',
      metrics: ['Search impressions', 'Click-through rates', 'Keyword rankings', 'Index coverage', 'Core web vitals']
    }
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Website Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">All your analytics tools in one place. Click any card to open the dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 hover:border-[#374151] transition-all group block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${tool.color}20` }}>
                  <tool.icon size={18} style={{ color: tool.color }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{tool.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-xs">Connected</span>
                  </div>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors mt-1" />
            </div>
            <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
            <div className="space-y-1.5">
              {tool.metrics.map(metric => (
                <div key={metric} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: tool.color }} />
                  <span className="text-gray-500 text-xs">{metric}</span>
                </div>
              ))}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-2">Analytics Strategy</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">Each tool covers a different layer of your analytics stack. Use them together for a complete picture.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'For traffic and acquisition', tool: 'Google Analytics 4', description: 'Where are visitors coming from and which pages do they visit.' },
            { title: 'For user behaviour', tool: 'Microsoft Clarity', description: 'Watch real session recordings and see where people click and scroll.' },
            { title: 'For assessment funnel', tool: 'PostHog', description: 'Exact drop-off points inside the assessment flow and chat performance.' },
            { title: 'For SEO performance', tool: 'Google Search Console', description: 'Which keywords bring traffic and how your pages rank in search.' },
          ].map(item => (
            <div key={item.title} className="bg-[#0a0f1a] border border-[#1f2937] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-1">{item.title}</p>
              <p className="text-white text-sm font-semibold mb-1">{item.tool}</p>
              <p className="text-gray-500 text-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
