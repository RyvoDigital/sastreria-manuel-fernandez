'use client'

import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('admin@sastreria.com')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Request failed')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#0F1D2E] rounded-xl border border-[#1E3A5F]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A84C]/10 rounded-full mb-4">
            <Mail size={20} className="text-[#C9A84C]" />
          </div>
          <h1 className="text-xl font-serif text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">Enter your email and we will send you a reset link</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
              If an account exists for this email, you will receive a password reset link shortly.
            </div>
            <a
              href="/admin/login"
              className="inline-flex items-center gap-2 text-[#C9A84C] hover:text-[#D4B76A] text-sm"
            >
              <ArrowLeft size={16} />
              Back to login
            </a>
          </div>
        ) : (
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <a href="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C]">
                <ArrowLeft size={16} />
                Back to login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
