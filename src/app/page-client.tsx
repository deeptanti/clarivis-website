"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useSpring } from "framer-motion";
import { Filter, TrendingDown, Clock, Search, Scan, Cpu, TrendingUp, ChevronLeft, ChevronRight, Check, PhoneCall, Users, Bell, BarChart2, FileText, Calendar, Heart, CreditCard, LayoutDashboard, FileSearch, ArrowRight } from "lucide-react";
// @ts-ignore
import { Gradient } from "stripe-gradient";

// Custom Apple-style easing
const cubicBezier = [0.25, 0.46, 0.45, 0.94] as const;
const cinematicBezier = [0.16, 1, 0.3, 1] as const;
const springConfig = { stiffness: 100, damping: 30 };

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [activeProductTab, setActiveProductTab] = useState<"real-estate" | "healthcare">("real-estate");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax Bounds & Springs
  const timelineRef = useRef<HTMLElement>(null);
  const { scrollYProgress: timelineScroll } = useScroll({ target: timelineRef, offset: ["start center", "end center"] });
  const timelineY = useTransform(timelineScroll, [0, 1], [-30, 30], { clamp: true });

  const node1Fill = useTransform(timelineScroll, [0, 0.15], ["#111827", "#0F6E56"], { clamp: true });
  const card1X = useTransform(timelineScroll, [0, 0.15], [-50, 0], { clamp: true });
  const card1Opacity = useTransform(timelineScroll, [0, 0.15], [0, 1], { clamp: true });

  const node2Fill = useTransform(timelineScroll, [0.15, 0.3], ["#111827", "#0F6E56"], { clamp: true });
  const card2X = useTransform(timelineScroll, [0.15, 0.3], [50, 0], { clamp: true });
  const card2Opacity = useTransform(timelineScroll, [0.15, 0.3], [0, 1], { clamp: true });

  const node3Fill = useTransform(timelineScroll, [0.3, 0.45], ["#111827", "#0F6E56"], { clamp: true });
  const card3X = useTransform(timelineScroll, [0.3, 0.45], [-50, 0], { clamp: true });
  const card3Opacity = useTransform(timelineScroll, [0.3, 0.45], [0, 1], { clamp: true });

  const node4Fill = useTransform(timelineScroll, [0.45, 0.6], ["#111827", "#0F6E56"], { clamp: true });
  const card4X = useTransform(timelineScroll, [0.45, 0.6], [50, 0], { clamp: true });
  const card4Opacity = useTransform(timelineScroll, [0.45, 0.6], [0, 1], { clamp: true });

  const ctaWords1 = "Ready to see what".split(" ");
  const ctaWords2 = "can do for your business?".split(" ");

  useEffect(() => {
    // Initialise stripe-gradient instance
    if (canvasRef.current) {
      const gradient = new Gradient();
      gradient.initGradient("#gradient-canvas");
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const words1 = "Clarity in every".split(" ");
  const words2 = "decision.".split(" "); // Technically just one word, but setup robustly

  return (
    <>
      {/* Global Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#0F6E56] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      <section 
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[100vh] flex flex-col items-center justify-center bg-[#1A1A2E] overflow-hidden"
      >
        {/* Layer 1: Stripe-style mesh gradient */}
        <canvas
          id="gradient-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
          data-transition-in
          style={{
            ["--gradient-color-1" as string]: "#060a0f",
            ["--gradient-color-2" as string]: "#0a2e22",
            ["--gradient-color-3" as string]: "#080d14",
            ["--gradient-color-4" as string]: "#040f0a",
          }}
        />

        {/* Layer 3: Grain texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0">
          <svg className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Layer 2: Cursor glow (Unparallaxed to maintain 1:1 mouse tracking) */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-[1]"
          style={{
            background: "radial-gradient(circle, rgba(15,110,86,0.12) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            left: mousePos ? `${mousePos.x}px` : "50%",
            top: mousePos ? `${mousePos.y}px` : "50%",
            opacity: mousePos ? 1 : 0,
            transition: "left 0.3s ease, top 0.3s ease, opacity 0.5s ease",
          }}
        />

        <div className="container relative z-10 mx-auto px-6 max-w-[900px] text-center">
          
          {/* Pill Badge Entrance */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, filter: prefersReducedMotion ? "none" : "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="inline-block mb-8 px-4 py-1.5 rounded-full border border-[#0F6E56] bg-[#0F6E56]/15"
          >
            <span className="text-white text-xs font-semibold uppercase tracking-widest">
              AI-First Consulting and Technology
            </span>
          </motion.div>

          <div>
            {/* Headline Entrance (Staggered Words Cinematic Clip-Path) */}
            <div className="mb-6">
              <h1 className="text-[36px] md:text-[48px] lg:text-[72px] font-bold text-white leading-tight md:leading-[1.1]">
                <div className="block">
                  {words1.map((word, i) => (
                    <span key={`w1-mask-${i}`} className="inline-block overflow-hidden mr-[0.3em] align-bottom">
                      <motion.span
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: cinematicBezier }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </div>
                <div className="block">
                  {words2.map((word, i) => (
                    <span key={`w2-mask-${i}`} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 + (words1.length + i) * 0.08, ease: cinematicBezier }}
                        className="inline-block text-[#0F6E56]"
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </div>
              </h1>
            </div>

            {/* Subheadline Entrance */}
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: cinematicBezier }}
              className="text-[#9CA3AF] text-[16px] lg:text-[20px] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              We help growing businesses deploy AI systems that generate measurable ROI within 90 days.
            </motion.p>
          </div>

          {/* Buttons Entrance */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15, scale: prefersReducedMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link
                href="/assessment"
                className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
              >
                Start the Clarivis Assessment
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>

          {/* Social Proof Line Entrance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
          >
            <p className="text-gray-500 text-sm">
              Free AI Opportunity Snapshot included. No credit card required.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 w-full py-20 lg:py-[120px] overflow-hidden -mt-[1px]">
        <div className="absolute inset-0 bg-[#0d1117] h-[120%] -top-[10%] -z-10" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                WHY BUSINESSES COME TO US
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[48px] font-bold mb-4"
            >
              You are losing more than you realise.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[600px] mx-auto mb-12 lg:mb-20"
            >
              Growing businesses in real estate and healthcare face the same invisible problems. Until they do not.
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
              className="group bg-[#111827] border border-[#1f2937] rounded-[16px] p-10 pb-12 transition-all duration-300 hover:border-[#0F6E56] hover:shadow-[0_0_20px_rgba(15,110,86,0.15)] hover:bg-[#152033]"
            >
              <Filter className="w-12 h-12 text-[#0F6E56] mb-6" />
              <h3 className="text-white font-bold text-[22px] mb-4">Leads fall through the cracks</h3>
              <p className="text-[#9CA3AF] text-[15px] leading-relaxed">
                Inbound enquiries sit unanswered for hours. Follow-ups happen manually, inconsistently, or not at all. Your competitors respond in minutes. You respond the next day.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
              className="group bg-[#111827] border border-[#1f2937] rounded-[16px] p-10 pb-12 transition-all duration-300 hover:border-[#0F6E56] hover:shadow-[0_0_20px_rgba(15,110,86,0.15)] hover:bg-[#152033]"
            >
              <TrendingDown className="w-12 h-12 text-[#0F6E56] mb-6" />
              <h3 className="text-white font-bold text-[22px] mb-4">No visibility into your own business</h3>
              <p className="text-[#9CA3AF] text-[15px] leading-relaxed">
                You cannot see your pipeline, your collections, or your team performance in real time. Decisions get made on gut feel and month-old reports instead of live data.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
              className="group bg-[#111827] border border-[#1f2937] rounded-[16px] p-10 pb-12 transition-all duration-300 hover:border-[#0F6E56] hover:shadow-[0_0_20px_rgba(15,110,86,0.15)] hover:bg-[#152033]"
            >
              <Clock className="w-12 h-12 text-[#0F6E56] mb-6" />
              <h3 className="text-white font-bold text-[22px] mb-4">Your team is drowning in manual work</h3>
              <p className="text-[#9CA3AF] text-[15px] leading-relaxed">
                Reminders, follow-ups, report generation, data entry. Hours of your team's day spent on work that should not require a human. High cost, high error rate, zero leverage.
              </p>
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={timelineRef} className="relative w-full py-20 lg:py-[120px] overflow-hidden">
        <motion.div style={{ y: prefersReducedMotion ? 0 : timelineY }} className="absolute inset-0 bg-[#0a0f1a] h-[120%] -top-[10%] -z-10" />
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
                HOW IT WORKS
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[42px] font-bold mb-4"
            >
              From first conversation to measurable ROI in 90 days.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-20"
            >
              A structured four-stage process designed to deliver results, not reports.
            </motion.p>
          </div>

          {/* Flow Layout (Vertical Timeline) */}
          <div className="relative max-w-[1000px] mx-auto mt-16 pt-8">
            {/* Animated Central Vertical Line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-[28px] lg:left-1/2 -ml-[1px] w-[2px] bg-[#0F6E56]/40 top-0 bottom-0 origin-top z-0"
            />
            
            {/* Stage 1 (Left on Desktop) */}
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center w-full mb-[80px]">
              {/* Center Node */}
              <motion.div 
                style={{ backgroundColor: node1Fill }}
                className="absolute left-[28px] lg:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-[0_0_15px_rgba(15,110,86,0.4)] flex items-center justify-center z-10"
              >
                <Search className="w-6 h-6 text-white" />
              </motion.div>

              {/* Card Container */}
              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : card1Opacity,
                  x: prefersReducedMotion ? 0 : card1X
                }}
                className="relative ml-[80px] lg:ml-0 lg:w-1/2 lg:pr-12 w-full"
              >
                <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-[36px] lg:max-w-[500px] lg:ml-auto relative lg:text-right text-left">
                  {/* Arrows */}
                  <div className="lg:hidden absolute top-[36px] -left-[24px] text-[#0F6E56]">
                    <ChevronLeft className="w-8 h-8" />
                  </div>
                  <div className="hidden lg:block absolute top-[36px] -right-[24px] text-[#0F6E56]">
                    <ChevronRight className="w-8 h-8" />
                  </div>

                  <div className="text-[#0F6E56] text-[12px] uppercase tracking-[0.2em] opacity-60 mb-2 font-bold">Stage 01</div>
                  <h3 className="text-white font-bold text-[22px] mb-3">Clarivis Assessment</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    A structured self-serve assessment that maps your AI opportunities. Complete it in 5 to 30 minutes and receive your personalised AI Opportunity Snapshot instantly.
                  </p>
                </div>
              </motion.div>
              <div className="hidden lg:block lg:w-1/2" />
            </div>

            {/* Stage 2 (Right on Desktop) */}
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center w-full mb-[80px]">
              <div className="hidden lg:block lg:w-1/2" />
              
              <motion.div 
                style={{ backgroundColor: node2Fill }}
                className="absolute left-[28px] lg:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-[0_0_15px_rgba(15,110,86,0.4)] flex items-center justify-center z-10"
              >
                <Scan className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : card2Opacity,
                  x: prefersReducedMotion ? 0 : card2X
                }}
                className="relative ml-[80px] lg:ml-0 lg:w-1/2 lg:pl-12 w-full"
              >
                <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-[36px] lg:max-w-[500px] relative text-left">
                  <div className="absolute top-[36px] -left-[24px] text-[#0F6E56]">
                    <ChevronLeft className="w-8 h-8" />
                  </div>
                  <div className="text-[#0F6E56] text-[12px] uppercase tracking-[0.2em] opacity-60 mb-2 font-bold">Stage 02</div>
                  <h3 className="text-white font-bold text-[22px] mb-3">Operational Audit</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    Deep dive into your operations. Four to six recorded interviews, process mapping, and a full AI opportunity matrix with ROI projections.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Stage 3 (Left on Desktop) */}
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center w-full mb-[80px]">
              <motion.div 
                style={{ backgroundColor: node3Fill }}
                className="absolute left-[28px] lg:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-[0_0_15px_rgba(15,110,86,0.4)] flex items-center justify-center z-10"
              >
                <Cpu className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : card3Opacity,
                  x: prefersReducedMotion ? 0 : card3X
                }}
                className="relative ml-[80px] lg:ml-0 lg:w-1/2 lg:pr-12 w-full"
              >
                <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-[36px] lg:max-w-[500px] lg:ml-auto relative lg:text-right text-left">
                  <div className="lg:hidden absolute top-[36px] -left-[24px] text-[#0F6E56]">
                    <ChevronLeft className="w-8 h-8" />
                  </div>
                  <div className="hidden lg:block absolute top-[36px] -right-[24px] text-[#0F6E56]">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                  <div className="text-[#0F6E56] text-[12px] uppercase tracking-[0.2em] opacity-60 mb-2 font-bold">Stage 03</div>
                  <h3 className="text-white font-bold text-[22px] mb-3">AI Product Build</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    We build your highest-impact AI system in four to six weeks. Fixed scope, fixed price, ROI tracked from day one.
                  </p>
                </div>
              </motion.div>
              <div className="hidden lg:block lg:w-1/2" />
            </div>

            {/* Stage 4 (Right on Desktop) */}
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center w-full mb-[16px]">
              <div className="hidden lg:block lg:w-1/2" />
              
              <motion.div 
                style={{ backgroundColor: node4Fill }}
                className="absolute left-[28px] lg:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-[0_0_15px_rgba(15,110,86,0.4)] flex items-center justify-center z-10"
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                style={{
                  opacity: prefersReducedMotion ? 1 : card4Opacity,
                  x: prefersReducedMotion ? 0 : card4X
                }}
                className="relative ml-[80px] lg:ml-0 lg:w-1/2 lg:pl-12 w-full"
              >
                <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-[36px] lg:max-w-[440px] relative text-left">
                  <div className="absolute top-[36px] -left-[24px] text-[#0F6E56]">
                    <ChevronLeft className="w-8 h-8" />
                  </div>
                  <div className="text-[#0F6E56] text-[12px] uppercase tracking-[0.2em] opacity-60 mb-2 font-bold">Stage 04</div>
                  <h3 className="text-white font-bold text-[22px] mb-3">AI Growth Plan</h3>
                  <p className="text-[#CBD5E1] text-[15px] leading-[1.7]">
                    Ongoing monitoring, optimisation, and expansion of your AI systems. New capabilities layered in every quarter.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
            className="mt-16 flex justify-center"
          >
            <Link
              href="/assessment"
              className="px-8 py-3.5 rounded-md bg-[#0F6E56] text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-[#0c5945]"
            >
              Start the Clarivis Assessment
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Verticals Section */}
      <section className="relative w-full py-20 lg:py-[120px] overflow-hidden">
        <div className="absolute inset-0 bg-[#0d1117] h-[120%] -top-[10%] -z-10" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                WHO WE SERVE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[48px] font-bold mb-4"
            >
              Built for two industries. Deployed in days.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-20"
            >
              Deep vertical expertise in real estate and healthcare means we understand your problems before you describe them.
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Real Estate */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="group flex flex-col justify-between min-h-[480px] h-full rounded-[20px] p-8 lg:p-[48px] border border-[#0F6E56]/30 bg-gradient-to-b from-[#0f1f1a] to-[#0d1117] transition-all duration-300 hover:border-[#0F6E56] hover:shadow-[0_0_30px_rgba(15,110,86,0.15)]"
            >
              <div>
                <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                  <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                    REAL ESTATE
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-[28px] mt-4 mb-4 leading-tight">
                  For developers, brokers, and property managers
                </h3>
                
                <p className="text-[#9CA3AF] text-[15px] leading-[1.8]">
                  From lead chaos to automated pipelines. From WhatsApp broker management to real-time channel partner portals. From manual collections to AI-powered payment agents. We deploy AI systems that give real estate businesses complete operational visibility and revenue control.
                </p>

                <div className="h-px w-full bg-[#0F6E56]/20 my-8" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Leads qualified and followed up within 60 seconds</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Broker and channel partner management automated</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Payment collections and pipeline visibility in real time</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 lg:mt-8">
                <Link
                  href="/services/real-estate"
                  className="block w-full text-center px-6 py-3.5 rounded-md border border-[#0F6E56] text-[#0F6E56] font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:text-white"
                >
                  Explore Real Estate Solutions
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Healthcare */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="group flex flex-col justify-between min-h-[480px] h-full rounded-[20px] p-8 lg:p-[48px] border border-[#0F6E56]/30 bg-gradient-to-b from-[#0f1a1f] to-[#0d1117] transition-all duration-300 hover:border-[#0F6E56] hover:shadow-[0_0_30px_rgba(15,110,86,0.15)]"
            >
              <div>
                <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
                  <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                    HEALTHCARE
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-[28px] mt-4 mb-4 leading-tight">
                  For clinics, diagnostic centres, and hospitals
                </h3>
                
                <p className="text-[#9CA3AF] text-[15px] leading-[1.8]">
                  From no-show chaos to automated appointment management. From manual billing to AI-powered revenue cycle automation. From paper-based operations to live clinical dashboards. We help healthcare providers run more efficiently so they can focus on patients, not paperwork.
                </p>

                <div className="h-px w-full bg-[#0F6E56]/20 my-8" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Patient no-shows reduced with automated reminders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Billing and revenue cycle errors eliminated</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0F6E56] shrink-0 mt-0.5" />
                    <span className="text-[#9CA3AF] text-[14px]">Clinical operations visible in a single dashboard</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 lg:mt-8">
                <Link
                  href="/services/healthcare"
                  className="block w-full text-center px-6 py-3.5 rounded-md border border-[#0F6E56] text-[#0F6E56] font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:text-white"
                >
                  Explore Healthcare Solutions
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Products Preview Section */}
      <section className="relative w-full py-20 lg:py-[120px] overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1a] h-[120%] -top-[10%] -z-10" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
            >
              <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
                AI PRODUCT SUITE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-white text-[32px] lg:text-[48px] font-bold mb-4"
            >
              Ten AI products. Two industries. One firm.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mb-12"
            >
              Every product is built on real operational intelligence from the businesses we serve.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex rounded-lg p-1 bg-[#111827] border border-[#1f2937]">
              <button
                onClick={() => setActiveProductTab("real-estate")}
                className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-300 ${activeProductTab === "real-estate" ? "bg-[#0F6E56] text-white shadow-md shadow-[#0F6E56]/20" : "text-[#9CA3AF] hover:text-white"}`}
              >
                Real Estate
              </button>
              <button
                onClick={() => setActiveProductTab("healthcare")}
                className={`py-2 px-6 rounded-md text-sm font-medium transition-all duration-300 ${activeProductTab === "healthcare" ? "bg-[#0F6E56] text-white shadow-md shadow-[#0F6E56]/20" : "text-[#9CA3AF] hover:text-white"}`}
              >
                Healthcare
              </button>
            </div>
          </motion.div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeProductTab === "real-estate" ? (
                <motion.div
                  key="re-grid"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                  {[
                    { icon: PhoneCall, name: "AI Lead Qualifier and Follow-up Agent", desc: "Instantly call and qualify inbound leads 24/7." },
                    { icon: Users, name: "Broker and Channel Partner Portal", desc: "WhatsApp and web chat agents converting traffic." },
                    { icon: Bell, name: "Collections Agent", desc: "Automated installment reminders via voice and WhatsApp." },
                    { icon: BarChart2, name: "Sales Dashboard", desc: "Live pipeline and revenue visibility for management." },
                    { icon: FileText, name: "Document Automation", desc: "Auto-generation of agreements and RERA compliance documents." }
                  ].map((prod, i) => {
                    const Icon = prod.icon;
                    return (
                      <motion.div
                        key={prod.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                      >
                        <div className="bg-[#111827] border border-[#1f2937] rounded-[12px] p-6 h-full transition-all duration-200 hover:-translate-y-1 hover:border-[#0F6E56] group cursor-default">
                          <Icon className="w-8 h-8 text-[#0F6E56] mb-3 transition-colors duration-200" />
                          <h3 className="text-white font-semibold text-[16px] mb-2">{prod.name}</h3>
                          <p className="text-[#9CA3AF] text-[13px] leading-relaxed">{prod.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="healthcare-grid"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                  {[
                    { icon: Calendar, name: "Appointment Agent", desc: "Bookings, reminders, and no-show follow-up automated end to end." },
                    { icon: Heart, name: "Post-Visit Follow-up", desc: "Medication reminders and revisit scheduling after every appointment." },
                    { icon: CreditCard, name: "Billing Automation", desc: "Revenue cycle errors eliminated with AI-powered billing workflows." },
                    { icon: LayoutDashboard, name: "Clinical Dashboard", desc: "Operations, staff performance, and patient metrics in one view." },
                    { icon: FileSearch, name: "Report Delivery Agent", desc: "Diagnostic reports delivered automatically to patients via WhatsApp." }
                  ].map((prod, i) => {
                    const Icon = prod.icon;
                    return (
                      <motion.div
                        key={prod.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                      >
                        <div className="bg-[#111827] border border-[#1f2937] rounded-[12px] p-6 h-full transition-all duration-200 hover:-translate-y-1 hover:border-[#0F6E56] group cursor-default">
                          <Icon className="w-8 h-8 text-[#0F6E56] mb-3 transition-colors duration-200" />
                          <h3 className="text-white font-semibold text-[16px] mb-2">{prod.name}</h3>
                          <p className="text-[#9CA3AF] text-[13px] leading-relaxed">{prod.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Callouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-12 text-center"
          >
            <p className="text-white text-[18px] font-semibold mb-4">
              Every product ships in 4 to 6 weeks with ROI tracked from day one.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 text-[#0F6E56] text-[15px] font-medium hover:opacity-80 transition-opacity"
            >
              Explore all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

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
                Ready to see what <span className="text-[#0F6E56]">AI</span>
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="block mt-1 lg:mt-2"
              >
                can do for your business?
              </motion.span>
            </h2>
          </div>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-[#9CA3AF] text-[18px] max-w-[560px] mx-auto mt-6"
          >
            Start the Clarivis Assessment. No commitment, no credit card. Just clarity on where AI can move the needle for your business.
          </motion.p>

          {/* Buttons */}
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
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-white text-white font-medium transition-all duration-300 hover:bg-[#0F6E56] hover:border-[#0F6E56]"
            >
              Schedule a Call
            </Link>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
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
    </>
  );
}
