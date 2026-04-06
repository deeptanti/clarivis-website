'use client'

import { useEffect, useState } from 'react'
import { Search, Plus, X, Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react'

const STAGES = ['New', 'Contacted', 'Assessment Sent', 'Call Scheduled', 'Call Done', 'Proposal Sent', 'Converted', 'Lost']
const STAGE_COLORS: Record<string, string> = {
  'New': '#6B7280', 'Contacted': '#3B82F6', 'Assessment Sent': '#8B5CF6',
  'Call Scheduled': '#F59E0B', 'Call Done': '#EAB308', 'Proposal Sent': '#EC4899',
  'Converted': '#0F6E56', 'Lost': '#EF4444'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', company: '', industry: 'Real Estate', source: 'manual', stage: 'New', notes: '' })

  async function fetchLeads() {
    setLoading(true)
    const params = new URLSearchParams()
    if (stageFilter !== 'all') params.set('stage', stageFilter)
    if (industryFilter !== 'all') params.set('industry', industryFilter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/portal/leads?${params}`)
    const json = await res.json()
    setLeads(json.leads || [])
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [stageFilter, industryFilter])

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 400)
    return () => clearTimeout(timer)
  }, [search])

  async function updateLeadStage(id: string, stage: string) {
    await fetch('/api/portal/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stage, last_contacted_at: new Date().toISOString() })
    })
    fetchLeads()
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, stage })
  }

  async function addLead() {
    await fetch('/api/portal/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
    setShowAddModal(false)
    setNewLead({ name: '', email: '', phone: '', company: '', industry: 'Real Estate', source: 'manual', stage: 'New', notes: '' })
    fetchLeads()
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main table */}
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedLead ? 'border-r border-[#1f2937]' : ''}`}>
        <div className="p-6 border-b border-[#1f2937]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl font-bold">Leads</h1>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] transition-colors">
              <Plus size={16} /> Add Lead
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or company..." className="w-full bg-[#111827] border border-[#1f2937] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56] transition-colors" />
            </div>
            <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]">
              <option value="all">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]">
              <option value="all">All Industries</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No leads found.</p>
              <button onClick={() => setShowAddModal(true)} className="mt-3 text-[#0F6E56] text-sm hover:underline">Add your first lead</button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-[#0d1117] border-b border-[#1f2937]">
                <tr>
                  {['Name', 'Company', 'Industry', 'Source', 'Stage', 'Date', ''].map(h => (
                    <th key={h} className="text-left text-gray-400 text-xs uppercase tracking-wider px-6 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={`border-b border-[#1f2937] hover:bg-[#111827] cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-[#111827]' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">{lead.name}</p>
                      <p className="text-gray-500 text-xs">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{lead.company || '—'}</td>
                    <td className="px-6 py-4">
                      {lead.industry && (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: lead.industry === 'Real Estate' ? '#0F6E5620' : '#3B82F620', color: lead.industry === 'Real Estate' ? '#0F6E56' : '#3B82F6' }}>
                          {lead.industry}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs capitalize">{lead.source || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: `${STAGE_COLORS[lead.stage]}20`, color: STAGE_COLORS[lead.stage] }}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4"><ChevronRight size={14} className="text-gray-600" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Lead profile panel */}
      {selectedLead && (
        <div className="w-96 flex-shrink-0 bg-[#0d1117] overflow-y-auto">
          <div className="p-6 border-b border-[#1f2937] flex items-center justify-between">
            <h2 className="text-white font-semibold">Lead Profile</h2>
            <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="w-12 h-12 bg-[#0F6E56] rounded-full flex items-center justify-center text-white text-lg font-bold mb-3">
                {selectedLead.name?.[0]?.toUpperCase()}
              </div>
              <h3 className="text-white text-lg font-bold">{selectedLead.name}</h3>
              <p className="text-gray-400 text-sm">{selectedLead.company || 'No company'}</p>
              {selectedLead.industry && (
                <span className="inline-block mt-2 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: selectedLead.industry === 'Real Estate' ? '#0F6E5620' : '#3B82F620', color: selectedLead.industry === 'Real Estate' ? '#0F6E56' : '#3B82F6' }}>
                  {selectedLead.industry}
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {selectedLead.email && (
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail size={14} className="text-[#0F6E56]" /> {selectedLead.email}
                </a>
              )}
              {selectedLead.phone && (
                <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone size={14} className="text-[#0F6E56]" /> {selectedLead.phone}
                </a>
              )}
              {selectedLead.phone && (
                <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#25D366] transition-colors text-sm">
                  <MessageCircle size={14} className="text-[#25D366]" /> WhatsApp
                </a>
              )}
            </div>

            <div className="mb-6">
              <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Stage</label>
              <select
                value={selectedLead.stage}
                onChange={e => updateLeadStage(selectedLead.id, e.target.value)}
                className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]"
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {selectedLead.main_challenge && (
              <div className="mb-6">
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Main Challenge</label>
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedLead.main_challenge}</p>
                </div>
              </div>
            )}

            {selectedLead.notes && (
              <div className="mb-6">
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Notes</label>
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedLead.notes}</p>
                </div>
              </div>
            )}

            <div className="text-gray-600 text-xs space-y-1">
              <p>Source: {selectedLead.source || 'unknown'}</p>
              <p>Added: {new Date(selectedLead.created_at).toLocaleString('en-IN')}</p>
              {selectedLead.last_contacted_at && <p>Last contact: {new Date(selectedLead.last_contacted_at).toLocaleString('en-IN')}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">Add Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', required: true },
                { label: 'Email', key: 'email', type: 'email', required: true },
                { label: 'Phone', key: 'phone', type: 'tel', required: false },
                { label: 'Company', key: 'company', type: 'text', required: false },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">{label}{required && ' *'}</label>
                  <input
                    type={type}
                    value={(newLead as any)[key]}
                    onChange={e => setNewLead({ ...newLead, [key]: e.target.value })}
                    className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Industry</label>
                <select value={newLead.industry} onChange={e => setNewLead({ ...newLead, industry: e.target.value })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]">
                  <option>Real Estate</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Notes</label>
                <textarea value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} rows={3} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56] transition-colors resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#1f2937] rounded-xl text-gray-400 text-sm hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={addLead} disabled={!newLead.name || !newLead.email} className="flex-1 py-2.5 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] transition-colors disabled:opacity-50">Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
