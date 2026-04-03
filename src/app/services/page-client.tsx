"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ClipboardList, Cpu, TrendingUp } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="w-full">
      {/* Section 1: Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] overflow-hidden bg-[#1A1A2E]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.06)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                OUR SERVICES
              </span>
            </div>
            <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight">
              Two industries. One methodology. Guaranteed results.
            </h1>
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4">
              We do not offer generic AI consulting. We go deep into real estate and healthcare because deep expertise is how we deliver measurable ROI within 90 days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Methodology */}
      <section className="relative w-full py-[100px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                THE CLARIVIS METHOD
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[44px] font-bold mb-4"
            >
              Every engagement follows the same proven path.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-[64px]"
            >
              Structured. Transparent. Accountable.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1000px] mx-auto">
            {[
              {
                num: "1", icon: Search, title: "AI Readiness Assessment", 
                desc: "A structured 45-minute discovery call backed by an AI-assisted analysis pipeline. We map your operations, identify your top three AI opportunities, and deliver a personalised snapshot report.",
                deliverable: "AI Opportunity Snapshot report — always free"
              },
              {
                num: "2", icon: ClipboardList, title: "Operational Audit", 
                desc: "Four to six recorded stakeholder interviews, process mapping, and a full AI opportunity matrix with ROI projections. The most thorough operational analysis most businesses have ever had.",
                deliverable: "Full six-document audit package"
              },
              {
                num: "3", icon: Cpu, title: "AI Product Build", 
                desc: "Fixed scope, fixed price, fixed timeline. We build your highest-impact AI system in four to six weeks with ROI tracked from day one. No scope creep, no surprises.",
                deliverable: "Production-ready AI system"
              },
              {
                num: "4", icon: TrendingUp, title: "AI Growth Plan", 
                desc: "Ongoing monitoring, optimisation, and quarterly expansion of your AI systems. New capabilities layered in as your business grows and trust compounds.",
                deliverable: "Ongoing AI management and optimisation"
              }
            ].map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 lg:p-[36px] relative overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top left stage number and icon */}
                    <div className="relative mb-6">
                      <span className="text-[#0F6E56]/15 font-extrabold text-[64px] leading-none absolute -top-4 -left-2 select-none">
                        {stage.num}
                      </span>
                      <Icon className="w-8 h-8 text-[#0F6E56] relative z-10 ml-4 mt-2" />
                    </div>
                    <h3 className="text-white text-[20px] font-bold mb-3">{stage.title}</h3>
                    <p className="text-[#CBD5E1] text-[15px] leading-[1.7] mb-8">
                      {stage.desc}
                    </p>
                  </div>
                  <div className="bg-[#0F6E56]/10 border border-[#0F6E56]/20 py-2.5 px-4 rounded-lg self-start">
                    <span className="text-[#0F6E56] text-[13px] font-bold">{stage.deliverable}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Two vertical cards */}
      <section className="relative w-full py-[100px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                CHOOSE YOUR VERTICAL
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[44px] font-bold mb-12"
            >
              Where do you want to start?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-[1100px] mx-auto">
            {/* Real Estate Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-gradient-to-br from-[#0f1f1a] to-[#0d1117] border border-[#0F6E56]/30 rounded-[20px] p-8 lg:p-[48px] min-h-[320px] flex flex-col justify-between hover:border-[#0F6E56]/80 hover:shadow-[0_0_30px_rgba(15,110,86,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#0F6E56]/20">
                  <span className="text-[#0F6E56] text-[12px] font-bold tracking-widest uppercase">
                    REAL ESTATE
                  </span>
                </div>
                <h3 className="text-white text-[24px] lg:text-[28px] font-bold leading-tight mb-4 group-hover:text-white transition-colors">
                  Developers, brokers, and property managers
                </h3>
                <p className="text-[#9CA3AF] text-[15px] leading-[1.8]">
                  AI systems for lead qualification, broker management, payment collections, pipeline visibility, and document automation.
                </p>
              </div>
              <Link
                href="/services/real-estate"
                className="mt-8 block w-full text-center bg-[#0F6E56] text-white font-medium py-3.5 rounded-lg hover:bg-[#0c5945] transition-colors"
              >
                Explore Real Estate Services
              </Link>
            </motion.div>

            {/* Healthcare Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-gradient-to-br from-[#0f1f1a] to-[#0d1117] border border-[#0F6E56]/30 rounded-[20px] p-8 lg:p-[48px] min-h-[320px] flex flex-col justify-between hover:border-[#0F6E56]/80 hover:shadow-[0_0_30px_rgba(15,110,86,0.15)] transition-all duration-300 group"
            >
              <div>
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-[#0F6E56]/20">
                  <span className="text-[#0F6E56] text-[12px] font-bold tracking-widest uppercase">
                    HEALTHCARE
                  </span>
                </div>
                <h3 className="text-white text-[24px] lg:text-[28px] font-bold leading-tight mb-4 group-hover:text-white transition-colors">
                  Clinics, diagnostic centres, and hospitals
                </h3>
                <p className="text-[#9CA3AF] text-[15px] leading-[1.8]">
                  AI systems for appointment management, patient follow-up, billing automation, clinical dashboards, and diagnostic report delivery.
                </p>
              </div>
              <Link
                href="/services/healthcare"
                className="mt-8 block w-full text-center bg-[#0F6E56] text-white font-medium py-3.5 rounded-lg hover:bg-[#0c5945] transition-colors"
              >
                Explore Healthcare Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative w-full py-[100px] lg:py-[140px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071a14] to-[#0a0f1a] h-[120%] -top-[10%] -z-10" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.08)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
        
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          <div className="mb-6">
            <h2 className="text-white text-[36px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tight">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="block"
              >
                Not <span className="text-[#0F6E56]">sure</span> where to start?
              </motion.span>
            </h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mt-6"
          >
            The free AI Readiness Assessment tells you exactly which opportunity will deliver the highest ROI for your specific business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10"
          >
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start Free Assessment
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
