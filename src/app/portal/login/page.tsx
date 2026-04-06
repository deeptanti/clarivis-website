'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PortalLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')
    
    const response = await fetch('/api/portal/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    if (response.ok) {
      router.push('/portal')
    } else {
      setError('Incorrect password. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Clarivis Intelligence" width={160} height={40} className="mx-auto mb-6" />
          <h1 className="text-white text-2xl font-700">Internal Portal</h1>
          <p className="text-gray-400 text-sm mt-2">Clarivis Intelligence Operations</p>
        </div>
        
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8">
          <label className="text-gray-400 text-xs uppercase tracking-wider font-500 block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter portal password"
            className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56] transition-colors mb-4"
          />
          
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          
          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full bg-[#0F6E56] text-white font-600 py-3 rounded-xl hover:bg-[#0a5a45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Portal'}
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-6">
          Clarivis Intelligence Private Limited
        </p>
      </div>
    </div>
  )
}
