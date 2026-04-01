'use client'

import { BodasHero } from './BodasHero'
import { BodasStatement } from './BodasStatement'
import { BodasCategorias } from './BodasCategorias'
import { BodasEditorial } from './BodasEditorial'
import { BodasProceso } from './BodasProceso'
import { BodasCarrusel } from './BodasCarrusel'
import { BodasFinal } from './BodasFinal'

export function BodasLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <BodasHero />
      <BodasStatement />
      <BodasCategorias />
      <BodasEditorial />
      <BodasProceso />
      <BodasCarrusel />
      <BodasFinal />
    </div>
  )
}
