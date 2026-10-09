'use client'

import { useEffect, useRef, useState } from 'react'
import { Package, Search } from 'lucide-react'
import { api, inputClass } from './ui'

export interface VarianteOption {
  id: number
  etiqueta: string | null
  sku: string | null
  es_unica: boolean
  stock_actual: string
  stock_reservado: string
  pvp: string | null
  coste: string | null
  coste_medio: string | null
  producto_id: number
  producto: string
  referencia: string | null
  unidad: string
  iva: string
  proveedor_id: number | null
  foto_thumb_url: string | null
  tipo: 'terminado' | 'material'
}

// Search-as-you-type over products and variants (name, reference, brand, SKU, size…).
// A barcode scanner acting as a keyboard ends with Enter: an exact SKU match is picked straight away.
export default function VariantePicker({ onPick, placeholder, tipo, renderMeta }: {
  onPick: (v: VarianteOption) => void
  placeholder: string
  tipo?: 'terminado' | 'material'
  renderMeta?: (v: VarianteOption) => React.ReactNode
}) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<VarianteOption[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!q.trim()) return
    let current = true
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q: q.trim(), ...(tipo ? { tipo } : {}) })
      api<{ variantes: VarianteOption[] }>(`/api/admin/inventario/variantes/buscar?${params}`).then((d) => {
        if (!current) return
        setResults(d.variantes)
        setActive(0)
        setOpen(true)
      })
    }, 200)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [q, tipo])

  useEffect(() => {
    const onDown = (e: PointerEvent) => !boxRef.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  function pick(v: VarianteOption) {
    onPick(v)
    setQ('')
    setResults([])
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter') {
      e.preventDefault()
      const exact = results.find((r) => r.sku && r.sku.toLowerCase() === q.trim().toLowerCase())
      if (exact) pick(exact)
      else if (open && results[active]) pick(results[active])
    }
  }

  const listId = 'variante-picker-list'
  const visible = open && q.trim() !== ''

  return (
    <div ref={boxRef} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
      <input
        type="search"
        className={`${inputClass} pl-12`}
        placeholder={placeholder}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          if (!e.target.value.trim()) setOpen(false)
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={visible}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={placeholder}
      />
      {visible && results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 w-full max-h-80 overflow-y-auto bg-[#0F1D2E] border border-[#1E3A5F] rounded-lg shadow-2xl">
          {results.map((r, i) => (
            <li
              key={r.id}
              role="option"
              aria-selected={i === active}
              onPointerDown={(e) => { e.preventDefault(); pick(r) }}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer ${i === active ? 'bg-[#1E3A5F]/60' : ''}`}
            >
              <div className="w-10 h-10 rounded bg-[#1E3A5F]/30 shrink-0 overflow-hidden flex items-center justify-center">
                {r.foto_thumb_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Blob host isn't in next.config remotePatterns
                  <img src={r.foto_thumb_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package size={16} className="text-gray-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-white truncate">
                  {r.producto}
                  {!r.es_unica && r.etiqueta && <span className="text-[#C9A84C]"> · {r.etiqueta}</span>}
                </div>
                <div className="text-xs text-gray-500 truncate">{[r.sku ?? r.referencia].filter(Boolean).join(' · ')}</div>
              </div>
              {renderMeta && <div className="text-xs text-gray-400 shrink-0 text-right">{renderMeta(r)}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
