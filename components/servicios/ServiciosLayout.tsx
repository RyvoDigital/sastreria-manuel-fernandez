'use client'

import { ServiciosHero }         from './ServiciosHero'
import { ServiciosMorphGallery } from './ServiciosMorphGallery'
import { CredencialesSection }   from './CredencialesSection'
import { TejidosMundoSection }   from './TejidosMundoSection'

export function ServiciosLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ServiciosHero />
      <ServiciosMorphGallery />
      <CredencialesSection />
      <TejidosMundoSection />
    </div>
  )
}
