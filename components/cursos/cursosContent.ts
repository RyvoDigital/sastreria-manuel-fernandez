'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useSettings } from '@/lib/settings-provider'
import { COURSE_PURCHASES_SETTING_ID } from '@/lib/course-purchases'
import { COURSES, type Course } from './courses'

/*
 * Everything Cursos renders: the strings of the previous layout and list
 * (kept verbatim), the course list from /api/courses with the same fallback,
 * and the same purchase gate.
 */

/* The hero photo, with its alt. */
export const HERO = {
  src: '/img/curso-sastreria-mesa-corte.webp',
  alt: 'Manuel Fernández trazando y cortando sobre el tejido en la mesa de corte',
}
/* The status badge, in English in every language as before. */
export const BADGE = 'Online Academy'

type L = 'es' | 'en' | 'it' | 'fr'

/* Hero and Stripe return */
const LAYOUT: Record<L, { title: string; desc: string; back: string; successTitle: string; successMsg: string }> = {
  es: {
    title: 'Curso Artesanal',
    desc: 'Nuestra academia digital ofrece masterclasses detalladas sobre las técnicas tradicionales que definen nuestro estilo. Aprende desde cualquier lugar, a tu ritmo.',
    back: 'Volver a cursos',
    successTitle: '¡Compra exitosa!',
    successMsg: 'Gracias por tu compra. Pronto tendrás acceso completo al curso.',
  },
  en: {
    title: 'Artisan Course',
    desc: 'Our digital academy offers detailed masterclasses on the traditional techniques that define our style. Learn from anywhere, at your own pace.',
    back: 'Back to courses',
    successTitle: 'Purchase successful!',
    successMsg: 'Thank you for your purchase. You will soon have full access to the course.',
  },
  it: {
    title: 'Corso Artigianale',
    desc: 'La nostra accademia digitale offre masterclass dettagliate sulle tecniche tradizionali che definiscono il nostro stile. Impara da qualsiasi luogo, al tuo ritmo.',
    back: 'Torna ai corsi',
    successTitle: 'Acquisto riuscito!',
    successMsg: 'Grazie per il tuo acquisto. Presto avrai accesso completo al corso.',
  },
  fr: {
    title: 'Cours Artisanal',
    desc: "Notre académie numérique propose des masterclasses détaillées sur les techniques traditionnelles qui définissent notre style. Apprenez de n'importe où, à votre rythme.",
    back: 'Retour aux cours',
    successTitle: 'Achat réussi !',
    successMsg: 'Merci pour votre achat. Vous aurez bientôt un accès complet au cours.',
  },
}

/* Course list */
const LIST: Record<L, { title: string; subtitle: string; description: string; locked: string; available: string; watch: string; duration: string; lessons: string }> = {
  es: {
    title: 'Cursos Artesanales',
    subtitle: 'Próximamente',
    description: 'Estamos preparando una serie de cursos en vídeo para que puedas aprender la técnica de la sastrería artesanal desde cualquier lugar.',
    locked: 'Próximamente',
    available: 'Disponible',
    watch: 'Ver curso',
    duration: 'Duración',
    lessons: 'Lecciones',
  },
  en: {
    title: 'Artisan Courses',
    subtitle: 'Coming Soon',
    description: 'We are preparing a series of video courses so you can learn the art of handmade tailoring from anywhere.',
    locked: 'Coming Soon',
    available: 'Available',
    watch: 'Watch course',
    duration: 'Duration',
    lessons: 'Lessons',
  },
  it: {
    title: 'Corsi Artigianali',
    subtitle: 'Prossimamente',
    description: "Stiamo preparando una serie di corsi video per permetterti di imparare l'arte della sartoria artigianale da qualsiasi luogo.",
    locked: 'Prossimamente',
    available: 'Disponibile',
    watch: 'Guarda corso',
    duration: 'Durata',
    lessons: 'Lezioni',
  },
  fr: {
    title: 'Cours Artisanaux',
    subtitle: 'Bientôt disponible',
    description: "Nous préparons une série de cours vidéo pour vous permettre d'apprendre l'art de la tailleur artisanale de n'importe où.",
    locked: 'Bientôt',
    available: 'Disponible',
    watch: 'Voir le cours',
    duration: 'Durée',
    lessons: 'Leçons',
  },
}

export type CourseItem = {
  raw: Course
  id: string
  title: string
  desc: string
  image: string
  duration: string
  lessons: number
  /** Badge text: "Próximamente" while locked or purchases are closed, else "Disponible". */
  badge: string
  open: boolean
  /** Button text, as live: locked courses say "Próximamente", the rest "Ver curso". */
  action: string
}

export function useCursosContent() {
  const { locale } = useI18n()
  const { getPrice, getSetting } = useSettings()
  const l = (['es', 'en', 'it', 'fr'].includes(locale) ? locale : 'es') as L
  const layout = LAYOUT[l]
  const list = LIST[l]

  // The admin's courses, else the built-in six.
  const [apiCourses, setApiCourses] = useState<Course[]>([])
  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => setApiCourses(data.courses || []))
      .catch(() => {})
  }, [])
  const source = apiCourses.length > 0 ? apiCourses : COURSES

  // Closed until the admin switches "Compra de cursos" on (see lib/course-purchases.ts).
  const purchasesOpen = getSetting(COURSE_PURCHASES_SETTING_ID)?.enabled === true

  const coursePrice = (courseId: string, price?: number) => {
    if (price !== undefined && price !== null) return price * 100
    const individual = getPrice(`cursos-${courseId}`)
    return (individual || getPrice('cursos') || 350) * 100
  }

  const courses: CourseItem[] = source.map((course) => {
    const open = !course.locked && purchasesOpen
    return {
      raw: course,
      id: course.id,
      title: (course[`title_${l}` as keyof Course] as string) || course.title_es,
      desc: (course[`desc_${l}` as keyof Course] as string) || course.desc_es,
      image: course.image,
      duration: course.duration,
      lessons: course.lessons,
      badge: open ? list.available : list.locked,
      open,
      action: course.locked ? list.locked : list.watch,
    }
  })

  return { locale, layout, list, courses, purchasesOpen, coursePrice }
}

export type CursosContent = ReturnType<typeof useCursosContent>
