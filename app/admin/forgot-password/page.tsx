'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function ForgotPassword() {
  const { t, locale, setLocale } = useAdminI18n()
  const [email, setEmail] = useState('')
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
      setError(data.error || 'Error')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex items-center justify-center gap-1">
        {(['es', 'en', 'it', 'fr'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
              locale === l
                ? 'bg-[#C9A84C] text-[#0A1628] font-medium'
                : 'text-gray-400 hover:text-white hover:bg-[#1E3A5F]/50'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-8 bg-[#0F1D2E] rounded-xl border border-[#1E3A5F]">
        <div className="text-center mb-8">
          <h1 className="text-xl font-serif text-white mb-2">{t.forgotPassword.title}</h1>
          <p className="text-gray-400 text-sm">{t.forgotPassword.subtitle}</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
              {t.forgotPassword.successMsg}
            </div>
            <a href="/admin/login" className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#D4B76A]">
              <ArrowLeft size={16} />
              {t.forgotPassword.backToLogin}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">{t.forgotPassword.email}</label>
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
              {loading ? t.forgotPassword.sending : t.forgotPassword.send}
            </button>

            <div className="text-center">
              <a href="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C]">
                <ArrowLeft size={16} />
                {t.forgotPassword.backToLogin}
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
