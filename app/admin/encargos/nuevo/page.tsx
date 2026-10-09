'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, inputClass, useApi } from '../../_components/ui'
import { useRol } from '../../_components/role'
import ClientePicker, { type ClienteOption } from '../../ventas/ClientePicker'
import { PRENDAS_PRENDA, TIPOS, type Tipo } from '../shared'

export default function NuevoEncargoPage() {
  return (
    <Suspense>
      <NuevoEncargo />
    </Suspense>
  )
}

// From the ficha del cliente: ?cliente=<id>&tipo=prenda|camisa|arreglo
function NuevoEncargo() {
  const sp = useSearchParams()
  const clienteParam = sp.get('cliente')
  const tipoParam = sp.get('tipo')
  const { data: preset } = useApi<{ cliente: ClienteOption }>(clienteParam ? `/api/admin/clientes/${clienteParam}` : null)
  if (clienteParam && !preset) return null
  return <Formulario key={preset?.cliente.id ?? 'nuevo'} cliente={preset?.cliente ?? null} tipoInicial={(TIPOS as readonly string[]).includes(tipoParam ?? '') ? (tipoParam as Tipo) : 'prenda'} />
}

const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' })

function Formulario({ cliente: clienteInicial, tipoInicial }: { cliente: ClienteOption | null; tipoInicial: Tipo }) {
  const { t } = useAdminI18n()
  const e = t.encargos
  const router = useRouter()
  const { propietario } = useRol()
  const { data: sastres } = useApi<{ items: { id: number; nombre: string; activo: boolean }[] }>('/api/admin/listas/sastres')
  const [cliente, setCliente] = useState<ClienteOption | null>(clienteInicial)
  const [tipo, setTipo] = useState<Tipo>(tipoInicial)
  const [prendas, setPrendas] = useState<string[]>(['americana', 'pantalon'])
  const [pedido, setPedido] = useState('')
  const [fechaEncargo, setFechaEncargo] = useState(hoy)
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [sastre, setSastre] = useState('')
  const [total, setTotal] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!cliente) {
      setError(e.errors['invalid cliente'])
      return
    }
    setSaving(true)
    setError('')
    try {
      const { encargo } = await api<{ encargo: { id: number } }>('/api/admin/encargos', {
        method: 'POST',
        body: {
          cliente_id: cliente.id, tipo, prendas, pedido, fecha_encargo: fechaEncargo, fecha_entrega: fechaEntrega,
          sastre_id: sastre || null, total,
        },
      })
      router.push(`/admin/encargos/${encargo.id}`)
    } catch (err) {
      setError(e.errors[(err as Error).message] ?? t.gestionCommon.error)
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title={e.nuevo} back={{ href: cliente ? `/admin/clientes/${cliente.id}` : '/admin/encargos', label: cliente ? cliente.nombre : e.back }} />
      <form onSubmit={submit} className="max-w-3xl space-y-6">
        <Card title={e.campos.cliente}>
          <ClientePicker value={cliente} onChange={setCliente} />
        </Card>

        <Card title={e.campos.tipo}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5" role="radiogroup" aria-label={e.campos.tipo}>
            {TIPOS.map((tp) => (
              <button
                key={tp}
                type="button"
                role="radio"
                aria-checked={tipo === tp}
                onClick={() => setTipo(tp)}
                className={`px-4 py-3 rounded-lg border text-sm text-left transition-colors ${
                  tipo === tp ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#1E3A5F] text-gray-300 hover:border-gray-500'
                }`}
              >
                {e.tiposLargos[tp]}
              </button>
            ))}
          </div>

          {tipo === 'prenda' && (
            <fieldset className="mb-4">
              <legend className="text-xs uppercase tracking-wider text-gray-400 mb-2">{e.campos.prendas}</legend>
              <div className="flex flex-wrap gap-x-5">
                {PRENDAS_PRENDA.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-gray-200 min-h-11 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#C9A84C]"
                      checked={prendas.includes(p)}
                      onChange={(ev) => setPrendas(ev.target.checked ? [...prendas, p] : prendas.filter((x) => x !== p))}
                    />
                    {e.prendas[p]}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <Field label={tipo === 'arreglo' ? e.campos.pedidoArreglo : e.campos.pedido}>
            <textarea className={inputClass} rows={2} value={pedido} onChange={(ev) => setPedido(ev.target.value)} required={tipo === 'arreglo'} />
          </Field>
        </Card>

        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={e.campos.fecha_encargo}>
              <input type="date" className={inputClass} value={fechaEncargo} onChange={(ev) => setFechaEncargo(ev.target.value)} required />
            </Field>
            <Field label={e.campos.fecha_entrega}>
              <input type="date" className={inputClass} value={fechaEntrega} onChange={(ev) => setFechaEntrega(ev.target.value)} />
            </Field>
            <Field label={e.campos.sastre}>
              <select className={inputClass} value={sastre} onChange={(ev) => setSastre(ev.target.value)}>
                <option value="">{e.campos.sinSastre}</option>
                {sastres?.items.filter((s) => s.activo).map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </Field>
            {propietario && (
              <Field label={e.campos.total}>
                <input className={`${inputClass} tabular-nums`} inputMode="decimal" value={total} onChange={(ev) => setTotal(ev.target.value)} />
              </Field>
            )}
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={btnPrimary} disabled={saving}>
            <Save size={16} />
            {saving ? t.gestionCommon.creating : e.crear}
          </button>
          <ErrorText>{error}</ErrorText>
        </div>
      </form>
    </div>
  )
}
