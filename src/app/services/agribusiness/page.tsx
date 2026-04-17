import AgribusinessServicesPageContent from './page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI for Agribusiness — Managed Farmland, Supply Chain and Input Distribution India',
  description: 'AI systems for Indian agribusiness operators. Workforce and attendance management for large field teams, investor pipeline CRM, lead access control, HR and appraisal intelligence, and operational reporting dashboards. Built for farmland operators, supply chain firms, and input distributors.',
  alternates: { canonical: 'https://clarivisintelligence.com/services/agribusiness' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clarivisintelligence.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://clarivisintelligence.com/services' },
        { '@type': 'ListItem', position: 3, name: 'Agribusiness', item: 'https://clarivisintelligence.com/services/agribusiness' },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Systems for Agribusiness',
      provider: {
        '@type': 'Organization',
        name: 'Clarivis Intelligence',
        url: 'https://clarivisintelligence.com',
      },
      description: 'AI-powered operational systems for managed farmland operators, fresh produce and supply chain companies, and input distribution firms across India. Replaces self-reported attendance, WhatsApp-based investor pipelines, and manual HR processes with structured digital infrastructure.',
      areaServed: { '@type': 'Country', name: 'India' },
      serviceType: 'AI Consulting and Technology',
      url: 'https://clarivisintelligence.com/services/agribusiness',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does Clarivis manage workforce attendance for large agribusiness field teams?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clarivis deploys automated daily attendance tracking via WhatsApp, replacing self-reported attendance for teams of 100 to 500 field workers. The system generates daily reports, flags anomalies, and links attendance data to task completion and appraisal cycles. Clients see up to 80% reduction in attendance disputes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI replace WhatsApp for managing investor pipelines in agri-investment firms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Clarivis builds structured investor pipeline CRMs that replace WhatsApp and spreadsheets with stage-tracked pipelines, automated follow-up sequences, document management, and audit trails. This gives leadership full pipeline visibility and eliminates the confidentiality risks of WhatsApp-based investor management.',
          },
        },
        {
          '@type': 'Question',
          name: 'What types of agribusiness companies do you work with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We work with managed farmland and agri-investment operators, fresh produce and supply chain companies, and input supply and distribution firms. Our systems are built for businesses with 20 to 500 employees where manual processes are creating operational friction and revenue leakage.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you prevent lead and investor data confidentiality breaches?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clarivis builds Lead Access Control and NDA systems with role-based access to prospect data, digital NDA signing workflows, and full audit trails showing who accessed what and when. This replaces open WhatsApp groups and shared spreadsheets where data leaks to competitors.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to deploy an agribusiness AI system?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most agribusiness systems are deployed within 4 to 8 weeks depending on team size and integration complexity. Workforce attendance tracking typically deploys in 3 to 4 weeks. Investor CRM and operational dashboards typically take 4 to 6 weeks.',
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
      <AgribusinessServicesPageContent />
    </>
  );
}
