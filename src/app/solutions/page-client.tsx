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
