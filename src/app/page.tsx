import HomePageContent from './page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Clarivis Intelligence: AI Consulting for Real Estate, Healthcare and Agribusiness',
  },
  description: 'AI-first consulting and technology firm for real estate, healthcare, and agribusiness in India. Start with a free AI Readiness Assessment and receive your AI Opportunity Snapshot.',
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
