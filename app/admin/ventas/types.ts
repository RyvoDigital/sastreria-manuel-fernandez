import { desgloseIva, toCents } from '@/lib/admin/ventas-calc'

export interface VentaLinea {
  id: number
  variante_id: number | null
  producto_id: number | null
  descripcion: string
  sku: string | null
  unidad: string | null
  cantidad: string
  cantidad_devuelta: string
  pvp_unitario: string
  descuento_pct: string
  importe_descuento: string
  iva: string
  base: string
  cuota_iva: string
  total: string
  devolvible: boolean
}

export interface VentaDetalle {
  venta: {
    id: number
    numero: string
    fecha: string
    total: string
    total_base: string
    total_iva: string
    descuento_total: string
    metodo_pago: string
    pagos: { metodo: string; importe: string }[] | null
    estado: 'completada' | 'devuelta_parcial' | 'devuelta'
    notas: string | null
    admin_nombre: string | null
    cliente_id: number | null
    cliente_nombre: string | null
    cliente_apellidos: string | null
    cliente_telefono: string | null
    cliente_email: string | null
    cliente_nif: string | null
  }
  lineas: VentaLinea[]
  devoluciones: {
    id: number
    numero: string
    fecha: string
    importe_total: string
    metodo_reembolso: string
    motivo: string | null
    admin_nombre: string | null
    lineas: { venta_linea_id: number; cantidad: string; importe: string; reponer_stock: boolean }[]
  }[]
  empresa: { direccion: string | null; telefono: string | null }
}

export const desgloseVenta = (lineas: VentaLinea[]) =>
  desgloseIva(lineas.map((l) => ({ iva: Number(l.iva), base: toCents(l.base), cuota: toCents(l.cuota_iva) })))
