import { query } from '../db'
import { HttpError, buildUpdate, pickFields } from './server'

export const PROVEEDOR_FIELDS = [
  'nombre', 'razon_social', 'nif', 'persona_contacto', 'email', 'telefono', 'web',
  'direccion', 'ciudad', 'pais', 'condiciones', 'notas', 'activo',
] as const

function normalise(body: Record<string, unknown>) {
  const fields = pickFields(body, PROVEEDOR_FIELDS)
  if ('nombre' in fields && !fields.nombre) throw new HttpError(400, 'nombre required')
  if (typeof fields.email === 'string') fields.email = fields.email.toLowerCase()
  return fields
}

export async function listProveedores(opts: { q?: string; archivados?: boolean }) {
  const params: unknown[] = []
  const where = [opts.archivados ? 'activo = FALSE' : 'activo = TRUE']
  if (opts.q) {
    params.push(`%${opts.q.toLowerCase()}%`)
    where.push(`(lower(nombre) LIKE $1 OR lower(coalesce(persona_contacto, '')) LIKE $1 OR lower(coalesce(email, '')) LIKE $1)`)
  }
  const result = await query(
    `SELECT id, nombre, persona_contacto, email, telefono, ciudad, pais, activo
       FROM proveedores WHERE ${where.join(' AND ')} ORDER BY lower(nombre)`,
    params
  )
  return result.rows
}

export async function getProveedor(id: number) {
  const proveedor = (await query(`SELECT * FROM proveedores WHERE id = $1`, [id])).rows[0]
  if (!proveedor) throw new HttpError(404, 'not found')
  return { proveedor }
}

export async function createProveedor(body: Record<string, unknown>) {
  const fields = normalise(body)
  if (!fields.nombre) throw new HttpError(400, 'nombre required')
  const cols = Object.keys(fields)
  const result = await query(
    `INSERT INTO proveedores (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
    Object.values(fields)
  )
  return result.rows[0]
}

export async function updateProveedor(id: number, body: Record<string, unknown>) {
  const update = buildUpdate('proveedores', id, normalise(body))
  if (!update) throw new HttpError(400, 'nothing to update')
  const result = await query(update.sql, update.params)
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}
