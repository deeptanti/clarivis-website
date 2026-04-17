import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import "./globals.css";
import VisitorTracker from "@/components/VisitorTracker";
import { PostHogProvider } from "@/components/PostHogProvider";
import SiteWrapper from "@/components/SiteWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clarivisintelligence.com'),
  title: {
    default: 'Clarivis Intelligence: AI Consulting and Technology for Real Estate, Healthcare and Agribusiness',
    template: '%s | Clarivis Intelligence'
  },
  description: 'Clarivis Intelligence is an AI-first consulting and technology firm. We help real estate, healthcare, and agribusiness businesses deploy AI systems that generate measurable ROI within 90 days.',
  keywords: [
    'AI consulting firm',
    'AI consulting India',
    'AI for real estate',
    'AI for healthcare',
    'AI for agribusiness',
    'AI automation services',
    'business process automation AI',
    'AI systems real estate',
    'healthcare AI automation',
    'agribusiness AI systems',
    'AI lead qualification real estate',
    'clinic appointment AI',
    'workforce management AI',
    'AI ROI consulting',
    'Clarivis Intelligence',
  ],
  authors: [{ name: 'Clarivis Intelligence' }],
  creator: 'Clarivis Intelligence',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://clarivisintelligence.com',
    siteName: 'Clarivis Intelligence',
    title: 'Clarivis Intelligence: AI Consulting for Real Estate, Healthcare and Agribusiness',
    description: 'Deploy AI systems that generate measurable ROI within 90 days. Specialists in real estate, healthcare, and agribusiness automation.',
    images: [{
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Clarivis Intelligence: AI Consulting and Technology'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarivis Intelligence: AI Consulting for Real Estate, Healthcare and Agribusiness',
    description: 'Deploy AI systems that generate measurable ROI within 90 days.',
    images: ['/images/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://clarivisintelligence.com/#organization',
  name: 'Clarivis Intelligence',
  url: 'https://clarivisintelligence.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://clarivisintelligence.com/images/logo.png',
    width: 280,
    height: 70,
  },
  description: 'AI-first consulting and technology firm helping real estate, healthcare, and agribusiness businesses deploy AI systems that generate measurable ROI within 90 days.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@clarivisintelligence.com',
    telephone: '+91-84018-14334',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://www.linkedin.com/company/clarivis-intelligence',
  ],
  foundingDate: '2026',
  areaServed: 'Worldwide',
  knowsAbout: [
    'Artificial Intelligence',
    'AI Consulting',
    'Real Estate Technology',
    'Healthcare Automation',
    'Agribusiness Technology',
    'Business Process Automation',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#1A1A2E]">
        <PostHogProvider>
          {/* Organisation structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />

          {/* Google Analytics 4 */}
          <Script
            src='https://www.googletagmanager.com/gtag/js?id=G-T1127E5MED'
            strategy='afterInteractive'
          />
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T1127E5MED');
            `}
          </Script>

          {/* Microsoft Clarity */}
          <Script id='clarity-analytics' strategy='afterInteractive'>
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, 'clarity', 'script', 'w5w4s29qzh');
            `}
          </Script>
          <VisitorTracker />
          <SiteWrapper>
            {children}
          </SiteWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
