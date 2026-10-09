'use client'

import { Suspense, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, SaveAll } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, btnSecondary, inputClass, useApi } from '../../_components/ui'
import InventarioTabs from '../InventarioTabs'
import ProductoForm, { emptyProducto, toBody, type ProductoFormValues } from '../ProductoForm'
import VariantesGenerator, { draftsToBody, type VarianteDraft } from '../VariantesGenerator'
import { errorMessage, type Categoria, type ProveedorOption } from '../shared'

interface Origen {
  producto: Record<string, unknown>
  variantes: { atributos: Record<string, string>; etiqueta: string | null; es_unica: boolean; activo: boolean; stock_minimo: string }[]
}

export default function NuevoProductoPage() {
  return (
    <Suspense>
      <NuevoProducto />
    </Suspense>
  )
}

// ?desde=<id> duplicates a product: same fields and variant structure, no references, photo or stock
function NuevoProducto() {
  const desde = Number(useSearchParams().get('desde')) || null
  const { data: origen, error } = useApi<Origen>(desde ? `/api/admin/inventario/productos/${desde}` : null)
  const { t } = useAdminI18n()
  if (desde && error) return <div className="text-gray-400">{t.common.noData}</div>
  if (desde && !origen) return <div className="text-gray-400">{t.common.loading}</div>
  return <Formulario key={desde ?? 'nuevo'} origen={origen ?? null} />
}

function fromOrigen(o: Origen): { values: ProductoFormValues; variantes: VarianteDraft[] } {
  const p = o.producto
  const str = (v: unknown) => (v === null || v === undefined ? '' : String(v))
  const values: ProductoFormValues = {
    ...emptyProducto,
    categoria_id: str(p.categoria_id), subtipo: str(p.subtipo), nombre: str(p.nombre), marca: str(p.marca),
    proveedor_id: str(p.proveedor_id), descripcion: str(p.descripcion), color: str(p.color), material: str(p.material),
    talla: str(p.talla), unidad: str(p.unidad) || 'ud', coste: str(p.coste), pvp: str(p.pvp), iva: String(Number(p.iva ?? 21)),
    stock_minimo_defecto: String(Number(p.stock_minimo_defecto ?? 0)), ubicacion: str(p.ubicacion),
  }
  const variantes = o.variantes
    .filter((v) => v.activo && !v.es_unica)
    .map((v, i) => ({
      key: `copia-${i}`,
      atributos: v.atributos ?? {},
      etiqueta: v.etiqueta ?? '',
      sku: '',
      stock_inicial: '',
      stock_minimo: String(Number(v.stock_minimo)),
    }))
  return { values, variantes }
}

function Formulario({ origen }: { origen: Origen | null }) {
  const { t } = useAdminI18n()
  const router = useRouter()
  const { data: cats } = useApi<{ categorias: Categoria[] }>('/api/admin/inventario/categorias')
  const { data: provs } = useApi<{ proveedores: ProveedorOption[] }>('/api/admin/proveedores')
  const [inicial] = useState(() => (origen ? fromOrigen(origen) : { values: emptyProducto, variantes: [] }))
  const [values, setValues] = useState<ProductoFormValues>(inicial.values)
  const [conVariantes, setConVariantes] = useState(inicial.variantes.length > 0)
  const [stockInicial, setStockInicial] = useState('')
  const [variantes, setVariantes] = useState<VarianteDraft[]>(inicial.variantes)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [creado, setCreado] = useState<{ id: number; nombre: string } | null>(null)
  const nombreRef = useRef<HTMLInputElement>(null)
  const otroRef = useRef(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (conVariantes && variantes.length === 0) {
      setError(t.inventario.variantesSection.needOne)
      return
    }
    const otro = otroRef.current
    otroRef.current = false
    setSaving(true)
    setError('')
    try {
      const body = {
        ...toBody(values),
        ...(conVariantes ? { variantes: draftsToBody(variantes) } : { stock_inicial: stockInicial || 0 }),
      }
      const { producto } = await api<{ producto: { id: number } }>('/api/admin/inventario/productos', { method: 'POST', body })
      if (!otro) {
        router.push(`/admin/inventario/${producto.id}`)
        return
      }
      // Keep category, supplier, prices and variant structure; clear what is specific to the item
      setCreado({ id: producto.id, nombre: values.nombre })
      setValues({ ...values, nombre: '', referencia: '', color: '', foto_url: null, foto_thumb_url: null })
      setVariantes(variantes.map((v) => ({ ...v, sku: '', stock_inicial: '' })))
      setStockInicial('')
      setSaving(false)
      nombreRef.current?.focus()
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  const s = t.inventario.variantesSection

  return (
    <div>
      <PageHeader title={origen ? t.inventario.duplicarTitulo : t.inventario.new} back={{ href: '/admin/inventario', label: t.inventario.title }} />
      <InventarioTabs />
      {creado && (
        <p className="mb-4 text-sm text-emerald-400" role="status">
          {t.inventario.creadoSiguiente.replace('{nombre}', creado.nombre)}{' '}
          <Link href={`/admin/inventario/${creado.id}`} className="text-[#C9A84C] hover:text-[#D4B76A] underline">{t.gestionCommon.view}</Link>
        </p>
      )}

      <form
        onSubmit={submit}
        onKeyDown={(e) => {
          // Ctrl/⌘ + Intro: save and stay for the next product
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            otroRef.current = true
            e.currentTarget.requestSubmit()
          }
        }}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start"
      >
        <ProductoForm
          values={values}
          onChange={setValues}
          categorias={cats?.categorias ?? []}
          proveedores={provs?.proveedores ?? []}
          nombreRef={nombreRef}
        />

        <div className="space-y-6">
          <Card title={s.title}>
            <div className="space-y-3 mb-5" role="radiogroup">
              {[false, true].map((option) => (
                <label key={String(option)} className="flex items-center gap-3 text-sm text-gray-200 cursor-pointer min-h-11">
                  <input type="radio" className="w-5 h-5 accent-[#C9A84C]" checked={conVariantes === option} onChange={() => setConVariantes(option)} />
                  {option ? s.hasVariants : s.none}
                </label>
              ))}
            </div>
            {conVariantes ? (
              <VariantesGenerator
                rows={variantes}
                onChange={setVariantes}
                referencia={values.referencia}
                stockMinimo={values.stock_minimo_defecto}
                unidadDecimal={values.unidad === 'm'}
              />
            ) : (
              <Field label={t.inventario.fields.stock_inicial}>
                <input
                  className={`${inputClass} tabular-nums`}
                  inputMode={values.unidad === 'm' ? 'decimal' : 'numeric'}
                  value={stockInicial}
                  onChange={(e) => setStockInicial(e.target.value)}
                  placeholder="0"
                />
              </Field>
            )}
            <p className="text-xs text-gray-500 mt-4">{s.stockInicialHint}</p>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={btnPrimary} disabled={saving}>
              <Save size={16} />
              {saving ? t.gestionCommon.creating : t.gestionCommon.create}
            </button>
            <button type="submit" className={btnSecondary} disabled={saving} onClick={() => { otroRef.current = true }}>
              <SaveAll size={16} />
              {t.inventario.crearYOtro}
            </button>
            <ErrorText>{error}</ErrorText>
          </div>
          <p className="text-xs text-gray-500">{t.inventario.rapidoHint}</p>
        </div>
      </form>
    </div>
  )
}
