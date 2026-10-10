/* The built-in course list, shown when the admin has no courses of its own
   (same fallback as before). */
export interface Course {
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

export const COURSES: Course[] = [
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
    price: undefined,
    image:
      "/img/curso-manuel-fernandez-mesa-corte.webp",
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
    price: undefined,
    image:
      "/img/solapa-chaqueta-cuadros-curso.webp",
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
    price: undefined,
    image:
      "/img/chaleco-verde-chaqueta-azul-showroom.webp",
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
    price: undefined,
    image:
      "/img/chaquetas-maniquies-showroom.webp",
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
    price: undefined,
    image:
      "/img/chaqueta-azul-terminada-despues.webp",
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
    price: undefined,
    image:
      "/img/anatomia-traje-forro-interior.webp",
  },
];
