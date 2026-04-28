"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Play, Lock, Clock, BookOpen } from "lucide-react";
import Image from "next/image";

const COURSES = [
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797375/photos/atelier-workshop_n5x6ce.jpg",
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797394/photos/cutting-fabric-wide_jqwwjw.jpg",
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797440/photos/chalk-cutting_jb9czb.jpg",
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797382/photos/velvet-lining_ukeflq.jpg",
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797445/photos/sleeve-buttons_drh2px.jpg",
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
    locked: true,
    image:
      "https://res.cloudinary.com/dwruvre6o/image/upload/v1776797389/photos/atelier-tools_clirtk.jpg",
  },
];

export function CursosList() {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#C9A96E] text-xs tracking-[0.25em] uppercase mb-4 font-sans"
          >
            {c.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-white mb-6"
          >
            {c.title}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C9A96E] mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed"
          >
            {c.description}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(1.5rem, 3vw, 2.5rem)",
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
                className="group relative bg-[#0D1D30] rounded-lg overflow-hidden border border-white/5 hover:border-[#C9A96E]/30 transition-all duration-500"
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', overflow: 'hidden', background: '#050A10', aspectRatio: '16/10' }}>
                  <Image
                    src={course.image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-700 opacity-50 group-hover:opacity-70"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D30] via-transparent to-transparent" />

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {course.locked ? (
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Lock
                          className="w-6 h-6 text-white/40"
                          strokeWidth={1.5}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center backdrop-blur-sm">
                        <Play
                          className="w-6 h-6 text-[#C9A96E]"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  {course.locked && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#0A1628]/80 backdrop-blur-sm rounded-full border border-[#C9A96E]/20 text-[#C9A96E] text-[10px] tracking-[0.2em] uppercase font-medium">
                      {c.locked}
                    </div>
                  )}
                  {!course.locked && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#C9A96E] rounded-full text-[#0A1628] text-[10px] tracking-[0.2em] uppercase font-semibold">
                      {c.available}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                  <h3 className="text-lg font-serif text-white mb-2 group-hover:text-[#C9A96E] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-sm text-white/50 mb-5 leading-relaxed">
                    {desc}
                  </p>

                  <div className="flex items-center gap-5 text-xs text-white/40">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>
                        {course.lessons} {c.lessons}
                      </span>
                    </div>
                  </div>

                  {!course.locked && (
                    <button className="mt-5 w-full py-3 bg-[#C9A96E] text-[#0A1628] text-xs tracking-[0.15em] uppercase font-medium rounded hover:bg-[#b89a5e] transition-colors duration-300">
                      {c.watch}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
