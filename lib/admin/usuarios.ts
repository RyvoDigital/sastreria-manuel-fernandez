import { query } from '../db'
import { hashPassword } from './auth'
import { HttpError, withTransaction, type CurrentAdmin, type Role } from './server'

const ROLES: readonly Role[] = ['owner', 'manager']
const MIN_PASSWORD = 8

function checkRole(role: unknown): Role {
  if (!ROLES.includes(role as Role)) throw new HttpError(400, 'invalid role')
  return role as Role
}

function checkPassword(password: unknown): string {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) throw new HttpError(400, 'password too short')
  return password
}

export async function listUsuarios() {
  const result = await query(
    `SELECT id, name, email, role, activo, created_at FROM admins ORDER BY activo DESC, lower(name)`
  )
  return result.rows
}

export async function createUsuario(body: Record<string, unknown>) {
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!name) throw new HttpError(400, 'name required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'invalid email')
  const role = checkRole(body.role ?? 'manager')
  const hash = await hashPassword(checkPassword(body.password))
  const result = await query(
    `INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, activo, created_at`,
    [name, email, hash, role]
  )
  return result.rows[0]
}

export async function updateUsuario(id: number, body: Record<string, unknown>, actor: CurrentAdmin) {
  return withTransaction(async (client) => {
    // Lock the owners so two owners can't demote each other at the same moment
    const owners = await client.query(`SELECT id FROM admins WHERE role = 'owner' AND activo FOR UPDATE`)
    const target = (await client.query(`SELECT id, role, activo FROM admins WHERE id = $1 FOR UPDATE`, [id])).rows[0]
    if (!target) throw new HttpError(404, 'not found')

    const sets: string[] = []
    const params: unknown[] = []
    const set = (col: string, value: unknown) => {
      params.push(value)
      sets.push(`${col} = $${params.length}`)
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim()
      if (!name) throw new HttpError(400, 'name required')
      set('name', name)
    }
    const role = body.role !== undefined ? checkRole(body.role) : target.role
    const activo = body.activo !== undefined ? Boolean(body.activo) : target.activo
    if (body.role !== undefined) set('role', role)
    if (body.activo !== undefined) set('activo', activo)
    if (body.password !== undefined) set('password_hash', await hashPassword(checkPassword(body.password)))
    if (sets.length === 0) throw new HttpError(400, 'nothing to update')

    if (id === actor.id && (!activo || role !== 'owner')) throw new HttpError(400, 'cannot demote self')
    const losesOwner = target.role === 'owner' && target.activo && (role !== 'owner' || !activo)
    if (losesOwner && owners.rowCount! <= 1) throw new HttpError(400, 'last owner')

    params.push(id)
    const result = await client.query(
      `UPDATE admins SET ${sets.join(', ')} WHERE id = $${params.length}
       RETURNING id, name, email, role, activo, created_at`,
      params
    )
    return result.rows[0]
  })
}
