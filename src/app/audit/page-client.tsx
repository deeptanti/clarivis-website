"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingDown, Users, Zap, Search, BarChart2, Cpu, FileText,
  FileSearch, MapPin, Activity, LayoutGrid, Calendar, Package,
  Check, X, Tag, Star, Award, ChevronLeft, ChevronRight, Plus,
} from "lucide-react";

/* ── Shared data ────────────────────────────────────────── */

const spotsTotal = 5;
const spotsClaimed = 2;

const problems = [
  {
    icon: TrendingDown,
    title: "You are making decisions without live data.",
    desc: "Monthly reports, gut feel, and WhatsApp updates are not a management system. By the time you see the problem, it has already cost you.",
  },
  {
    icon: Users,
    title: "Your team is doing work that should not require humans.",
    desc: "Every hour spent on reminders, data entry, and manual follow-up is an hour not spent on revenue-generating activity. The cost compounds daily.",
  },
  {
    icon: Zap,
    title: "You know AI can help but you do not know where to start.",
    desc: "The wrong first AI investment wastes money and destroys confidence. The right first investment pays for itself and creates momentum for everything that follows.",
  },
];

const processSteps = [
  {
    icon: Search,
    name: "Founder Discovery Session",
    desc: "A 90-minute recorded session with the business owner or MD. We map the full operational picture, revenue model, team structure, and strategic priorities. This session sets the context for everything that follows.",
    side: "left",
  },
  {
    icon: Users,
    name: "Operations Deep Dive",
    desc: "Recorded sessions with your operations, sales, and frontline team leads. We map every workflow, identify every manual process, and document every point where things slow down or break.",
    side: "right",
  },
  {
    icon: BarChart2,
    name: "Data and Systems Audit",
    desc: "We review your current tools, data sources, and reporting structure. We identify what data you have, what data you are missing, and what your AI systems will need to operate effectively.",
    side: "left",
  },
  {
    icon: Cpu,
    name: "AI Opportunity Mapping",
    desc: "Using everything gathered, we map every viable AI opportunity against four criteria: impact, feasibility, cost, and time to ROI. Each opportunity is scored and ranked to identify your highest-value starting point.",
    side: "right",
  },
  {
    icon: FileText,
    name: "Roadmap Presentation",
    desc: "A final session where we present your complete AI roadmap, walk through every recommendation, answer every question, and agree on the implementation sequence.",
    side: "left",
  },
];

const deliverables = [
  {
    icon: FileSearch,
    name: "AI Opportunity Snapshot",
    desc: "An updated and expanded version of your initial snapshot, now informed by the full audit. Your top five AI opportunities ranked by ROI potential.",
  },
  {
    icon: MapPin,
    name: "Current State Process Map",
    desc: "A visual map of your current operational workflows showing every step, every handoff, and every point of friction. The foundation for all AI recommendations.",
  },
  {
    icon: Activity,
    name: "AI Readiness Score",
    desc: "A scored assessment across four dimensions: data readiness, process clarity, automation potential, and leadership buy-in. Benchmarked against comparable businesses.",
  },
  {
    icon: LayoutGrid,
    name: "Automation Opportunity Matrix",
    desc: "A scored matrix of every automation opportunity identified, ranked by impact, feasibility, cost, and time to ROI. The definitive guide to your AI investment sequence.",
  },
  {
    icon: Calendar,
    name: "90-Day Implementation Roadmap",
    desc: "A week-by-week implementation plan for your highest-priority AI opportunity. Milestones, dependencies, success metrics, and ROI tracking framework included.",
  },
  {
    icon: Package,
    name: "Vendor and Tool Recommendations",
    desc: "A curated list of the specific tools, platforms, and vendors we recommend for your implementation, with rationale and cost estimates for each.",
  },
];

const isForItems = [
  "You run a real estate or healthcare business with 10 or more staff",
  "You know AI can help but do not know where to start",
  "You are spending more than 20 hours per week on manual processes",
  "You are making management decisions without live data",
  "You are ready to invest in operational improvement",
  "You want a clear ROI-backed plan before committing to a build",
];

const isNotForItems = [
  "You are looking for a generic AI strategy presentation",
  "You want someone to hand you off-the-shelf software",
  "You are not willing to give your team time for interviews",
  "You are not open to changing how your operation works",
];

const faqs = [
  {
    q: "How long does the audit take?",
    a: "The full audit takes four to five weeks from the first session to the final roadmap presentation. This includes four to six recorded sessions with your team, the analysis period, and the deliverable preparation. We work around your schedule to minimise disruption.",
  },
  {
    q: "Who needs to be involved from our side?",
    a: "At minimum we need time with the business owner or MD, and one or two team leads from operations and sales or clinical management. For a full audit we typically conduct four to six sessions of 60 to 90 minutes each. All sessions are recorded and transcribed so nobody needs to take notes.",
  },
  {
    q: "What happens after the audit?",
    a: "You receive all six deliverables and own them completely. You can implement the recommendations yourself, use another vendor, or engage Clarivis Intelligence to build your first AI system. There is no obligation to proceed with us, though most clients do because the audit gives them confidence in exactly what to build.",
  },
  {
    q: "What if we are not ready to implement after the audit?",
    a: "The audit is designed to be evergreen. The process maps, opportunity matrix, and implementation roadmap remain valid for twelve to eighteen months. Many clients complete the audit, file it away, and return when the timing is right. The investment is never wasted.",
  },
  {
    q: "Is the founding client price really ₹10,000?",
    a: "Yes. The full audit involves significant time from our team across four to five weeks. Standard pricing reflects that. The founding client rate exists because we are building our case study library and we are willing to invest our time at a lower rate in exchange for documented results and honest feedback. Once five founding spots are filled, pricing returns to ₹30,000.",
  },
];

/* ── Spots display component ────────────────────────────── */
function SpotsDisplay({ label = true }: { label?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: spotsTotal }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              i < spotsClaimed
                ? "bg-[#0F6E56] border-[#0F6E56] shadow-[0_0_8px_rgba(15,110,86,0.5)]"
                : "bg-transparent border-[#374151]"
            }`}
          />
        ))}
      </div>
      {label && (
        <p className="text-[#6B7280] text-[13px]">
          {spotsClaimed} of {spotsTotal} founding spots claimed. {spotsTotal - spotsClaimed} remaining.
        </p>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function AuditPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="w-full">

      {/* ─── Section 1: Hero ───────────────────────────────── */}
      <section className="relative w-full pt-[120px] pb-[80px] bg-[#1A1A2E] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.06)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

            {/* Left 55% */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[55%]"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">OPERATIONAL AUDIT</span>
              </div>
              <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight">
                Know exactly where AI will move the needle. Before you spend a rupee on building it.
              </h1>
              <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-5">
                Most businesses guess their way into AI. They pick a tool, deploy it, and hope for results. The Clarivis Operational Audit replaces guesswork with a complete, data-backed AI roadmap built specifically for your operation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:bg-[#0c5945] hover:scale-105"
                >
                  Claim Your Founding Spot
                </Link>
                <Link
                  href="#deliverables"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-white/10"
                >
                  See What You Receive
                </Link>
              </div>
            </motion.div>

            {/* Right 45% — pricing card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[45%]"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[40px]">
                <p className="text-white text-[18px] font-bold">Founding Client Offer</p>
                <p className="text-[#9CA3AF] text-[14px] mt-1">First five clients only.</p>

                {/* Pricing */}
                <div className="mt-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[#6B7280] text-[24px] line-through">₹30,000</span>
                  </div>
                  <div className="text-[#0F6E56] text-[48px] font-extrabold leading-none tracking-tight mt-1">
                    ₹10,000
                  </div>
                  <p className="text-[#6B7280] text-[13px] mt-2">One-time investment. No hidden fees.</p>
                </div>

                <div className="h-px w-full bg-[#0F6E56]/20 my-6" />

                {/* Spots */}
                <SpotsDisplay />

                {/* Founder note */}
                <div className="mt-6 bg-[#0F6E56]/08 border border-[#0F6E56]/20 rounded-[12px] p-4" style={{ background: "rgba(15,110,86,0.08)" }}>
                  <p className="text-[#9CA3AF] text-[13px] leading-relaxed">
                    Founding clients receive the full audit experience at reduced investment in exchange for detailed feedback and a case study documenting their results.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Section 2: The problem ────────────────────────── */}
      <section className="relative w-full py-[100px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">THE PROBLEM</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[32px] lg:text-[44px] font-bold mb-4">
              Flying blind is costing you more than you think.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-16">
              Every week without operational clarity is a week of preventable revenue loss.
            </motion.p>
          </div>

          <div className="flex flex-col gap-6 max-w-[900px] mx-auto">
            {problems.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                  className="flex gap-6 items-start bg-[#111827] border-l-4 border-[#0F6E56] rounded-r-[16px] px-8 py-8"
                >
                  <Icon className="w-8 h-8 text-[#0F6E56] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white text-[18px] font-bold mb-2">{p.title}</h3>
                    <p className="text-[#9CA3AF] text-[15px] leading-[1.8]">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 3: Process timeline ───────────────────── */}
      <section className="relative w-full py-[100px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">THE PROCESS</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[32px] lg:text-[44px] font-bold mb-4">
              A structured deep dive into every corner of your operation.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-20">
              Four to five weeks. Four to six recorded sessions. One complete picture.
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-[1000px] mx-auto">
            {/* Central vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[28px] lg:left-1/2 -ml-[1px] w-[2px] bg-[#0F6E56]/40 top-0 bottom-0 origin-top z-0"
            />

            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              const isLeft = step.side === "left";
              return (
                <div key={idx} className={`relative flex flex-col lg:flex-row items-start lg:items-center w-full mb-[80px] ${!isLeft ? "lg:flex-row-reverse" : ""}`}>
                  {/* Node */}
                  <div className="absolute left-[28px] lg:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#0F6E56] shadow-[0_0_15px_rgba(15,110,86,0.4)] flex items-center justify-center z-10">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className={`relative ml-[80px] lg:ml-0 w-full lg:w-1/2 ${isLeft ? "lg:pr-12" : "lg:pl-12"}`}
                  >
                    <div className={`bg-[#111827] border border-[#1f2937] rounded-[16px] p-[36px] lg:max-w-[500px] ${isLeft ? "lg:ml-auto lg:text-right" : ""} relative`}>
                      {/* Arrow */}
                      <div className={`lg:hidden absolute top-[36px] -left-[24px] text-[#0F6E56]`}>
                        <ChevronLeft className="w-8 h-8" />
                      </div>
                      {isLeft ? (
                        <div className="hidden lg:block absolute top-[36px] -right-[24px] text-[#0F6E56]">
                          <ChevronRight className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="hidden lg:block absolute top-[36px] -left-[24px] text-[#0F6E56]">
                          <ChevronLeft className="w-8 h-8" />
                        </div>
                      )}
                      <div className="text-[#0F6E56] text-[12px] uppercase tracking-[0.2em] opacity-60 mb-2 font-bold">Step 0{idx + 1}</div>
                      <h3 className="text-white font-bold text-[20px] mb-3">{step.name}</h3>
                      <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">{step.desc}</p>
                    </div>
                  </motion.div>

                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Deliverables ───────────────────────── */}
      <section id="deliverables" className="relative w-full py-[100px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">WHAT YOU RECEIVE</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[32px] lg:text-[44px] font-bold mb-4">
              Six documents. One complete AI strategy.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-16">
              Everything you need to make informed decisions and move forward with confidence.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deliverables.map((d, idx) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 lg:p-[36px] hover:border-[#0F6E56]/60 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,110,86,0.08)] transition-all duration-200"
                >
                  <Icon className="w-9 h-9 text-[#0F6E56] mb-4" />
                  <h3 className="text-white text-[18px] font-bold mb-3">{d.name}</h3>
                  <p className="text-[#9CA3AF] text-[14px] leading-[1.7]">{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 5: Who it's for ───────────────────────── */}
      <section className="relative w-full py-[100px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">RIGHT FIT</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[32px] lg:text-[44px] font-bold mb-12">
              The audit is designed for businesses at a specific stage.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Is for */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 lg:p-[36px]"
            >
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-5 h-5 text-[#0F6E56]" />
                <h3 className="text-white text-[18px] font-bold">This is for you if:</h3>
              </div>
              <ul className="flex flex-col gap-4">
                {isForItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[15px] leading-[1.7]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not for */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 lg:p-[36px]"
            >
              <div className="flex items-center gap-3 mb-6">
                <X className="w-5 h-5 text-[#9CA3AF]" />
                <h3 className="text-white text-[18px] font-bold">This is not for you if:</h3>
              </div>
              <ul className="flex flex-col gap-4">
                {isNotForItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-[#EF4444]/70 shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[15px] leading-[1.7]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Founding client CTA ───────────────── */}
      <section className="relative w-full py-[100px] overflow-hidden" style={{ background: "linear-gradient(to bottom, #071a14, #0d1117)" }}>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.08)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
        <div className="container relative z-10 mx-auto px-6 max-w-[900px] text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">FOUNDING CLIENT PROGRAMME</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[40px] lg:text-[48px] font-extrabold leading-[1.1] mb-4">
            <span className="text-[#0F6E56]">Five spots.</span> One opportunity.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }} className="text-[#9CA3AF] text-[18px] max-w-[600px] mx-auto mb-16">
            We are accepting five founding clients for the Clarivis Operational Audit at a significantly reduced investment. In exchange we ask for your time, your honesty, and permission to document your results.
          </motion.p>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Tag, title: "₹10,000 investment", desc: "Full audit experience at founding client pricing. Standard investment is ₹30,000." },
              { icon: Star, title: "Priority attention", desc: "Founding clients receive more of our time, more sessions, and more detailed documentation than any future client." },
              { icon: Award, title: "Case study feature", desc: "Your results will be documented and published as a Clarivis case study. Your business gets visibility. We get proof." },
            ].map((col, idx) => {
              const Icon = col.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="bg-[#0F6E56]/15 p-4 rounded-2xl">
                    <Icon className="w-8 h-8 text-[#0F6E56]" />
                  </div>
                  <h3 className="text-white text-[18px] font-bold">{col.title}</h3>
                  <p className="text-[#9CA3AF] text-[15px] leading-[1.7]">{col.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="h-px w-full bg-[#0F6E56]/20 mb-12" />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h3 className="text-white text-[28px] font-bold mb-3">Ready to claim your founding spot?</h3>
            <p className="text-[#9CA3AF] text-[16px] mb-8">
              Book your free AI Opportunity Session first. If there is a clear fit, we will discuss the audit on the call.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-10 py-4 rounded-md bg-[#0F6E56] text-white font-semibold text-[16px] transition-all duration-300 hover:bg-[#0c5945] hover:scale-105"
            >
              Book Your Free AI Opportunity Session
            </Link>
            <p className="text-[#6B7280] text-[13px] mt-4">No commitment required. The session is free.</p>

            <div className="mt-8 flex flex-col items-center gap-2">
              <SpotsDisplay />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Section 7: FAQ ────────────────────────────────── */}
      <section className="relative w-full py-[80px] bg-[#0d1117]">
        <div className="container mx-auto px-6 max-w-[800px]">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">QUESTIONS</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className="text-white text-[36px] font-bold">
              About the audit
            </motion.h2>
          </div>

          <div className="flex flex-col">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: idx * 0.07, ease: "easeOut" }}
                  className="border-b border-[#1f2937]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="text-white text-[17px] font-semibold pr-4 group-hover:text-[#0F6E56] transition-colors">
                      {faq.q}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                      <Plus className="w-5 h-5 text-[#0F6E56]" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#9CA3AF] text-[15px] leading-[1.8] pb-6">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
