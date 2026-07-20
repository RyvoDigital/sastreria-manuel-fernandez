/**
 * Deploy-time feature flags (per Vercel project). Independent of shared DB settings.
 *
 * Modelos 3D:
 * - Ryvo deploys: HIDDEN by default (detected via Vercel URL / repo owner in next.config)
 * - Ajemark / local: shown (admin setting still applies)
 * - Override anytime: NEXT_PUBLIC_HIDE_MODELOS3D=true|false
 */
export function isModelos3dHiddenByDeploy(): boolean {
  const v = process.env.NEXT_PUBLIC_HIDE_MODELOS3D
  return v === 'true' || v === '1' || v === 'yes'
}
