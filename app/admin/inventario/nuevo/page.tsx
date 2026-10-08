'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, ErrorText, Field, PageHeader, api, btnPrimary, inputClass, useApi } from '../../_components/ui'
import InventarioTabs from '../InventarioTabs'
import ProductoForm, { emptyProducto, toBody, type ProductoFormValues } from '../ProductoForm'
import VariantesGenerator, { draftsToBody, type VarianteDraft } from '../VariantesGenerator'
import { errorMessage, type Categoria, type ProveedorOption } from '../shared'

export default function NuevoProductoPage() {
  const { t } = useAdminI18n()
  const router = useRouter()
  const { data: cats } = useApi<{ categorias: Categoria[] }>('/api/admin/inventario/categorias')
  const { data: provs } = useApi<{ proveedores: ProveedorOption[] }>('/api/admin/proveedores')
  const [values, setValues] = useState<ProductoFormValues>(emptyProducto)
  const [conVariantes, setConVariantes] = useState(false)
  const [stockInicial, setStockInicial] = useState('')
  const [variantes, setVariantes] = useState<VarianteDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (conVariantes && variantes.length === 0) {
      setError(t.inventario.variantesSection.needOne)
      return
    }
    setSaving(true)
    setError('')
    try {
      const body = {
        ...toBody(values),
        ...(conVariantes ? { variantes: draftsToBody(variantes) } : { stock_inicial: stockInicial || 0 }),
      }
      const { producto } = await api<{ producto: { id: number } }>('/api/admin/inventario/productos', { method: 'POST', body })
      router.push(`/admin/inventario/${producto.id}`)
    } catch (err) {
      setError(errorMessage(t, err))
      setSaving(false)
    }
  }

  const s = t.inventario.variantesSection

  return (
    <div>
      <PageHeader title={t.inventario.new} back={{ href: '/admin/inventario', label: t.inventario.title }} />
      <InventarioTabs />

      <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <ProductoForm values={values} onChange={setValues} categorias={cats?.categorias ?? []} proveedores={provs?.proveedores ?? []} />

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
            <ErrorText>{error}</ErrorText>
          </div>
        </div>
      </form>
    </div>
  )
}
