'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Plus, Printer, Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { CARACTERISTICAS } from '@/lib/admin/medidas'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, btnSecondary, formatDate, inputClass, useApi } from '../../_components/ui'
import { useRol } from '../../_components/role'
import { FichaMedidasView, MedidasFormModal, MedidasVersionLabel, type MedidasRow } from '../../_components/MedidasFicha'
import { ESTADOS, EstadoBadge, PRENDAS_PRENDA, useEncargoTexto, type Estado } from '../shared'
import { Entrega, Materiales, Pagos, Pruebas } from './secciones'
import type { Encargo, EncargoDetalle } from '../types'

export default function EncargoPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useAdminI18n()
  const { data, error, reload } = useApi<EncargoDetalle>(`/api/admin/encargos/${id}`)
  if (error) return <div className="text-gray-400">{t.common.noData}</div>
  if (!data) return <div className="text-gray-400">{t.common.loading}</div>
  return <Detalle data={data} reload={reload} />
}

function Detalle({ data, reload }: { data: EncargoDetalle; reload: () => void }) {
  const { t } = useAdminI18n()
  const { e, prendas } = useEncargoTexto()
  const { propietario } = useRol()
  const { encargo } = data
  const cliente = [encargo.cliente_nombre, encargo.cliente_apellidos].filter(Boolean).join(' ')
  const [estadoError, setEstadoError] = useState('')

  async function cambiarEstado(estado: Estado) {
    setEstadoError('')
    try {
      await api(`/api/admin/encargos/${encargo.id}`, { method: 'PATCH', body: { estado } })
      reload()
    } catch (err) {
      const code = (err as Error).message
      setEstadoError(e.errors[code] ?? t.gestionCommon.error)
    }
  }

  const pendientesInventario = data.materiales.some((m) => m.origen === 'inventario' && !m.consumido)

  return (
    <div>
      <PageHeader
        back={{ href: `/admin/clientes/${encargo.cliente_id}`, label: cliente }}
        title={prendas(encargo)}
        actions={
          <Link href={`/admin/encargos/${encargo.id}/ficha`} className={btnSecondary}>
            <Printer size={16} />
            {e.fichaTrabajo}
          </Link>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
          <EstadoBadge estado={encargo.estado} />
          <span>{encargo.numero} · {e.tiposLargos[encargo.tipo]}</span>
          {encargo.cliente_telefono && <a href={`tel:${encargo.cliente_telefono}`} className="text-[#C9A84C] hover:text-[#D4B76A]">{encargo.cliente_telefono}</a>}
        </div>
      </PageHeader>

      {/* Presupuesto → Confirmado → Prueba → Listo → Entregado; any step can be chosen to correct a mistake */}
      <nav aria-label={e.filtros.estado} className="mb-6">
        <ol className="flex flex-wrap gap-1">
          {ESTADOS.map((s, i) => {
            const actual = ESTADOS.indexOf(encargo.estado)
            return (
              <li key={s} className="flex-1 basis-[6.5rem]">
                <button
                  type="button"
                  onClick={() => s !== encargo.estado && cambiarEstado(s)}
                  aria-current={s === encargo.estado ? 'step' : undefined}
                  className={`w-full px-1 py-2.5 rounded-lg text-sm border transition-colors ${
                    s === encargo.estado
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0A1628] font-medium'
                      : i < actual
                        ? 'border-[#C9A84C]/40 text-[#C9A84C]'
                        : 'border-[#1E3A5F] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {e.estados[s]}
                </button>
              </li>
            )
          })}
        </ol>
        {encargo.estado === 'presupuesto' && pendientesInventario && <p className="text-xs text-gray-500 mt-2">{e.estadoAyuda}</p>}
        <ErrorText>{estadoError}</ErrorText>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <DatosForm key={encargo.updated_at} encargo={encargo} onSaved={reload} />
        </div>
        <div className="space-y-6">
          {propietario && <Pagos key={`${data.totales.pagado}-${data.totales.total}`} encargoId={encargo.id} totales={data.totales} pagos={data.pagos} onChange={reload} />}
          <MedidasCard encargo={encargo} medidas={data.medidas} onChange={reload} />
          {encargo.tipo !== 'arreglo' && (
            <Materiales encargoId={encargo.id} prendas={encargo.prendas} confirmado={encargo.estado !== 'presupuesto'} materiales={data.materiales} onChange={reload} />
          )}
          <Pruebas encargoId={encargo.id} pruebas={data.pruebas} onChange={reload} />
          <Entrega
            key={`${encargo.entrega_cita_fecha}-${encargo.entrega_cita_hora}`}
            encargoId={encargo.id}
            fechaEntrega={encargo.fecha_entrega}
            cita={{ fecha: encargo.entrega_cita_fecha, hora: encargo.entrega_cita_hora, estado: encargo.entrega_cita_estado }}
            onChange={reload}
          />
        </div>
      </div>
    </div>
  )
}

// Garments, dates, tailor, external workshop, characteristics and notes, saved together
function DatosForm({ encargo, onSaved }: { encargo: Encargo; onSaved: () => void }) {
  const { t } = useAdminI18n()
  const e = t.encargos
  const { propietario } = useRol()
  const { data: sastres } = useApi<{ items: { id: number; nombre: string; activo: boolean }[] }>('/api/admin/listas/sastres')
  const [form, setForm] = useState(() => ({
    prendas: encargo.prendas ?? [],
    pedido: encargo.pedido ?? '',
    fecha_encargo: encargo.fecha_encargo,
    fecha_entrega: encargo.fecha_entrega ?? '',
    sastre_id: encargo.sastre_id ? String(encargo.sastre_id) : '',
    total: encargo.total ? String(Number(encargo.total)).replace('.', ',') : '',
    taller_externo: encargo.taller_externo ?? '',
    taller_enviado: encargo.taller_enviado ?? '',
    taller_devuelto: encargo.taller_devuelto ?? '',
    notas_sastre: encargo.notas_sastre ?? '',
    comentarios: encargo.comentarios ?? '',
    caracteristicas: { chaqueta: encargo.caracteristicas?.chaqueta ?? [], pantalon: encargo.caracteristicas?.pantalon ?? [] },
  }))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const body: Record<string, unknown> = { ...form, sastre_id: form.sastre_id || null }
      if (!propietario) delete body.total
      await api(`/api/admin/encargos/${encargo.id}`, { method: 'PATCH', body })
      setMessage(e.guardado)
      onSaved()
    } catch (err) {
      setError(e.errors[(err as Error).message] ?? t.gestionCommon.error)
      setSaving(false)
    }
  }

  const text = (key: 'pedido' | 'notas_sastre' | 'comentarios', label: string, rows = 3) => (
    <Field label={label}>
      <textarea className={inputClass} rows={rows} value={form[key]} onChange={(ev) => setForm({ ...form, [key]: ev.target.value })} />
    </Field>
  )
  const date = (key: 'fecha_encargo' | 'fecha_entrega' | 'taller_enviado' | 'taller_devuelto', label: string) => (
    <Field label={label}>
      <input type="date" className={inputClass} value={form[key]} onChange={(ev) => setForm({ ...form, [key]: ev.target.value })} required={key === 'fecha_encargo'} />
    </Field>
  )
  const toggleCar = (seccion: 'chaqueta' | 'pantalon', key: string, on: boolean) =>
    setForm({
      ...form,
      caracteristicas: {
        ...form.caracteristicas,
        [seccion]: on ? [...form.caracteristicas[seccion], key] : form.caracteristicas[seccion].filter((x) => x !== key),
      },
    })

  // Jacket choices for americana/abrigo, trouser choices for pantalón
  const conChaqueta = encargo.tipo === 'prenda' && form.prendas.some((p) => p === 'americana' || p === 'abrigo')
  const conPantalon = encargo.tipo === 'prenda' && form.prendas.includes('pantalon')

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card title={e.secciones.datos}>
        <div className="space-y-4">
          {encargo.tipo === 'prenda' && (
            <fieldset>
              <legend className="text-xs uppercase tracking-wider text-gray-400 mb-1">{e.campos.prendas}</legend>
              <div className="flex flex-wrap gap-x-5">
                {PRENDAS_PRENDA.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-gray-200 min-h-11 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#C9A84C]"
                      checked={form.prendas.includes(p)}
                      onChange={(ev) => setForm({ ...form, prendas: ev.target.checked ? [...form.prendas, p] : form.prendas.filter((x) => x !== p) })}
                    />
                    {e.prendas[p]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {text('pedido', encargo.tipo === 'arreglo' ? e.campos.pedidoArreglo : e.campos.pedido, 2)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {date('fecha_encargo', e.campos.fecha_encargo)}
            {date('fecha_entrega', e.campos.fecha_entrega)}
            <Field label={e.campos.sastre}>
              <select className={inputClass} value={form.sastre_id} onChange={(ev) => setForm({ ...form, sastre_id: ev.target.value })}>
                <option value="">{e.campos.sinSastre}</option>
                {sastres?.items.filter((s) => s.activo || String(s.id) === form.sastre_id).map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </Field>
            {propietario && (
              <Field label={e.campos.total}>
                <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={form.total} onChange={(ev) => setForm({ ...form, total: ev.target.value })} />
              </Field>
            )}
          </div>
        </div>
      </Card>

      {(conChaqueta || conPantalon) && (
        <Card title={e.secciones.caracteristicas}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {([['chaqueta', conChaqueta, t.ficha.secciones.carChaqueta, t.ficha.carChaqueta], ['pantalon', conPantalon, t.ficha.secciones.carPantalon, t.ficha.carPantalon]] as const)
              .filter(([, on]) => on)
              .map(([seccion, , titulo, labels]) => (
                <fieldset key={seccion}>
                  <legend className="text-xs uppercase tracking-wider text-[#C9A84C] mb-2">{titulo}</legend>
                  {CARACTERISTICAS[seccion].map((key) => (
                    <label key={key} className="flex items-center gap-3 text-sm text-gray-300 min-h-10 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-[#C9A84C] shrink-0"
                        checked={form.caracteristicas[seccion].includes(key)}
                        onChange={(ev) => toggleCar(seccion, key, ev.target.checked)}
                      />
                      {labels[key]}
                    </label>
                  ))}
                </fieldset>
              ))}
          </div>
        </Card>
      )}

      <Card title={e.secciones.tallerExterno}>
        <div className="grid grid-cols-2 gap-4">
          <Field label={e.campos.taller_externo} className="col-span-2">
            <input className={inputClass} value={form.taller_externo} onChange={(ev) => setForm({ ...form, taller_externo: ev.target.value })} />
          </Field>
          {date('taller_enviado', e.campos.taller_enviado)}
          {date('taller_devuelto', e.campos.taller_devuelto)}
        </div>
      </Card>

      <Card title={e.secciones.notas}>
        <div className="space-y-4">
          {text('notas_sastre', e.campos.notas_sastre)}
          {text('comentarios', e.campos.comentarios)}
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={btnPrimary} disabled={saving}>
          <Save size={16} />
          {saving ? t.common.saving : t.common.save}
        </button>
        {message && <span className="text-sm text-emerald-400">{message}</span>}
        <ErrorText>{error}</ErrorText>
      </div>
    </form>
  )
}

// Which measurement version this encargo uses; a new toma becomes the encargo's set straight away
function MedidasCard({ encargo, medidas, onChange }: { encargo: Encargo; medidas: MedidasRow[]; onChange: () => void }) {
  const { t, locale } = useAdminI18n()
  const e = t.encargos
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const actual = medidas.find((m) => m.id === encargo.medidas_id) ?? null
  const masReciente = actual && medidas[0] && medidas[0].id !== actual.id
  const base = actual?.tipo_prenda === 'ficha' ? actual : medidas.find((m) => m.tipo_prenda === 'ficha') ?? null

  async function usar(medidasId: number | null) {
    setError('')
    try {
      await api(`/api/admin/encargos/${encargo.id}`, { method: 'PATCH', body: { medidas_id: medidasId } })
      onChange()
    } catch {
      setError(t.gestionCommon.error)
    }
  }

  return (
    <Card
      title={e.secciones.medidas}
      actions={
        <button type="button" className={btnSecondary} onClick={() => setAdding(true)}>
          <Plus size={16} />
          <span className="hidden sm:inline">{e.medidasNueva}</span>
        </button>
      }
    >
      {medidas.length > 0 && (
        <Field label={e.medidasVersion} className="mb-4">
          <select className={inputClass} value={encargo.medidas_id ?? ''} onChange={(ev) => usar(ev.target.value ? Number(ev.target.value) : null)}>
            <option value="">—</option>
            {medidas.map((m) => (
              <option key={m.id} value={m.id}>
                {formatDate(m.tomada_en, locale)}{m.tomada_por_nombre ? ` · ${m.tomada_por_nombre}` : ''}{m.tipo_prenda !== 'ficha' ? ` · ${t.medidas.anteriores}` : ''}
              </option>
            ))}
          </select>
        </Field>
      )}
      {masReciente && <p className="text-xs text-amber-300 mb-3">{e.medidasMasReciente}</p>}
      {actual ? (
        <>
          <div className="text-xs text-gray-400 mb-3"><MedidasVersionLabel row={actual} /></div>
          <FichaMedidasView row={actual} compact />
        </>
      ) : (
        <p className="text-sm text-gray-400">{encargo.tipo === 'arreglo' ? e.soloArreglo : e.medidasSin}</p>
      )}
      <ErrorText>{error}</ErrorText>
      {adding && (
        <MedidasFormModal
          clienteId={encargo.cliente_id}
          base={base}
          onClose={() => setAdding(false)}
          onSaved={(row) => { setAdding(false); usar(row.id) }}
        />
      )}
    </Card>
  )
}
