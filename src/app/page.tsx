import HomePageContent from './page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Consulting and Technology for Real Estate, Healthcare and Agribusiness',
  description: 'Clarivis Intelligence is an AI-first consulting and technology firm. We help growing businesses in real estate, healthcare, and agribusiness deploy AI systems that generate measurable ROI within 90 days. Start with a free AI Readiness Assessment.',
  alternates: { canonical: 'https://clarivisintelligence.com' },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://clarivisintelligence.com/#website',
  name: 'Clarivis Intelligence',
  url: 'https://clarivisintelligence.com',
  description: 'AI-first consulting and technology firm for real estate, healthcare, and agribusiness in India.',
  publisher: {
    '@id': 'https://clarivisintelligence.com/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://clarivisintelligence.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePageContent />
    </>
  );
}
