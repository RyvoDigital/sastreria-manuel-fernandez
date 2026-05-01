'use client'

import { BodasHero } from './BodasHero'
import { BodasTeCasas } from './BodasTeCasas'
import { BodasStatement } from './BodasStatement'
import { BodasCategorias } from './BodasCategorias'
import { BodasFormalWear } from './BodasFormalWear'
import { BodasProceso } from './BodasProceso'
import { BodasCarrusel } from './BodasCarrusel'
import { BodasFinal } from './BodasFinal'

export function BodasLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <BodasHero />
      <BodasTeCasas />
      <BodasStatement />
      <BodasCategorias />
      <BodasFormalWear />
      <BodasProceso />
      <BodasCarrusel />
      <BodasFinal />
    </div>
  )
}
