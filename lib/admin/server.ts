import type { PoolClient } from 'pg'
import { NextResponse } from 'next/server'
import { pool, query } from '../db'
import { requireAuth } from './auth'

export type Role = 'owner' | 'manager'

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

// The JWT outlives a deactivation by up to 8h, so gestión writes re-check the row.
export async function requireAdmin(): Promise<CurrentAdmin> {
  const session = await requireAuth()
  const result = await query(
    `SELECT id, name, email, role FROM admins WHERE id = $1 AND activo IS NOT FALSE`,
    [session.id]
  )
  if (!result.rows[0]) throw new Error('Unauthorized')
  return result.rows[0]
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
    const pgCode = (error as { code?: string }).code
    if (pgCode === '23505') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 })
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
