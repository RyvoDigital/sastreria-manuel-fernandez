'use client'

import { useState } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'

export default function ChangePassword() {
  const { t } = useAdminI18n()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError(t.changePassword.mismatch)
      return
    }

    if (newPassword.length < 6) {
      setError(t.changePassword.minLength)
      return
    }

    setLoading(true)

    const res = await fetch('/api/admin/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || t.changePassword.failed)
      setLoading(false)
      return
    }

    setSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">{t.changePassword.title}</h1>

      <div className="max-w-lg bg-[#0A1628] border border-[#1E3A5F] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A84C]/10 rounded-lg">
            <KeyRound size={20} className="text-[#C9A84C]" />
          </div>
          <div>
            <h2 className="text-white font-medium">{t.changePassword.subtitle}</h2>
            <p className="text-gray-400 text-sm">{t.changePassword.description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.changePassword.currentPassword}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.changePassword.newPassword}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.changePassword.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-emerald-400 text-sm bg-emerald-900/20 px-4 py-3 rounded-lg">
              {t.changePassword.success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? t.changePassword.updating : t.changePassword.update}
          </button>
        </form>
      </div>
    </div>
  )
}
