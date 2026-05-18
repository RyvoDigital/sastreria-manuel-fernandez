'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { KeyRound, ArrowLeft } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import AdminLangSwitcher from '@/components/admin/AdminLangSwitcher'

export default function ResetPassword() {
  const { t } = useAdminI18n()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError(t.forgotPassword.invalidToken)
    }
  }, [token, t.forgotPassword.invalidToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError(t.resetPassword.mismatch)
      return
    }

    if (newPassword.length < 6) {
      setError(t.resetPassword.minLength)
      return
    }

    setLoading(true)

    const res = await fetch('/api/admin/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || t.resetPassword.failed)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <AdminLangSwitcher />
        </div>
        <div className="p-8 bg-[#0F1D2E] rounded-xl border border-[#1E3A5F]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C9A84C]/10 rounded-full mb-4">
              <KeyRound size={20} className="text-[#C9A84C]" />
            </div>
            <h1 className="text-xl font-serif text-white mb-2">{t.resetPassword.title}</h1>
            <p className="text-gray-400 text-sm">{t.resetPassword.subtitle}</p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg text-emerald-300 text-sm">
                {t.resetPassword.success}
              </div>
              <a
                href="/admin/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] text-sm"
              >
                {t.resetPassword.goToLogin}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.resetPassword.newPassword}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">{t.resetPassword.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A1628] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors disabled:opacity-50"
              >
                {loading ? t.resetPassword.updating : t.resetPassword.update}
              </button>

              <div className="text-center">
                <a href="/admin/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C]">
                  <ArrowLeft size={16} />
                  {t.resetPassword.backToLogin}
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
