import type { Metadata } from 'next'
import { WomensBespokeTailoringMadrid } from '@/components/landing/WomensBespokeTailoringMadrid'

export const metadata: Metadata = {
  title: "Women's Bespoke Tailoring in Madrid | Manuel Fernández",
  description:
    "Women's bespoke tailoring in Madrid. Suits, jackets and coats cut on the cloth for one body, by hand. Jorge Juan 41.",
  alternates: { canonical: '/womens-bespoke-tailoring-madrid' },
  // English page targeting an English query. No hreflang to the Spanish
  // pages: they are different pages for different queries, not translations
  // of one another, and declaring them as alternates would be inaccurate.
  openGraph: { locale: 'en_GB' },

}

export default function Page() {
  return <WomensBespokeTailoringMadrid />
}
