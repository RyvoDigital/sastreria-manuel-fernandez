'use client'

import { useI18n } from '@/lib/i18n'
import { Play, Lock, Clock, BookOpen } from 'lucide-react'

const COURSES = [
  {
    id: 'intro',
    title_es: 'Introducción a la Sastrería Artesanal',
    title_en: 'Introduction to Artisan Tailoring',
    title_it: 'Introduzione alla Sartoria Artigianale',
    title_fr: 'Introduction à la Tailleur Artisanale',
    desc_es: 'Fundamentos y filosofía del traje a mano.',
    desc_en: 'Fundamentals and philosophy of handmade tailoring.',
    desc_it: "Fondamenti e filosofia dell'abito fatto a mano.",
    desc_fr: 'Fondements et philosophie du costume fait main.',
    duration: '45 min',
    lessons: 3,
    locked: false,
  },
  {
    id: 'canvas',
    title_es: 'Entretelado a Mano',
    title_en: 'Hand Canvas',
    title_it: 'Canvas a Mano',
    title_fr: 'Canvas à la Main',
    desc_es: 'Técnicas de cosido de la entretela canvas.',
    desc_en: 'Hand-stitching canvas interlining techniques.',
    desc_it: 'Tecniche di cucitura della tela canvas.',
    desc_fr: 'Techniques de couture de la toile canvas.',
    duration: '2h 30min',
    lessons: 5,
    locked: true,
  },
  {
    id: 'lapel',
    title_es: 'Construcción de Solapas',
    title_en: 'Lapel Construction',
    title_it: 'Costruzione del Revers',
    title_fr: 'Construction du Revers',
    desc_es: 'Tipos de solapa y su confección paso a paso.',
    desc_en: 'Lapel types and step-by-step construction.',
    desc_it: 'Tipi di rever e costruzione passo dopo passo.',
    desc_fr: 'Types de revers et construction étape par étape.',
    duration: '1h 45min',
    lessons: 4,
    locked: true,
  },
  {
    id: 'pockets',
    title_es: 'Bolsillos de Chaqueta',
    title_en: 'Jacket Pockets',
    title_it: 'Tasche della Giacca',
    title_fr: 'Poches de la Veste',
    desc_es: 'Bolsillos de ojal, de parche y de tapeta.',
    desc_en: 'Welt, patch and flap pockets.',
    desc_it: 'Tasche a filo, a toppa e con patta.',
    desc_fr: 'Poches passepoilées, à patch et à rabat.',
    duration: '2h 15min',
    lessons: 6,
    locked: true,
  },
  {
    id: 'buttonholes',
    title_es: 'Ojales a Mano',
    title_en: 'Hand-made Buttonholes',
    title_it: 'Asole a Mano',
    title_fr: 'Boutonnières à la Main',
    desc_es: 'Técnica de ojales de ojaladero.',
    desc_en: 'Buttonhole stitch technique.',
    desc_it: 'Tecnica del punto a giorno.',
    desc_fr: 'Technique du point de boutonnière.',
    duration: '1h 30min',
    lessons: 3,
    locked: true,
  },
  {
    id: 'finishes',
    title_es: 'Acabados Profesionales',
    title_en: 'Professional Finishes',
    title_it: 'Finiture Professionali',
    title_fr: 'Finitions Professionnelles',
    desc_es: 'Detalles que marcan la diferencia.',
    desc_en: 'Details that make the difference.',
    desc_it: 'Dettagli che fanno la differenza.',
    desc_fr: 'Détails qui font la différence.',
    duration: '2h',
    lessons: 4,
    locked: true,
  },
]

export function CursosList() {
  const { locale } = useI18n()

  const t = {
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
      description: 'Stiamo preparando una serie di corsi video per permetterti di imparare l\'arte della sartoria artigianale da qualsiasi luogo.',
      locked: 'Prossimamente',
      available: 'Disponibile',
      watch: 'Guarda corso',
      duration: 'Durata',
      lessons: 'Lezioni',
    },
    fr: {
      title: 'Cours Artisanaux',
      subtitle: 'Bientôt disponible',
      description: 'Nous préparons une série de cours vidéo pour vous permettre d\'apprendre l\'art de la tailleur artisanale de n\'importe où.',
      locked: 'Bientôt',
      available: 'Disponible',
      watch: 'Voir le cours',
      duration: 'Durée',
      lessons: 'Leçons',
    },
  }

  const c = t[locale as keyof typeof t] || t.es

  return (
    <section id="cursos" className="py-24 px-6 bg-[#F5F5F3]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1C1C1C] mb-4">
            {c.title}
          </h2>
          <div className="w-16 h-px bg-[#C9A96E] mx-auto mb-6" />
          <p className="text-[#1C1C1C]/60 max-w-2xl mx-auto">
            {c.description}
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            opacity: 0,
            animation: 'fadeInUp 0.8s ease-out forwards',
          }}
        >
          {COURSES.map((course, index) => {
            const title = course[`title_${locale}` as keyof typeof course] as string || course.title_es
            const desc = course[`desc_${locale}` as keyof typeof course] as string || course.desc_es

            return (
              <div
                key={course.id}
                className={`group relative bg-white rounded-sm overflow-hidden border border-[#1C1C1C]/5 hover:border-[#C9A96E]/30 transition-all duration-500 ${
                  course.locked ? 'opacity-75' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-[#1C1C1C]/5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {course.locked ? (
                      <Lock className="w-8 h-8 text-[#1C1C1C]/20" />
                    ) : (
                      <Play className="w-8 h-8 text-[#C9A96E]" />
                    )}
                  </div>
                  {course.locked && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[#1C1C1C]/80 text-white text-xs tracking-wider">
                      {c.locked}
                    </div>
                  )}
                  {!course.locked && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[#C9A96E] text-white text-xs tracking-wider">
                      {c.available}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-serif text-[#1C1C1C] mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-[#1C1C1C]/60 mb-4 leading-relaxed">
                    {desc}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#1C1C1C]/40">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {course.lessons} {c.lessons}
                      </span>
                    </div>
                  </div>

                  {!course.locked && (
                    <button className="mt-4 w-full py-2.5 bg-[#1C1C1C] text-white text-sm tracking-wider hover:bg-[#C9A96E] transition-colors duration-300">
                      {c.watch}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
