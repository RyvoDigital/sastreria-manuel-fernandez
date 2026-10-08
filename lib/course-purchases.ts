/**
 * Course purchases are switched on and off from the admin panel:
 * Ajustes → "Compra de cursos" (settings row id `cursos-compra`).
 *
 * Purchases are open only when that row exists AND is enabled. A missing
 * row, a failed settings fetch or a DB error all mean "closed", so the
 * Cursos page shows the coming-soon pop-up and /api/stripe refuses course
 * checkouts.
 */
export const COURSE_PURCHASES_SETTING_ID = 'cursos-compra'
