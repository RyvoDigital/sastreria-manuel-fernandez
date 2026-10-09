import { query } from '../db'
import { HttpError, type CurrentAdmin } from './server'
import { validarCantidad } from './stock'

// "Por pedir": items a customer wanted when there was no stock (sales never go negative).
// pendiente → pedido → resuelto; the Panel lists the open ones.
const ESTADOS = ['pendiente', 'pedido', 'resuelto'] as const

export async function listPorPedir(opts: { abiertos?: boolean } = {}) {
  const result = await query(
    `SELECT pp.id, pp.descripcion, pp.cantidad, pp.estado, pp.notas, pp.created_at, pp.admin_nombre,
            pp.variante_id, v.stock_actual, p.id AS producto_id, p.unidad,
            pp.cliente_id, trim(c.nombre || ' ' || coalesce(c.apellidos, '')) AS cliente
       FROM por_pedir pp
       LEFT JOIN producto_variantes v ON v.id = pp.variante_id
       LEFT JOIN productos p ON p.id = v.producto_id
       LEFT JOIN clientes c ON c.id = pp.cliente_id
      WHERE ${opts.abiertos ? `pp.estado <> 'resuelto'` : 'TRUE'}
      ORDER BY pp.estado = 'pedido', pp.created_at
      LIMIT 200`
  )
  return result.rows
}

export async function crearPorPedir(body: Record<string, unknown>, admin: CurrentAdmin) {
  const varianteId = body.variante_id ? Number(body.variante_id) : null
  let descripcion = String(body.descripcion ?? '').trim().slice(0, 250)
  let unidad = 'ud'
  if (varianteId) {
    const v = (await query(
      `SELECT p.nombre, v.etiqueta, v.es_unica, p.unidad FROM producto_variantes v JOIN productos p ON p.id = v.producto_id WHERE v.id = $1`,
      [varianteId]
    )).rows[0]
    if (!v) throw new HttpError(400, 'invalid variante')
    unidad = v.unidad
    if (!descripcion) descripcion = v.es_unica || !v.etiqueta ? v.nombre : `${v.nombre} · ${v.etiqueta}`
  }
  if (!descripcion) throw new HttpError(400, 'descripcion required')
  const cantidad = Number(String(body.cantidad ?? 1).replace(',', '.'))
  validarCantidad(cantidad, unidad)
  if (cantidad < 0) throw new HttpError(400, 'invalid quantity')
  const result = await query(
    `INSERT INTO por_pedir (variante_id, descripcion, cantidad, cliente_id, notas, admin_id, admin_nombre)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [varianteId, descripcion, cantidad, body.cliente_id ? Number(body.cliente_id) : null,
      String(body.notas ?? '').trim() || null, admin.id, admin.name]
  )
  return result.rows[0]
}

export async function actualizarPorPedir(id: number, body: Record<string, unknown>) {
  if (!(ESTADOS as readonly unknown[]).includes(body.estado)) throw new HttpError(400, 'invalid estado')
  const result = await query(
    `UPDATE por_pedir SET estado = $1, updated_at = now() WHERE id = $2 RETURNING *`,
    [body.estado, id]
  )
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}
