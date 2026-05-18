'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@sastreria.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Login failed')
      setLoading(false)
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#0F1D2E] rounded-xl border border-[#1E3A5F]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#C9A84C] mb-2">Sastrería Admin</h1>
          <p className="text-gray-400 text-sm">Sign in to manage your business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <a href="/admin/forgot-password" className="text-sm text-[#C9A84C] hover:text-[#D4B76A]">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
