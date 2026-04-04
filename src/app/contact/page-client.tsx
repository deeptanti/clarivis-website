"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-[120px] pb-[80px] overflow-hidden bg-[#1A1A2E]">
        <div className="container relative z-10 mx-auto px-6 max-w-[700px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                GET IN TOUCH
              </span>
            </div>
            <h1 className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight">
              Let us talk about what AI can do for your business.
            </h1>
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4">
              No pitch. No pressure. Just an honest conversation about where AI can move the needle for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative w-full py-[80px] bg-[#0d1117] overflow-hidden">
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
            
            {/* Left Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[55%]"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[48px]">
                <h2 className="text-white text-[24px] font-bold">Send us a message</h2>
                <p className="text-[#9CA3AF] text-[14px] mt-1 mb-8">We respond within 24 hours.</p>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[#9CA3AF] text-sm mb-2">Full Name (required)</label>
                    <input type="text" required className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all" />
                  </div>
                  
                  {/* Company Name */}
                  <div>
                    <label className="block text-[#9CA3AF] text-sm mb-2">Company Name (required)</label>
                    <input type="text" required className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all" />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#9CA3AF] text-sm mb-2">Email Address (required)</label>
                      <input type="email" required className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] text-sm mb-2">Phone Number (optional)</label>
                      <input type="tel" placeholder="+91 98765 43210" className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all placeholder:text-[#4B5563]" />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-[#9CA3AF] text-sm mb-2">Industry</label>
                    {/* Add a wrapper div to handle the custom dropdown arrow */}
                    <div className="relative">
                      <select className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all appearance-none cursor-pointer">
                        <option>Real Estate</option>
                        <option>Healthcare</option>
                        <option>Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[#9CA3AF] text-sm mb-2">Message (required)</label>
                    <textarea rows={4} required className="w-full bg-[#0d1117] border border-[#1f2937] rounded-[10px] px-5 py-3.5 text-white text-[15px] focus:outline-none focus:border-[#0F6E56] focus:shadow-[0_0_10px_rgba(15,110,86,0.2)] transition-all resize-none"></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button type="submit" className="w-full bg-[#0F6E56] hover:bg-[#0c5945] text-white font-semibold py-4 rounded-[10px] flex items-center justify-center gap-2 transition-colors">
                      Send Message
                      <Send className="w-5 h-5" />
                    </button>
                    <p className="text-center text-[#6B7280] text-[13px] mt-4">
                      Your information is never shared with third parties.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <div className="w-full lg:w-[45%] flex flex-col gap-6">
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-7 flex items-start gap-5"
              >
                <div className="bg-[#0F6E56]/15 rounded-xl p-3 shrink-0">
                  <Mail className="w-6 h-6 text-[#0F6E56]" />
                </div>
                <div>
                  <h3 className="text-[#9CA3AF] text-sm mb-1">Email us</h3>
                  <a href="mailto:hello@clarivisintelligence.com" className="text-white text-[16px] font-medium hover:text-[#0F6E56] transition-colors">
                    hello@clarivisintelligence.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-7 flex items-start gap-5"
              >
                <div className="bg-[#0F6E56]/15 rounded-xl p-3 shrink-0">
                  <MapPin className="w-6 h-6 text-[#0F6E56]" />
                </div>
                <div>
                  <h3 className="text-[#9CA3AF] text-sm mb-1">Based in</h3>
                  <p className="text-white text-[16px] font-medium">Rajkot, Gujarat, India</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-7 flex items-start gap-5"
              >
                <div className="bg-[#0F6E56]/15 rounded-xl p-3 shrink-0">
                  <Clock className="w-6 h-6 text-[#0F6E56]" />
                </div>
                <div>
                  <h3 className="text-[#9CA3AF] text-sm mb-1">Response time</h3>
                  <p className="text-white text-[16px] font-medium">Within 24 hours</p>
                  <p className="text-[#6B7280] text-[13px] mt-1 leading-snug">Monday to Saturday, 9am to 7pm IST</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                className="bg-gradient-to-b from-[#071a14] to-[#0d1117] border border-[#0F6E56]/30 rounded-[16px] p-8 mt-2"
              >
                <div className="inline-block mb-4 px-3 py-1 rounded-full bg-[#0F6E56]/20">
                  <span className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider">
                    FREE
                  </span>
                </div>
                <h3 className="text-white text-[20px] font-bold leading-tight mb-3">
                  Start the Clarivis Assessment
                </h3>
                <p className="text-[#9CA3AF] text-[14px] leading-relaxed mb-6">
                  No commitment required. Walk away with a personalised AI Opportunity Snapshot for your business.
                </p>
                <Link
                  href="/assessment"
                  className="block w-full text-center bg-[#0F6E56] text-white font-medium py-3.5 rounded-lg hover:bg-[#0c5945] transition-colors"
                >
                  Start the Clarivis Assessment
                </Link>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative w-full py-[100px] lg:py-[140px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071a14] to-[#0a0f1a] h-[120%] -top-[10%] -z-10" />
        {/* Radial Depth Glow */}
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
                Prefer to <span className="text-[#0F6E56]">talk</span>?
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
            Book a 45-minute discovery call and walk away with a clear picture of your AI opportunities.
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
              Schedule a Discovery Call
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
