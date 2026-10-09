// The shop's paper "Ficha de trabajo" (Evelyn, October 2026), field by field.
// Labels live in i18n (t.ficha). Values are cm unless the field is a choice, a yes/no or free text.
// A measurement set (cliente_medidas row, tipo_prenda 'ficha') holds every section at once:
//   medidas = { chaqueta: {...}, pantalon: {...}, chaleco: {...}, postura: ['hombros_caidos', ...] }
//   observaciones = "Observaciones de postura y morfología"
// Rows saved before the ficha existed (tipo 'general', 'chaqueta'…, imported notes) are shown read-only.

export type CampoFicha =
  | { key: string; kind: 'cm' }
  | { key: string; kind: 'opcion'; opciones: readonly string[] }
  | { key: string; kind: 'sino' }
  | { key: string; kind: 'texto' }

const cm = (key: string): CampoFicha => ({ key, kind: 'cm' })

export const SECCIONES_MEDIDAS = {
  chaqueta: [
    cm('talle'), cm('largo_total'), cm('pecho'), cm('entalle'), cm('cintura'), cm('cadera'), cm('hombro_a_hombro'),
    cm('hombro'), cm('largo_manga_d'), cm('largo_manga_iz'), cm('sisa'), cm('biceps'), cm('antebrazo'), cm('puno'),
    cm('espalda'), cm('separacion_pinzas'), cm('cuello'),
    { key: 'solapa', kind: 'opcion', opciones: ['punta', 'clasica'] },
    { key: 'botones', kind: 'opcion', opciones: ['A', 'M'] },
    { key: 'cerillera', kind: 'sino' },
  ],
  pantalon: [
    cm('cintura'), cm('cadera'), cm('largo_total'), cm('tiro_delantero'), cm('tiro_trasero'), cm('muslo'), cm('rodilla'),
    cm('boca'), cm('fundillo'),
    { key: 'bajo_vuelto', kind: 'sino' },
    { key: 'pinzas', kind: 'sino' },
    cm('cinturon'),
    { key: 'observaciones', kind: 'texto' },
  ],
  chaleco: [cm('pecho'), cm('cintura'), cm('largo_delante'), cm('largo_detras'), cm('boton_1'), cm('boton_2'), cm('boton_3')],
} as const satisfies Record<string, readonly CampoFicha[]>

export type SeccionMedidas = keyof typeof SECCIONES_MEDIDAS
export const SECCIONES: readonly SeccionMedidas[] = ['chaqueta', 'pantalon', 'chaleco']

export const POSTURA = [
  'postura_correcta', 'postura_quebrada', 'espalda_encorvada', 'hombros_caidos', 'hombros_rectos',
  'pectoral_normal', 'pectoral_fuerte', 'espalda_normal', 'espalda_fuerte', 'vientre_prominente',
  'pelvis_adelantada', 'inclinacion_delante', 'inclinacion_atras', 'hombro_d_bajo', 'hombro_i_bajo',
] as const

// Garment choices, stored per encargo (encargos.caracteristicas = { chaqueta: [...], pantalon: [...] })
export const CARACTERISTICAS = {
  chaqueta: [
    'hombro_natural', 'hombro_caida', 'hombro_estructurado', 'iniciales', 'forro_clasico', 'forro_especial',
    'bolsillos_rectos', 'bolsillos_inclinados', 'bolsillo_ticket', 'solapa_clasica', 'solapa_pico', 'solapa_inglesa',
    'solapa_seda', 'cruce_sencillo', 'cruce_doble', 'aberturas_laterales', 'abertura_central', 'sin_abertura',
  ],
  pantalon: [
    'clasico', 'sin_pinzas', 'una_pinza', 'dos_pinzas', 'cinturon', 'tirantes', 'sin_vuelto', 'corte_recto',
    'corte_entallado', 'bolsillos_rectos', 'bolsillos_inclinados', 'trasero_con_boton', 'trasero_sin_boton',
  ],
} as const

export type FichaMedidas = Partial<Record<SeccionMedidas, Record<string, number | string | boolean>>> & { postura?: string[] }

// Server-side clean-up of a submitted set: known keys only, cm as numbers (comma or dot), choices checked
export function limpiarFicha(raw: unknown): FichaMedidas {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: FichaMedidas = {}
  for (const seccion of SECCIONES) {
    const values = (input[seccion] && typeof input[seccion] === 'object' ? input[seccion] : {}) as Record<string, unknown>
    const clean: Record<string, number | string | boolean> = {}
    for (const campo of SECCIONES_MEDIDAS[seccion] as readonly CampoFicha[]) {
      const v = values[campo.key]
      if (v === undefined || v === null || v === '') continue
      if (campo.kind === 'cm') {
        const n = Number(String(v).replace(',', '.'))
        if (!Number.isFinite(n) || n < 0 || n > 400) throw new Error(`invalid ${seccion}.${campo.key}`)
        clean[campo.key] = Math.round(n * 10) / 10
      } else if (campo.kind === 'opcion') {
        if (!campo.opciones.includes(String(v))) throw new Error(`invalid ${seccion}.${campo.key}`)
        clean[campo.key] = String(v)
      } else if (campo.kind === 'sino') {
        if (v === true || v === 'si') clean[campo.key] = true
        else if (v === false || v === 'no') clean[campo.key] = false
      } else {
        const text = String(v).trim().slice(0, 500)
        if (text) clean[campo.key] = text
      }
    }
    if (Object.keys(clean).length > 0) out[seccion] = clean
  }
  const postura = Array.isArray(input.postura) ? input.postura.filter((p): p is string => (POSTURA as readonly unknown[]).includes(p)) : []
  if (postura.length > 0) out.postura = [...new Set(postura)]
  return out
}

export function limpiarCaracteristicas(raw: unknown) {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: Partial<Record<keyof typeof CARACTERISTICAS, string[]>> = {}
  for (const seccion of ['chaqueta', 'pantalon'] as const) {
    const list = Array.isArray(input[seccion]) ? (input[seccion] as unknown[]) : []
    const valid = list.filter((x): x is string => (CARACTERISTICAS[seccion] as readonly unknown[]).includes(x))
    if (valid.length > 0) out[seccion] = [...new Set(valid)]
  }
  return out
}
