/**
 * Deploy-time feature flags (per Vercel project / env).
 * These are independent of the shared database `settings` table.
 *
 * Ryvo production (hide Modelos 3D):
 *   NEXT_PUBLIC_HIDE_MODELOS3D=true
 *
 * Ajemark / local (show Modelos 3D when admin setting is on):
 *   leave unset, or NEXT_PUBLIC_HIDE_MODELOS3D=false
 */
export function isModelos3dHiddenByDeploy(): boolean {
  const v = process.env.NEXT_PUBLIC_HIDE_MODELOS3D
  return v === 'true' || v === '1' || v === 'yes'
}
