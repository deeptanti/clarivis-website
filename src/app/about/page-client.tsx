"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Target, Zap, Eye, RefreshCw, User } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-20 lg:pt-[120px] pb-[100px] overflow-hidden bg-[#1A1A2E]">
        {/* Subtle Static Radial Teal Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.06)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />

        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-start">
            
            {/* Left Column (55%) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[55%]"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                  OUR STORY
                </span>
              </div>
              <h1 className="text-white text-[28px] lg:text-[42px] font-extrabold leading-[1.1] tracking-tight">
                We built Clarivis Intelligence to give growing businesses enterprise-grade AI without the enterprise price tag.
              </h1>
              <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-6 lg:mt-8">
                Most businesses know AI can help them. Few know exactly where to start, what it will cost, or what return to expect. We answer all three questions before we charge a single cent.
              </p>
            </motion.div>

            {/* Right Column (45%) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[45%]"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[40px]">
                <div className="flex flex-col gap-6">
                  {/* Stat 1 */}
                  <div>
                    <div className="text-[#0F6E56] text-[48px] font-extrabold leading-none tracking-tight">90</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">Day ROI guarantee on every build</div>
                  </div>
                  <div className="h-px w-full bg-[#1f2937]" />
                  {/* Stat 2 */}
                  <div>
                    <div className="text-[#0F6E56] text-[48px] font-extrabold leading-none tracking-tight">3</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">Industries. Infinite operational depth.</div>
                  </div>
                  <div className="h-px w-full bg-[#1f2937]" />
                  {/* Stat 3 */}
                  <div>
                    <div className="text-[#0F6E56] text-[48px] font-extrabold leading-none tracking-tight">4-6</div>
                    <div className="text-[#9CA3AF] text-[15px] mt-2">Weeks from audit to deployed AI system</div>
                  </div>

                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative w-full py-12 lg:py-16 bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative inline-block text-center"
          >
            <div className="absolute -top-6 lg:-top-10 -left-6 lg:-left-12 text-[#0F6E56] text-[80px] font-serif leading-none opacity-30 select-none">
              &ldquo;
            </div>
            <p className="text-white text-[22px] lg:text-[28px] font-semibold leading-[1.6] italic relative z-10">
              Clarity in every decision. Intelligence in every system.
            </p>
            <div className="w-16 h-[2px] bg-[#0F6E56] mx-auto mt-10 mb-5 opacity-80" />
            <div className="text-[#9CA3AF] text-sm tracking-wide">
              Clarivis Intelligence, India
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative w-full py-[100px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">WHAT WE DO</span>
            </div>
            <h2 className="text-white text-[32px] lg:text-[44px] font-bold">
              Six capabilities. One integrated practice.
            </h2>
            <p className="text-[#9CA3AF] text-[18px] mt-4 max-w-[600px]">
              Every engagement draws on the full stack: from diagnosis to deployment to long-term optimisation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
                label: "We Diagnose",
                desc: "Before we recommend anything, we map exactly where your business is losing time and money. Our audit process surfaces the real pain, not the assumed pain."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                ),
                label: "We Strategise",
                desc: "We translate audit findings into a prioritised 90-day roadmap, ranked by ROI, sequenced for your team's capacity, and grounded in what is actually buildable."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                ),
                label: "We Build",
                desc: "Our team designs and deploys AI systems purpose-built for your operation. Not off-the-shelf software. Not generic automation. Systems built around how your business actually works."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                label: "We Deploy",
                desc: "We handle implementation end to end: integration, testing, team onboarding, and go-live. Most clients have a live AI system in their business within four to six weeks."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                label: "We Measure",
                desc: "Every system we build is tracked against the ROI baseline established in the audit. You always know exactly what working with us is worth in concrete terms."
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                ),
                label: "We Optimise",
                desc: "Post-deployment, we monitor performance, improve models, and identify the next highest-impact opportunity. Our retainer clients compound their AI advantage every quarter."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                className="flex flex-col items-center text-center p-8 bg-[#111827] border border-[#1f2937] rounded-[16px] hover:border-[#0F6E56]/40 transition-colors group"
              >
                <div className="text-[#0F6E56] mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-[#0F6E56] text-[18px] font-bold mb-3">{item.label}</h3>
                <p className="text-[#9CA3AF] text-[15px] leading-[1.7]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="relative w-full py-[120px] bg-[#0a0f1a] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                  THE FOUNDER
                </span>
              </div>
              <h2 className="text-white text-[36px] font-bold tracking-tight">
                Deep Tanti
              </h2>
              <div className="text-[#0F6E56] text-[16px] font-medium mt-1">
                Founder, Clarivis Intelligence 
              </div>
              <p className="text-[#9CA3AF] text-[16px] leading-[1.8] mt-6">
                Before founding Clarivis Intelligence, I built AI and data systems that operated at scale. At Medmate in Australia, I joined as a backend engineer during Covid and architected core infrastructure through a complete company pivot, eventually leading ML development for fraud prevention and recommendations on a platform serving over 150,000 users. I then completed a Master of Science in Analytics at Harrisburg University in the United States, specialising in AI, and Cloud Engineering. Clarivis Intelligence brings that international experience to real estate, healthcare, and agribusiness operators across India.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8">
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F6E56]/40 bg-[#111827]">
                  <span className="text-white text-[13px] font-medium">B.Tech, RMIT University, Australia</span>
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F6E56]/40 bg-[#111827]">
                  <span className="text-white text-[13px] font-medium">M.Sc Analytics, Harrisburg University, USA</span>
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F6E56]/40 bg-[#111827]">
                  <span className="text-white text-[13px] font-medium">Co-Founder, Assiduous Technology, USA</span>
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F6E56]/40 bg-[#111827]">
                  <span className="text-white text-[13px] font-medium">Microsoft Certified: Azure Data Scientist Associate</span>
                </div>
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#0F6E56]/40 bg-[#111827]">
                  <span className="text-white text-[13px] font-medium">Microsoft Certified: Azure AI Engineer Associate</span>
                </div>
              </div>

              <div className="mt-10">
                <a href="#" className="inline-flex items-center gap-2 text-[#0F6E56] hover:text-[#0c5945] transition-colors group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="text-[15px] font-medium">Connect on LinkedIn</span>
                </a>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] min-h-[400px] flex flex-col items-center justify-center p-8">
                {/* Note: replace this with an actual Next.js Image component pointing to /images/founder.jpg when photo is available */}
                <User className="w-16 h-16 text-[#374151] mb-4" />
                <span className="text-[#6B7280] text-[15px]">Founder photo coming soon</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative w-full py-[120px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                HOW WE WORK
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[48px] font-bold mb-4"
            >
              Principles that govern every engagement.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[500px] mx-auto mb-[64px]"
            >
              Not a methodology deck. The actual way we work.
            </motion.p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: "Outcomes over outputs",
                desc: "We measure success by revenue gained, costs reduced, and time saved. Not by deliverables produced or hours billed."
              },
              {
                icon: Zap,
                title: "Speed without shortcuts",
                desc: "Every system we build is production-ready from day one. We move fast because our process is engineered for speed, not because we cut corners."
              },
              {
                icon: Eye,
                title: "Radical transparency",
                desc: "Fixed scope, fixed price, no surprises. You know exactly what we are building, what it costs, and what ROI to expect before we start."
              },
              {
                icon: RefreshCw,
                title: "Built to compound",
                desc: "Every system we deploy is designed to be expanded. Your first AI product is the foundation of an intelligent operation, not a one-off tool."
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-8 lg:p-[36px] transition-all duration-300 hover:border-[#0F6E56] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,110,86,0.1)] group"
                >
                  <Icon className="w-9 h-9 text-[#0F6E56]" />
                  <h3 className="text-white text-[20px] font-bold mt-4 mb-3">{value.title}</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative w-full py-[100px] lg:py-[140px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071a14] to-[#0a0f1a] h-[120%] -top-[10%] -z-10" />
        {/* Radial Depth Glow */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.08)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
        
        <div className="container relative z-10 mx-auto px-6 max-w-[800px] text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            className="inline-block mb-8 px-5 py-2 rounded-full border border-[#0F6E56]/40 bg-[#0F6E56]/15"
          >
            <span className="text-[#0F6E56] text-sm font-semibold tracking-widest uppercase">
              GET STARTED TODAY
            </span>
          </motion.div>

          <div className="mb-6">
            <h2 className="text-white text-[36px] lg:text-[56px] font-extrabold leading-[1.1] tracking-tight">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="block"
              >
                Ready to see what <span className="text-[#0F6E56]">we</span>
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="block mt-1 lg:mt-2"
              >
                can build for you?
              </motion.span>
            </h2>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mt-6"
          >
            Start the Clarivis Assessment and walk away with a personalised AI Opportunity Snapshot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              href="/assessment"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start the Clarivis Assessment
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
            >
              View Our Work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#6B7280]" />
              <span className="text-[#6B7280] text-[13px]">Free AI Opportunity Snapshot</span>
            </div>
            <div className="hidden sm:block w-[3px] h-[3px] rounded-full bg-[#4B5563]" />
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#6B7280]" />
              <span className="text-[#6B7280] text-[13px]">Response within 24 hours</span>
            </div>
            <div className="hidden sm:block w-[3px] h-[3px] rounded-full bg-[#4B5563]" />
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#6B7280]" />
              <span className="text-[#6B7280] text-[13px]">No obligation</span>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
