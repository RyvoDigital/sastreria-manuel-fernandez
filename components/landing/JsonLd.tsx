import { SITE_NAME, SITE_URL } from '@/lib/site'
import type { FaqEntry } from '@/data/faq'

/**
 * JSON-LD blocks for the landing pages.
 *
 * Deliberately separate from the LocalBusiness block in app/layout.tsx: that
 * one describes the business and there is exactly one of it site-wide. These
 * describe a page's service and its visible questions, and are not nested
 * inside it.
 */

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** One Service per landing page. */
export function ServiceSchema({ serviceType }: { serviceType: string }) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType,
        provider: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        areaServed: {
          '@type': 'City',
          name: 'Madrid',
        },
      }}
    />
  )
}

/**
 * FAQPage for the questions visible on this page, and only those. Answers are
 * joined from the same paragraph array the accordion renders, so the markup
 * and the visible text cannot drift apart.
 */
export function FaqSchema({ entries }: { entries: readonly FaqEntry[] }) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: entries.map((e) => ({
          '@type': 'Question',
          name: e.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: e.answer.join('\n\n'),
          },
        })),
      }}
    />
  )
}

/** Convenience wrapper: a page's Service block, plus FAQPage when it has one. */
export function JsonLdBlocks({
  serviceType,
  faq,
}: {
  serviceType: string
  faq?: readonly FaqEntry[]
}) {
  return (
    <>
      <ServiceSchema serviceType={serviceType} />
      {faq && faq.length > 0 && <FaqSchema entries={faq} />}
    </>
  )
}
