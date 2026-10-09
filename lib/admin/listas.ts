import { query } from '../db'
import { HttpError } from './server'

// Small editable lists (Ajustes → Listas): workshop tailors and stock locations.
// Same shape: nombre, orden, activo. Products keep the location name as text.
export const LISTAS = { sastres: 'sastres', ubicaciones: 'ubicaciones' } as const
export type Lista = keyof typeof LISTAS

export function parseLista(raw: string): Lista {
  if (!(raw in LISTAS)) throw new HttpError(404, 'not found')
  return raw as Lista
}

export async function listar(lista: Lista) {
  const result = await query(`SELECT id, nombre, orden, activo FROM ${LISTAS[lista]} ORDER BY activo DESC, orden, lower(nombre)`)
  return result.rows
}

function nombre(body: Record<string, unknown>) {
  const value = String(body.nombre ?? '').trim().slice(0, 100)
  if (!value) throw new HttpError(400, 'nombre required')
  return value
}

export async function crear(lista: Lista, body: Record<string, unknown>) {
  const result = await query(
    `INSERT INTO ${LISTAS[lista]} (nombre, orden)
     VALUES ($1, (SELECT COALESCE(MAX(orden), 0) + 1 FROM ${LISTAS[lista]})) RETURNING id, nombre, orden, activo`,
    [nombre(body)]
  )
  return result.rows[0]
}

export async function actualizar(lista: Lista, id: number, body: Record<string, unknown>) {
  const sets: string[] = []
  const params: unknown[] = []
  if ('nombre' in body) sets.push(`nombre = $${params.push(nombre(body))}`)
  if ('activo' in body) sets.push(`activo = $${params.push(body.activo === true)}`)
  if ('orden' in body) sets.push(`orden = $${params.push(Math.max(0, Math.min(10000, Number(body.orden) || 0)))}`)
  if (sets.length === 0) throw new HttpError(400, 'nothing to update')
  params.push(id)
  const result = await query(
    `UPDATE ${LISTAS[lista]} SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING id, nombre, orden, activo`,
    params
  )
  if (!result.rows[0]) throw new HttpError(404, 'not found')
  return result.rows[0]
}
