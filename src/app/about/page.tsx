import AboutPageContent from './page-client';

export const metadata = {
  title: 'About Clarivis Intelligence',
  description: 'Clarivis Intelligence is an AI-first consulting firm founded in Rajkot, India. Learn about our founder, our four-stage methodology, and why we specialise in real estate, healthcare, and agribusiness.',
  alternates: { canonical: 'https://clarivisintelligence.com/about' },
};

export default function Page() {
  return <AboutPageContent />;
}
