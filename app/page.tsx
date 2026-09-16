import { HeroEnhanced }          from '@/components/home/HeroEnhanced'
import { SeoIntro }             from '@/components/home/SeoIntro'
import { ServicesEnhanced }      from '@/components/home/ServicesEnhanced'
import { DetailGallery }         from '@/components/home/DetailGallery'
import { TrajeEmpiezaSection }   from '@/components/home/TrajeEmpiezaSection'

import { ZoomParallaxSection }   from '@/components/home/ZoomParallaxSection'
import { ProcessCardsEnhanced }  from '@/components/home/ProcessCardsEnhanced'
import { EditorialSection }      from '@/components/home/EditorialSection'
import { TestimonialsSection }   from '@/components/home/TestimonialsSection'
import { BeforeAfterSlider }     from '@/components/home/BeforeAfterSlider'
import { SuitShowcaseSection }   from '@/components/home/SuitShowcaseSection'
import { FabricsSection }        from '@/components/fabrics/FabricsSection'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sastrería Artesanal a Medida en Madrid | Manuel Fernández',
  description:
    'Sastrería artesanal a medida en Madrid. Trajes bespoke para caballero y señora, novios, chaqué, smoking y prendas únicas. Jorge Juan 41.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HeroEnhanced />
      <SeoIntro />
      <ServicesEnhanced />
      <DetailGallery />
      <TrajeEmpiezaSection />
      <ZoomParallaxSection />
      <ProcessCardsEnhanced />
      <EditorialSection />
      <TestimonialsSection />
      <BeforeAfterSlider />
      <SuitShowcaseSection />
      <FabricsSection />
    </>
  )
}
