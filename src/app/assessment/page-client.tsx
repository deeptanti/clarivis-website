"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardList, Calendar, Check, X, ArrowLeft, ArrowRight,
  Building2, Activity, Cpu, Zap,
} from "lucide-react";

/* ─── Types ─────────────────────────────────── */
type Phase = 1 | 2 | 3;
type Screen = "time" | "contact" | "questions";
type ResultPhase = "loading" | "snap";
type TimeOption = 5 | 15 | 30 | null;
interface FormData {
  industry: string; company: string; teamSize: string;
  mainChallenge: string; tools: string[]; aiExperience: string;
  successVision: string; referralSource: string;
  name: string; email: string; phone: string;
}
const INIT: FormData = {
  industry: "", company: "", teamSize: "", mainChallenge: "",
  tools: [], aiExperience: "", successVision: "", referralSource: "",
  name: "", email: "", phone: "",
};

/* ─── Constants ──────────────────────────────── */
const TOOLS_LIST = ["WhatsApp","Excel or Sheets","CRM Software","Accounting Software","ERP System","Custom Software","None of the above"];
const TEAM_SIZES = ["1 to 10","11 to 30","31 to 50","50 plus"];
const REFERRAL_OPTIONS = ["Referral","LinkedIn","Google Search","Instagram","Other"];
const AI_OPTIONS = ["No, completely new to this","Yes, with mixed results","Yes, successfully"];
const QUESTIONS: Record<string, string> = {
  industry: "What industry are you in?",
  company: "What is your company called?",
  teamSize: "How many people work in your business?",
  mainChallenge: "What is your biggest operational challenge right now?",
  tools: "Which of these tools does your team currently use?",
  aiExperience: "Have you tried any AI or automation tools before?",
  successVision: "What would success look like in 90 days?",
  referralSource: "How did you hear about Clarivis Intelligence?",
};

/* ─── Helpers ────────────────────────────────── */
// total steps = question steps + 1 submit step
function getTotalSteps(t: TimeOption) { return t === 5 ? 5 : t === 15 ? 7 : 9; }
function getStepType(step: number, time: TimeOption) {
  const total = getTotalSteps(time);
  if (step === total) return "submit";
  const types = ["industry","company","teamSize","mainChallenge","tools","aiExperience","successVision","referralSource"];
  return types[step - 1] ?? "submit";
}
function isStepValid(step: number, time: TimeOption, f: FormData) {
  switch (getStepType(step, time)) {
    case "industry": return !!f.industry;
    case "company": return f.company.trim().length > 0;
    case "teamSize": return !!f.teamSize;
    case "mainChallenge": return f.mainChallenge.trim().length >= 20;
    case "tools": return true;
    case "aiExperience": return !!f.aiExperience;
    case "successVision": return f.successVision.trim().length > 0;
    case "referralSource": return !!f.referralSource;
    case "submit": return true;
    default: return true;
  }
}
function isContactValid(f: FormData) {
  return f.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) &&
    f.phone.trim().length > 0;
}

/* ─── Opportunity Generator ──────────────────── */
interface Opp { title: string; desc: string; metric: string; }
function generateOpportunities(industry: string, teamSize: string): Opp[] {
  const isSmallRE = teamSize === "1 to 10" || teamSize === "11 to 30";
  const isSmallHC = teamSize === "1 to 10";
  if (industry === "Real Estate") {
    return [
      { title: "AI Lead Qualifier", desc: "Automated lead response within 60 seconds across all channels", metric: "Up to 40% more site visits booked" },
      isSmallRE
        ? { title: "Sales Pipeline Dashboard", desc: "Live visibility into your pipeline, agent performance, and revenue forecast", metric: "Management decisions based on live data" }
        : { title: "Broker and Channel Partner Portal", desc: "Replace WhatsApp chaos with a structured digital portal", metric: "Full broker network visibility" },
      { title: "Payment and Collections Agent", desc: "Automated installment reminders via voice and WhatsApp", metric: "Reduce overdue collections by up to 60%" },
    ];
  }
  return [
    { title: "Patient Appointment Agent", desc: "Automated booking, reminders, and no-show follow-up", metric: "Up to 40% reduction in no-shows" },
    { title: "Billing and Revenue Cycle Automation", desc: "Eliminate manual billing errors and accelerate collections", metric: "Revenue cycle errors reduced to zero" },
    isSmallHC
      ? { title: "Post-Visit Follow-up System", desc: "Automated medication reminders and revisit scheduling", metric: "Higher patient retention and revisit rates" }
      : { title: "Clinical Operations Dashboard", desc: "Live operational visibility across all departments and doctors", metric: "Management reporting automated completely" },
  ];
}

/* ─── Animation Variants ─────────────────────── */
const phaseV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
const stepV = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4,0,0.2,1] as [number,number,number,number] } },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
};

/* ─── Shared UI ──────────────────────────────── */
const inputCls = "w-full bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-4 text-white text-[18px] placeholder-[#4B5563] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56] transition-all";
const pillCls = (active: boolean) => `cursor-pointer px-6 py-3 rounded-xl border text-[15px] font-medium transition-all duration-200 ${active ? "border-[#0F6E56] bg-[#0F6E56]/10 text-white shadow-[0_0_12px_rgba(15,110,86,0.2)]" : "border-[#1f2937] bg-[#111827] text-[#9CA3AF] hover:border-[#0F6E56]/40"}`;

/* ─── Small Animated Check (for snapshot) ────── */
function SmallCheck({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      className="w-16 h-16 rounded-full bg-[#0F6E56] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(15,110,86,0.3)]"
    >
      <motion.svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <motion.path d="M5 13l4 4L19 7" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.3, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ─── TopBar ─────────────────────────────────── */
function TopBar() {
  return (
    <div className="sticky top-0 z-10 bg-[#0a0f1a] border-b border-[#1f2937] px-6 lg:px-8 py-4 flex items-center justify-between shrink-0">
      <Link href="/"><Image src="/images/logo.png" alt="Clarivis Intelligence" width={140} height={35} priority /></Link>
      <div className="flex items-center gap-3">
        <Link href="/book" className="hidden sm:inline-flex items-center px-4 py-2 rounded-md border border-[#0F6E56] text-[#0F6E56] text-sm font-medium hover:bg-[#0F6E56]/10 transition-all">
          Book a Call Instead
        </Link>
        <Link href="/" className="w-9 h-9 rounded-full border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:border-[#9CA3AF] hover:text-white transition-all" aria-label="Exit">
          <X className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Phase 1: Entry ─────────────────────────── */
function Phase1({ onStart }: { onStart: () => void }) {
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12"
    >
      <div className="w-full max-w-[800px]">
        <div className="flex justify-center mb-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">FREE — NO CREDIT CARD REQUIRED</span>
          </div>
        </div>
        <h1 className="text-white text-[32px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight text-center">Start the Clarivis Assessment</h1>
        <p className="text-[#9CA3AF] text-[18px] text-center max-w-[560px] mx-auto mt-4 leading-[1.8]">
          Answer a few questions about your business. We analyse your responses and deliver a personalised AI Opportunity Snapshot to your inbox.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={onStart}
            className="relative cursor-pointer rounded-[20px] p-8 lg:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-[12px] hover:border-[#0F6E56]/50 hover:shadow-[0_0_30px_rgba(15,110,86,0.15)] transition-all duration-300 group"
          >
            <div className="absolute top-4 right-4">
              <span className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider bg-[#0F6E56]/15 border border-[#0F6E56]/30 px-3 py-1 rounded-full">INSTANT REPORT</span>
            </div>
            <ClipboardList className="w-12 h-12 text-[#0F6E56] mb-5" />
            <h2 className="text-white text-[24px] font-bold">Clarivis Assessment</h2>
            <p className="text-[#9CA3AF] text-[15px] leading-[1.8] mt-3 mb-6">Answer questions about your business in 5 to 30 minutes. Receive a personalised AI Opportunity Snapshot instantly by email.</p>
            <div className="flex flex-col gap-3 mb-8">
              {["Takes 5 to 30 minutes","Personalised AI Opportunity Snapshot by email","Free, no commitment required"].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0F6E56] shrink-0" />
                  <span className="text-[#9CA3AF] text-[14px]">{f}</span>
                </div>
              ))}
            </div>
            <button onClick={onStart} className="w-full bg-[#0F6E56] text-white font-semibold py-3.5 rounded-lg text-[16px] hover:bg-[#0c5945] transition-all duration-200 group-hover:scale-[1.01]">
              Start the Assessment
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative rounded-[20px] p-8 lg:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-[12px] hover:border-[#0F6E56]/30 transition-all duration-300"
          >
            <div className="absolute top-4 right-4">
              <span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">LIVE SESSION</span>
            </div>
            <Calendar className="w-12 h-12 text-[#0F6E56] mb-5" />
            <h2 className="text-white text-[24px] font-bold">AI Opportunity Session</h2>
            <p className="text-[#9CA3AF] text-[15px] leading-[1.8] mt-3 mb-6">A focused 45-minute conversation with our founder. We identify your top AI opportunities and give you a clear recommendation.</p>
            <div className="flex flex-col gap-3 mb-8">
              {["45 minutes with our founder","Personalised verbal analysis","Follow-up AI Opportunity Snapshot within 24 hours"].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#0F6E56] shrink-0" />
                  <span className="text-[#9CA3AF] text-[14px]">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/book" className="block w-full border border-[#0F6E56] text-[#0F6E56] font-semibold py-3.5 rounded-lg text-[16px] text-center hover:bg-[#0F6E56]/10 transition-all duration-200">
              Book Your Session
            </Link>
          </motion.div>
        </div>
        <p className="text-center text-[#6B7280] text-[14px] mt-6">Most people start with the Clarivis Assessment and book a session after receiving their report.</p>
      </div>
    </motion.div>
  );
}

/* ─── Time Selection Step ────────────────────── */
function TimeSelectionStep({ timeSelected, onSelect, onContinue }: { timeSelected: TimeOption; onSelect: (t: TimeOption) => void; onContinue: () => void }) {
  const opts = [
    { val: 5 as const, num: "5", label: "Quick Look", desc: "Top opportunities identified fast.", recommended: false },
    { val: 15 as const, num: "15", label: "Full Assessment", desc: "Complete picture with ROI context.", recommended: true },
    { val: 30 as const, num: "30", label: "Deep Dive", desc: "Thorough analysis of your full operation.", recommended: false },
  ];
  return (
    <div className="pt-8 text-center">
      <p className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.2em] font-semibold mb-3">BEFORE WE BEGIN</p>
      <h2 className="text-white text-[36px] lg:text-[40px] font-bold">How much time do you have?</h2>
      <p className="text-[#9CA3AF] text-[16px] mt-3">We personalise your assessment based on the time you have available.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {opts.map(o => (
          <div key={o.val} onClick={() => onSelect(o.val)}
            className={`relative cursor-pointer rounded-[16px] p-8 text-center border transition-all duration-200 ${timeSelected === o.val ? "border-[#0F6E56] bg-[#0F6E56]/10 shadow-[0_0_20px_rgba(15,110,86,0.2)]" : "border-white/[0.08] bg-white/[0.03] hover:border-[#0F6E56]/40"}`}
          >
            {o.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#0F6E56] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">RECOMMENDED</span>
              </div>
            )}
            <div className="text-[#0F6E56] text-[64px] font-extrabold leading-none">{o.num}</div>
            <div className="text-[#9CA3AF] text-[14px] mt-1">minutes</div>
            <div className="text-white text-[18px] font-semibold mt-3">{o.label}</div>
            <div className="text-[#6B7280] text-[13px] mt-1">{o.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 max-w-[400px] mx-auto">
        <button onClick={onContinue} disabled={!timeSelected}
          className={`w-full py-4 rounded-xl font-semibold text-[16px] transition-all duration-200 ${timeSelected ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ─── Contact Screen (between time and questions) */
function ContactScreen({ formData, onChange, onContinue, onBack }: {
  formData: FormData; onChange: (k: keyof FormData, v: string) => void; onContinue: () => void; onBack: () => void;
}) {
  const valid = isContactValid(formData);
  return (
    <div className="pt-8 text-center">
      <p className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.2em] font-semibold mb-3">BEFORE WE START</p>
      <h2 className="text-white text-[32px] lg:text-[36px] font-bold">Where should we send your report?</h2>
      <p className="text-[#9CA3AF] text-[16px] mt-3 mb-10">We will send your personalised AI Opportunity Snapshot here. Takes 5 seconds.</p>
      <div className="flex flex-col gap-4 text-left mb-8 max-w-[500px] mx-auto">
        <input type="text" value={formData.name} onChange={e => onChange("name", e.target.value)}
          placeholder="Your full name" autoFocus className={inputCls} />
        <input type="email" value={formData.email} onChange={e => onChange("email", e.target.value)}
          placeholder="your@email.com" className={inputCls} />
        <div>
          <input type="tel" value={formData.phone} onChange={e => onChange("phone", e.target.value)}
            placeholder="+91 98765 43210" className={inputCls} />
          <p className="text-[#4B5563] text-[13px] mt-1.5 pl-1">(We may call to discuss your results)</p>
        </div>
      </div>
      <div className="max-w-[500px] mx-auto">
        <button onClick={onContinue} disabled={!valid}
          className={`w-full py-4 rounded-xl font-bold text-[17px] transition-all duration-200 ${valid ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}
        >
          Continue to Assessment
        </button>
        <button onClick={onBack} className="mt-4 flex items-center gap-1.5 text-[#4B5563] text-[14px] hover:text-[#6B7280] transition-colors mx-auto">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to time selection
        </button>
      </div>
    </div>
  );
}

/* ─── Question Step ──────────────────────────── */
function QuestionStep({ stepType, formData, onChange }: {
  stepType: string; formData: FormData; onChange: (k: keyof FormData, v: string | string[]) => void;
}) {
  const question = QUESTIONS[stepType] ?? "";
  return (
    <div className="pt-8">
      {stepType !== "submit" && (
        <h2 className="text-white text-[28px] lg:text-[36px] font-bold text-center mb-8">{question}</h2>
      )}

      {stepType === "industry" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{val:"Real Estate",icon:Building2},{val:"Healthcare",icon:Activity}].map(({val, icon: Icon}) => (
            <div key={val} onClick={() => onChange("industry", val)}
              className={`cursor-pointer rounded-[16px] p-10 border text-center min-h-[160px] flex flex-col items-center justify-center gap-3 transition-all duration-200 ${formData.industry === val ? "border-[#0F6E56]" : "border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`}
              style={{ background: formData.industry === val ? "rgba(15,110,86,0.08)" : "" }}
            >
              <Icon className="w-10 h-10 text-[#0F6E56]" />
              <span className="text-white text-[20px] font-bold">{val}</span>
            </div>
          ))}
        </div>
      )}

      {stepType === "company" && (
        <input type="text" value={formData.company} onChange={e => onChange("company", e.target.value)}
          placeholder="Your company name" autoFocus className={inputCls} style={{ fontSize: "22px" }} />
      )}

      {stepType === "teamSize" && (
        <div className="flex flex-wrap gap-3 justify-center">
          {TEAM_SIZES.map(s => (
            <button key={s} onClick={() => onChange("teamSize", s)} className={pillCls(formData.teamSize === s)} style={{ padding: "14px 28px", fontSize: "16px" }}>{s}</button>
          ))}
        </div>
      )}

      {stepType === "mainChallenge" && (
        <div>
          <textarea value={formData.mainChallenge} onChange={e => onChange("mainChallenge", e.target.value)}
            placeholder="Describe the problem that costs you the most time or money each week."
            autoFocus rows={5} className={`${inputCls} resize-none leading-relaxed`} />
          <p className="text-[#4B5563] text-[13px] mt-2 text-right">
            {formData.mainChallenge.length} characters {formData.mainChallenge.length < 20 && "(minimum 20)"}
          </p>
        </div>
      )}

      {stepType === "tools" && (
        <div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {TOOLS_LIST.map(t => (
              <button key={t} onClick={() => {
                const cur = formData.tools ?? [];
                onChange("tools", cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
              }} className={pillCls((formData.tools ?? []).includes(t))}>{t}</button>
            ))}
          </div>
          <input type="text" placeholder="Any other tools? (optional)" className={inputCls} style={{ fontSize: "16px" }} readOnly onChange={() => {}} />
        </div>
      )}

      {stepType === "aiExperience" && (
        <div className="grid grid-cols-1 gap-4">
          {AI_OPTIONS.map(o => (
            <div key={o} onClick={() => onChange("aiExperience", o)}
              className={`cursor-pointer rounded-[16px] p-6 border flex items-center gap-4 transition-all duration-200 ${formData.aiExperience === o ? "border-[#0F6E56]" : "border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`}
              style={{ background: formData.aiExperience === o ? "rgba(15,110,86,0.08)" : "" }}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.aiExperience === o ? "border-[#0F6E56] bg-[#0F6E56]" : "border-[#374151]"}`}>
                {formData.aiExperience === o && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-white text-[17px] font-medium">{o}</span>
            </div>
          ))}
        </div>
      )}

      {stepType === "successVision" && (
        <textarea value={formData.successVision} onChange={e => onChange("successVision", e.target.value)}
          placeholder="Describe the outcome that would make this worthwhile for your business."
          autoFocus rows={5} className={`${inputCls} resize-none leading-relaxed`} />
      )}

      {stepType === "referralSource" && (
        <div className="flex flex-wrap gap-3 justify-center">
          {REFERRAL_OPTIONS.map(r => (
            <button key={r} onClick={() => onChange("referralSource", r)} className={pillCls(formData.referralSource === r)} style={{ padding: "14px 28px", fontSize: "16px" }}>{r}</button>
          ))}
        </div>
      )}

      {/* Final submit step */}
      {stepType === "submit" && (
        <div className="text-center pt-4">
          <div className="w-20 h-20 rounded-full border-2 border-[#0F6E56] flex items-center justify-center mx-auto mb-8" style={{ background: "rgba(15,110,86,0.1)" }}>
            <Zap className="w-9 h-9 text-[#0F6E56]" />
          </div>
          <h2 className="text-white text-[32px] lg:text-[36px] font-bold">You are all set.</h2>
          <p className="text-[#9CA3AF] text-[16px] mt-3 max-w-[400px] mx-auto">Click below to generate your AI Opportunity Snapshot.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Phase 2 Wrapper ────────────────────────── */
interface P2Props {
  screen: Screen; currentStep: number; timeSelected: TimeOption;
  formData: FormData; direction: number;
  onTimeSelect: (t: TimeOption) => void;
  onFormChange: (k: keyof FormData, v: string | string[]) => void;
  onNext: () => void; onBack: () => void; onGenerate: () => void;
}
function Phase2({ screen, currentStep, timeSelected, formData, direction, onTimeSelect, onFormChange, onNext, onBack, onGenerate }: P2Props) {
  const total = getTotalSteps(timeSelected ?? 5);
  const progress = screen !== "questions" ? 0 : Math.round((currentStep / total) * 100);
  const stepType = screen === "questions" ? getStepType(currentStep, timeSelected) : null;
  const isSubmitStep = stepType === "submit";
  const valid = screen === "questions" && stepType ? isStepValid(currentStep, timeSelected, formData) : (screen === "contact" ? isContactValid(formData) : !!timeSelected);
  const animKey = screen === "questions" ? `q-${currentStep}` : screen;

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Progress bar — only during questions */}
      <div className="px-6 lg:px-12 pt-6 pb-2 max-w-[680px] mx-auto w-full">
        <div className="h-[3px] w-full bg-[#1f2937] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#0F6E56] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
        {screen === "questions" && (
          <p className="text-[#6B7280] text-[13px] mt-2 text-right">Step {currentStep} of {total}</p>
        )}
      </div>

      {/* Animated content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-hidden">
        <div className="w-full max-w-[680px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={animKey} custom={direction} variants={stepV} initial="enter" animate="center" exit="exit">
              {screen === "time" && <TimeSelectionStep timeSelected={timeSelected} onSelect={onTimeSelect} onContinue={onNext} />}
              {screen === "contact" && <ContactScreen formData={formData} onChange={(k, v) => onFormChange(k, v as string)} onContinue={onNext} onBack={onBack} />}
              {screen === "questions" && stepType && <QuestionStep stepType={stepType} formData={formData} onChange={onFormChange} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation for question steps */}
          {screen === "questions" && !isSubmitStep && (
            <div className="flex justify-between items-center mt-10">
              <button onClick={onBack} className="flex items-center gap-2 text-[#9CA3AF] hover:text-white text-[15px] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={onNext} disabled={!valid}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-[15px] transition-all ${valid ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Generate button for submit step */}
          {screen === "questions" && isSubmitStep && (
            <div className="mt-10 max-w-[500px] mx-auto">
              <button onClick={onGenerate}
                className="w-full py-4 rounded-xl font-bold text-[18px] bg-[#0F6E56] text-white hover:bg-[#0c5945] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" /> Generate My AI Snapshot
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase 3A: Loading ──────────────────────── */
function LoadingScreen() {
  const lines = [
    { text: "Reviewing your industry profile", delay: 0.8 },
    { text: "Identifying operational patterns", delay: 1.6 },
    { text: "Mapping your AI opportunities", delay: 2.4 },
  ];
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{ background: "rgba(15,110,86,0.2)", boxShadow: "0 0 40px rgba(15,110,86,0.3)" }}
      >
        <Cpu className="w-9 h-9 text-[#0F6E56]" />
      </motion.div>
      <h2 className="text-white text-[28px] font-bold">Analysing your business...</h2>
      <div className="flex flex-col gap-4 mt-8 text-left">
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: l.delay, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: l.delay + 0.2, type: "spring" }}
              className="w-5 h-5 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" />
            </motion.div>
            <span className="text-[#9CA3AF] text-[16px]">{l.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Phase 3B: Snapshot ─────────────────────── */
function SnapshotScreen({ formData, timeSelected }: { formData: FormData; timeSelected: TimeOption }) {
  const opps = generateOpportunities(formData.industry || "Real Estate", formData.teamSize || "1 to 10");
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const firstName = formData.name.split(" ")[0] || "Your";

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit"
      className="flex flex-col items-center px-6 py-12 min-h-[calc(100vh-73px)]"
    >
      <div className="w-full max-w-[700px]">
        {/* Top */}
        <div className="text-center mb-8">
          <SmallCheck delay={0} />
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-white text-[28px] lg:text-[32px] font-bold mt-6">
            Your AI Opportunity Snapshot
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-[#9CA3AF] text-[16px] mt-2">
            Based on your responses, here are your top AI opportunities.{" "}
            {formData.email && <span>Full report sent to <strong className="text-white">{formData.email}</strong>.</span>}
          </motion.p>
        </div>

        {/* Snapshot card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-10"
        >
          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            {formData.company && (
              <span className="text-[#0F6E56] text-[12px] font-bold uppercase tracking-[0.15em]">{formData.company}</span>
            )}
            {formData.industry && (
              <span className="bg-[#0F6E56]/15 border border-[#0F6E56]/30 text-[#0F6E56] text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{formData.industry}</span>
            )}
          </div>
          <h3 className="text-white text-[20px] lg:text-[22px] font-bold">{firstName}&apos;s AI Opportunity Snapshot</h3>
          <p className="text-[#6B7280] text-[13px] mt-1">Generated {today} · {timeSelected ?? 15}-minute assessment</p>

          <div className="h-px w-full my-6" style={{ background: "rgba(15,110,86,0.3)" }} />

          {/* Opportunities */}
          <div className="flex flex-col gap-6">
            {opps.map((o, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.15 }}
                className="flex gap-4 items-start"
              >
                <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0 text-white text-[12px] font-bold mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-white text-[16px] font-bold">{o.title}</span>
                    <span className="text-[#0F6E56] text-[11px] font-semibold bg-[#0F6E56]/10 border border-[#0F6E56]/30 px-2.5 py-0.5 rounded-full">{o.metric}</span>
                  </div>
                  <p className="text-[#9CA3AF] text-[14px] leading-[1.6]">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="h-px w-full my-6" style={{ background: "rgba(15,110,86,0.3)" }} />
          <p className="text-[#4B5563] text-[13px] italic">
            This snapshot is based on your initial responses. The full detailed report including ROI projections has been sent to your email.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-3 mt-8 justify-center"
        >
          <Link href="/book" className="flex-1 sm:flex-none sm:min-w-[220px] text-center bg-[#0F6E56] text-white font-semibold py-3.5 rounded-lg text-[15px] hover:bg-[#0c5945] transition-all px-6">
            Book Your AI Opportunity Session
          </Link>
          <Link href="/" className="flex-1 sm:flex-none sm:min-w-[160px] text-center border border-[#1f2937] text-[#9CA3AF] font-medium py-3.5 rounded-lg text-[15px] hover:border-[#374151] hover:text-white transition-all px-6">
            Return to Home
          </Link>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="text-center text-[#4B5563] text-[13px] mt-6">
          Questions? Email us at{" "}
          <a href="mailto:hello@clarivisintelligence.com" className="text-[#6B7280] hover:text-[#0F6E56] transition-colors">
            hello@clarivisintelligence.com
          </a>
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────── */
export default function AssessmentClient() {
  const [phase, setPhase] = useState<Phase>(1);
  const [screen, setScreen] = useState<Screen>("time");
  const [currentStep, setCurrentStep] = useState(1);
  const [timeSelected, setTimeSelected] = useState<TimeOption>(null);
  const [direction, setDirection] = useState(1);
  const [resultPhase, setResultPhase] = useState<ResultPhase>("loading");
  const [formData, setFormData] = useState<FormData>(INIT);

  const updateForm = (key: keyof FormData, val: string | string[]) =>
    setFormData(d => ({ ...d, [key]: val }));

  const fireEarlyCapture = () => {
    fetch("/api/assessment-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, timeSelected }),
    }).catch(() => {});
  };

  const fireFullSubmission = () => {
    fetch("/api/assessment-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, timeSelected }),
    }).catch(() => {});
  };

  const handleGenerate = () => {
    fireFullSubmission();
    setResultPhase("loading");
    setPhase(3);
    setTimeout(() => setResultPhase("snap"), 3000);
  };

  const handleNext = () => {
    if (screen === "time") {
      if (!timeSelected) return;
      setDirection(1); setScreen("contact"); return;
    }
    if (screen === "contact") {
      if (!isContactValid(formData)) return;
      fireEarlyCapture();
      setDirection(1); setScreen("questions"); setCurrentStep(1); return;
    }
    // questions
    const total = getTotalSteps(timeSelected);
    if (!isStepValid(currentStep, timeSelected, formData)) return;
    if (currentStep < total) { setDirection(1); setCurrentStep(c => c + 1); }
  };

  const handleBack = () => {
    if (screen === "time") return;
    if (screen === "contact") { setDirection(-1); setScreen("time"); return; }
    if (screen === "questions") {
      if (currentStep <= 1) { setDirection(-1); setScreen("contact"); return; }
      setDirection(-1); setCurrentStep(c => c - 1);
    }
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 2 || screen === "time") return;
      const active = document.activeElement as HTMLElement;
      const isTextarea = active?.tagName === "TEXTAREA";
      if (e.key === "Enter" && !isTextarea && !e.shiftKey) {
        if (screen === "contact" && isContactValid(formData)) { handleNext(); return; }
        if (screen === "questions" && isStepValid(currentStep, timeSelected, formData)) handleNext();
      }
      if (e.key === "Backspace" && (active?.tagName === "INPUT" || isTextarea)) {
        if ((active as HTMLInputElement | HTMLTextAreaElement).value === "") handleBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, screen, currentStep, formData, timeSelected]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0f1a] overflow-y-auto flex flex-col">
      <TopBar />
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <Phase1 key="p1" onStart={() => { setPhase(2); setScreen("time"); }} />
        )}
        {phase === 2 && (
          <Phase2
            key="p2"
            screen={screen}
            currentStep={currentStep}
            timeSelected={timeSelected}
            formData={formData}
            direction={direction}
            onTimeSelect={t => setTimeSelected(t)}
            onFormChange={updateForm}
            onNext={handleNext}
            onBack={handleBack}
            onGenerate={handleGenerate}
          />
        )}
        {phase === 3 && resultPhase === "loading" && <LoadingScreen key="loading" />}
        {phase === 3 && resultPhase === "snap" && (
          <SnapshotScreen key="snap" formData={formData} timeSelected={timeSelected} />
        )}
      </AnimatePresence>
    </div>
  );
}
