'use client'

import { useAdminI18n } from '@/lib/admin/i18n'
import { Badge } from '../_components/ui'

export const ESTADOS = ['presupuesto', 'confirmado', 'prueba', 'listo', 'entregado'] as const
export type Estado = (typeof ESTADOS)[number]
export const TIPOS = ['prenda', 'camisa', 'arreglo'] as const
export type Tipo = (typeof TIPOS)[number]
export const PRENDAS_PRENDA = ['americana', 'pantalon', 'chaleco', 'abrigo', 'otra'] as const
// Default fabric per garment for a talla M (Evelyn), editable on each material line
export const METROS_DEFECTO: Record<string, number> = { americana: 1.8, pantalon: 1.2, chaleco: 0.7 }

export interface EncargoResumen {
  id: number
  numero: string
  tipo: Tipo
  prendas: string[]
  pedido: string | null
  estado: Estado
  fecha_encargo: string
  fecha_entrega: string | null
  sastre_id: number | null
  sastre: string | null
  cliente_id: number
  cliente: string
  taller_externo: string | null
  taller_enviado: string | null
  taller_devuelto: string | null
  proxima_prueba: string | null
  total?: string | null
  pagado?: string | null
}

export function useEncargoTexto() {
  const { t } = useAdminI18n()
  const e = t.encargos
  // "Americana + pantalón" for garments, the free text for arreglos
  const prendas = (x: { tipo: Tipo; prendas: string[]; pedido: string | null }) => {
    if (x.tipo === 'arreglo') return x.pedido || e.tipos.arreglo
    const list = (x.prendas ?? []).map((p) => e.prendas[p as keyof typeof e.prendas] ?? p)
    return list.length ? list.join(' + ') : e.tipos[x.tipo]
  }
  return { e, prendas }
}

const TONO: Record<Estado, 'neutral' | 'gold' | 'amber' | 'green' | 'red'> = {
  presupuesto: 'neutral',
  confirmado: 'gold',
  prueba: 'amber',
  listo: 'green',
  entregado: 'neutral',
}

export function EstadoBadge({ estado }: { estado: Estado }) {
  const { t } = useAdminI18n()
  return <Badge tone={TONO[estado]}>{t.encargos.estados[estado]}</Badge>
}
