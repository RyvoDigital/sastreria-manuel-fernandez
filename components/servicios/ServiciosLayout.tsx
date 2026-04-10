'use client'

import { ServiciosHero }       from './ServiciosHero'
import { ServiciosSimple }     from './ServiciosSimple'
import { CredencialesSection } from './CredencialesSection'
import { TejidosMundoSection } from './TejidosMundoSection'

export function ServiciosLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ServiciosHero />
      <ServiciosSimple />
      <CredencialesSection />
      <TejidosMundoSection />
    </div>
  )
}
