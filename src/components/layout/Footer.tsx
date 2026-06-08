import React from "react";
import Link from "next/link";
import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/clarivisintelligence/ai_opportunity_session";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand (2 cols wide on lg) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <Link href="/">
              <Image src="/images/logo.png" alt="Clarivis Intelligence" width={240} height={60} />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Clarity in every decision. Intelligence in every system.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://www.linkedin.com/company/clarivis-intelligence" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0F6E56] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://www.instagram.com/clarivisintelligence" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0F6E56] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-1">Company</h3>
            <Link href="/about" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Contact</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Terms of Use</Link>
          </div>

          {/* Process */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-1">Process</h3>
            <Link href="/how-it-works" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">How It Works</Link>
            <Link href="/assessment" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Start Assessment</Link>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Book a Call</a>
            <Link href="/insights" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Insights</Link>
          </div>

          {/* Solutions */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-gray-200 font-semibold text-sm uppercase tracking-wider mb-1">Solutions</h3>
            <Link href="/solutions/real-estate" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Real Estate</Link>
            <Link href="/solutions/healthcare" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Healthcare</Link>
            <Link href="/solutions/agribusiness" className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm">Agribusiness</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500 text-xs">
          <p>© 2026 Clarivis Intelligence Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@clarivisintelligence.com" className="hover:text-[#0F6E56] transition-colors">hello@clarivisintelligence.com</a>
            <span className="text-gray-600">·</span>
            <a href="tel:+918401814334" className="hover:text-[#0F6E56] transition-colors">+91 84018 14334</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
