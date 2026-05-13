# Website Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current website to a process-first structure with a clean 5-item nav, consolidated Solutions hub, new How It Works page, and correct 301 redirects for all retired pages.

**Architecture:** New pages follow the existing `page.tsx` (server, metadata) + `page-client.tsx` ("use client", UI) pattern. Redirects are declared in `next.config.ts`. Old page directories are deleted only after redirects are live. The `/insights` content infrastructure is out of scope — see Plan 2.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React

---

## File Map

| Action | File |
|---|---|
| Modify | `next.config.ts` |
| Modify | `src/components/layout/Navbar.tsx` |
| Modify | `src/components/layout/Footer.tsx` |
| Create | `src/app/how-it-works/page.tsx` |
| Create | `src/app/how-it-works/page-client.tsx` |
| Create | `src/app/solutions/page.tsx` |
| Create | `src/app/solutions/page-client.tsx` |
| Create | `src/app/solutions/real-estate/page.tsx` |
| Create | `src/app/solutions/real-estate/page-client.tsx` |
| Create | `src/app/solutions/healthcare/page.tsx` |
| Create | `src/app/solutions/healthcare/page-client.tsx` |
| Create | `src/app/solutions/agribusiness/page.tsx` |
| Create | `src/app/solutions/agribusiness/page-client.tsx` |
| Delete | `src/app/services/` (whole directory) |
| Delete | `src/app/products/` (whole directory) |
| Delete | `src/app/audit/` (whole directory) |
| Delete | `src/app/book/` (whole directory) |

---

## Task 1: Add 301 Redirects

Do this first. Redirects must be live before old pages are deleted so there is no broken window.

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add redirects to next.config.ts**

Replace the entire file content:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.clarivisintelligence.com" }],
        destination: "https://clarivisintelligence.com/:path*",
        permanent: true,
      },
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/services/real-estate", destination: "/solutions/real-estate", permanent: true },
      { source: "/services/healthcare", destination: "/solutions/healthcare", permanent: true },
      { source: "/services/agribusiness", destination: "/solutions/agribusiness", permanent: true },
      { source: "/products", destination: "/solutions", permanent: true },
      { source: "/audit", destination: "/how-it-works", permanent: true },
      { source: "/book", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify redirects compile**

```bash
cd "/Users/deeptanti/Desktop/untitled folder/Clarivis Intelligence/Website/clarivis-website"
npm run build 2>&1 | tail -20
```

Expected: build completes with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(routing): add 301 redirects for retired pages"
```

---

## Task 2: Update Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Replace navLinks array and CTA button label**

In `src/components/layout/Navbar.tsx`, replace the `navLinks` array (lines 22-30) with:

```typescript
const navLinks = [
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Solutions", path: "/solutions" },
  { name: "About", path: "/about" },
];
```

Then replace the desktop CTA button text (currently "Get Started") with "Start Assessment →":

```tsx
<Link
  href="/assessment"
  className="bg-[#0F6E56] hover:bg-[#0c5945] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors shadow-lg shadow-[#0F6E56]/20"
>
  Start Assessment →
</Link>
```

Also replace the mobile CTA button text (bottom of mobile overlay):

```tsx
<Link
  href="/assessment"
  onClick={() => setIsMobileMenuOpen(false)}
  className="block w-full bg-[#0F6E56] text-white py-4 rounded-md font-medium text-lg text-center"
>
  Start Assessment →
</Link>
```

- [ ] **Step 2: Run dev server and verify nav renders correctly**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm:
- Desktop nav shows: Home | How It Works | Solutions | About | [Start Assessment →]
- Mobile menu shows the same 4 links plus the CTA button
- CTA button is teal, other links are plain text

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat(nav): simplify to 4 links + assessment CTA button"
```

---

## Task 3: Update Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace Footer with 4-column layout**

Replace the entire content of `src/components/layout/Footer.tsx`:

```tsx
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
              <a href="#" className="text-gray-400 hover:text-[#0F6E56] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0F6E56] transition-colors" aria-label="Instagram">
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
            <a href="tel:+918401814334" className="hover:text-[#0F6E56] transition-colors">+91 840 181 4334</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer renders at http://localhost:3000**

Confirm:
- 4 columns visible on desktop (Brand spans 2, then Company / Process / Solutions)
- "Book a Call" links to Calendly URL (external, opens in new tab)
- All internal links are correct paths
- Bottom bar shows email + phone

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): restructure to 4-column layout with new page links"
```

---

## Task 4: Build /how-it-works Page

**Files:**
- Create: `src/app/how-it-works/page.tsx`
- Create: `src/app/how-it-works/page-client.tsx`

- [ ] **Step 1: Create the server wrapper**

Create `src/app/how-it-works/page.tsx`:

```tsx
import HowItWorksContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works: AI Consulting Process in 4 Stages",
  description:
    "Clarivis Intelligence delivers AI systems through a four-stage process: free Assessment, Operational Audit, AI Product Build, and monthly AI Growth Plan. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/how-it-works" },
};

export default function Page() {
  return <HowItWorksContent />;
}
```

- [ ] **Step 2: Create the page-client component**

Create `src/app/how-it-works/page-client.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Scan, Cpu, TrendingUp, Check, ArrowRight } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/clarivisintelligence/ai_opportunity_session";

const stages = [
  {
    number: "01",
    label: "ALWAYS FREE",
    icon: Search,
    title: "Clarivis Assessment",
    description:
      "A structured self-serve assessment that maps your AI opportunities in 5 to 20 minutes. You answer questions about your business through an adaptive AI conversation. At the end you receive a personalised AI Opportunity Snapshot: a 5-page PDF report covering your readiness findings, top 3 AI opportunities, and a recommended starting point.",
    deliverables: [
      "AI Opportunity Snapshot PDF (5 pages)",
      "Top 3 AI opportunities ranked by ROI potential",
      "45-minute AI Opportunity Session with the Clarivis team",
    ],
    cta: { label: "Start the Assessment", href: "/assessment", external: false },
    highlight: null,
  },
  {
    number: "02",
    label: "PAID ENGAGEMENT",
    icon: Scan,
    title: "Operational Audit",
    description:
      "A deep dive into your operations across 4 to 6 recorded sessions covering the founder, operations, sales, and frontline team leads. We map every workflow, document every manual process, and build a complete AI opportunity matrix with ROI projections for your specific business. Six deliverables are produced, leaving nothing to interpretation.",
    deliverables: [
      "Updated AI Opportunity Snapshot",
      "Current State Process Map",
      "AI Readiness Score",
      "Automation Opportunity Matrix with ROI projections",
      "90-Day Implementation Roadmap",
      "Vendor and Tool Recommendations",
    ],
    cta: { label: "Book a Call to Discuss", href: CALENDLY_URL, external: true },
    highlight: {
      title: "Founding Client Offer",
      body: "The first 5 clients to complete a paid audit receive the Clarivis Operational Audit at Rs 10,000 (standard rate Rs 50,000) in exchange for a documented case study and reference. 2 of 5 spots claimed.",
    },
  },
  {
    number: "03",
    label: "FIXED SCOPE, FIXED PRICE",
    icon: Cpu,
    title: "AI Product Build",
    description:
      "We build the highest-impact AI system identified in your audit. Fixed scope, fixed price, 4 to 6 weeks to deploy. Weekly progress updates throughout. ROI is tracked from day one so you see exactly what the system is delivering from the moment it goes live.",
    deliverables: [
      "Purpose-built AI system deployed to your infrastructure",
      "Full documentation and team training",
      "ROI dashboard configured and live",
      "30-day post-launch support included",
    ],
    cta: { label: "Start the Assessment", href: "/assessment", external: false },
    highlight: null,
  },
  {
    number: "04",
    label: "ONGOING",
    icon: TrendingUp,
    title: "AI Growth Plan",
    description:
      "Ongoing monitoring, optimisation, and expansion of your AI systems. Performance reviewed monthly, new capabilities layered in every quarter. As your business grows and your data compounds, your AI systems get smarter. Clients on the AI Growth Plan see compounding returns over 12 to 18 months.",
    deliverables: [
      "Monthly performance review and optimisation",
      "Priority support and issue resolution",
      "New AI capabilities layered in quarterly",
      "Strategic advisory on AI roadmap expansion",
    ],
    cta: { label: "Start the Assessment", href: "/assessment", external: false },
    highlight: null,
  },
];

export default function HowItWorksContent() {
  return (
    <main className="w-full">

      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] overflow-hidden bg-[#1A1A2E]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.07)_0%,transparent_60%)] pointer-events-none z-0" />
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
          >
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              OUR PROCESS
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-white text-[36px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tight"
          >
            From first conversation to measurable ROI in 90 days.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 max-w-[600px] mx-auto"
          >
            A four-stage process designed to deliver results, not reports. Every stage has defined deliverables, defined timelines, and a clear decision point.
          </motion.p>
        </div>
      </section>

      {/* Stages */}
      <section className="relative w-full py-[80px] bg-[#0d1117]">
        <div className="container mx-auto px-6 max-w-[900px]">
          <div className="flex flex-col gap-6">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[48px]"
                >
                  {/* Stage header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="bg-[#0F6E56]/15 p-3 rounded-xl w-fit">
                      <Icon className="w-6 h-6 text-[#0F6E56]" />
                    </div>
                    <div>
                      <div className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-[0.2em] opacity-70">
                        Stage {stage.number} — {stage.label}
                      </div>
                      <h2 className="text-white text-[24px] lg:text-[30px] font-bold leading-tight mt-1">
                        {stage.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-[#CBD5E1] text-[16px] leading-[1.8] mb-6">
                    {stage.description}
                  </p>

                  {/* Founding offer highlight */}
                  {stage.highlight && (
                    <div className="bg-[#0F6E56]/10 border border-[#0F6E56]/30 rounded-[12px] p-5 mb-6">
                      <div className="text-[#0F6E56] text-[12px] font-bold uppercase tracking-wider mb-2">
                        {stage.highlight.title}
                      </div>
                      <p className="text-[#CBD5E1] text-[14px] leading-[1.7]">
                        {stage.highlight.body}
                      </p>
                    </div>
                  )}

                  <div className="h-px w-full bg-[#0F6E56]/15 mb-6" />

                  {/* Deliverables */}
                  <div className="mb-8">
                    <div className="text-[#9CA3AF] text-[12px] font-semibold uppercase tracking-wider mb-4">
                      What you get
                    </div>
                    <ul className="space-y-3">
                      {stage.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#0F6E56] shrink-0 mt-0.5" />
                          <span className="text-[#9CA3AF] text-[14px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  {stage.cta.external ? (
                    <a
                      href={stage.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors"
                    >
                      {stage.cta.label}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      href={stage.cta.href}
                      className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-6 py-3 rounded-md font-medium text-sm transition-colors"
                    >
                      {stage.cta.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative w-full py-[100px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071a14] to-[#0a0f1a] -z-10" />
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.08)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6 max-w-[700px] text-center">
          <h2 className="text-white text-[32px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight">
            Ready to start?
          </h2>
          <p className="text-[#9CA3AF] text-[18px] mt-4 mb-10 max-w-[500px] mx-auto">
            The Assessment is free, takes 5 to 20 minutes, and gives you a personalised AI Opportunity Snapshot at the end. No credit card, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start the Clarivis Assessment
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
```

- [ ] **Step 3: Verify page at http://localhost:3000/how-it-works**

Confirm:
- All 4 stage cards render with correct content
- Founding offer callout appears inside Stage 02 card
- "Book a Call to Discuss" in Stage 02 links to Calendly
- All other CTAs link to /assessment
- Page looks consistent with the rest of the site (dark bg, teal accents, same card style)

- [ ] **Step 4: Commit**

```bash
git add src/app/how-it-works/
git commit -m "feat(page): add /how-it-works with 4-stage process + founding offer callout"
```

---

## Task 5: Build /solutions Hub Page

**Files:**
- Create: `src/app/solutions/page.tsx`
- Create: `src/app/solutions/page-client.tsx`

- [ ] **Step 1: Create server wrapper**

Create `src/app/solutions/page.tsx`:

```tsx
import SolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Real Estate, Healthcare and Agribusiness",
  description:
    "Purpose-built AI systems for real estate developers, healthcare clinics, and agribusiness operators. 15 AI products across 3 verticals, deployed in 4-6 weeks with ROI tracked from day one.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions" },
};

export default function Page() {
  return <SolutionsContent />;
}
```

- [ ] **Step 2: Create page-client component**

Create `src/app/solutions/page-client.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  PhoneCall, Users, Bell, BarChart2, FileText, Check,
  Calendar, Heart, CreditCard, LayoutDashboard, FileSearch,
  ClipboardList, Shield, ArrowRight,
} from "lucide-react";

const verticals = {
  "real-estate": {
    label: "Real Estate",
    href: "/solutions/real-estate",
    pains: [
      "Inbound leads sit unanswered for hours while competitors respond in minutes",
      "Broker and channel partner management lost in WhatsApp groups with no visibility",
      "Collections follow-up is manual, inconsistent, and creates cash flow gaps",
    ],
    products: [
      { icon: PhoneCall, name: "AI Lead Qualifier and Follow-up Agent", desc: "Calls every inbound lead within 60 seconds. Qualifies, collects details, books site visits automatically." },
      { icon: Users, name: "Broker and Channel Partner Portal", desc: "Replaces WhatsApp chaos. Real-time inventory, commission tracking, performance dashboards." },
      { icon: Bell, name: "Payment and Collections Agent", desc: "Automated installment reminders via voice and WhatsApp. Live collections pipeline for management." },
      { icon: BarChart2, name: "Sales Pipeline and Revenue Dashboard", desc: "Live pipeline visibility, agent performance, revenue forecasting in one dashboard." },
      { icon: FileText, name: "Document and Compliance Automation", desc: "Auto-generation of agreements, allotment letters, and RERA-compliant documentation." },
    ],
  },
  "healthcare": {
    label: "Healthcare",
    href: "/solutions/healthcare",
    pains: [
      "No-shows cost the clinic revenue every day with no automated follow-up in place",
      "Manual billing and insurance claim processing creates errors and delays collections",
      "No live visibility into doctor performance, patient flow, or department revenue",
    ],
    products: [
      { icon: Calendar, name: "Patient Appointment Agent", desc: "Bookings via WhatsApp and voice. Three-stage automated reminders. No-show follow-up with rebooking." },
      { icon: Heart, name: "Post-Visit Follow-up System", desc: "Personalised medication reminders, revisit scheduling, and patient satisfaction collection." },
      { icon: CreditCard, name: "Billing and Revenue Cycle Automation", desc: "Automated invoicing, insurance claim processing, and payment reconciliation." },
      { icon: LayoutDashboard, name: "Clinical Operations Dashboard", desc: "Doctor performance, patient flow, and revenue by department in a single live view." },
      { icon: FileSearch, name: "Diagnostic Report Delivery Agent", desc: "Automated report delivery to patients via WhatsApp. Delivery confirmation included." },
    ],
  },
  "agribusiness": {
    label: "Agribusiness",
    href: "/solutions/agribusiness",
    pains: [
      "200+ field staff managed through self-reported attendance with no verification or task tracking",
      "Investor pipeline managed on WhatsApp and spreadsheets with no access control or audit trail",
      "Lead data leaks through open WhatsApp groups exposing prospects to competitors",
    ],
    products: [
      { icon: Users, name: "Workforce Management System", desc: "Daily attendance, task assignment, and performance tracking for field teams of 100 to 500 workers." },
      { icon: ClipboardList, name: "HR and Appraisal Intelligence", desc: "Appraisal cycles linked to attendance and task records. Retention risk flagging." },
      { icon: BarChart2, name: "Investor Pipeline CRM", desc: "Stage-tracked pipeline replacing WhatsApp. Automated follow-up, document management, full audit trail." },
      { icon: Shield, name: "Lead Access Control and NDA System", desc: "Role-based access to prospect data with digital NDA signing and complete audit trail." },
      { icon: LayoutDashboard, name: "Operations Reporting Dashboard", desc: "Field team, collections, and investor pipeline consolidated in one live management view." },
    ],
  },
} as const;

type VerticalKey = keyof typeof verticals;

export default function SolutionsContent() {
  const [activeTab, setActiveTab] = useState<VerticalKey>("real-estate");
  const current = verticals[activeTab];

  return (
    <main className="w-full">

      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] overflow-hidden bg-[#1A1A2E]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.06)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
          >
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              AI SOLUTIONS
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight"
          >
            Purpose-built AI systems. Deployed in weeks. Measured from day one.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 max-w-[600px] mx-auto"
          >
            Fifteen AI products across real estate, healthcare, and agribusiness. Every product built on real operational intelligence from the businesses we serve.
          </motion.p>
        </div>
      </section>

      {/* Tab Switcher + Content */}
      <section className="relative w-full py-[80px] bg-[#0d1117]">
        <div className="container mx-auto px-6 max-w-[1200px]">

          {/* Tabs */}
          <div className="flex justify-center mb-14">
            <div className="bg-[#111827] border border-[#1f2937] rounded-full p-1.5 flex flex-col sm:flex-row gap-1">
              {(Object.keys(verticals) as VerticalKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-8 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                    activeTab === key
                      ? "bg-[#0F6E56] text-white shadow-lg"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#1f2937]"
                  }`}
                >
                  {verticals[key].label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Pain points */}
              <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 mb-8">
                <div className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-4">
                  Common pain points
                </div>
                <ul className="space-y-3">
                  {current.pains.map((pain, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] shrink-0 mt-2" />
                      <span className="text-[#CBD5E1] text-[15px]">{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                {current.products.map((product, i) => {
                  const Icon = product.icon;
                  return (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-7 hover:border-[#0F6E56]/60 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="bg-[#0F6E56]/15 p-2.5 rounded-xl w-fit mb-4">
                        <Icon className="w-5 h-5 text-[#0F6E56]" />
                      </div>
                      <h3 className="text-white text-[18px] font-bold mb-2">{product.name}</h3>
                      <p className="text-[#9CA3AF] text-[14px] leading-[1.7]">{product.desc}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Vertical CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href={current.href}
                  className="inline-flex items-center gap-2 text-[#0F6E56] font-medium text-[15px] hover:opacity-75 transition-opacity"
                >
                  Explore all {current.label} solutions in detail
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Process teaser */}
      <section className="relative w-full py-[80px] bg-[#0a0f1a]">
        <div className="container mx-auto px-6 max-w-[700px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-[28px] lg:text-[36px] font-bold mb-4"
          >
            Not sure which solution is right for you?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[17px] mb-8"
          >
            The Clarivis Assessment identifies your highest-impact opportunity and tells you exactly which product delivers the fastest ROI for your business.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start the Clarivis Assessment
            </Link>
            <Link
              href="/how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-white/30 text-white font-medium transition-all duration-300 hover:border-[#0F6E56] hover:text-[#0F6E56]"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
```

- [ ] **Step 3: Verify at http://localhost:3000/solutions**

Confirm:
- Tab switcher works and animates between verticals
- Each vertical shows correct pain points and products
- "Explore all X solutions in detail" links to `/solutions/real-estate`, `/solutions/healthcare`, `/solutions/agribusiness`
- "See How It Works" links to `/how-it-works`

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/
git commit -m "feat(page): add /solutions hub with vertical tab switcher"
```

---

## Task 6: Migrate /solutions/real-estate

**Files:**
- Create: `src/app/solutions/real-estate/page.tsx`
- Create: `src/app/solutions/real-estate/page-client.tsx`

- [ ] **Step 1: Create server wrapper**

Create `src/app/solutions/real-estate/page.tsx`:

```tsx
import RealEstateSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Real Estate Developers and Brokers in India",
  description:
    "AI systems for real estate developers, brokers, and property managers in India. Lead qualification, broker portals, collections automation, and sales dashboards. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/real-estate" },
};

export default function Page() {
  return <RealEstateSolutionsContent />;
}
```

- [ ] **Step 2: Copy and update page-client**

Copy the full content of `src/app/services/real-estate/page-client.tsx` into `src/app/solutions/real-estate/page-client.tsx`.

Then make these two changes inside the copied file:

1. Rename the exported function from `RealEstateServicesPage` to `RealEstateSolutionsContent`.

2. Replace the "View Our Products" button (which links to `/products`) with:

```tsx
<Link
  href="/solutions"
  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
>
  Explore All Solutions
</Link>
```

- [ ] **Step 3: Verify at http://localhost:3000/solutions/real-estate**

Confirm the page renders identically to the old `/services/real-estate` page with the updated button label.

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/real-estate/
git commit -m "feat(page): migrate /services/real-estate to /solutions/real-estate"
```

---

## Task 7: Migrate /solutions/healthcare

**Files:**
- Create: `src/app/solutions/healthcare/page.tsx`
- Create: `src/app/solutions/healthcare/page-client.tsx`

- [ ] **Step 1: Create server wrapper**

Create `src/app/solutions/healthcare/page.tsx`:

```tsx
import HealthcareSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Clinics, Diagnostic Labs and Hospitals in India",
  description:
    "AI systems for multispecialty clinics, diagnostic labs, and hospitals in India. Patient appointment automation, billing, clinical dashboards, and report delivery. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/healthcare" },
};

export default function Page() {
  return <HealthcareSolutionsContent />;
}
```

- [ ] **Step 2: Copy and update page-client**

Copy the full content of `src/app/services/healthcare/page-client.tsx` into `src/app/solutions/healthcare/page-client.tsx`.

Make these two changes:

1. Rename the exported function to `HealthcareSolutionsContent`.

2. Replace any button that links to `/products` with a link to `/solutions`.

- [ ] **Step 3: Verify at http://localhost:3000/solutions/healthcare**

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/healthcare/
git commit -m "feat(page): migrate /services/healthcare to /solutions/healthcare"
```

---

## Task 8: Migrate /solutions/agribusiness

**Files:**
- Create: `src/app/solutions/agribusiness/page.tsx`
- Create: `src/app/solutions/agribusiness/page-client.tsx`

- [ ] **Step 1: Create server wrapper**

Create `src/app/solutions/agribusiness/page.tsx`:

```tsx
import AgribusinessSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Agribusiness Operators in India",
  description:
    "AI systems for managed farmland operators, input suppliers, and agro-investment firms in India. Workforce management, investor CRM, lead access control, and operations dashboards.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/agribusiness" },
};

export default function Page() {
  return <AgribusinessSolutionsContent />;
}
```

- [ ] **Step 2: Copy and update page-client**

Copy the full content of `src/app/services/agribusiness/page-client.tsx` into `src/app/solutions/agribusiness/page-client.tsx`.

Make these two changes:

1. Rename the exported function to `AgribusinessSolutionsContent`.

2. Replace any button that links to `/products` with a link to `/solutions`.

- [ ] **Step 3: Verify at http://localhost:3000/solutions/agribusiness**

- [ ] **Step 4: Commit**

```bash
git add src/app/solutions/agribusiness/
git commit -m "feat(page): migrate /services/agribusiness to /solutions/agribusiness"
```

---

## Task 9: Remove Retired Pages

Do this last, after all new pages are live and verified. The 301 redirects from Task 1 will handle any incoming traffic to the old URLs.

**Files:**
- Delete: `src/app/services/` (whole directory)
- Delete: `src/app/products/` (whole directory)
- Delete: `src/app/audit/` (whole directory)
- Delete: `src/app/book/` (whole directory)

- [ ] **Step 1: Delete old directories**

```bash
cd "/Users/deeptanti/Desktop/untitled folder/Clarivis Intelligence/Website/clarivis-website"
rm -rf src/app/services src/app/products src/app/audit src/app/book
```

- [ ] **Step 2: Verify no broken imports**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no TypeScript errors referencing the deleted files.

- [ ] **Step 3: Verify redirects work in dev**

Start the dev server and confirm these URLs redirect correctly:
- `http://localhost:3000/services` → `/solutions`
- `http://localhost:3000/services/real-estate` → `/solutions/real-estate`
- `http://localhost:3000/products` → `/solutions`
- `http://localhost:3000/audit` → `/how-it-works`
- `http://localhost:3000/book` → `/contact`

- [ ] **Step 4: Final build check**

```bash
npm run build 2>&1 | tail -30
```

Expected: clean build, no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(restructure): remove retired pages, complete website structure migration"
```

---

## Self-Review Against Spec

| Spec Requirement | Task |
|---|---|
| Nav: Home, How It Works, Solutions, About, [Start Assessment →] | Task 2 |
| Assessment as styled CTA button (not text link) | Task 2 |
| `/how-it-works` page with all 4 stages | Task 4 |
| Founding offer from `/audit` folds into How It Works | Task 4 (Stage 02 section) |
| `/solutions` hub replacing `/services` + `/products` | Task 5 |
| `/solutions/real-estate`, `/healthcare`, `/agribusiness` | Tasks 6-8 |
| 301 redirects for all 7 retired URLs | Task 1 |
| Footer with 4-column layout | Task 3 |
| "Book a Call" in footer links to Calendly directly | Task 3 |
| Old pages removed | Task 9 |
| Contact remains in footer, not in nav | Tasks 2 + 3 |

**Not in this plan (Plan 2):** `/insights` hub and content infrastructure.
