import { HeroNew }              from '@/components/home/HeroNew'
import { ServicesOverview }     from '@/components/home/ServicesOverview'
import { TrajeEmpiezaSection }  from '@/components/home/TrajeEmpiezaSection'
import { ZoomParallaxSection }  from '@/components/home/ZoomParallaxSection'
import { ProcessCardsSection }  from '@/components/home/ProcessCardsSection'
import { TestimonialsSection }  from '@/components/home/TestimonialsSection'
import { BeforeAfterSlider }    from '@/components/home/BeforeAfterSlider'
import { FabricsSection }       from '@/components/fabrics/FabricsSection'

export default function HomePage() {
  return (
    <>
      <HeroNew />
      <ServicesOverview />
      <TrajeEmpiezaSection />
      <ZoomParallaxSection />
      <ProcessCardsSection />
      <TestimonialsSection />
      <BeforeAfterSlider />
      <FabricsSection />
    </>
  )
}
