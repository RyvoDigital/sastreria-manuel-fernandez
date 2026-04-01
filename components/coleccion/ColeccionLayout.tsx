'use client'

import { ColeccionShopHero } from './ColeccionShopHero'
import { ColeccionShop }     from './ColeccionShop'
import { ColeccionCTA }      from './ColeccionCTA'

export function ColeccionLayout() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ColeccionShopHero />
      <ColeccionShop />
      <ColeccionCTA />
    </div>
  )
}
