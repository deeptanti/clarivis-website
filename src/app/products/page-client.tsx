"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  PhoneCall, Users, Bell, BarChart2, FileText, Check,
  Calendar, Heart, CreditCard, LayoutDashboard, FileSearch
} from "lucide-react";

const realEstateProducts = [
  {
    icon: PhoneCall, category: "LEAD MANAGEMENT",
    name: "AI Lead Qualifier and Follow-up Agent",
    desc: "Calls every inbound lead within 60 seconds of enquiry. Qualifies based on your criteria, collects key details, and books site visits automatically. Operates 24 hours a day, 7 days a week in Hindi and English.",
    features: [
      "60-second response time on every inbound lead",
      "Automated site visit booking and calendar sync",
      "Full conversation transcripts and lead scoring dashboard"
    ]
  },
  {
    icon: Users, category: "BROKER MANAGEMENT",
    name: "Broker and Channel Partner Portal",
    desc: "Replaces WhatsApp chaos with a structured digital portal. Real-time inventory visibility, commission tracking, document sharing, and performance dashboards for every channel partner in your network.",
    features: [
      "Real-time inventory updates across all projects",
      "Automated commission calculation and tracking",
      "Channel partner performance leaderboard"
    ]
  },
  {
    icon: Bell, category: "COLLECTIONS",
    name: "Payment and Collections Agent",
    desc: "Automated installment reminders via voice call and WhatsApp at every payment milestone. Escalation workflows for overdue accounts. Full collections pipeline visible to management in real time.",
    features: [
      "Multi-channel reminders via voice and WhatsApp",
      "Automated escalation for overdue payments",
      "Live collections dashboard for management"
    ]
  },
  {
    icon: BarChart2, category: "INTELLIGENCE",
    name: "Sales Pipeline and Revenue Dashboard",
    desc: "Live management intelligence for every project. Pipeline by stage, agent performance, lead-to-visit-to-booking conversion rates, and revenue forecasting in a single real-time dashboard.",
    features: [
      "Live pipeline visibility across all projects",
      "Agent and team performance tracking",
      "Revenue forecasting and target monitoring"
    ]
  },
  {
    icon: FileText, category: "COMPLIANCE",
    name: "Document and Compliance Automation",
    desc: "Auto-generation of sale agreements, allotment letters, demand letters, and RERA-compliant documentation. Reduces documentation time from days to minutes with zero manual errors.",
    features: [
      "Automated generation of all standard documents",
      "RERA compliance built into every template",
      "Digital signature integration ready"
    ]
  }
];

const healthcareProducts = [
  {
    icon: Calendar, category: "APPOINTMENTS",
    name: "Patient Appointment Agent",
    desc: "Automated appointment bookings via WhatsApp and voice. Sends reminders at 48 hours, 24 hours, and 2 hours before every appointment. No-show follow-up with automatic rebooking workflow.",
    features: [
      "WhatsApp and voice booking across all channels",
      "Three-stage automated reminder sequence",
      "No-show follow-up with rebooking workflow"
    ]
  },
  {
    icon: Heart, category: "PATIENT CARE",
    name: "Post-Visit Follow-up System",
    desc: "Personalised medication reminders, revisit scheduling, and patient satisfaction collection after every appointment. Fully automated and personalised per patient condition and treatment plan.",
    features: [
      "Personalised medication and revisit reminders",
      "Automated patient satisfaction collection",
      "Revisit rate tracking and reporting"
    ]
  },
  {
    icon: CreditCard, category: "REVENUE CYCLE",
    name: "Billing and Revenue Cycle Automation",
    desc: "Automated invoice generation, insurance claim processing, payment reconciliation, and overdue follow-up. Eliminates billing errors and accelerates revenue collection across every department.",
    features: [
      "Automated invoice generation and delivery",
      "Insurance claim processing and tracking",
      "Payment reconciliation with zero manual errors"
    ]
  },
  {
    icon: LayoutDashboard, category: "OPERATIONS",
    name: "Clinical Operations Dashboard",
    desc: "Doctor performance, patient flow, revenue by department, staff utilisation, and appointment analytics in a single live dashboard. Management clarity without a single manual report.",
    features: [
      "Live doctor and department performance metrics",
      "Patient flow and capacity utilisation tracking",
      "Revenue by department with trend analysis"
    ]
  },
  {
    icon: FileSearch, category: "DIAGNOSTICS",
    name: "Diagnostic Report Delivery Agent",
    desc: "Automated delivery of lab and diagnostic reports to patients via WhatsApp with personalised messaging. Eliminates manual report distribution, reduces support calls, and improves patient experience.",
    features: [
      "Instant automated report delivery via WhatsApp",
      "Personalised patient messaging per report type",
      "Delivery confirmation and read receipts"
    ]
  }
];

export default function ProductsPageContent() {
  const [activeTab, setActiveTab] = useState<"real-estate" | "healthcare">("real-estate");

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
                AI PRODUCT SUITE
              </span>
            </div>
            <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight">
              Ten AI products. Deployed in weeks. Measured from day one.
            </h1>
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 max-w-[600px] mx-auto">
              Every product in our suite was built on real operational intelligence from the businesses we serve. No generic tools. No off-the-shelf software. Purpose-built AI systems for real estate and healthcare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Tab switcher and product grid */}
      <section className="relative w-full py-[100px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          
          {/* Tab Switcher */}
          <div className="flex justify-center mb-16">
            <div className="bg-[#111827] border border-[#1f2937] rounded-full p-1.5 flex flex-col sm:flex-row gap-1">
              <button
                onClick={() => setActiveTab("real-estate")}
                className={`px-8 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                  activeTab === "real-estate"
                    ? "bg-[#0F6E56] text-white shadow-lg"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#1f2937]"
                }`}
              >
                Real Estate
              </button>
              <button
                onClick={() => setActiveTab("healthcare")}
                className={`px-8 py-3 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                  activeTab === "healthcare"
                    ? "bg-[#0F6E56] text-white shadow-lg"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#1f2937]"
                }`}
              >
                Healthcare
              </button>
            </div>
          </div>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {(activeTab === "real-estate" ? realEstateProducts : healthcareProducts).map((product, idx) => {
                  const Icon = product.icon;
                  return (
                    <motion.div
                      key={idx}
                      className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[40px] hover:border-[#0F6E56]/80 hover:-translate-y-1 transition-all duration-200 flex flex-col h-full hover:shadow-[0_4px_20px_rgba(15,110,86,0.1)]"
                    >
                      {/* Top Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-[#0F6E56]/15 p-2.5 rounded-xl">
                          <Icon className="w-6 h-6 text-[#0F6E56]" />
                        </div>
                        <div className="bg-[#0F6E56]/10 border border-[#0F6E56]/20 px-3 py-1 rounded-full">
                          <span className="text-[#0F6E56] text-[11px] font-bold tracking-wider uppercase">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Name & Desc */}
                      <h3 className="text-white text-[22px] font-bold leading-tight mt-2">
                        {product.name}
                      </h3>
                      <p className="text-[#CBD5E1] text-[15px] leading-[1.8] mt-3">
                        {product.desc}
                      </p>

                      {/* Divider */}
                      <div className="h-px w-full bg-[#0F6E56]/20 my-6" />

                      {/* Features */}
                      <ul className="space-y-3 mb-8 flex-grow">
                        {product.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#0F6E56] shrink-0 mt-0.5" />
                            <span className="text-[#9CA3AF] text-[14px]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Bottom Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <Link
                          href="/assessment"
                          className="flex-1 text-center bg-[#0F6E56] hover:bg-[#0c5945] text-white font-medium py-3 rounded-lg transition-colors"
                        >
                          Start the Clarivis Assessment
                        </Link>
                        <button className="flex-1 text-center bg-transparent border border-[#0F6E56]/40 hover:bg-[#0F6E56]/10 text-[#0F6E56] font-medium py-3 rounded-lg transition-colors">
                          Learn More
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Section 3: Process */}
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
                OUR PROCESS
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[44px] font-bold mb-4"
            >
              Every product follows the same proven build process.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-[64px]"
            >
              No surprises. No scope creep. No disappearing after launch.
            </motion.p>
          </div>

          <div className="relative">
            {/* Desktop Dotted Line */}
            <div className="hidden lg:block absolute top-[24px] left-[12%] right-[12%] h-px border-t-2 border-dashed border-[#0F6E56]/30 z-0" />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
              {[
                { num: "1", title: "Discovery", desc: "The Clarivis Assessment and a 45-minute AI Opportunity Session to understand your specific operation." },
                { num: "2", title: "Audit", desc: "Operational audit with stakeholder interviews and process mapping to define exact scope." },
                { num: "3", title: "Build", desc: "Four to six week build with weekly progress updates. Fixed scope, fixed timeline." },
                { num: "4", title: "Launch and Measure", desc: "Go-live support and ROI tracking from day one. Monthly optimisation included." }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                  className="flex flex-col items-center text-center lg:px-4"
                >
                  <div className="w-[48px] h-[48px] rounded-full bg-[#0F6E56] flex items-center justify-center shadow-[0_0_15px_rgba(15,110,86,0.5)] border-4 border-[#0a0f1a] relative z-10">
                    <span className="text-white font-bold text-lg">{step.num}</span>
                  </div>
                  <h3 className="text-white text-[18px] font-bold mt-5 mb-2">{step.title}</h3>
                  <p className="text-[#9CA3AF] text-[14px] leading-[1.7]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
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
                Which product is <span className="text-[#0F6E56]">right</span> for you?
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
            The Clarivis Assessment identifies your highest-impact opportunity and tells you exactly which product will deliver the fastest ROI for your specific business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start the Clarivis Assessment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-md bg-transparent border border-white text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black"
            >
              Talk to Us
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
