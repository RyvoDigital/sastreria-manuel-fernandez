import type { Metadata } from 'next'
import { VariantThree } from '@/components/landing/variants/VariantThree'

/**
 * Temporary design variant for review. Delete this route, its siblings and
 * components/landing/variants/ once a direction is chosen.
 *
 * The folder is named %5Fv so the URL segment is a literal "_v": a plain
 * "_v" folder would be a private folder and would not route at all.
 * noindex, absent from app/sitemap.ts, and /_v/ is disallowed in robots.ts.
 */
export const metadata: Metadata = {
  title: 'Variante 3 · Placas',
  robots: { index: false, follow: false },
}

export default function SastreriaVariant3Page() {
  return <VariantThree />
}
