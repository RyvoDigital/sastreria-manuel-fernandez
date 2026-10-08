// Measurement fields per garment type, in cm. Labels live in i18n (t.medidas.campos).
// Provisional standard list until Evelyn sends the shop's own ficha de medidas (question E10).
export const TIPOS_PRENDA_MEDIDAS = ['general', 'chaqueta', 'pantalon', 'chaleco', 'camisa', 'abrigo'] as const
export type TipoPrendaMedidas = (typeof TIPOS_PRENDA_MEDIDAS)[number]

export const CAMPOS_MEDIDAS: Record<TipoPrendaMedidas, readonly string[]> = {
  general: ['altura', 'peso', 'cuello', 'pecho', 'cintura', 'cadera', 'hombros'],
  chaqueta: ['pecho', 'cintura', 'cadera', 'hombros', 'espalda', 'talle', 'largo_chaqueta', 'largo_manga', 'biceps', 'puno'],
  pantalon: ['cintura', 'cadera', 'tiro', 'largo_exterior', 'entrepierna', 'muslo', 'rodilla', 'bajo'],
  chaleco: ['pecho', 'cintura', 'largo_delantero', 'largo_espalda'],
  camisa: ['cuello', 'pecho', 'cintura', 'cadera', 'hombros', 'largo_manga', 'puno', 'largo_camisa'],
  abrigo: ['pecho', 'cintura', 'cadera', 'hombros', 'espalda', 'largo_abrigo', 'largo_manga', 'biceps'],
}

export function isTipoPrenda(value: unknown): value is TipoPrendaMedidas {
  return typeof value === 'string' && (TIPOS_PRENDA_MEDIDAS as readonly string[]).includes(value)
}
