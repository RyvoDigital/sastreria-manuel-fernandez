'use client'

import { ColeccionHero }       from './ColeccionHero'
import { ColeccionStatement }  from './ColeccionStatement'
import { ColeccionCategorias } from './ColeccionCategorias'
import { ColeccionEditorial }  from './ColeccionEditorial'
import { ColeccionCarrusel }   from './ColeccionCarrusel'
import { ColeccionGrid }       from './ColeccionGrid'
import { ColeccionFinal }      from './ColeccionFinal'

export function ColeccionLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ColeccionHero />
      <ColeccionStatement />
      <ColeccionCategorias />
      <ColeccionEditorial />
      <ColeccionCarrusel />
      <ColeccionGrid />
      <ColeccionFinal />
    </div>
  )
}
