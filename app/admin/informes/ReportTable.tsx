'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { useAdminI18n } from '@/lib/admin/i18n'
import { btnSecondary, formatMoney, intlLocale } from '../_components/ui'

export type Row = Record<string, unknown>

export interface Column {
  key: string
  label: string
  kind?: 'text' | 'money' | 'qty' | 'int' | 'date' | 'datetime'
  total?: boolean
  href?: (row: Row) => string | null
  format?: (row: Row) => string // display + CSV text, for enums and composed cells
  wide?: boolean
}

const NUMERIC = new Set(['money', 'qty', 'int'])

export function sumColumn(rows: Row[], key: string) {
  return rows.reduce((s, r) => s + (Number(r[key]) || 0), 0)
}

export default function ReportTable({ columns, rows, filename, empty }: {
  columns: Column[]
  rows: Row[]
  filename: string
  empty: string
}) {
  const { t, locale } = useAdminI18n()
  const nf = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 3 })
  const df = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium', timeZone: 'Europe/Madrid' })
  const dtf = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Madrid' })

  const display = (col: Column, row: Row) => {
    if (col.format) return col.format(row)
    const v = row[col.key]
    if (v === null || v === undefined || v === '') return '—'
    switch (col.kind) {
      case 'money': return formatMoney(v as string, locale)
      case 'qty':
      case 'int': return nf.format(Number(v))
      case 'date': return /^\d{4}-\d{2}(-\d{2})?$/.test(String(v)) ? String(v) : df.format(new Date(String(v)))
      case 'datetime': return dtf.format(new Date(String(v)))
      default: return String(v)
    }
  }

  // Semicolon-separated with a BOM and decimal commas, which is what Excel expects in Spain/Italy/France
  function exportCsv() {
    const decimalComma = locale !== 'en'
    const sep = decimalComma ? ';' : ','
    const cell = (col: Column, row: Row) => {
      const v = row[col.key]
      let text: string
      if (col.format) text = col.format(row)
      else if (v === null || v === undefined) text = ''
      else if (col.kind && NUMERIC.has(col.kind)) {
        const n = col.kind === 'money' ? Number(v).toFixed(2) : String(Number(v))
        text = decimalComma ? n.replace('.', ',') : n
      }
      else if (col.kind === 'datetime') text = dtf.format(new Date(String(v)))
      else text = String(v)
      return text.includes(sep) || /["\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
    }
    const lines = [columns.map((c) => (c.label.includes(sep) ? `"${c.label}"` : c.label)).join(sep), ...rows.map((r) => columns.map((c) => cell(c, r)).join(sep))]
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const totals = columns.some((c) => c.total)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm text-gray-400">{rows.length} {t.informes.filas}</span>
        <button type="button" className={btnSecondary} onClick={exportCsv} disabled={rows.length === 0}>
          <Download size={16} />
          {t.informes.exportar}
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-6">{empty}</p>
      ) : (
        <div className="overflow-x-auto bg-[#0A1628] border border-[#1E3A5F] rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A5F]">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`px-3 py-3 text-xs font-normal uppercase tracking-wider text-gray-400 whitespace-nowrap ${c.kind && NUMERIC.has(c.kind) ? 'text-right' : 'text-left'}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-[#1E3A5F]/15">
                  {columns.map((c) => {
                    const text = display(c, row)
                    const href = c.href?.(row)
                    const numeric = c.kind && NUMERIC.has(c.kind)
                    return (
                      <td
                        key={c.key}
                        className={`px-3 py-2.5 ${numeric ? 'text-right tabular-nums whitespace-nowrap' : ''} ${c.wide ? 'min-w-48' : 'whitespace-nowrap'} ${Number(row[c.key]) < 0 && numeric ? 'text-red-300' : 'text-gray-200'}`}
                      >
                        {href ? <Link href={href} className="text-white hover:text-[#C9A84C]">{text}</Link> : text}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            {totals && (
              <tfoot>
                <tr className="border-t border-[#1E3A5F] font-medium">
                  {columns.map((c, i) => (
                    <td key={c.key} className={`px-3 py-3 whitespace-nowrap ${c.kind && NUMERIC.has(c.kind) ? 'text-right tabular-nums text-white' : 'text-gray-400'}`}>
                      {c.total ? (c.kind === 'money' ? formatMoney(sumColumn(rows, c.key), locale) : nf.format(sumColumn(rows, c.key))) : i === 0 ? t.informes.total : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  )
}
