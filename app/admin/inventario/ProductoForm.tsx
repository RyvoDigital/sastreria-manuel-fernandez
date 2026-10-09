'use client'

import { useAdminI18n } from '@/lib/admin/i18n'
import { Card, Field, inputClass } from '../_components/ui'
import PhotoUpload from '../_components/PhotoUpload'
import { useRol } from '../_components/role'
import { UbicacionSelect, type Categoria, type ProveedorOption } from './shared'

export const UNIDADES = ['ud', 'par', 'm', 'bobina', 'caja', 'juego'] as const
export const IVA_TIPOS = ['21', '10', '4', '0']

export interface ProductoFormValues {
  categoria_id: string
  subtipo: string
  nombre: string
  referencia: string
  marca: string
  proveedor_id: string
  descripcion: string
  color: string
  material: string
  talla: string
  unidad: string
  coste: string
  pvp: string
  iva: string
  stock_minimo_defecto: string
  ubicacion: string
  observaciones: string
  foto_url: string | null
  foto_thumb_url: string | null
}

export const emptyProducto: ProductoFormValues = {
  categoria_id: '', subtipo: '', nombre: '', referencia: '', marca: '', proveedor_id: '', descripcion: '', color: '', material: '',
  talla: '', unidad: 'ud', coste: '', pvp: '', iva: '21', stock_minimo_defecto: '0', ubicacion: '', observaciones: '',
  foto_url: null, foto_thumb_url: null,
}

// Body for the API: blanks become null, numbers keep the comma-or-dot the user typed (server parses)
export function toBody(v: ProductoFormValues) {
  return { ...v, categoria_id: v.categoria_id || null, proveedor_id: v.proveedor_id || null }
}

export default function ProductoForm({ values, onChange, categorias, proveedores, productoId, unidadLocked, nombreRef }: {
  values: ProductoFormValues
  onChange: (v: ProductoFormValues) => void
  categorias: Categoria[]
  proveedores: ProveedorOption[]
  productoId?: number
  unidadLocked?: boolean
  nombreRef?: React.Ref<HTMLInputElement>
}) {
  const { t } = useAdminI18n()
  const { propietario } = useRol()
  const f = t.inventario.fields
  const set = (key: keyof ProductoFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...values, [key]: e.target.value })

  // Picking a category prefills its unit and IVA (only while creating)
  function setCategoria(e: React.ChangeEvent<HTMLSelectElement>) {
    const cat = categorias.find((c) => String(c.id) === e.target.value)
    if (cat && !productoId) {
      onChange({ ...values, categoria_id: e.target.value, subtipo: '', unidad: cat.unidad_defecto, iva: String(Number(cat.iva_defecto)) })
    } else {
      onChange({ ...values, categoria_id: e.target.value })
    }
  }
  const subtipos = categorias.find((c) => String(c.id) === values.categoria_id)?.subtipos ?? []

  const text = (key: keyof ProductoFormValues, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field label={label}>
      <input className={inputClass} value={(values[key] as string) ?? ''} onChange={set(key)} autoComplete="off" {...props} />
    </Field>
  )

  return (
    <div className="space-y-6">
      <Card title={t.inventario.sections.ficha}>
        <div className="mb-5">
          <PhotoUpload
            value={values.foto_thumb_url ?? values.foto_url}
            folder={`productos/${productoId ?? 'nuevo'}`}
            onChange={(foto) => onChange({ ...values, foto_url: foto?.url ?? null, foto_thumb_url: foto?.thumbUrl ?? null })}
            labels={t.inventario.foto}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={f.nombre} className="sm:col-span-2">
            <input ref={nombreRef} className={inputClass} value={values.nombre} onChange={set('nombre')} required autoComplete="off" />
          </Field>
          <Field label={f.categoria}>
            <select className={inputClass} value={values.categoria_id} onChange={setCategoria} required>
              <option value="" disabled>—</option>
              {(['terminado', 'material'] as const).map((tipo) => (
                <optgroup key={tipo} label={t.inventario.tipos[tipo]}>
                  {categorias.filter((c) => c.tipo === tipo && (c.activo || String(c.id) === values.categoria_id)).map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          {(subtipos.length > 0 || values.subtipo) && (
            <Field label={f.subtipo}>
              <select className={inputClass} value={values.subtipo} onChange={set('subtipo')}>
                <option value="">—</option>
                {[...new Set([...subtipos, ...(values.subtipo ? [values.subtipo] : [])])].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </Field>
          )}
          {text('referencia', f.referencia)}
          {text('marca', f.marca)}
          <Field label={f.proveedor}>
            <select className={inputClass} value={values.proveedor_id} onChange={set('proveedor_id')}>
              <option value="">{t.inventario.sinProveedor}</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </Field>
          {text('color', f.color)}
          {text('material', f.material)}
          {text('talla', f.talla)}
          <Field label={f.ubicacion}>
            <UbicacionSelect value={values.ubicacion} onChange={(v) => onChange({ ...values, ubicacion: v })} />
          </Field>
          <Field label={f.descripcion} className="sm:col-span-2">
            <textarea className={inputClass} rows={3} value={values.descripcion} onChange={set('descripcion')} />
          </Field>
        </div>
      </Card>

      <Card title={propietario ? t.inventario.sections.precios : t.inventario.stock}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {propietario && (
            <>
              {text('coste', f.coste, { inputMode: 'decimal' })}
              {text('pvp', f.pvp, { inputMode: 'decimal' })}
              <Field label={f.iva}>
                <select className={inputClass} value={values.iva} onChange={set('iva')}>
                  {[...new Set([...IVA_TIPOS, String(Number(values.iva))])].map((v) => (
                    <option key={v} value={v}>{v} %</option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <Field label={f.unidad}>
            <select className={inputClass} value={values.unidad} onChange={set('unidad')} disabled={unidadLocked}>
              {UNIDADES.map((u) => (
                <option key={u} value={u}>{t.inventario.unidadesLargas[u]}</option>
              ))}
            </select>
          </Field>
          {text('stock_minimo_defecto', f.stock_minimo_defecto, { inputMode: 'decimal' })}
        </div>
      </Card>

      <Card title={f.observaciones}>
        <textarea className={inputClass} rows={3} value={values.observaciones} onChange={set('observaciones')} aria-label={f.observaciones} />
      </Card>
    </div>
  )
}
