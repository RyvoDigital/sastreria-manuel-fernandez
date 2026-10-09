import type { MedidasRow } from '../_components/MedidasFicha'
import type { Material, Pago, Prueba } from './[id]/secciones'
import type { Estado, Tipo } from './shared'

export interface Encargo {
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
  medidas_id: number | null
  caracteristicas: { chaqueta?: string[]; pantalon?: string[] }
  total: string | null
  notas_sastre: string | null
  comentarios: string | null
  taller_externo: string | null
  taller_enviado: string | null
  taller_devuelto: string | null
  cliente_id: number
  cliente_nombre: string
  cliente_apellidos: string | null
  cliente_telefono: string | null
  cliente_email: string | null
  entrega_cita_fecha: string | null
  entrega_cita_hora: string | null
  entrega_cita_estado: string | null
  updated_at: string
}

export interface EncargoDetalle {
  encargo: Encargo
  materiales: Material[]
  pruebas: Prueba[]
  pagos: Pago[]
  medidas: MedidasRow[]
  totales: { total: string | null; pagado: string | null; pendiente: string | null }
}
