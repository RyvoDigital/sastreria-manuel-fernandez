"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const COPY = {
  es: {
    title: "Los cursos llegan pronto",
    body: "Todavía no es posible comprar los cursos. Estarán disponibles muy pronto. Si quieres que te avisemos cuando salgan, o tienes alguna pregunta, escríbenos.",
    cta: "Contactar",
    close: "Cerrar",
  },
  en: {
    title: "Courses are coming soon",
    body: "Courses can't be purchased yet. They will be available very soon. If you'd like us to let you know when they launch, or you have any questions, get in touch.",
    cta: "Contact us",
    close: "Close",
  },
  it: {
    title: "I corsi arrivano presto",
    body: "Non è ancora possibile acquistare i corsi. Saranno disponibili molto presto. Se vuoi che ti avvisiamo quando escono, o hai qualche domanda, scrivici.",
    cta: "Contattaci",
    close: "Chiudi",
  },
  fr: {
    title: "Les cours arrivent bientôt",
    body: "Il n'est pas encore possible d'acheter les cours. Ils seront disponibles très prochainement. Si vous souhaitez être prévenu de leur sortie, ou si vous avez une question, écrivez-nous.",
    cta: "Nous contacter",
    close: "Fermer",
  },
};

type LenisLike = { stop: () => void; start: () => void };

/** Shown instead of the checkout while course purchases are closed. */
export function CursosComingSoonDialog({ onClose }: { onClose: () => void }) {
  const { locale } = useI18n();
  const c = COPY[locale as keyof typeof COPY] || COPY.es;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="cursos-soon-title"
      aria-describedby="cursos-soon-body"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-lenis-prevent
      className="cursos-soon"
    >
      <div className="cursos-soon-panel">
        <button type="button" onClick={onClose} aria-label={c.close} className="cursos-soon-close">
          <X size={18} strokeWidth={1.5} />
        </button>
        <h2 id="cursos-soon-title">{c.title}</h2>
        <div className="cursos-soon-rule" />
        <p id="cursos-soon-body">{c.body}</p>
        <Link href="/contacto" className="cursos-soon-cta" onClick={onClose}>
          {c.cta}
        </Link>
      </div>

      <style jsx>{`
        .cursos-soon {
          margin: auto;
          padding: 0;
          border: none;
          background: transparent;
          max-width: min(30rem, calc(100vw - 2rem));
          width: 100%;
          color: #ffffff;
        }
        .cursos-soon::backdrop {
          background: rgba(5, 12, 20, 0.78);
          backdrop-filter: blur(4px);
        }
        .cursos-soon-panel {
          position: relative;
          background: #0d1d30;
          border: 1px solid rgba(201, 168, 76, 0.25);
          padding: clamp(2rem, 6vw, 2.75rem) clamp(1.5rem, 6vw, 2.5rem);
          text-align: center;
        }
        .cursos-soon-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
        .cursos-soon-close:hover,
        .cursos-soon-close:focus-visible {
          color: #c9a84c;
        }
        h2 {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 5vw, 2rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.15;
          margin: 0 0 1.25rem;
        }
        .cursos-soon-rule {
          width: 40px;
          height: 1px;
          background: #c9a84c;
          opacity: 0.5;
          margin: 0 auto 1.25rem;
        }
        p {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.75);
          margin: 0 0 2rem;
        }
        .cursos-soon-panel :global(.cursos-soon-cta) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 2rem;
          background: #c9a84c;
          color: #0a1628;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
        }
        .cursos-soon-panel :global(.cursos-soon-cta:hover),
        .cursos-soon-panel :global(.cursos-soon-cta:focus-visible) {
          background: #e8d5a3;
        }
      `}</style>
    </dialog>
  );
}
