'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { id: 1, cat: 'Trajes',     name: 'Traje Príncipe de Gales', price: null,   roman: 'I',    new: true  },
  { id: 2, cat: 'Chaquetas',  name: 'Chaqueta Camel',          price: null,   roman: 'II',   new: false },
  { id: 3, cat: 'Chaquetas',  name: 'Blazer Tweed Madrid',     price: null,   roman: 'III',  new: true  },
  { id: 4, cat: 'Accesorios', name: 'Corbata de Seda',         price: '€150', roman: 'IV',   new: false },
  { id: 5, cat: 'Accesorios', name: 'Pañuelo de Lino',         price: '€85',  roman: 'V',    new: false },
  { id: 6, cat: 'Accesorios', name: 'Gemelos Nácar',           price: '€220', roman: 'VI',   new: true  },
  { id: 7, cat: 'Ceremonias', name: 'Traje de Novio',          price: null,   roman: 'VII',  new: false },
  { id: 8, cat: 'Ceremonias', name: 'Chaqué de Mañana',        price: null,   roman: 'VIII', new: false },
]

const FILTERS = ['Todos', 'Trajes', 'Chaquetas', 'Accesorios', 'Ceremonias']

export function ColeccionShop() {
  const { t } = useI18n()
  const c = t.coleccion.shop
  const [activeFilter, setActiveFilter] = useState('Todos')
  const gridRef    = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  const filtered = activeFilter === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === activeFilter)

  // Initial scroll-triggered entrance
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return
          hasAnimated.current = true
          gsap.from(gridRef.current?.querySelectorAll('.mf-shop-card') ?? [], {
            y: 32, opacity: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08,
          })
        },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // Animate cards on filter change (after first render)
  useEffect(() => {
    if (!hasAnimated.current) return
    const cards = gridRef.current?.querySelectorAll('.mf-shop-card')
    if (!cards?.length) return
    gsap.fromTo(cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07 }
    )
  }, [activeFilter])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#EDE8E0',
        padding: 'clamp(4rem, 8vh, 7rem) var(--container-padding) clamp(5rem, 10vh, 9rem)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* ── Filter bar ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 0,
          marginBottom: 'clamp(3rem, 5vh, 4.5rem)',
          borderBottom: '1px solid rgba(5,12,20,0.1)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {FILTERS.map(filter => {
            const active = activeFilter === filter
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '1px solid var(--color-gold)' : '1px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  padding: '0 2rem 1rem 0',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--color-navy)' : 'rgba(5,12,20,0.3)',
                  transition: 'color 0.22s ease, border-color 0.22s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {active && (
                  <span style={{
                    display: 'inline-block',
                    width: '1rem',
                    height: '1px',
                    background: 'var(--color-gold)',
                    opacity: 0.6,
                    flexShrink: 0,
                  }} />
                )}
                {filter}
              </button>
            )
          })}

          {/* Item count — right side */}
          <span style={{
            marginLeft: 'auto',
            paddingBottom: '1rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.48rem',
            letterSpacing: '0.18em',
            color: 'rgba(5,12,20,0.25)',
            whiteSpace: 'nowrap',
          }}>
            {filtered.length} {filtered.length === 1 ? 'pieza' : 'piezas'}
          </span>
        </div>

        {/* ── Product grid ── */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '2px',
          }}
        >
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

type Product = typeof PRODUCTS[0]

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="mf-shop-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* ── Photo placeholder ── */}
      <div style={{
        aspectRatio: '4/5',
        background: 'var(--color-navy)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Grid texture — scales on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(196,163,90,0.055) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(196,163,90,0.055) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '32px 32px',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }} />

        {/* NEW badge */}
        {product.new && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'var(--color-gold)',
            padding: '0.25rem 0.55rem',
            zIndex: 2,
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.4rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#050C14',
            }}>Nuevo</span>
          </div>
        )}

        {/* Roman numeral */}
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
          fontWeight: 400,
          color: hovered ? 'rgba(196,163,90,0.22)' : 'rgba(196,163,90,0.12)',
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
          transition: 'color 0.4s ease',
          userSelect: 'none',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          display: 'inline-block',
          transitionProperty: 'color, transform',
          transitionDuration: '0.4s, 0.7s',
          transitionTimingFunction: 'ease, cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}>
          {product.roman}
        </span>

        {/* Hover CTA overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '2rem 1.25rem 1.1rem',
          background: 'linear-gradient(to top, rgba(5,12,20,0.7) 0%, transparent 100%)',
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 2,
        }}>
          <Link
            href="/reservar"
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              textDecoration: 'none',
            }}
          >
            {product.price ? 'Comprar →' : 'Consultar →'}
          </Link>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div style={{
        padding: '0.85rem 1.1rem 1.1rem',
        borderTop: '1px solid rgba(5,12,20,0.05)',
        background: hovered ? 'rgba(5,12,20,0.025)' : '#fff',
        transition: 'background 0.3s ease',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.46rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(196,163,90,0.62)',
          marginBottom: '0.3rem',
        }}>
          {product.cat}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '0.5rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.92rem, 1.3vw, 1.08rem)',
            fontWeight: 400,
            color: 'var(--color-navy)',
            lineHeight: 1.2,
          }}>
            {product.name}
          </p>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.54rem',
            letterSpacing: '0.06em',
            color: product.price ? 'var(--color-navy)' : 'rgba(5,12,20,0.28)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {product.price ?? 'Consultar'}
          </p>
        </div>
      </div>
    </div>
  )
}
