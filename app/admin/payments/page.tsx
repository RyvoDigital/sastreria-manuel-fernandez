'use client'

import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'

interface Payment {
  id: string
  amount: number | null
  currency: string
  status: string
  customer: string | null
  created: number
  metadata: Record<string, string>
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/payments')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setPayments(data.payments || [])
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load payments')
        setLoading(false)
      })
  }, [])

  function formatAmount(amount: number | null, currency: string) {
    if (!amount) return '-'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-8">Payments</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="text-gray-400">No payments found.</div>
      ) : (
        <div className="bg-[#0A1628] border border-[#1E3A5F] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1E3A5F]/30 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#1E3A5F]/20">
                  <td className="px-6 py-4 text-white">
                    {new Date(p.created * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-white">{p.customer || 'Unknown'}</td>
                  <td className="px-6 py-4 text-white font-medium">
                    {formatAmount(p.amount, p.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      p.status === 'paid' ? 'bg-emerald-900/30 text-emerald-300' :
                      p.status === 'unpaid' ? 'bg-amber-900/30 text-amber-300' :
                      'bg-red-900/30 text-red-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-xs">
                    {p.metadata?.type || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
