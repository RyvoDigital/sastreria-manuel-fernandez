'use client'

import { useState } from 'react'
import { useTransitionTo } from './Transition'
import styles from './switcher.module.css'

export const DIRECTIONS = [
  {
    id: '1',
    name: 'Hilván',
    idea:
      'The white basting thread that holds a suit together before the fitting. Deep navy carries the page; gold appears only as thread — a stitched line that sews itself down the left margin as you read and ties every section to the next. Light, large Cormorant against quiet Inter; a measured, asymmetric 12-column grid with content hung off the thread. Photographs run wide with slow parallax inside their frames; headings rise line by line from under a mask; links are underlined with a stitch that sews on hover. Pages change as a bolt of navy cloth rising with a gold stitch running across it.',
  },
  {
    id: '2',
    name: 'Medida',
    idea:
      'The cutting table and the tape measure. The only light direction: white paper, navy ink, gold-dim hairlines, gold kept for the one action that matters. A gold tape measure runs down the right edge and counts the centimetres you have read. Upright Cormorant at very large sizes with tight leading against small, exact Inter; a strict asymmetric grid where text and image sit side by side like a spread. Services become an index you read down, the photograph following your finger. Images are revealed by a straight cut, then drift a little slower than the text; pages change with one clean cut across the sheet.',
  },
  {
    id: '3',
    name: 'Probador',
    idea:
      'The fitting room on Jorge Juan: navy velvet curtains, a mirror, the moment you first see the suit on. The darkest, most cinematic direction — black and navy, gold-light for type, everything on one centred axis. Photographs are tall mirror-shaped frames with a hairline gold edge and slowly settle from a slight zoom as you scroll; full-height sections let the image hold the screen while text passes over it. Italic Cormorant display, words lighting up one after another. The curtains open the homepage once, and close and open again between pages.',
  },
] as const

export function Switcher({ current }: { current: string }) {
  const go = useTransitionTo()
  const [open, setOpen] = useState(false)
  const active = DIRECTIONS.find((d) => d.id === current) ?? DIRECTIONS[0]

  return (
    <div className={styles.wrap} data-open={open || undefined}>
      {open && (
        <div className={styles.note} id="direction-note">
          <strong>
            {active.id} · {active.name}
          </strong>
          <p>{active.idea}</p>
          <p className={styles.small}>
            Preview: hero, introduction, services, “Tu traje empieza en ti”, the three steps and testimonials. The
            remaining homepage sections are designed in Step 3.
          </p>
        </div>
      )}
      <nav className={styles.bar} aria-label="Design directions">
        {DIRECTIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={styles.btn}
            aria-current={d.id === current ? 'page' : undefined}
            onClick={() => d.id !== current && go(`/preview/home?d=${d.id}`)}
          >
            <span className={styles.num}>{d.id}</span> {d.name}
          </button>
        ))}
        <button
          type="button"
          className={styles.info}
          aria-expanded={open}
          aria-controls="direction-note"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '×' : 'i'}
        </button>
      </nav>
    </div>
  )
}
