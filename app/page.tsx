import { HeroEnhanced } from '@/components/home/HeroEnhanced'
import { ElHiloHome } from '@/components/home/ElHiloHome'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sastrería Artesanal a Medida en Madrid | Manuel Fernández',
  description:
    'Sastrería artesanal a medida en Madrid. Trajes bespoke para caballero y señora, novios, chaqué, smoking y prendas únicas. Jorge Juan 41.',
  alternates: { canonical: '/' },
}

/* The hero is the live HeroEnhanced, unchanged. Everything below it is the
   approved "El hilo" homepage: one continuous scroll piece. */
export default function HomePage() {
  return (
    <>
      <HeroEnhanced />
      <ElHiloHome />
    </>
  )
}
