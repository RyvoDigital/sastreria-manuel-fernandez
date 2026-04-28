'use client'

import { ServiciosHero }       from './ServiciosHero'
import { CredencialesSection } from './CredencialesSection'
import { TejidosMundoSection } from './TejidosMundoSection'

export function ServiciosLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ServiciosHero />
      <CredencialesSection />
      <TejidosMundoSection />
    </div>
  )
}
