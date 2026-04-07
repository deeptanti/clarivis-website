'use client'

import { useEffect, useState } from 'react'
import { Plus, X, Check, Cpu, Zap, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'

const VARIABLES = ['{{name}}', '{{company}}', '{{industry}}', '{{teamSize}}', '{{mainChallenge}}', '{{tools}}', '{{aiExperience}}', '{{timeSelected}}', '{{maxTurns}}']

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([])
  const [prompts, setPrompts] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [activePrompt, setActivePrompt] = useState<any>(null)
  const [editingPrompt, setEditingPrompt] = useState<any>(null)
  const [showNewModel, setShowNewModel] = useState(false)
  const [showNewPrompt, setShowNewPrompt] = useState(false)
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)
  const [newModel, setNewModel] = useState({ name: '', provider: 'anthropic', model_string: '', max_tokens: 300, temperature: 0.7, notes: '' })
  const [newPrompt, setNewPrompt] = useState({ name: '', system_prompt: '', is_active: false, notes: '' })
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  async function fetchData() {
    const [modelsRes, promptsRes] = await Promise.all([
      fetch('/api/portal/models'),
      fetch('/api/portal/prompts')
    ])
    const modelsJson = await modelsRes.json()
    const promptsJson = await promptsRes.json()
    setModels(modelsJson.models || [])
    setPrompts(promptsJson.prompts || [])
    const active = promptsJson.prompts?.find((p: any) => p.is_active)
    if (active) setActivePrompt(active)
  }

  useEffect(() => { fetchData() }, [])

  async function setActiveModel(id: string) {
    await fetch('/api/portal/models', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: true })
    })
    fetchData()
  }

  async function setActivePromptVersion(id: string) {
    await fetch('/api/portal/prompts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: true })
    })
    fetchData()
  }

  async function addModel() {
    await fetch('/api/portal/models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newModel)
    })
    setShowNewModel(false)
    setNewModel({ name: '', provider: 'anthropic', model_string: '', max_tokens: 300, temperature: 0.7, notes: '' })
    fetchData()
  }

  async function saveNewPrompt() {
    setSaving(true)
    await fetch('/api/portal/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPrompt)
    })
    setShowNewPrompt(false)
    setNewPrompt({ name: '', system_prompt: '', is_active: false, notes: '' })
    setSaving(false)
    fetchData()
  }

  function getPreview(prompt: string) {
    return prompt
      .replace('{{name}}', 'Rajiv Shah')
      .replace('{{company}}', 'Horizon Developers')
      .replace('{{industry}}', 'Real Estate')
      .replace('{{teamSize}}', '25')
      .replace('{{mainChallenge}}', 'Lead follow-up is completely manual and we lose 40% of enquiries')
      .replace('{{tools}}', 'WhatsApp, Excel')
      .replace('{{aiExperience}}', 'No, completely new')
      .replace('{{timeSelected}}', '15')
      .replace('{{maxTurns}}', '14')
  }

  const activeModel = models.find(m => m.is_active)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Model Management</h1>
        <p className="text-gray-400 text-sm mt-1">Control which AI model and prompt the Clarivis Assessment uses. Changes take effect immediately.</p>
      </div>

      {/* Active Configuration Banner */}
      {activeModel && activePrompt && (
        <div className="bg-[#0F6E5615] border border-[#0F6E5640] rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0F6E56] rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Active Configuration</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Model: <span className="text-[#0F6E56]">{activeModel.name}</span> · 
              Prompt: <span className="text-[#0F6E56]">v{activePrompt.version_number} — {activePrompt.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0F6E56] rounded-full animate-pulse" />
            <span className="text-[#0F6E56] text-xs font-medium">Live</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Models Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">AI Models</h2>
            <button onClick={() => setShowNewModel(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1f2937] rounded-xl text-gray-400 hover:text-white hover:border-[#0F6E56] transition-all text-sm">
              <Plus size={14} /> Add Model
            </button>
          </div>

          <div className="space-y-3">
            {models.map(model => (
              <div key={model.id} className={`bg-[#111827] border rounded-2xl p-5 transition-all ${model.is_active ? 'border-[#0F6E56]' : 'border-[#1f2937] hover:border-[#374151]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${model.is_active ? 'bg-[#0F6E56]' : 'bg-[#1f2937]'}`}>
                      <Cpu size={16} className={model.is_active ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{model.name}</p>
                      <p className="text-gray-500 text-xs font-mono">{model.model_string}</p>
                    </div>
                  </div>
                  {model.is_active ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0F6E5620] text-[#0F6E56] rounded-lg text-xs font-medium">
                      <Check size={11} /> Active
                    </span>
                  ) : (
                    <button onClick={() => setActiveModel(model.id)} className="px-3 py-1 border border-[#1f2937] rounded-xl text-gray-400 text-xs hover:border-[#0F6E56] hover:text-[#0F6E56] transition-all">
                      Set Active
                    </button>
                  )}
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t border-[#1f2937]">
                  <div>
                    <p className="text-gray-500 text-xs">Max Tokens</p>
                    <p className="text-white text-sm font-medium">{model.max_tokens}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Temperature</p>
                    <p className="text-white text-sm font-medium">{model.temperature}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Provider</p>
                    <p className="text-white text-sm font-medium capitalize">{model.provider}</p>
                  </div>
                </div>
                {model.notes && <p className="text-gray-500 text-xs mt-3">{model.notes}</p>}
              </div>
            ))}
          </div>

          {showNewModel && (
            <div className="mt-4 bg-[#111827] border border-[#0F6E56] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Add New Model</h3>
                <button onClick={() => setShowNewModel(false)} className="text-gray-400 hover:text-white"><X size={14} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Display Name', key: 'name', placeholder: 'Claude Opus 4.5' },
                  { label: 'Model String', key: 'model_string', placeholder: 'claude-opus-4-5' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">{label}</label>
                    <input value={(newModel as any)[key]} onChange={e => setNewModel({ ...newModel, [key]: e.target.value })} placeholder={placeholder} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Max Tokens</label>
                    <input type="number" value={newModel.max_tokens} onChange={e => setNewModel({ ...newModel, max_tokens: parseInt(e.target.value) })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Temperature</label>
                    <input type="number" step="0.1" min="0" max="1" value={newModel.temperature} onChange={e => setNewModel({ ...newModel, temperature: parseFloat(e.target.value) })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Notes</label>
                  <input value={newModel.notes} onChange={e => setNewModel({ ...newModel, notes: e.target.value })} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                </div>
                <button onClick={addModel} disabled={!newModel.name || !newModel.model_string} className="w-full py-2 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] disabled:opacity-50 transition-colors">
                  Add Model
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Prompts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Prompt Versions</h2>
            <button onClick={() => setShowNewPrompt(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] border border-[#1f2937] rounded-xl text-gray-400 hover:text-white hover:border-[#0F6E56] transition-all text-sm">
              <Plus size={14} /> New Version
            </button>
          </div>

          <div className="space-y-3">
            {prompts.map(prompt => (
              <div key={prompt.id} className={`bg-[#111827] border rounded-2xl transition-all ${prompt.is_active ? 'border-[#0F6E56]' : 'border-[#1f2937]'}`}>
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}>
                  <div className="flex items-center gap-3">
                    <span className="text-[#0F6E56] font-mono text-sm font-bold">v{prompt.version_number}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{prompt.name}</p>
                      <p className="text-gray-500 text-xs">{new Date(prompt.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {prompt.is_active ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0F6E5620] text-[#0F6E56] rounded-lg text-xs font-medium">
                        <Check size={11} /> Active
                      </span>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); setActivePromptVersion(prompt.id) }} className="px-3 py-1 border border-[#1f2937] rounded-xl text-gray-400 text-xs hover:border-[#0F6E56] hover:text-[#0F6E56] transition-all">
                        Set Active
                      </button>
                    )}
                    {expandedPrompt === prompt.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </div>

                {expandedPrompt === prompt.id && (
                  <div className="px-4 pb-4 border-t border-[#1f2937] pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-xs uppercase tracking-wider">System Prompt</p>
                      <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors">
                        {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                        {showPreview ? 'Show template' : 'Preview with data'}
                      </button>
                    </div>
                    <pre className="bg-[#0a0f1a] border border-[#1f2937] rounded-xl p-4 text-gray-300 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
                      {showPreview ? getPreview(prompt.system_prompt) : prompt.system_prompt}
                    </pre>
                    {prompt.notes && <p className="text-gray-500 text-xs mt-3">{prompt.notes}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {showNewPrompt && (
            <div className="mt-4 bg-[#111827] border border-[#0F6E56] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">New Prompt Version</h3>
                <button onClick={() => setShowNewPrompt(false)} className="text-gray-400 hover:text-white"><X size={14} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Version Name</label>
                  <input value={newPrompt.name} onChange={e => setNewPrompt({ ...newPrompt, name: e.target.value })} placeholder="e.g. v2 — More direct questioning" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-400 text-xs uppercase tracking-wider">System Prompt</label>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {VARIABLES.map(v => (
                        <button key={v} onClick={() => setNewPrompt({ ...newPrompt, system_prompt: newPrompt.system_prompt + v })} className="px-1.5 py-0.5 bg-[#0F6E5620] text-[#0F6E56] rounded text-xs font-mono hover:bg-[#0F6E5640] transition-colors">
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={newPrompt.system_prompt} onChange={e => setNewPrompt({ ...newPrompt, system_prompt: e.target.value })} rows={12} placeholder="Write your system prompt here. Click variable buttons above to insert template variables." className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#0F6E56] resize-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Notes</label>
                  <input value={newPrompt.notes} onChange={e => setNewPrompt({ ...newPrompt, notes: e.target.value })} placeholder="What changed in this version?" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0F6E56]" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newPrompt.is_active} onChange={e => setNewPrompt({ ...newPrompt, is_active: e.target.checked })} className="rounded" />
                    <span className="text-gray-400 text-sm">Set as active immediately</span>
                  </label>
                </div>
                <button onClick={saveNewPrompt} disabled={saving || !newPrompt.name || !newPrompt.system_prompt} className="w-full py-2 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] disabled:opacity-50 transition-colors">
                  {saving ? 'Saving...' : 'Save New Version'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
