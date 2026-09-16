import type { Metadata } from 'next'
import { VariantOne } from '@/components/landing/variants/VariantOne'

/**
 * Temporary design variant for review. Delete this route, its siblings and
 * components/landing/variants/ once a direction is chosen.
 *
 * The folder is named %5Fv so the URL segment is a literal "_v": a plain
 * "_v" folder would be a private folder and would not route at all.
 * noindex, absent from app/sitemap.ts, and /_v/ is disallowed in robots.ts.
 */
export const metadata: Metadata = {
  title: 'Variante 1 · Pliego',
  robots: { index: false, follow: false },
}

export default function SastreriaVariant1Page() {
  return <VariantOne />
}
