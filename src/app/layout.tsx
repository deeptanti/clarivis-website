import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clarivisintelligence.com'),
  title: {
    default: 'Clarivis Intelligence — AI Consulting and Technology for Real Estate and Healthcare',
    template: '%s | Clarivis Intelligence'
  },
  description: 'Clarivis Intelligence is an AI-first consulting and technology firm helping real estate and healthcare businesses deploy AI systems that generate measurable ROI within 90 days. Based in Rajkot, India.',
  keywords: ['AI consulting India', 'AI for real estate India', 'AI for healthcare India', 'AI automation Rajkot', 'business AI consulting', 'AI systems real estate', 'healthcare AI automation', 'Clarivis Intelligence'],
  authors: [{ name: 'Clarivis Intelligence' }],
  creator: 'Clarivis Intelligence',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://clarivisintelligence.com',
    siteName: 'Clarivis Intelligence',
    title: 'Clarivis Intelligence — AI Consulting for Real Estate and Healthcare',
    description: 'Deploy AI systems that generate measurable ROI within 90 days. Specialists in real estate and healthcare automation.',
    images: [{
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Clarivis Intelligence'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarivis Intelligence — AI Consulting for Real Estate and Healthcare',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#1A1A2E]">
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-KYGBCC5DTC'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KYGBCC5DTC');
          `}
        </Script>
        <Script id='clarity' strategy='afterInteractive'>
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', 'w5w4s29qzh');
          `}
        </Script>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
