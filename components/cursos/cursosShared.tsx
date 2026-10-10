'use client'

import { useEffect, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { CursosComingSoonDialog } from '@/components/cursos/CursosComingSoonDialog'
import { useCursosContent, type CourseItem, type CursosContent } from './cursosContent'
import s from './el-hilo-cursos.module.css'

// The payment step loads Stripe's script as soon as it is imported, so it is
// fetched only when someone opens it (never while purchases are closed).
const CursosPaymentGate = dynamic(() => import('./CursosPaymentGate').then((m) => m.CursosPaymentGate), { ssr: false })

/*
 * The page's behaviour, unchanged from before: the Stripe return screen, the
 * payment gate for a chosen course, and the coming-soon dialog while
 * purchases are closed. The page only draws itself and calls watch(course).
 */
export function CursosShell({ children }: { children: (c: CursosContent, watch: (course: CourseItem) => void) => ReactNode }) {
  const c = useCursosContent()
  const [selected, setSelected] = useState<{ id: string; title: string; price: number } | null>(null)
  const [success, setSuccess] = useState(false)
  const [soon, setSoon] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('success') === 'true') setSuccess(true)
  }, [])

  const watch = (course: CourseItem) => {
    if (!c.purchasesOpen) return setSoon(true)
    setSelected({ id: course.id, title: course.title, price: c.coursePrice(course.id, course.raw.price) || 35000 })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (success) {
    return (
      <div className="flex flex-col bg-[#0A1628] min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/20 rounded-full mb-6">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-serif text-white mb-3">{c.layout.successTitle}</h1>
          <p className="text-gray-400 mb-8">{c.layout.successMsg}</p>
          <button
            onClick={() => {
              setSuccess(false)
              setSelected(null)
              window.history.replaceState({}, '', window.location.pathname + window.location.search.replace(/[?&]success=true/, ''))
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A1628] font-medium rounded-lg hover:bg-[#D4B76A] transition-colors"
          >
            <ArrowLeft size={16} />
            {c.layout.back}
          </button>
        </div>
      </div>
    )
  }

  if (selected) {
    return (
      <CursosPaymentGate
        onAccessGranted={() => setSelected(null)}
        title={selected.title}
        subtitle={''}
        courseId={selected.id}
        courseName={selected.title}
        price={selected.price}
      />
    )
  }

  return (
    <>
      {children(c, watch)}
      {soon && <CursosComingSoonDialog onClose={() => setSoon(false)} />}
    </>
  )
}

/* One course's facts and its button. */
export function CourseFacts({ course, c, onWatch }: { course: CourseItem; c: CursosContent; onWatch: () => void }) {
  return (
    <>
      <p className={s.meta}>
        <span>
          <span className={s.metaLabel}>{c.list.duration}</span> {course.duration}
        </span>
        <span>
          {course.lessons} {c.list.lessons}
        </span>
      </p>
      <div className={s.actionRow}>
        <button type="button" className={s.btnPrimary} onClick={onWatch}>
          {course.action}
        </button>
        <span className={`${s.badge} ${course.open ? s.badgeOpen : ''}`}>{course.badge}</span>
      </div>
    </>
  )
}
