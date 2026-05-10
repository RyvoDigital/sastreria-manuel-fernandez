import { HeroEnhanced }          from '@/components/home/HeroEnhanced'
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

export default function HomePage() {
  return (
    <>
      <HeroEnhanced />
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
