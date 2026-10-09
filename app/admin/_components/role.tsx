'use client'

import { createContext, useContext } from 'react'
import type { Role } from '@/lib/admin/server'

// The signed-in user's role, read from the admins row by the admin layout.
// Hiding things here is only for the screen: every API route checks the role again.
const RolContext = createContext<Role>('owner')

export function RolProvider({ role, children }: { role: Role; children: React.ReactNode }) {
  return <RolContext.Provider value={role}>{children}</RolContext.Provider>
}

export function useRol() {
  const role = useContext(RolContext)
  return { role, propietario: role === 'owner', taller: role === 'taller' }
}
