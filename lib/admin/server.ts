import type { PoolClient } from 'pg'
import { NextResponse } from 'next/server'
import { pool, query } from '../db'
import { requireAuth } from './auth'

// owner = Propietario (everything), manager = Empleado (no prices, costs, margins or client data
// beyond the name), taller = workshop login that only sees the Taller board.
export type Role = 'owner' | 'manager' | 'taller'
export const ROLES: readonly Role[] = ['owner', 'manager', 'taller']

export interface CurrentAdmin {
  id: number
  name: string
  email: string
  role: Role
}

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

// The JWT outlives a deactivation or a role change by up to 8h, so gestión routes re-check the row.
// Taller users are refused unless the route opts in (only the Taller board does).
export async function requireAdmin(opts: { taller?: boolean } = {}): Promise<CurrentAdmin> {
  const session = await requireAuth({ taller: true })
  const result = await query(
    `SELECT id, name, email, role FROM admins WHERE id = $1 AND activo IS NOT FALSE`,
    [session.id]
  )
  const admin = result.rows[0] as CurrentAdmin | undefined
  if (!admin) throw new Error('Unauthorized')
  if (admin.role === 'taller' && !opts.taller) throw new HttpError(403, 'forbidden')
  return admin
}

// Prices, costs, margins, payments and client data beyond the name are for Propietarios only
export function esPropietario(admin: CurrentAdmin) {
  return admin.role === 'owner'
}

export function requirePropietarioData(admin: CurrentAdmin) {
  if (!esPropietario(admin)) throw new HttpError(403, 'forbidden')
}

const MONEY_KEYS = new Set(['coste', 'pvp', 'coste_medio', 'coste_unitario', 'total', 'importe', 'pagado', 'pendiente', 'pagos'])

// Recursively blanks prices, costs and payments in a response for non-owners
export function sinDineroDeep<T>(admin: CurrentAdmin, data: T): T {
  if (esPropietario(admin)) return data
  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk)
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, MONEY_KEYS.has(k) ? null : walk(v)]))
    }
    return value
  }
  return walk(data) as T
}

// Drops price and cost fields an Empleado sends, so their edits never touch them
export function sinDineroBody(admin: CurrentAdmin, body: Record<string, unknown>) {
  if (esPropietario(admin)) return body
  const copy = { ...body }
  for (const key of ['coste', 'pvp', 'total']) delete copy[key]
  if (Array.isArray(copy.variantes)) {
    copy.variantes = copy.variantes.map((v: Record<string, unknown>) => {
      const rest = { ...v }
      delete rest.coste
      delete rest.pvp
      return rest
    })
  }
  return copy
}

// Blanks the money fields of each row for non-owners (keeps the keys so the UI shapes stay the same)
export function sinDinero<T extends Record<string, unknown>>(admin: CurrentAdmin, rows: T[], keys: readonly string[]): T[] {
  if (esPropietario(admin)) return rows
  return rows.map((row) => {
    const copy: Record<string, unknown> = { ...row }
    for (const key of keys) if (key in copy) copy[key] = null
    return copy as T
  })
}

export async function requireOwner(): Promise<CurrentAdmin> {
  const admin = await requireAdmin()
  if (admin.role !== 'owner') throw new HttpError(403, 'forbidden')
  return admin
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Wraps a route handler body with the auth / validation / 500 mapping every admin route repeats.
export async function handle(label: string, fn: () => Promise<unknown>) {
  try {
    const data = await fn()
    return NextResponse.json(data)
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: error.status })
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'invalid json' }, { status: 400 })
    }
    const pgCode = (error as { code?: string }).code
    if (pgCode === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 })
    }
    if (pgCode === '23503') {
      return NextResponse.json({ error: 'in use' }, { status: 409 })
    }
    console.error(`${label} error:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export function parseId(raw: string): number {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'invalid id')
  return id
}

// Trims strings, turns '' into null, and keeps only the whitelisted keys.
export function pickFields<K extends string>(body: Record<string, unknown>, keys: readonly K[]) {
  const out: Partial<Record<K, unknown>> = {}
  for (const key of keys) {
    if (!(key in body)) continue
    const value = body[key]
    out[key] = typeof value === 'string' ? (value.trim() === '' ? null : value.trim()) : value ?? null
  }
  return out
}

export function buildUpdate(table: string, id: number, fields: Record<string, unknown>, returning = '*') {
  const cols = Object.keys(fields)
  if (cols.length === 0) return null
  const sets = cols.map((c, i) => `${c} = $${i + 1}`)
  sets.push('updated_at = now()')
  return {
    sql: `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${cols.length + 1} RETURNING ${returning}`,
    params: [...Object.values(fields), id],
  }
}

// "grenadina azul" should find "Corbata grenadina · azul marino": every word must appear, in any order.
// Returns an SQL condition over `haystack` and pushes one parameter per word.
export function wordsMatch(q: string, haystack: string, params: unknown[]) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6)
  if (words.length === 0) return 'TRUE'
  return words
    .map((w) => {
      params.push(`%${w.replace(/[\\%_]/g, (c) => '\\' + c)}%`)
      return `${haystack} LIKE $${params.length}`
    })
    .join(' AND ')
}
