import type { FAQItem } from '@/types/content'

interface FAQSectionProps {
  items: FAQItem[]
  articleUrl: string
}

export default function FAQSection({ items, articleUrl }: FAQSectionProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'url': articleUrl,
    'mainEntity': items.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer,
      },
    })),
  }

  return (
    <section
      style={{
        borderTop: '1px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
        paddingTop: '3rem',
        marginTop: '3rem',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ borderLeft: '3px solid var(--v-accent)' }} className="pl-4 mb-8">
        <h2 className="text-white text-[22px] font-bold">
          Frequently asked questions
        </h2>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: 'var(--v-fb)',
            border: '0.5px solid color-mix(in srgb, var(--v-accent) 20%, transparent)',
          }}
          className="rounded-xl p-6 mb-4"
        >
          <p className="text-[16px] font-bold text-white mb-3">
            <span
              className="inline-block text-[11px] font-bold px-2 py-0.5 rounded mr-2"
              style={{ background: 'var(--v-accent)', color: 'white' }}
            >
              Q
            </span>
            {item.question}
          </p>
          <p
            className="faq-answer text-[15px] leading-relaxed"
            style={{ color: 'var(--v-muted)' }}
          >
            {item.answer}
          </p>
        </div>
      ))}
    </section>
  )
}
