"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [mobileCtaHovered, setMobileCtaHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Real Estate", path: "/real-estate" },
    { name: "Healthcare", path: "/healthcare" },
    { name: "Agribusiness", path: "/agribusiness" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <style>{`
        .nav-link:hover { color: var(--v-signal) !important; }
        .nav-link-underline { background-color: var(--v-signal); }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "backdrop-blur-md py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
        style={isScrolled ? { backgroundColor: "var(--v-fa)" } : undefined}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl tracking-tight z-50 relative"
          >
            <Image src='/images/logo.png' alt='Clarivis Intelligence' width={220} height={55} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="group relative nav-link text-white font-medium text-sm transition-colors"
              >
                {link.name}
                <span className="nav-link-underline absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/assessment"
              className="text-white px-6 py-2.5 rounded-md font-medium text-sm shadow-lg transition-opacity"
              style={{
                backgroundColor: "var(--v-accent)",
                opacity: ctaHovered ? 0.85 : 1,
              }}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
            >
              Start Assessment →
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white z-50 relative p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center pt-20 px-6"
            style={{ backgroundColor: "var(--v-fa)" }}
          >
            <nav className="flex flex-col space-y-6 text-center w-full max-w-sm">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block nav-link text-white text-2xl font-medium tracking-wide py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                className="pt-6 border-t border-white/10 w-full"
              >
                <Link
                  href="/assessment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-white py-4 rounded-md font-medium text-lg text-center transition-opacity"
                  style={{
                    backgroundColor: "var(--v-accent)",
                    opacity: mobileCtaHovered ? 0.85 : 1,
                  }}
                  onMouseEnter={() => setMobileCtaHovered(true)}
                  onMouseLeave={() => setMobileCtaHovered(false)}
                >
                  Start Assessment →
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
