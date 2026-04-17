"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sprout, Package, Truck, Users, ClipboardList, BarChart2, Shield, LayoutDashboard } from "lucide-react";

export default function AgribusinessServicesPageContent() {
  return (
    <main className="w-full">
      {/* Section 1: Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] overflow-hidden bg-[#1A1A2E]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.06)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">

            {/* Left Column (60%) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[60%]"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                  AGRIBUSINESS
                </span>
              </div>
              <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight">
                AI systems built for the way agribusiness actually operates.
              </h1>
              <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 lg:mt-6">
                From self-reported attendance to automated field tracking. From investor pipelines on WhatsApp to structured CRM. We understand agribusiness operations because we have mapped them across managed farmland operators, supply chain firms, and input distributors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-8">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:bg-[#0c5945]"
                >
                  Start the Clarivis Assessment
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
                >
                  View Our Products
                </Link>
              </div>
            </motion.div>

            {/* Right Column (40%) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[40%]"
            >
              <div className="bg-[#111827] border border-[#0F6E56]/20 rounded-[20px] p-8 lg:p-[40px]">
                <div className="flex flex-col gap-6">
                  {/* Stat 1 */}
                  <div>
                    <div className="text-[#0F6E56] text-[40px] lg:text-[48px] font-extrabold leading-none tracking-tight">80%</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">Reduction in attendance disputes after workforce system deployment</div>
                  </div>
                  <div className="h-px w-full bg-[#1f2937]" />
                  {/* Stat 2 */}
                  <div>
                    <div className="text-[#0F6E56] text-[40px] lg:text-[48px] font-extrabold leading-none tracking-tight">Zero</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">Self-reported attendance after field tracking deployment</div>
                  </div>
                  <div className="h-px w-full bg-[#1f2937]" />
                  {/* Stat 3 */}
                  <div>
                    <div className="text-[#0F6E56] text-[40px] lg:text-[48px] font-extrabold leading-none tracking-tight">90 days</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">To measurable ROI on every build</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Section 2: Who we serve */}
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
                WHO WE SERVE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[44px] font-bold mb-[64px]"
            >
              Three profiles. One deep expertise.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sprout, title: "Managed Farmland and Agri-Investment", tag: "PRIMARY",
                desc: "Revenue above ₹50 crore. One hundred to five hundred employees. Founder or MD decides. Pain points: workforce without HR infrastructure, self-reported attendance, investor pipeline on WhatsApp, lead confidentiality breaches."
              },
              {
                icon: Truck, title: "Fresh Produce and Supply Chain", tag: "SECONDARY",
                desc: "Revenue above ₹20 crore. Fifty to two hundred field and logistics staff. Ops head decides. Pain points: dispatch coordination, quality reporting, traceability from farm to buyer."
              },
              {
                icon: Package, title: "Input Supply and Distribution", tag: "SECONDARY",
                desc: "Revenue above ₹10 crore. Twenty to eighty staff. Owner decides. Pain points: dealer network management, order visibility, credit tracking across a distributed field team."
              }
            ].map((profile, idx) => {
              const Icon = profile.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56] rounded-[16px] p-8 lg:p-[36px] transition-all duration-300 group flex flex-col items-start"
                >
                  <Icon className="w-8 h-8 text-[#0F6E56] mb-4" />
                  <div className="inline-block mb-3 px-2.5 py-0.5 rounded border border-[#0F6E56]/40 bg-[#0F6E56]/10">
                    <span className="text-[#0F6E56] text-[10px] font-bold tracking-widest uppercase">
                      {profile.tag}
                    </span>
                  </div>
                  <h3 className="text-white text-[20px] font-bold mb-3">{profile.title}</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    {profile.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Products for Agribusiness */}
      <section className="relative w-full py-[100px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1000px]">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                AI PRODUCTS
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[44px] font-bold mb-[64px]"
            >
              Five AI systems. Each solving a specific operational gap.
            </motion.h2>
          </div>

          <div className="flex flex-col gap-6">
            {[
              {
                icon: Users, title: "Workforce Management System",
                desc: "Automated daily attendance tracking, task assignment, and performance visibility for field teams of 100 to 500 workers across multiple sites. Replaces self-reported attendance with structured digital infrastructure.",
                outcome: "Scoped to your requirements"
              },
              {
                icon: ClipboardList, title: "HR and Appraisal Intelligence",
                desc: "Digitises appraisal cycles and links performance data to attendance and task records. Gives HR teams structured data for every review and flags retention risks before they become departures.",
                outcome: "Scoped to your requirements"
              },
              {
                icon: BarChart2, title: "Investor Pipeline CRM",
                desc: "Structured investor pipeline replacing WhatsApp and spreadsheets. Stage tracking, document management, and automated follow-up sequences for land investment leads with full audit trail and pipeline visibility for leadership.",
                outcome: "Scoped to your requirements"
              },
              {
                icon: Shield, title: "Lead Access Control and NDA System",
                desc: "Role-based access to prospect data with digital NDA signing workflows and complete audit trails. Eliminates lead data leaks through open WhatsApp groups and shared spreadsheets where competitor exposure is a real risk.",
                outcome: "Scoped to your requirements"
              },
              {
                icon: LayoutDashboard, title: "Operations Reporting Dashboard",
                desc: "Consolidates field team performance, collections activity, and investor pipeline into a single live management view. Replaces manual reporting and WhatsApp status updates with real-time operational intelligence.",
                outcome: "Scoped to your requirements"
              }
            ].map((product, idx) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/50 rounded-[16px] p-6 lg:padding-[32px_40px] px-8 py-8 transition-all duration-300 group flex flex-col hover:shadow-[0_0_20px_rgba(15,110,86,0.05)]"
                >
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
                    {/* Left: Icon and Title */}
                    <div className="flex items-start gap-5 lg:w-[35%] shrink-0">
                      <div className="bg-[#0F6E56]/10 p-3 rounded-xl shrink-0">
                        <Icon className="w-8 h-8 text-[#0F6E56]" />
                      </div>
                      <h3 className="text-white text-[18px] lg:text-[20px] font-bold leading-tight mt-1">{product.title}</h3>
                    </div>

                    {/* Middle: Description */}
                    <div className="lg:w-[45%]">
                      <p className="text-[#9CA3AF] text-[15px] leading-[1.7]">
                        {product.desc}
                      </p>
                    </div>

                    {/* Right: Outcome */}
                    <div className="w-full lg:w-[20%] mt-4 lg:mt-0 flex lg:justify-end">
                      <div className="inline-block px-4 py-2 rounded-lg bg-[#0F6E56]/15 border border-[#0F6E56]/20 whitespace-nowrap">
                        <span className="text-[#0F6E56] text-[13px] font-bold tracking-wide">
                          {product.outcome}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-center mt-12"
          >
            <p className="text-[#6B7280] text-[14px]">
              All products include a monthly AI Growth Plan option.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Section 4: Final CTA */}
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
                Ready to see which product <span className="text-[#0F6E56]">fits</span> your business?
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
            Start the Clarivis Assessment. We will identify which of these products will deliver the highest ROI for your specific operation.
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
              Start the Clarivis Assessment
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
