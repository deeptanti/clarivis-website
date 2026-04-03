import React from "react";
import Link from "next/link";

export default function Footer() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/products" },
    { name: "Assessment", path: "/assessment" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column: Brand */}
          <div className="flex flex-col space-y-4">
            <span className="text-[#0F6E56] font-bold text-2xl tracking-tight">
              Clarivis Intelligence
            </span>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Clarity in every decision. Intelligence in every system.
            </p>
          </div>

          {/* Centre Column: Navigation */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-gray-200 font-semibold mb-2">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Contact & Socials */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-gray-200 font-semibold mb-2">Connect</h3>
            <a
              href="mailto:hello@clarivisintelligence.com"
              className="text-gray-400 hover:text-[#0F6E56] transition-colors text-sm"
            >
              hello@clarivisintelligence.com
            </a>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-[#0F6E56] transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#0F6E56] transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© 2026 Clarivis Intelligence Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
