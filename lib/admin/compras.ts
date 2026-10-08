import { query } from '../db'
import { HttpError, withTransaction, type CurrentAdmin } from './server'
import { aplicarMovimientos, siguienteNumero } from './stock'

interface LineaInput {
  variante_id: number
  cantidad: number | string
  coste_unitario: number | string
}

// An entrada is recorded as received straight away: lines, numbering and stock movements in one transaction
export async function createCompra(body: Record<string, unknown>, admin: CurrentAdmin) {
  const proveedorId = Number(body.proveedor_id)
  if (!Number.isInteger(proveedorId) || proveedorId <= 0) throw new HttpError(400, 'proveedor required')
  const lineas = (Array.isArray(body.lineas) ? body.lineas : []) as LineaInput[]
  if (lineas.length === 0 || lineas.length > 200) throw new HttpError(400, 'lineas required')

  const parsed = lineas.map((l) => {
    const cantidad = Number(String(l.cantidad).replace(',', '.'))
    const coste = Number(String(l.coste_unitario ?? 0).replace(',', '.'))
    if (!Number.isInteger(Number(l.variante_id)) || !(cantidad > 0) || !(coste >= 0)) throw new HttpError(400, 'invalid linea')
    return { varianteId: Number(l.variante_id), cantidad, coste }
  })
  const fecha = typeof body.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.fecha) ? body.fecha : null

  return withTransaction(async (client) => {
    const proveedor = await client.query(`SELECT 1 FROM proveedores WHERE id = $1`, [proveedorId])
    if (!proveedor.rowCount) throw new HttpError(400, 'proveedor required')

    const numero = await siguienteNumero(client, 'C')
    const compra = (
      await client.query(
        `INSERT INTO compras (numero, proveedor_id, fecha, referencia_proveedor, notas, admin_id)
         VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4, $5, $6) RETURNING *, fecha::text AS fecha`,
        [numero, proveedorId, fecha, (body.referencia_proveedor as string)?.trim() || null, (body.notas as string)?.trim() || null, admin.id]
      )
    ).rows[0]

    const movimientos = []
    for (const l of parsed) {
      const linea = await client.query(
        `INSERT INTO compra_lineas (compra_id, variante_id, cantidad, coste_unitario) VALUES ($1, $2, $3, $4) RETURNING id`,
        [compra.id, l.varianteId, l.cantidad, l.coste]
      )
      movimientos.push({ varianteId: l.varianteId, tipo: 'compra' as const, cantidad: l.cantidad, costeUnitario: l.coste, compraLineaId: linea.rows[0].id })
    }
    await aplicarMovimientos(client, movimientos, admin)
    return compra
  })
}

export async function listCompras(opts: { proveedor?: number; offset?: number }) {
  const params: unknown[] = []
  const where = opts.proveedor ? `WHERE co.proveedor_id = $${params.push(opts.proveedor)}` : ''
  params.push(opts.offset ?? 0)
  const result = await query(
    `SELECT co.id, co.numero, co.fecha::text AS fecha, co.referencia_proveedor, co.estado, pr.id AS proveedor_id, pr.nombre AS proveedor,
            a.name AS admin_nombre,
            (SELECT COUNT(*) FROM compra_lineas l WHERE l.compra_id = co.id)::int AS lineas,
            (SELECT COALESCE(SUM(l.cantidad * l.coste_unitario), 0) FROM compra_lineas l WHERE l.compra_id = co.id) AS total
       FROM compras co
       JOIN proveedores pr ON pr.id = co.proveedor_id
       LEFT JOIN admins a ON a.id = co.admin_id
       ${where}
      ORDER BY co.fecha DESC, co.id DESC
      LIMIT 50 OFFSET $${params.length}`,
    params
  )
  return result.rows
}

export async function getCompra(id: number) {
  const compra = (
    await query(
      `SELECT co.*, co.fecha::text AS fecha, pr.nombre AS proveedor, a.name AS admin_nombre
         FROM compras co JOIN proveedores pr ON pr.id = co.proveedor_id LEFT JOIN admins a ON a.id = co.admin_id
        WHERE co.id = $1`,
      [id]
    )
  ).rows[0]
  if (!compra) throw new HttpError(404, 'not found')
  const lineas = await query(
    `SELECT l.*, v.etiqueta, v.es_unica, v.sku, p.id AS producto_id, p.nombre AS producto, p.unidad
       FROM compra_lineas l JOIN producto_variantes v ON v.id = l.variante_id JOIN productos p ON p.id = v.producto_id
      WHERE l.compra_id = $1 ORDER BY l.id`,
    [id]
  )
  return { compra, lineas: lineas.rows }
}
