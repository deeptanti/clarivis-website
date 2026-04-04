"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { InlineWidget } from "react-calendly";
import Image from "next/image";
import { Calendar, Clock, Zap, User, Plus, X, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is this really free?",
    a: "Completely. The AI Opportunity Session has no cost and no obligation. Our philosophy is that you should understand exactly where AI can help your business before you spend a single rupee. If there is a fit, we will suggest a next step. If there is not, you still walk away with valuable insight.",
  },
  {
    q: "What should I prepare before the call?",
    a: "Nothing formal. Just be ready to talk openly about your business, your team, and the problems that cost you the most time or money. The more candid you are, the more useful the session will be. If you have numbers handy, like how many leads you receive per month or your current no-show rate, even better.",
  },
  {
    q: "Who will I be speaking with?",
    a: "You will speak directly with Deep Tanti, founder of Clarivis Intelligence. Not a salesperson, not an account manager. The person who will be designing and building your AI system if we work together.",
  },
  {
    q: "What happens after the session?",
    a: "Within 24 hours you will receive a personalised AI Opportunity Snapshot by email. This document maps your top two or three AI opportunities, explains how each one would work in your specific operation, and provides indicative ROI projections. There is no obligation to proceed.",
  },
  {
    q: "What if I am not ready to implement AI yet?",
    a: "That is completely fine. Many people book a session to understand what is possible before they are ready to move. The session is designed to give you clarity, not to push you toward a decision. You can revisit the conversation whenever the timing is right.",
  },
];

const sessionSteps = [
  {
    num: "1",
    title: "We review your business",
    desc: "We share observations based on your industry and the details you provided when booking.",
  },
  {
    num: "2",
    title: "You describe your challenges",
    desc: "An open conversation about what is costing you time, money, or opportunity right now.",
  },
  {
    num: "3",
    title: "We identify your opportunities",
    desc: "Together we map your top two or three AI opportunities with indicative ROI for each.",
  },
  {
    num: "4",
    title: "You receive a follow-up report",
    desc: "Within 24 hours you receive a personalised AI Opportunity Snapshot documenting everything discussed.",
  },
];

export default function BookPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="w-full">
      {/* Section 1: Hero */}
      <section className="relative w-full pt-[80px] pb-[48px] overflow-hidden bg-[#1A1A2E]">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.07)_0%,transparent_60%)] pointer-events-none z-0 translate-x-1/4 -translate-y-1/4" />
        <div className="container relative z-10 mx-auto px-6 max-w-[900px] text-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                FREE — 45 MINUTES
              </span>
            </div>
            <h1 className="text-white text-[32px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight">
              Book Your AI Opportunity Session
            </h1>
            <p className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 max-w-[600px] mx-auto">
              A structured 45-minute diagnostic with our founder. We identify your top AI opportunities, quantify what they are costing you today, and give you a clear recommendation on where to start.
            </p>

            {/* Trust signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              {[
                { icon: Calendar, text: "Free, no commitment" },
                { icon: Clock, text: "45 minutes with our founder" },
                { icon: Zap, text: "Personalised AI opportunity analysis" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#0F6E56] shrink-0" />
                  <span className="text-[#9CA3AF] text-[14px]">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Two column — what to expect + Calendly */}
      <section className="relative w-full py-[80px] bg-[#0d1117]">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">

            {/* Left column — 40% */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[40%] h-full"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-[40px] h-full">
                <h2 className="text-white text-[22px] font-bold mb-8">
                  What happens in your session
                </h2>

                <div className="flex flex-col gap-6">
                  {sessionSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(15,110,86,0.4)]">
                        <span className="text-white font-bold text-[14px]">{step.num}</span>
                      </div>
                      <div>
                        <p className="text-white text-[16px] font-bold leading-snug">{step.title}</p>
                        <p className="text-[#9CA3AF] text-[14px] leading-[1.7] mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Teal divider */}
                <div className="h-px w-full bg-[#0F6E56]/20 my-8" />

                {/* Founder profile */}
                <div className="flex items-start gap-4">
                  <div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#0F6E56] shrink-0'>
                    <Image
                      src='/images/founder.jpg'
                      alt='Deep Tanti, Founder of Clarivis Intelligence'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href='https://www.linkedin.com/in/dtanti'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white font-semibold hover:text-[#0F6E56] transition-colors duration-200 underline-offset-2 hover:underline text-[16px]'
                      >
                        Deep Tanti
                      </Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14" height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-[#6B7280] hover:text-[#0F6E56] transition-colors duration-200 shrink-0"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <p className="text-[#0F6E56] text-[14px] mt-0.5">Founder, Clarivis Intelligence</p>
                    <p className="text-[#6B7280] text-[13px] mt-2 leading-relaxed">
                      B.Tech RMIT Australia · M.Sc Analytics Harrisburg USA · Azure AI Engineer
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right column — 60% */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-[60%]"
            >
              <div className="bg-[#111827] border border-[#1f2937] rounded-[20px] overflow-hidden min-h-[700px]">
                <InlineWidget
                  url="https://calendly.com/clarivisintelligence/ai_opportunity_session"
                  styles={{ height: "700px", minWidth: "320px" }}
                  pageSettings={{
                    backgroundColor: "111827",
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: "0F6E56",
                    textColor: "ffffff",
                  }}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Section 3: FAQ Accordion */}
      <section className="relative w-full py-[80px] bg-[#0a0f1a]">
        <div className="container mx-auto px-6 max-w-[800px]">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                COMMON QUESTIONS
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[36px] font-bold"
            >
              Before you book
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
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
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
                        <p className="text-[#9CA3AF] text-[15px] leading-[1.8] pb-6">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="relative w-full py-[80px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071a14] to-[#0d1117] -z-10" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(15,110,86,0.08)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

        <div className="container relative z-10 mx-auto px-6 max-w-[700px] text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-[36px] font-bold mb-4"
          >
            Prefer to <span className="text-[#0F6E56]">explore</span> first?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[16px] leading-[1.8] mb-8"
          >
            Start the Clarivis Assessment and receive your AI Opportunity Snapshot instantly, then book a session to go deeper.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-[#0F6E56] text-[#0F6E56] font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:text-white"
            >
              Start the Clarivis Assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
