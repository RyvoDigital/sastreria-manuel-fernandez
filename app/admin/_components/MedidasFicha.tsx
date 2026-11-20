'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, History } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { POSTURA, SECCIONES, SECCIONES_MEDIDAS, type CampoFicha, type FichaMedidas } from '@/lib/admin/medidas'
import { ErrorText, Field, Modal, api, btnDanger, btnPrimary, btnSecondary, formatDate, inputClass, intlLocale } from './ui'

// One measurement version (cliente_medidas row). 'ficha' rows follow the paper Ficha de trabajo;
// older rows (generic fields, imported notes) are shown as they were saved.
export interface MedidasRow {
  id: number
  tipo_prenda: string
  medidas: FichaMedidas & Record<string, unknown>
  observaciones: string | null
  tomada_en: string
  tomada_por_nombre: string | null
}

export function useFichaLabels() {
  const { t, locale } = useAdminI18n()
  const f = t.ficha
  const nf = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 })
  const campo = (seccion: string, key: string) => (f[seccion as 'chaqueta'] as Record<string, string>)[key] ?? key.replace(/_/g, ' ')
  const valor = (c: CampoFicha, v: unknown) => {
    if (c.kind === 'sino') return v === true ? f.si : v === false ? f.no : ''
    if (c.kind === 'opcion') return f.opciones[String(v)] ?? String(v)
    // cm with the locale's decimal comma (46,5)
    return typeof v === 'number' ? nf.format(v) : String(v)
  }
  return { f, campo, valor }
}

export function MedidasVersionLabel({ row }: { row: MedidasRow }) {
  const { t, locale } = useAdminI18n()
  return (
    <span>
      {formatDate(row.tomada_en, locale)}
      {row.tomada_por_nombre && ` · ${t.medidas.tomadaPor}: ${row.tomada_por_nombre}`}
      {row.tipo_prenda !== 'ficha' && ` · ${t.medidas.anteriores}`}
    </span>
  )
}

export function FichaMedidasView({ row, compact = false }: { row: MedidasRow; compact?: boolean }) {
  const { t } = useAdminI18n()
  const { f, campo, valor } = useFichaLabels()

  if (row.tipo_prenda !== 'ficha') {
    // Pre-ficha rows: generic keys
    const entries = Object.entries(row.medidas ?? {})
    return (
      <div>
        {entries.length > 0 && (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            {entries.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-xs text-gray-400 truncate">{t.medidas.campos[key] ?? key.replace(/_/g, ' ')}</dt>
                <dd className="text-white tabular-nums">{String(value)}</dd>
              </div>
            ))}
          </dl>
        )}
        {row.observaciones && <p className="text-sm text-gray-300 mt-3 whitespace-pre-line">{row.observaciones}</p>}
      </div>
    )
  }

  const postura = row.medidas.postura ?? []
  return (
    <div className="space-y-4">
      {SECCIONES.map((s) => {
        const values = row.medidas[s] ?? {}
        const campos = (SECCIONES_MEDIDAS[s] as readonly CampoFicha[]).filter((c) => values[c.key] !== undefined)
        if (campos.length === 0) return null
        return (
          <div key={s}>
            <div className="text-xs uppercase tracking-wider text-[#C9A84C] mb-2">{f.secciones[s]}</div>
            <dl className={`grid gap-x-4 gap-y-2 text-sm ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {campos.map((c) => (
                <div key={c.key} className={`min-w-0 ${c.kind === 'texto' ? 'col-span-full' : ''}`}>
                  <dt className="text-xs text-gray-400 truncate">{campo(s, c.key)}</dt>
                  <dd className="text-white tabular-nums whitespace-pre-line">{valor(c, values[c.key])}</dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
      {(postura.length > 0 || row.observaciones) && (
        <div>
          <div className="text-xs uppercase tracking-wider text-[#C9A84C] mb-2">{f.secciones.postura}</div>
          {postura.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {postura.map((p) => (
                <li key={p} className="px-2 py-0.5 rounded-full bg-[#1E3A5F]/40 text-xs text-gray-200">{f.postura[p] ?? p}</li>
              ))}
            </ul>
          )}
          {row.observaciones && <p className="text-sm text-gray-300 mt-2 whitespace-pre-line">{row.observaciones}</p>}
        </div>
      )}
    </div>
  )
}

type FormValues = Record<string, Record<string, string>>

function toForm(base: MedidasRow | null): { values: FormValues; postura: string[]; observaciones: string } {
  const values: FormValues = { chaqueta: {}, pantalon: {}, chaleco: {} }
  if (base?.tipo_prenda === 'ficha') {
    for (const s of SECCIONES) {
      for (const [k, v] of Object.entries(base.medidas[s] ?? {})) {
        values[s][k] = v === true ? 'si' : v === false ? 'no' : String(v).replace('.', ',')
      }
    }
  }
  return {
    values,
    postura: base?.tipo_prenda === 'ficha' ? [...(base.medidas.postura ?? [])] : [],
    observaciones: base?.tipo_prenda === 'ficha' ? base.observaciones ?? '' : '',
  }
}

// ── Never lose typed measurements ─────────────────────────────────────────────
// The form doesn't close on an outside click or Esc. Cancel, X, the browser's back gesture, a reload
// or closing the tab ask first when something changed. Every change is also kept as a draft in this
// browser (per client) until it is saved, and offered back the next time the form opens.

interface Borrador {
  values: FormValues
  postura: string[]
  observaciones: string
  fecha: string
  savedAt: string
}

const borradorKey = (clienteId: number) => `smf-admin:medidas-borrador:${clienteId}`

function leerBorrador(clienteId: number): Borrador | null {
  try {
    const raw = localStorage.getItem(borradorKey(clienteId))
    const b = raw ? (JSON.parse(raw) as Borrador) : null
    return b && b.values && Array.isArray(b.postura) ? b : null
  } catch {
    return null
  }
}

function guardarBorrador(clienteId: number, b: Borrador) {
  try {
    localStorage.setItem(borradorKey(clienteId), JSON.stringify(b))
  } catch {
    // storage full or blocked: the leave confirmations still protect the typing
  }
}

function borrarBorrador(clienteId: number) {
  try {
    localStorage.removeItem(borradorKey(clienteId))
  } catch {
    // ignore
  }
}

// What counts as "changed": the measurements, posture and notes (empty fields ignored)
function huella(values: FormValues, postura: string[], observaciones: string) {
  const v = Object.fromEntries(
    Object.entries(values).map(([s, campos]) => [s, Object.fromEntries(Object.entries(campos).filter(([, x]) => x.trim() !== '').sort())])
  )
  return JSON.stringify([v, [...postura].sort(), observaciones.trim()])
}

// A new measurement version, prefilled from `base` (the latest set) so only what changed needs typing
export function MedidasFormModal({ clienteId, base, onClose, onSaved }: {
  clienteId: number
  base: MedidasRow | null
  onClose: () => void
  onSaved: (row: MedidasRow) => void
}) {
  const { t, locale } = useAdminI18n()
  const { f, campo } = useFichaLabels()
  const [inicial] = useState(() => toForm(base))
  const [values, setValues] = useState<FormValues>(inicial.values)
  const [postura, setPostura] = useState<string[]>(inicial.postura)
  const [observaciones, setObservaciones] = useState(inicial.observaciones)
  const [fecha, setFecha] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const huellaInicial = useMemo(() => huella(inicial.values, inicial.postura, inicial.observaciones), [inicial])
  const dirty = huella(values, postura, observaciones) !== huellaInicial

  // A draft left from an earlier session, offered once; autosave waits for the answer so it isn't overwritten
  const [oferta, setOferta] = useState<Borrador | null>(() => {
    const b = typeof window === 'undefined' ? null : leerBorrador(clienteId)
    return b && huella(b.values, b.postura, b.observaciones) !== huellaInicial ? b : null
  })
  const [autosaved, setAutosaved] = useState(false)

  useEffect(() => {
    if (oferta || !dirty) return
    const timer = window.setTimeout(() => {
      guardarBorrador(clienteId, { values, postura, observaciones, fecha, savedAt: new Date().toISOString() })
      setAutosaved(true)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [clienteId, values, postura, observaciones, fecha, dirty, oferta])

  function recuperar() {
    if (!oferta) return
    setValues({ chaqueta: {}, pantalon: {}, chaleco: {}, ...oferta.values })
    setPostura(oferta.postura)
    setObservaciones(oferta.observaciones ?? '')
    if (oferta.fecha) setFecha(oferta.fecha)
    setOferta(null)
  }

  function descartar() {
    borrarBorrador(clienteId)
    setOferta(null)
  }

  // ── Leaving ──
  // 'cerrar' = Cancel or X; 'atras' = the browser's back (button, keyboard or trackpad swipe)
  const [confirmar, setConfirmar] = useState<null | 'cerrar' | 'atras'>(null)
  const dirtyRef = useRef(dirty)
  const guardRef = useRef(false)
  useEffect(() => {
    dirtyRef.current = dirty
  })

  // Reload or closing the tab: the browser asks with its own wording
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Back: an extra history entry (a copy of the router's own state, same URL) absorbs the first "back",
  // so the page stays and we can ask. Unchanged forms just close, like a sheet on a phone.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
    // A remount (React dev mode mounts twice) finds the entry already there
    if (!window.history.state?.smfMedidas) window.history.pushState({ ...(window.history.state ?? {}), smfMedidas: true }, '')
    guardRef.current = true
    const onPop = () => {
      if (!guardRef.current) return
      if (dirtyRef.current) {
        window.history.pushState({ ...(window.history.state ?? {}), smfMedidas: true }, '')
        setConfirmar('atras')
      } else {
        guardRef.current = false
        onCloseRef.current()
      }
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      mountedRef.current = false
      // Closed from inside (Cancel, X, Save): drop the extra entry so "back" works normally afterwards.
      // Deferred, so a remount in the same tick keeps it.
      window.setTimeout(() => {
        if (mountedRef.current || !guardRef.current) return
        guardRef.current = false
        if (window.history.state?.smfMedidas) window.history.back()
      }, 0)
    }
  }, [])

  const salir = useCallback((intent: 'cerrar' | 'atras') => {
    setConfirmar(null)
    if (intent === 'atras') {
      // Finish the back the user asked for: past the extra entry and on to the previous page
      guardRef.current = false
      window.history.go(-2)
    }
    onCloseRef.current()
  }, [])

  function pedirCerrar() {
    if (dirty) setConfirmar('cerrar')
    else onClose()
  }

  const setValue = (s: string, k: string, v: string) => setValues({ ...values, [s]: { ...values[s], [k]: v } })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { medidas } = await api<{ medidas: MedidasRow }>(`/api/admin/clientes/${clienteId}/medidas`, {
        method: 'POST',
        body: { medidas: { ...values, postura }, observaciones, tomada_en: fecha },
      })
      borrarBorrador(clienteId)
      dirtyRef.current = false
      onSaved(medidas)
    } catch (err) {
      const code = (err as Error).message
      setError(code === 'medidas required' ? t.medidas.required : code === 'invalid medida' ? t.medidas.invalida : t.gestionCommon.error)
      setSaving(false)
    }
  }

  const input = (s: string, c: CampoFicha) => {
    const v = values[s]?.[c.key] ?? ''
    const label = campo(s, c.key)
    if (c.kind === 'cm') {
      return <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={v} onChange={(e) => setValue(s, c.key, e.target.value)} aria-label={label} />
    }
    if (c.kind === 'texto') {
      return <textarea className={inputClass} rows={2} value={v} onChange={(e) => setValue(s, c.key, e.target.value)} aria-label={label} />
    }
    const opciones = c.kind === 'sino' ? ['si', 'no'] : c.opciones
    return (
      <select className={inputClass} value={v} onChange={(e) => setValue(s, c.key, e.target.value)} aria-label={label}>
        <option value="">—</option>
        {opciones.map((o) => <option key={o} value={o}>{o === 'si' ? f.si : o === 'no' ? f.no : f.opciones[o] ?? o}</option>)}
      </select>
    )
  }

  return (
    <Modal title={base ? t.medidas.nuevaVersion : t.medidas.add} onClose={pedirCerrar} closeLabel={t.common.close} wide dismissible={false}>
      <form onSubmit={submit} className="space-y-6">
        {oferta && (
          <div role="status" className="rounded-lg border border-[#C9A84C]/40 bg-[#C9A84C]/10 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-[#C9A84C]">
              <History size={16} className="shrink-0" />
              {t.medidas.borradorTitulo}
            </p>
            <p className="mt-1 text-sm text-gray-300">
              {t.medidas.borradorTexto.replace('{fecha}', new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Madrid' }).format(new Date(oferta.savedAt)))}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btnPrimary} onClick={recuperar}>{t.medidas.recuperar}</button>
              <button type="button" className={btnSecondary} onClick={descartar}>{t.medidas.descartar}</button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-end gap-4">
          <Field label={t.medidas.fecha}>
            <input className={inputClass} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </Field>
          <p className="text-xs text-gray-500 pb-3">{base ? t.medidas.versionHint : t.medidas.unidad}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SECCIONES.map((s) => (
            <fieldset key={s} className="min-w-0">
              <legend className="text-xs uppercase tracking-wider text-[#C9A84C] mb-3">{f.secciones[s]}</legend>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-2">
                {(SECCIONES_MEDIDAS[s] as readonly CampoFicha[]).map((c) => (
                  <label key={c.key} className={`grid items-center gap-2 text-sm text-gray-300 ${c.kind === 'texto' ? 'col-span-2 lg:col-span-1 grid-cols-1' : 'grid-cols-[1fr_5.5rem]'}`}>
                    <span className="leading-tight">{campo(s, c.key)}</span>
                    {input(s, c)}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <fieldset>
          <legend className="text-xs uppercase tracking-wider text-[#C9A84C] mb-3">{f.secciones.postura}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4">
            {POSTURA.map((p) => (
              <label key={p} className="flex items-center gap-3 text-sm text-gray-300 min-h-10 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[#C9A84C] shrink-0"
                  checked={postura.includes(p)}
                  onChange={(e) => setPostura(e.target.checked ? [...postura, p] : postura.filter((x) => x !== p))}
                />
                {f.postura[p]}
              </label>
            ))}
          </div>
          <Field label={f.observacionesPostura} className="mt-3">
            <textarea className={inputClass} rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </Field>
        </fieldset>

        <ErrorText>{error}</ErrorText>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className={btnPrimary} disabled={saving}>{saving ? t.common.saving : t.common.save}</button>
          <button type="button" className={btnSecondary} onClick={pedirCerrar}>{t.common.cancel}</button>
          {autosaved && dirty && <span className="text-xs text-gray-500" aria-live="polite">{t.medidas.borradorGuardado}</span>}
        </div>
      </form>
      {confirmar && <ConfirmarSalida onSeguir={() => setConfirmar(null)} onSalir={() => salir(confirmar)} />}
    </Modal>
  )
}

// "¿Salir sin guardar?" with the safe choice focused, so Enter or Esc keeps editing
function ConfirmarSalida({ onSeguir, onSalir }: { onSeguir: () => void; onSalir: () => void }) {
  const { t } = useAdminI18n()
  const seguirRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    seguirRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onSeguir()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [onSeguir])
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="medidas-salir-titulo"
        className="w-full max-w-md rounded-2xl border border-[#1E3A5F] bg-[#0F1D2E] p-5 sm:p-6 shadow-2xl"
      >
        <p id="medidas-salir-titulo" className="flex items-start gap-3 text-white">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
          {t.medidas.salirTitulo}
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button type="button" className={btnDanger} onClick={onSalir}>{t.medidas.salirSinGuardar}</button>
          <button ref={seguirRef} type="button" className={btnPrimary} onClick={onSeguir}>{t.medidas.seguirEditando}</button>
        </div>
      </div>
    </div>
  )
}
