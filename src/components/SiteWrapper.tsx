'use client'

import { usePathname } from 'next/navigation'
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPortal = pathname?.startsWith('/portal')

  return (
    <>
      {!isPortal && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isPortal && <Footer />}
      {!isPortal && <CookieBanner />}
    </>
  )
}
