'use client'

import { useEffect, useState } from 'react'
import { Plus, X, ChevronRight, Briefcase } from 'lucide-react'

const AUDIT_STAGES = ['Not Started', 'Discovery Session', 'Operations Deep Dive', 'Data Review', 'Opportunity Mapping', 'Roadmap Presentation', 'Complete']
const BUILD_STAGES = ['Not Started', 'Design', 'Development', 'Testing', 'Deployment', 'Handover', 'Complete']
const STAGE_COLORS: Record<string, string> = {
  'Not Started': '#6B7280',
  'Complete': '#0F6E56',
}

function ProgressBar({ stages, current }: { stages: string[], current: string }) {
  const index = stages.indexOf(current)
  const percent = stages.length > 1 ? Math.round((index / (stages.length - 1)) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{current}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
        <div className="h-full bg-[#0F6E56] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState({ company: '', industry: 'Real Estate', contract_value: '', notes: '' })

  async function fetchClients() {
    setLoading(true)
    const res = await fetch('/api/portal/clients')
    const json = await res.json()
    setClients(json.clients || [])
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  async function updateClient(id: string, updates: any) {
    await fetch('/api/portal/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    })
    fetchClients()
    if (selectedClient?.id === id) setSelectedClient({ ...selectedClient, ...updates })
  }

  async function addClient() {
    await fetch('/api/portal/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newClient, contract_value: newClient.contract_value ? parseInt(newClient.contract_value) : null })
    })
    setShowAddModal(false)
    setNewClient({ company: '', industry: 'Real Estate', contract_value: '', notes: '' })
    fetchClients()
  }

  const tabs = ['overview', 'audit', 'build', 'notes']

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedClient ? 'border-r border-[#1f2937]' : ''}`}>
        <div className="p-6 border-b border-[#1f2937] flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Clients</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] transition-colors">
            <Plus size={16} /> Add Client
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Briefcase size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">No clients yet.</p>
              <button onClick={() => setShowAddModal(true)} className="mt-3 text-[#0F6E56] text-sm hover:underline">Add your first client</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clients.map(client => (
                <div
                  key={client.id}
                  onClick={() => { setSelectedClient(client); setActiveTab('overview') }}
                  className={`bg-[#111827] border rounded-2xl p-5 cursor-pointer hover:border-[#0F6E56] transition-all ${selectedClient?.id === client.id ? 'border-[#0F6E56]' : 'border-[#1f2937]'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{client.company}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-lg mt-1 inline-block" style={{ background: client.industry === 'Real Estate' ? '#0F6E5620' : '#3B82F620', color: client.industry === 'Real Estate' ? '#0F6E56' : '#3B82F6' }}>
                        {client.industry}
                      </span>
                    </div>
                    {client.on_growth_plan && (
                      <span className="text-xs px-2 py-0.5 bg-[#0F6E5620] text-[#0F6E56] rounded-lg border border-[#0F6E5640]">Growth Plan</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Audit</p>
                      <ProgressBar stages={AUDIT_STAGES} current={client.audit_stage || 'Not Started'} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Build</p>
                      <ProgressBar stages={BUILD_STAGES} current={client.build_stage || 'Not Started'} />
                    </div>
                  </div>
                  {client.contract_value && (
                    <p className="text-[#0F6E56] text-sm font-semibold mt-3">₹{client.contract_value.toLocaleString('en-IN')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedClient && (
        <div className="w-[480px] flex-shrink-0 bg-[#0d1117] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[#1f2937] flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold">{selectedClient.company}</h2>
              <p className="text-gray-400 text-xs">{selectedClient.industry}</p>
            </div>
            <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>

          <div className="flex border-b border-[#1f2937]">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${activeTab === tab ? 'text-[#0F6E56] border-b-2 border-[#0F6E56]' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Contract Value</p>
                    <p className="text-[#0F6E56] text-xl font-bold">{selectedClient.contract_value ? `₹${selectedClient.contract_value.toLocaleString('en-IN')}` : '—'}</p>
                  </div>
                  <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">Start Date</p>
                    <p className="text-white text-sm font-medium">{selectedClient.start_date ? new Date(selectedClient.start_date).toLocaleDateString('en-IN') : '—'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Growth Plan</label>
                  <button
                    onClick={() => updateClient(selectedClient.id, { on_growth_plan: !selectedClient.on_growth_plan })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClient.on_growth_plan ? 'bg-[#0F6E56] text-white' : 'bg-[#111827] border border-[#1f2937] text-gray-400 hover:border-[#0F6E56]'}`}
                  >
                    {selectedClient.on_growth_plan ? 'On Growth Plan ✓' : 'Not on Growth Plan'}
                  </button>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Contact</label>
                  {selectedClient.leads ? (
                    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 space-y-1">
                      <p className="text-white text-sm font-medium">{selectedClient.leads.name}</p>
                      <p className="text-gray-400 text-sm">{selectedClient.leads.email}</p>
                      <p className="text-gray-400 text-sm">{selectedClient.leads.phone}</p>
                    </div>
                  ) : <p className="text-gray-500 text-sm">No contact linked</p>}
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Current Stage</label>
                  <select
                    value={selectedClient.audit_stage || 'Not Started'}
                    onChange={e => updateClient(selectedClient.id, { audit_stage: e.target.value })}
                    className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]"
                  >
                    {AUDIT_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <ProgressBar stages={AUDIT_STAGES} current={selectedClient.audit_stage || 'Not Started'} />
                <div className="mt-4 space-y-2">
                  {AUDIT_STAGES.map((stage, i) => {
                    const currentIndex = AUDIT_STAGES.indexOf(selectedClient.audit_stage || 'Not Started')
                    const isDone = i <= currentIndex
                    return (
                      <div key={stage} className={`flex items-center gap-3 p-3 rounded-xl ${isDone ? 'bg-[#0F6E5610] border border-[#0F6E5630]' : 'bg-[#111827] border border-[#1f2937]'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isDone ? 'bg-[#0F6E56] text-white' : 'bg-[#1f2937] text-gray-500'}`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-sm ${isDone ? 'text-white' : 'text-gray-500'}`}>{stage}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'build' && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Current Stage</label>
                  <select
                    value={selectedClient.build_stage || 'Not Started'}
                    onChange={e => updateClient(selectedClient.id, { build_stage: e.target.value })}
                    className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]"
                  >
                    {BUILD_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <ProgressBar stages={BUILD_STAGES} current={selectedClient.build_stage || 'Not Started'} />
                <div className="mt-4 space-y-2">
                  {BUILD_STAGES.map((stage, i) => {
                    const currentIndex = BUILD_STAGES.indexOf(selectedClient.build_stage || 'Not Started')
                    const isDone = i <= currentIndex
                    return (
                      <div key={stage} className={`flex items-center gap-3 p-3 rounded-xl ${isDone ? 'bg-[#0F6E5610] border border-[#0F6E5630]' : 'bg-[#111827] border border-[#1f2937]'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isDone ? 'bg-[#0F6E56] text-white' : 'bg-[#1f2937] text-gray-500'}`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-sm ${isDone ? 'text-white' : 'text-gray-500'}`}>{stage}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-2">Notes</label>
                <textarea
                  defaultValue={selectedClient.notes || ''}
                  onBlur={e => updateClient(selectedClient.id, { notes: e.target.value })}
                  rows={12}
                  placeholder="Add notes about this client..."
                  className="w-full bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0F6E56] transition-colors resize-none"
                />
                <p className="text-gray-600 text-xs mt-2">Notes save automatically when you click away.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">Add Client</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Company Name *</label>
                <input type="text" value={newClient.company} onChange={e => setNewClient({ ...newClient, company: e.target.value })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Industry</label>
                <select value={newClient.industry} onChange={e => setNewClient({ ...newClient, industry: e.target.value })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]">
                  <option>Real Estate</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Contract Value (₹)</label>
                <input type="number" value={newClient.contract_value} onChange={e => setNewClient({ ...newClient, contract_value: e.target.value })} placeholder="30000" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">Notes</label>
                <textarea value={newClient.notes} onChange={e => setNewClient({ ...newClient, notes: e.target.value })} rows={3} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#1f2937] rounded-xl text-gray-400 text-sm hover:border-gray-400 transition-colors">Cancel</button>
              <button onClick={addClient} disabled={!newClient.company} className="flex-1 py-2.5 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] transition-colors disabled:opacity-50">Add Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
