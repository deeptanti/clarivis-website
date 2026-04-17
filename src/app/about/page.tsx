import AboutPageContent from './page-client';

export const metadata = {
  title: 'About — AI-First Consulting and Technology Firm',
  description: 'Clarivis Intelligence is an AI-first consulting and technology firm. Learn about our founder, our methodology, and why we specialise in real estate, healthcare, and agribusiness AI systems that generate measurable ROI.',
  alternates: { canonical: 'https://clarivisintelligence.com/about' },
};

export default function Page() {
  return <AboutPageContent />;
}
