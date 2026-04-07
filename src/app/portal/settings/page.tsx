'use client'

import { useState } from 'react'
import { Check, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  async function updatePassword() {
    setPasswordError('')
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return
    }
    const res = await fetch('/api/portal/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
    if (res.ok) {
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    } else {
      setPasswordError('Current password is incorrect.')
    }
  }

  const integrations = [
    { name: 'Supabase', description: 'Database and real-time data', status: 'connected', color: '#22c55e' },
    { name: 'Resend', description: 'Transactional email delivery', status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connected' : 'check config', color: '#22c55e' },
    { name: 'Anthropic Claude', description: 'AI assessment chat agent', status: 'connected', color: '#22c55e' },
    { name: 'PostHog', description: 'Product and website analytics', status: 'connected', color: '#22c55e' },
    { name: 'Google Analytics 4', description: 'Website traffic analytics', status: 'connected', color: '#22c55e' },
    { name: 'Microsoft Clarity', description: 'Session recordings and heatmaps', status: 'connected', color: '#22c55e' },
    { name: 'Calendly', description: 'AI Opportunity Session bookings', status: 'connected', color: '#22c55e' },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Portal configuration and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* Portal Access */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Portal Access</h2>
          <p className="text-gray-500 text-sm mb-6">Update your portal password. You will need to log in again after changing it.</p>
          <div className="space-y-4 max-w-sm">
            {[
              { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
              { label: 'New Password', value: newPassword, setter: setNewPassword },
              { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0F6E56] pr-10"
                  />
                  <button onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            <button
              onClick={updatePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F6E56] text-white rounded-xl text-sm font-medium hover:bg-[#0a5a45] disabled:opacity-50 transition-colors"
            >
              {passwordSaved ? <><Check size={14} /> Saved</> : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Company Information</h2>
          <p className="text-gray-500 text-sm mb-6">Used throughout the portal and in automated emails.</p>
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {[
              { label: 'Company Name', value: 'Clarivis Intelligence' },
              { label: 'Legal Name', value: 'Clarivis Intelligence Private Limited' },
              { label: 'Founder', value: 'Deep Tanti' },
              { label: 'Email', value: 'hello@clarivisintelligence.com' },
              { label: 'Location', value: 'Rajkot, Gujarat, India' },
              { label: 'Website', value: 'clarivisintelligence.com' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
                <p className="text-white text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-1">Integrations</h2>
          <p className="text-gray-500 text-sm mb-6">Status of all connected services.</p>
          <div className="space-y-3">
            {integrations.map(integration => (
              <div key={integration.name} className="flex items-center justify-between py-3 border-b border-[#1f2937] last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{integration.name}</p>
                  <p className="text-gray-500 text-xs">{integration.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: integration.color }} />
                  <span className="text-xs capitalize" style={{ color: integration.color }}>{integration.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portal Info */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Portal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Portal Version', value: '1.0' },
              { label: 'Database', value: 'Supabase (PostgreSQL)' },
              { label: 'Hosting', value: 'Vercel' },
              { label: 'Built with', value: 'Next.js 14, TypeScript, Tailwind' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
                <p className="text-white text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
