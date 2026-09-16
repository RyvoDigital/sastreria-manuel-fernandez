/**
 * Layout stylesheet for the landing-page template.
 *
 * Extracted because seven more pages follow this same structure: full-bleed
 * bands, a narrow reading column, a sticky contents rail beside numbered steps,
 * and images that interrupt edge to edge rather than pairing with text.
 * Duplicating it per page would be the real cost here.
 *
 * It is a stylesheet, not an abstraction over layout: a page that needs a
 * different structure should write its own CSS rather than bend these classes.
 * Scope everything under `.lp` so it cannot leak into the rest of the site.
 */
export function LandingStyles() {
  return (
    <style>{`
      .lp .band { padding: clamp(4.5rem, 9vh, 8rem) var(--container-padding); }
      .lp .inner { max-width: var(--container-max); margin: 0 auto; }
      .lp .col { max-width: 60ch; }
      .lp .bleed { width: 100%; }

      /* Sticky contents rail beside a continuous reading column. */
      .lp .rail { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 4vw, 4rem); }
      .lp .index { display: none; }
      .lp .railLink:hover { color: #FFFFFF; }

      /* A numbered step. scroll-margin-top keeps the heading clear of the
         fixed header when the rail links to it. */
      .lp .step {
        scroll-margin-top: var(--header-offset);
        padding-block: clamp(2rem, 4vh, 3rem);
      }
      .lp .step:first-child { padding-top: 0; }
      .lp .stepTitle {
        font-family: var(--font-serif); font-weight: 400; line-height: 1.28;
        margin: 0 0 0.85rem; font-size: clamp(1.3rem, 2.1vw, 1.7rem); color: #FFFFFF;
      }

      /* Below 900px there is no left margin for the numeral to sit in, so it
         stacks above the title and becomes the divider between steps. No
         hairline rule as well: one marker doing one job. */
      .lp .ghost { font-size: clamp(2.2rem, 9vw, 3rem); margin-bottom: 0.4rem; }

      @media (min-width: 1000px) {
        .lp .rail { grid-template-columns: 17rem 1fr; gap: clamp(3rem, 6vw, 6rem); }
        .lp .index { display: block; position: sticky; top: var(--header-offset); align-self: start; }
        .lp .step { display: grid; grid-template-columns: 6.5rem 1fr; gap: clamp(1.5rem, 3vw, 2.5rem); }
        .lp .ghost { font-size: clamp(3rem, 5vw, 4.6rem); margin-bottom: 0; text-align: right; }
      }
    `}</style>
  )
}
