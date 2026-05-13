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
