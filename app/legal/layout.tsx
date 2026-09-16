import type { Metadata } from 'next'

/**
 * app/legal/page.tsx is a client component (it reads the i18n dictionary), so
 * it cannot export `metadata` itself. This layout carries the canonical.
 * Title and description intentionally fall through to the root layout.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/legal' },
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
