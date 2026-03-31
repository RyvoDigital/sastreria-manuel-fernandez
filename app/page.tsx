import { ScrollExpandHero }     from '@/components/home/ScrollExpandHero'
import { TrajeEmpiezaSection }  from '@/components/home/TrajeEmpiezaSection'
import { ZoomParallaxSection }  from '@/components/home/ZoomParallaxSection'
import { ProcessCardsSection }  from '@/components/home/ProcessCardsSection'
import { TestimonialsSection }  from '@/components/home/TestimonialsSection'
import { EditorialSection }     from '@/components/home/EditorialSection'

export default function HomePage() {
  return (
    <>
      <ScrollExpandHero />
      <TrajeEmpiezaSection />
      <ZoomParallaxSection />
      <ProcessCardsSection />
      <TestimonialsSection />
      <EditorialSection />
    </>
  )
}
