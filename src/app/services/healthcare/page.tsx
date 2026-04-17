import HealthcareServicesPageContent from './page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI for Healthcare: Clinics, Hospitals and Diagnostic Centres',
  description: 'AI systems for healthcare businesses. Automated patient appointment management, no-show reduction, billing and revenue cycle automation, clinical operations dashboards, and diagnostic report delivery. Measurable ROI within 90 days.',
  alternates: { canonical: 'https://clarivisintelligence.com/services/healthcare' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://clarivisintelligence.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://clarivisintelligence.com/services' },
        { '@type': 'ListItem', position: 3, name: 'Healthcare', item: 'https://clarivisintelligence.com/services/healthcare' },
      ],
    },
    {
      '@type': 'Service',
      name: 'AI Systems for Healthcare',
      provider: {
        '@type': 'Organization',
        name: 'Clarivis Intelligence',
        url: 'https://clarivisintelligence.com',
      },
      description: 'AI-powered systems for multispecialty clinics, diagnostic centres, and hospitals in India. Reduces patient no-shows, automates billing cycles, and delivers real-time operational dashboards for clinical management.',
      areaServed: { '@type': 'Country', name: 'India' },
      serviceType: 'AI Consulting and Technology',
      url: 'https://clarivisintelligence.com/services/healthcare',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does AI reduce patient no-shows for clinics and hospitals?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Clarivis deploys automated appointment reminder systems that contact patients at 48 hours, 24 hours, and 2 hours before their appointment via SMS, WhatsApp, and phone. Clients typically see up to 40% reduction in no-show rates within the first month of deployment.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI automate billing and revenue cycle management for a healthcare clinic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Clarivis builds billing automation systems that handle invoice generation, payment reconciliation, and collections follow-up. This eliminates manual billing errors and significantly reduces revenue cycle time. Most billing automation systems are deployed within 4 to 6 weeks.',
          },
        },
        {
          '@type': 'Question',
          name: 'What types of healthcare organisations do you work with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We work with multispecialty clinics with 4 to 15 doctors, diagnostic centres and pathology labs, and mid-sized hospitals with 50 to 200 beds. Each engagement starts with a free AI Readiness Assessment to identify your highest-impact opportunity.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to deploy an AI system for a healthcare business?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most healthcare AI systems are deployed within 3 to 6 weeks depending on complexity. Appointment management and reminder systems typically deploy in 3 to 4 weeks. Billing automation and clinical dashboards typically take 4 to 6 weeks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is patient data kept secure when using Clarivis AI systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. All systems built by Clarivis follow data security best practices. Patient data is stored in secure, access-controlled environments. We do not share client data with third parties. Specific compliance requirements are discussed and addressed during the audit engagement.',
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
      <HealthcareServicesPageContent />
    </>
  );
}
