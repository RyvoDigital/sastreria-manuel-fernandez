import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[#0F1D2E] rounded-xl border border-[#1E3A5F]">
          <div className="text-center">
            <h1 className="text-xl font-serif text-white mb-2">New Password</h1>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
