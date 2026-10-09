import { query } from '../db'
import { HttpError, withTransaction, type CurrentAdmin } from './server'
import { aplicarMovimientos, siguienteNumero, validarCantidad } from './stock'
import { METODOS_PAGO, calcularLinea, toCents, type MetodoPago as Metodo } from './ventas-calc'

export { METODOS_PAGO }

// Sales register. Records sales and prints a NON-FISCAL ticket; legal invoicing (VeriFactu) is out of scope.

const cents = toCents
const euros = (c: number) => (c / 100).toFixed(2)

function parseNumber(value: unknown, { min = 0, max = 1e9 } = {}) {
  const n = Number(String(value ?? '').replace(',', '.'))
  if (value === '' || value === null || value === undefined || !Number.isFinite(n) || n < min || n > max) {
    throw new HttpError(400, 'invalid number')
  }
  return n
}

interface LineaInput {
  variante_id?: number | null
  descripcion?: string
  cantidad: number | string
  pvp_unitario?: number | string
  descuento_pct?: number | string
  iva?: number | string
}

export async function createVenta(body: Record<string, unknown>, admin: CurrentAdmin) {
  const lineasIn = (Array.isArray(body.lineas) ? body.lineas : []) as LineaInput[]
  if (lineasIn.length === 0 || lineasIn.length > 100) throw new HttpError(400, 'lineas required')
  const metodo = body.metodo_pago as Metodo | 'mixto'
  if (metodo !== 'mixto' && !METODOS_PAGO.includes(metodo as Metodo)) throw new HttpError(400, 'invalid metodo')
  const clienteId = body.cliente_id ? parseNumber(body.cliente_id, { min: 1 }) : null

  return withTransaction(async (client) => {
    // Lock the variants up front so prices, costs and stock are read consistently
    const ids = [...new Set(lineasIn.filter((l) => l.variante_id).map((l) => Number(l.variante_id)))].sort((a, b) => a - b)
    const variantes = new Map(
      (
        await client.query(
          `SELECT v.id, v.etiqueta, v.es_unica, COALESCE(v.pvp, p.pvp) AS pvp, COALESCE(v.coste_medio, v.coste, p.coste) AS coste,
                  p.nombre, p.iva, p.unidad, p.activo AND v.activo AS activo
             FROM producto_variantes v JOIN productos p ON p.id = v.producto_id
            WHERE v.id = ANY($1::int[]) ORDER BY v.id FOR UPDATE OF v`,
          [ids]
        )
      ).rows.map((r) => [r.id as number, r])
    )

    if (clienteId) {
      const c = await client.query(`SELECT 1 FROM clientes WHERE id = $1`, [clienteId])
      if (!c.rowCount) throw new HttpError(400, 'invalid cliente')
    }

    const lineas = lineasIn.map((l) => {
      const cantidad = parseNumber(l.cantidad, { min: 0.001 })
      const descuentoPct = l.descuento_pct === undefined || l.descuento_pct === '' ? 0 : parseNumber(l.descuento_pct, { max: 100 })
      if (l.variante_id) {
        const v = variantes.get(Number(l.variante_id))
        if (!v) throw new HttpError(404, 'variant not found')
        if (!v.activo) throw new HttpError(400, 'inactive product')
        validarCantidad(cantidad, v.unidad)
        const pvp = l.pvp_unitario === undefined || l.pvp_unitario === '' ? Number(v.pvp ?? 0) : parseNumber(l.pvp_unitario)
        const iva = Number(v.iva)
        return {
          varianteId: v.id as number,
          descripcion: v.es_unica || !v.etiqueta ? v.nombre : `${v.nombre} · ${v.etiqueta}`,
          cantidad, pvpCents: cents(pvp), descuentoPct, iva,
          coste: v.coste === null ? null : Number(v.coste),
        }
      }
      // Free-text line (e.g. an alteration): sold without touching stock
      const descripcion = String(l.descripcion ?? '').trim().slice(0, 250)
      if (!descripcion) throw new HttpError(400, 'descripcion required')
      if (Math.abs(cantidad * 1000 - Math.round(cantidad * 1000)) > 1e-6) throw new HttpError(400, 'too many decimals')
      return {
        varianteId: null, descripcion, cantidad, pvpCents: cents(parseNumber(l.pvp_unitario)), descuentoPct,
        iva: l.iva === undefined || l.iva === '' ? 21 : parseNumber(l.iva, { max: 100 }), coste: null,
      }
    })

    const calcs = lineas.map((l) => calcularLinea(l.cantidad, l.pvpCents, l.descuentoPct, l.iva))
    const total = calcs.reduce((s, c) => s + c.total, 0)
    const totalBase = calcs.reduce((s, c) => s + c.base, 0)
    const descuentoTotal = calcs.reduce((s, c) => s + c.descuento, 0)

    let pagos: { metodo: Metodo; importe: string }[] | null = null
    if (metodo === 'mixto') {
      const raw = (Array.isArray(body.pagos) ? body.pagos : []) as { metodo: Metodo; importe: unknown }[]
      if (raw.length < 2 || raw.some((p) => !METODOS_PAGO.includes(p.metodo))) throw new HttpError(400, 'invalid pagos')
      const parts = raw.map((p) => ({ metodo: p.metodo, c: cents(parseNumber(p.importe)) }))
      if (parts.reduce((s, p) => s + p.c, 0) !== total) throw new HttpError(400, 'pagos mismatch')
      pagos = parts.map((p) => ({ metodo: p.metodo, importe: euros(p.c) }))
    }

    const numero = await siguienteNumero(client, 'V')
    const venta = (
      await client.query(
        `INSERT INTO ventas (numero, cliente_id, admin_id, admin_nombre, metodo_pago, pagos, total_base, total_iva, total, descuento_total, notas)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [numero, clienteId, admin.id, admin.name, metodo, pagos ? JSON.stringify(pagos) : null,
          euros(totalBase), euros(total - totalBase), euros(total), euros(descuentoTotal), (body.notas as string)?.trim() || null]
      )
    ).rows[0]

    const movimientos = []
    for (const [i, l] of lineas.entries()) {
      const c = calcs[i]
      const linea = await client.query(
        `INSERT INTO venta_lineas (venta_id, variante_id, descripcion, cantidad, pvp_unitario, descuento_pct, importe_descuento, iva, base, cuota_iva, total, coste_unitario)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [venta.id, l.varianteId, l.descripcion, l.cantidad, euros(l.pvpCents), l.descuentoPct, euros(c.descuento), l.iva,
          euros(c.base), euros(c.cuota), euros(c.total), l.coste]
      )
      if (l.varianteId) {
        movimientos.push({ varianteId: l.varianteId, tipo: 'venta' as const, cantidad: -l.cantidad, ventaLineaId: linea.rows[0].id as number })
      }
    }
    await aplicarMovimientos(client, movimientos, admin)
    return venta
  })
}

interface DevolucionLineaInput {
  venta_linea_id: number
  cantidad: number | string
  reponer_stock?: boolean
}

export async function createDevolucion(ventaId: number, body: Record<string, unknown>, admin: CurrentAdmin) {
  // Rows left at 0 in the form are skipped; "0,5" (Spanish decimal comma) must count as a quantity
  const input = ((Array.isArray(body.lineas) ? body.lineas : []) as DevolucionLineaInput[]).filter(
    (l) => Number(String(l.cantidad ?? '').replace(',', '.')) > 0
  )
  if (input.length === 0) throw new HttpError(400, 'lineas required')
  const metodo = body.metodo_reembolso as Metodo
  if (!METODOS_PAGO.includes(metodo)) throw new HttpError(400, 'invalid metodo')

  return withTransaction(async (client) => {
    const venta = (await client.query(`SELECT id FROM ventas WHERE id = $1 FOR UPDATE`, [ventaId])).rows[0]
    if (!venta) throw new HttpError(404, 'not found')
    const lineas = new Map(
      (
        await client.query(
          `SELECT l.*, p.unidad, COALESCE(cat.tipo = 'terminado', FALSE) AS devolvible,
                  COALESCE((SELECT SUM(dl.importe) FROM devolucion_lineas dl WHERE dl.venta_linea_id = l.id), 0) AS importe_devuelto
             FROM venta_lineas l
             LEFT JOIN producto_variantes v ON v.id = l.variante_id
             LEFT JOIN productos p ON p.id = v.producto_id
             LEFT JOIN categorias_producto cat ON cat.id = p.categoria_id
            WHERE l.venta_id = $1 ORDER BY l.id FOR UPDATE OF l`,
          [ventaId]
        )
      ).rows.map((r) => [r.id as number, r])
    )

    const plan = input.map((d) => {
      const l = lineas.get(Number(d.venta_linea_id))
      if (!l) throw new HttpError(400, 'invalid linea')
      // Only accessories (finished products) come back; free lines (arreglos, servicios) and workshop materials don't
      if (!l.devolvible) throw new HttpError(409, 'not returnable', { venta_linea_id: l.id })
      const cantidad = parseNumber(d.cantidad, { min: 0.001 })
      if (l.unidad) validarCantidad(cantidad, l.unidad)
      const pendiente = Math.round((Number(l.cantidad) - Number(l.cantidad_devuelta)) * 1000)
      const qty = Math.round(cantidad * 1000)
      if (qty > pendiente) throw new HttpError(409, 'return exceeds sold', { venta_linea_id: l.id, pendiente: pendiente / 1000 })
      // Proportional refund; the last unit takes the remainder so refunds never drift from what was paid
      const importe = qty === pendiente
        ? cents(l.total) - cents(l.importe_devuelto)
        : Math.round((cents(l.total) * cantidad) / Number(l.cantidad))
      return { linea: l, cantidad, importe, reponer: d.reponer_stock !== false && !!l.variante_id }
    })

    const importeTotal = plan.reduce((s, p) => s + p.importe, 0)
    const numero = await siguienteNumero(client, 'D')
    const devolucion = (
      await client.query(
        `INSERT INTO devoluciones (numero, venta_id, admin_id, admin_nombre, motivo, importe_total, metodo_reembolso)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [numero, ventaId, admin.id, admin.name, (body.motivo as string)?.trim() || null, euros(importeTotal), metodo]
      )
    ).rows[0]

    const movimientos = []
    for (const p of plan) {
      const dl = await client.query(
        `INSERT INTO devolucion_lineas (devolucion_id, venta_linea_id, cantidad, importe, reponer_stock) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [devolucion.id, p.linea.id, p.cantidad, euros(p.importe), p.reponer]
      )
      await client.query(`UPDATE venta_lineas SET cantidad_devuelta = cantidad_devuelta + $2 WHERE id = $1`, [p.linea.id, p.cantidad])
      if (p.reponer) {
        movimientos.push({
          varianteId: p.linea.variante_id as number,
          tipo: 'devolucion_venta' as const,
          cantidad: p.cantidad,
          costeUnitario: p.linea.coste_unitario === null ? null : Number(p.linea.coste_unitario),
          devolucionLineaId: dl.rows[0].id as number,
        })
      }
    }
    await aplicarMovimientos(client, movimientos, admin)

    await client.query(
      `UPDATE ventas SET estado = CASE
         WHEN NOT EXISTS (SELECT 1 FROM venta_lineas WHERE venta_id = $1 AND cantidad_devuelta < cantidad) THEN 'devuelta'
         ELSE 'devuelta_parcial' END
       WHERE id = $1`,
      [ventaId]
    )
    return devolucion
  })
}

export async function listVentas(opts: { q?: string; desde?: string; hasta?: string; cliente?: number; offset?: number }) {
  const params: unknown[] = []
  const p = (v: unknown) => (params.push(v), `$${params.length}`)
  const where: string[] = []
  if (opts.q) {
    const like = p(`%${opts.q.toLowerCase()}%`)
    where.push(`(lower(v.numero) LIKE ${like} OR lower(coalesce(c.nombre, '') || ' ' || coalesce(c.apellidos, '')) LIKE ${like}
      OR EXISTS (SELECT 1 FROM venta_lineas l WHERE l.venta_id = v.id AND lower(l.descripcion) LIKE ${like}))`)
  }
  if (opts.desde) where.push(`v.fecha >= (${p(opts.desde)}::date AT TIME ZONE 'Europe/Madrid')`)
  if (opts.hasta) where.push(`v.fecha < ((${p(opts.hasta)}::date + 1) AT TIME ZONE 'Europe/Madrid')`)
  if (opts.cliente) where.push(`v.cliente_id = ${p(opts.cliente)}`)
  const result = await query(
    `SELECT v.id, v.numero, v.fecha, v.total, v.metodo_pago, v.estado, v.admin_nombre,
            c.id AS cliente_id, trim(c.nombre || ' ' || coalesce(c.apellidos, '')) AS cliente,
            (SELECT COALESCE(SUM(d.importe_total), 0) FROM devoluciones d WHERE d.venta_id = v.id) AS devuelto,
            (SELECT COUNT(*) FROM venta_lineas l WHERE l.venta_id = v.id)::int AS lineas
       FROM ventas v LEFT JOIN clientes c ON c.id = v.cliente_id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY v.fecha DESC, v.id DESC
      LIMIT 50 OFFSET ${p(opts.offset ?? 0)}`,
    params
  )
  return result.rows
}

export async function getVenta(id: number) {
  const venta = (
    await query(
      `SELECT v.*, c.nombre AS cliente_nombre, c.apellidos AS cliente_apellidos, c.email AS cliente_email,
              c.telefono AS cliente_telefono, c.nif AS cliente_nif
         FROM ventas v LEFT JOIN clientes c ON c.id = v.cliente_id WHERE v.id = $1`,
      [id]
    )
  ).rows[0]
  if (!venta) throw new HttpError(404, 'not found')
  const [lineas, devoluciones, empresa] = await Promise.all([
    query(
      `SELECT l.*, v.producto_id, v.sku, p.unidad, COALESCE(cat.tipo = 'terminado', FALSE) AS devolvible
         FROM venta_lineas l LEFT JOIN producto_variantes v ON v.id = l.variante_id LEFT JOIN productos p ON p.id = v.producto_id
         LEFT JOIN categorias_producto cat ON cat.id = p.categoria_id
        WHERE l.venta_id = $1 ORDER BY l.id`,
      [id]
    ),
    query(
      `SELECT d.*, COALESCE(json_agg(json_build_object(
                'venta_linea_id', dl.venta_linea_id, 'cantidad', dl.cantidad, 'importe', dl.importe, 'reponer_stock', dl.reponer_stock
              ) ORDER BY dl.id) FILTER (WHERE dl.id IS NOT NULL), '[]') AS lineas
         FROM devoluciones d LEFT JOIN devolucion_lineas dl ON dl.devolucion_id = d.id
        WHERE d.venta_id = $1 GROUP BY d.id ORDER BY d.fecha`,
      [id]
    ),
    query(`SELECT id, value FROM editable_content WHERE id IN ('contact.address', 'contact.phone')`),
  ])
  const content = Object.fromEntries(empresa.rows.map((r) => [r.id, r.value]))
  return {
    venta,
    lineas: lineas.rows,
    devoluciones: devoluciones.rows,
    empresa: { direccion: content['contact.address'] || null, telefono: content['contact.phone'] || null },
  }
}

// Shop sales, refunds and online (Stripe) payments in one list, for cashing up
export async function listCobros(opts: { desde: string; hasta: string }) {
  const result = await query(
    `SELECT * FROM (
       SELECT 'venta' AS origen, v.id, v.numero AS referencia, v.fecha, v.total AS importe, v.metodo_pago AS metodo, v.pagos,
              trim(c.nombre || ' ' || coalesce(c.apellidos, '')) AS cliente
         FROM ventas v LEFT JOIN clientes c ON c.id = v.cliente_id
       UNION ALL
       SELECT 'devolucion', d.venta_id, d.numero, d.fecha, -d.importe_total, d.metodo_reembolso, NULL,
              trim(c.nombre || ' ' || coalesce(c.apellidos, ''))
         FROM devoluciones d JOIN ventas v ON v.id = d.venta_id LEFT JOIN clientes c ON c.id = v.cliente_id
       UNION ALL
       SELECT 'encargo', e.id, e.numero, ep.fecha, ep.importe, ep.metodo, ep.pagos,
              trim(c.nombre || ' ' || coalesce(c.apellidos, ''))
         FROM encargo_pagos ep JOIN encargos e ON e.id = ep.encargo_id JOIN clientes c ON c.id = e.cliente_id
       UNION ALL
       SELECT 'online', p.id, COALESCE(p.type, 'stripe'), p.created_at AT TIME ZONE 'UTC', p.amount / 100.0, 'stripe', NULL,
              COALESCE(p.customer_name, p.customer_email)
         FROM payments p WHERE p.status = 'paid'
     ) cobros
     WHERE fecha >= ($1::date AT TIME ZONE 'Europe/Madrid') AND fecha < (($2::date + 1) AT TIME ZONE 'Europe/Madrid')
     ORDER BY fecha DESC
     LIMIT 1000`,
    [opts.desde, opts.hasta]
  )
  return result.rows
}
