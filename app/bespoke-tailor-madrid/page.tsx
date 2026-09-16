import type { Metadata } from 'next'
import { BespokeTailorMadrid } from '@/components/landing/BespokeTailorMadrid'

export const metadata: Metadata = {
  title: 'Bespoke Tailor in Madrid | Manuel Fernández',
  description:
    'Bespoke tailor in Madrid. Suits cut and built entirely by hand, without patterns, for one body. Jorge Juan 41, Barrio de Salamanca.',
  alternates: { canonical: '/bespoke-tailor-madrid' },
  // English page targeting an English query. No hreflang to the Spanish
  // pages: they are different pages for different queries, not translations
  // of one another, and declaring them as alternates would be inaccurate.
  openGraph: { locale: 'en_GB' },

}

export default function Page() {
  return <BespokeTailorMadrid />
}
