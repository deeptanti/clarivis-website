import RealEstateServicesPageContent from './page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI for Real Estate — Developers, Brokers and Property Managers in India',
  description: 'AI systems built for Indian real estate businesses. Automated lead qualification and follow-up, broker and channel partner portals, payment and collections agents, and live sales pipeline dashboards. Deployed in 4 to 6 weeks.',
  alternates: { canonical: 'https://clarivisintelligence.com/services/real-estate' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clarivisintelligence.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://clarivisintelligence.com/services' },
        { '@type': 'ListItem', position: 3, name: 'Real Estate', item: 'https://clarivisintelligence.com/services/real-estate' },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Systems for Real Estate',
      provider: {
        '@type': 'Organization',
        name: 'Clarivis Intelligence',
        url: 'https://clarivisintelligence.com',
      },
      description: 'End-to-end AI systems for real estate developers, brokers, and property management firms in India. Products include lead qualification agents, channel partner portals, collections automation, and revenue dashboards.',
      areaServed: { '@type': 'Country', name: 'India' },
      serviceType: 'AI Consulting and Technology',
      url: 'https://clarivisintelligence.com/services/real-estate',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How quickly can Clarivis deploy an AI lead qualification system for a real estate firm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most real estate AI lead qualification and follow-up systems are deployed within 4 to 6 weeks. The system responds to inbound leads within 60 seconds, qualifies them automatically, and books site visits without manual intervention.',
          },
        },
        {
          '@type': 'Question',
          name: 'What ROI can a real estate developer expect from AI automation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clients typically see up to 40% more site visits booked through automated lead follow-up, up to 60% fewer overdue payment accounts through collections agents, and full real-time pipeline visibility replacing manual reporting. ROI is measurable within 90 days of deployment.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can your AI systems integrate with WhatsApp for broker and channel partner management?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Clarivis builds broker and channel partner portals that replace WhatsApp groups with structured digital platforms featuring real-time inventory, automated commission tracking, and document management — eliminating the lead confusion and confidentiality risks of WhatsApp-based workflows.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you work with property management firms as well as developers and brokers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We serve real estate developers and builders, broker and agency firms, and property management companies. Each engagement begins with a free AI Readiness Assessment that identifies the highest-impact opportunity specific to your business type.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the free AI Readiness Assessment work for real estate businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The free Clarivis Assessment takes 5 to 20 minutes online. You answer questions about your business, have a short AI-guided conversation, and receive a personalised AI Opportunity Snapshot PDF identifying your top three AI opportunities with indicative ROI and a recommended first step.',
          },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RealEstateServicesPageContent />
    </>
  );
}
