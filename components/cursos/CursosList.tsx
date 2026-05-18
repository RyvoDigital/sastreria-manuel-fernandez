"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Play, Lock, Clock, BookOpen } from "lucide-react";
import Image from "next/image";

interface Course {
  id: string
  title_es: string
  title_en: string
  title_it: string
  title_fr: string
  desc_es: string
  desc_en: string
  desc_it: string
  desc_fr: string
  duration: string
  lessons: number
  locked: boolean
  image: string
  price?: number
}

const COURSES: Course[] = [
  {
    id: "intro",
    title_es: "Introducción a la Sastrería Artesanal",
    title_en: "Introduction to Artisan Tailoring",
    title_it: "Introduzione alla Sartoria Artigianale",
    title_fr: "Introduction à la Tailleur Artisanale",
    desc_es: "Fundamentos y filosofía del traje a mano.",
    desc_en: "Fundamentals and philosophy of handmade tailoring.",
    desc_it: "Fondamenti e filosofia dell'abito fatto a mano.",
    desc_fr: "Fondements et philosophie du costume fait main.",
    duration: "45 min",
    lessons: 3,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/atelier-workshop_n5x6ce",
  },
  {
    id: "canvas",
    title_es: "Entretelado a Mano",
    title_en: "Hand Canvas",
    title_it: "Canvas a Mano",
    title_fr: "Canvas à la Main",
    desc_es: "Técnicas de cosido de la entretela canvas.",
    desc_en: "Hand-stitching canvas interlining techniques.",
    desc_it: "Tecniche di cucitura della tela canvas.",
    desc_fr: "Techniques de couture de la toile canvas.",
    duration: "2h 30min",
    lessons: 5,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/purple-lining-interior_krylkv",
  },
  {
    id: "lapel",
    title_es: "Construcción de Solapas",
    title_en: "Lapel Construction",
    title_it: "Costruzione del Revers",
    title_fr: "Construction du Revers",
    desc_es: "Tipos de solapa y su confección paso a paso.",
    desc_en: "Lapel types and step-by-step construction.",
    desc_it: "Tipi di rever e costruzione passo dopo passo.",
    desc_fr: "Types de revers et construction étape par étape.",
    duration: "1h 45min",
    lessons: 4,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/gray-check-mannequin_gaf1fp",
  },
  {
    id: "pockets",
    title_es: "Bolsillos de Chaqueta",
    title_en: "Jacket Pockets",
    title_it: "Tasche della Giacca",
    title_fr: "Poches de la Veste",
    desc_es: "Bolsillos de ojal, de parche y de tapeta.",
    desc_en: "Welt, patch and flap pockets.",
    desc_it: "Tasche a filo, a toppa e con patta.",
    desc_fr: "Poches passepoilées, à patch et à rabat.",
    duration: "2h 15min",
    lessons: 6,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/showroom-jackets_n55sfk",
  },
  {
    id: "buttonholes",
    title_es: "Ojales a Mano",
    title_en: "Hand-made Buttonholes",
    title_it: "Asole a Mano",
    title_fr: "Boutonnières à la Main",
    desc_es: "Técnica de ojales de ojaladero.",
    desc_en: "Buttonhole stitch technique.",
    desc_it: "Tecnica del punto a giorno.",
    desc_fr: "Technique du point de boutonnière.",
    duration: "1h 30min",
    lessons: 3,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/scissors-cutting_vyt9my",
  },
  {
    id: "finishes",
    title_es: "Acabados Profesionales",
    title_en: "Professional Finishes",
    title_it: "Finiture Professionali",
    title_fr: "Finitions Professionnelles",
    desc_es: "Detalles que marcan la diferencia.",
    desc_en: "Details that make the difference.",
    desc_it: "Dettagli che fanno la differenza.",
    desc_fr: "Détails qui font la différence.",
    duration: "2h",
    lessons: 4,
    locked: false,
    price: 9900,
    image:
      "https://res.cloudinary.com/dp3qxlhb4/image/upload/photos/IMG_9436_uyetr0",
  },
];

interface CursosListProps {
  onSelectCourse?: (course: Course) => void
}

export function CursosList({ onSelectCourse }: CursosListProps) {
  const { locale } = useI18n();

  const t = {
    es: {
      title: "Cursos Artesanales",
      subtitle: "Próximamente",
      description:
        "Estamos preparando una serie de cursos en vídeo para que puedas aprender la técnica de la sastrería artesanal desde cualquier lugar.",
      locked: "Próximamente",
      available: "Disponible",
      watch: "Ver curso",
      duration: "Duración",
      lessons: "Lecciones",
    },
    en: {
      title: "Artisan Courses",
      subtitle: "Coming Soon",
      description:
        "We are preparing a series of video courses so you can learn the art of handmade tailoring from anywhere.",
      locked: "Coming Soon",
      available: "Available",
      watch: "Watch course",
      duration: "Duration",
      lessons: "Lessons",
    },
    it: {
      title: "Corsi Artigianali",
      subtitle: "Prossimamente",
      description:
        "Stiamo preparando una serie di corsi video per permetterti di imparare l'arte della sartoria artigianale da qualsiasi luogo.",
      locked: "Prossimamente",
      available: "Disponibile",
      watch: "Guarda corso",
      duration: "Durata",
      lessons: "Lezioni",
    },
    fr: {
      title: "Cours Artisanaux",
      subtitle: "Bientôt disponible",
      description:
        "Nous préparons une série de cours vidéo pour vous permettre d'apprendre l'art de la tailleur artisanale de n'importe où.",
      locked: "Bientôt",
      available: "Disponible",
      watch: "Voir le cours",
      duration: "Durée",
      lessons: "Leçons",
    },
  };

  const c = t[locale as keyof typeof t] || t.es;

  return (
    <section id="cursos" style={{ padding: 'clamp(5rem, 10vh, 8rem) var(--container-padding)', background: '#0A1628' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header - centered */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vh, 4.5rem)' }}>
          {/* Title first */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 400,
              color: '#FFFFFF',
              marginBottom: '1rem',
              lineHeight: 1.1,
            }}
          >
            {c.title}
          </motion.h2>
          {/* Subtitle below title */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C9A96E',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {c.subtitle}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              width: '48px',
              height: '1px',
              background: '#C9A96E',
              margin: '0 auto 1.5rem',
              opacity: 0.6,
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '560px',
              margin: '0 auto',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              lineHeight: 1.7,
            }}
          >
            {c.description}
          </motion.p>
        </div>

        {/* Cards Grid - centered, better columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
            justifyContent: 'center',
          }}
        >
          {COURSES.map((course, index) => {
            const title =
              (course[`title_${locale}` as keyof typeof course] as string) ||
              course.title_es;
            const desc =
              (course[`desc_${locale}` as keyof typeof course] as string) ||
              course.desc_es;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                style={{
                  position: 'relative',
                  background: '#0D1D30',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.5s ease',
                }}
                className="course-card"
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', overflow: 'hidden', background: '#050A10', width: '100%', aspectRatio: '16/10' }}>
                  <Image
                    src={course.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="course-card-img"
                    unoptimized
                  />

                  {/* Overlay gradient */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, #0D1D30, transparent, transparent)',
                  }} />

                  {/* Center icon */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {course.locked ? (
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                      }}>
                        <Lock
                          size={26}
                          strokeWidth={1.5}
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(201,169,110,0.15)',
                        border: '1px solid rgba(201,169,110,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(8px)',
                      }}>
                        <Play
                          size={26}
                          strokeWidth={1.5}
                          style={{ color: '#C9A96E' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Badge - BIGGER */}
                  {course.locked && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.5rem 1.25rem',
                      background: 'rgba(10,22,40,0.85)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '9999px',
                      border: '1px solid rgba(201,169,110,0.25)',
                      color: '#C9A96E',
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {c.locked}
                    </div>
                  )}
                  {!course.locked && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.5rem 1.25rem',
                      background: '#C9A96E',
                      borderRadius: '9999px',
                      color: '#0A1628',
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {c.available}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    marginBottom: '0.6rem',
                    lineHeight: 1.3,
                    transition: 'color 0.3s',
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.6,
                  }}>
                    {desc}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'var(--font-sans)',
                    marginBottom: course.locked ? '0' : '1.25rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} strokeWidth={1.5} />
                      <span>{course.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={15} strokeWidth={1.5} />
                      <span>
                        {course.lessons} {c.lessons}
                      </span>
                    </div>
                  </div>

                  {/* Course action button */}
                  <button
                    onClick={() => onSelectCourse?.(course)}
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      padding: '0.9rem 1.5rem',
                      background: '#C9A96E',
                      color: '#0A1628',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    {course.locked ? c.locked : c.watch}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .course-card:hover {
          border-color: rgba(201, 169, 110, 0.2) !important;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .course-card:hover h3 {
          color: #C9A96E !important;
        }
        .course-card-img {
          opacity: 0.5;
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .course-card:hover .course-card-img {
          opacity: 0.7;
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
