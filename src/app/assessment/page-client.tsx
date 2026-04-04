"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ClipboardList, Calendar, Check, X, ArrowLeft, ArrowRight,
  Send, Mail, Loader2, Building2, Activity,
} from "lucide-react";

/* ─── Types ─────────────────────────────────── */
type Phase = 1 | 2 | 3;
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

/* ─── Helpers ────────────────────────────────── */
function getTotalSteps(t: TimeOption) { return t === 5 ? 5 : t === 15 ? 7 : 9; }
function getStepType(step: number, time: TimeOption) {
  const total = getTotalSteps(time);
  if (step === total) return "contact";
  const types = ["industry","company","teamSize","mainChallenge","tools","aiExperience","successVision","referralSource"];
  return types[step - 1] ?? "contact";
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
    case "contact": return f.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) && f.phone.trim().length > 0;
    default: return true;
  }
}
const QUESTIONS: Record<string, string> = {
  industry: "What industry are you in?",
  company: "What is your company called?",
  teamSize: "How many people work in your business?",
  mainChallenge: "What is your biggest operational challenge right now?",
  tools: "Which of these tools does your team currently use?",
  aiExperience: "Have you tried any AI or automation tools before?",
  successVision: "What would success look like in 90 days?",
  referralSource: "How did you hear about Clarivis Intelligence?",
  contact: "Last step. Where should we send your report?",
};

/* ─── Animation Variants ─────────────────────── */
const phaseV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4,0,0.2,1] as [number,number,number,number] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
const stepV = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.4,0,0.2,1] as [number,number,number,number] } },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.25 } }),
};

/* ─── Shared UI Primitives ───────────────────── */
const inputCls = "w-full bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-4 text-white text-[18px] placeholder-[#4B5563] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56] transition-all";
const pillCls = (active: boolean) => `cursor-pointer px-6 py-3 rounded-xl border text-[15px] font-medium transition-all duration-200 ${active ? "border-[#0F6E56] bg-[#0F6E56]/10 text-white shadow-[0_0_12px_rgba(15,110,86,0.2)]" : "border-[#1f2937] bg-[#111827] text-[#9CA3AF] hover:border-[#0F6E56]/40"}`;

/* ─── AnimatedCheckmark ──────────────────────── */
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
      className="w-24 h-24 rounded-full bg-[#0F6E56] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(15,110,86,0.4)]"
    >
      <motion.svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
        <motion.path d="M5 13l4 4L19 7" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeInOut" }}
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
          {/* Card 1 */}
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

          {/* Card 2 */}
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

/* ─── Phase 2: Multi-Step Form ───────────────── */
interface P2Props {
  currentStep: number; timeSelected: TimeOption; formData: FormData; direction: number; isSubmitting: boolean;
  onTimeSelect: (t: TimeOption) => void; onFormChange: (key: keyof FormData, val: string | string[]) => void;
  onNext: () => void; onBack: () => void;
}

function Phase2({ currentStep, timeSelected, formData, direction, isSubmitting, onTimeSelect, onFormChange, onNext, onBack }: P2Props) {
  const total = getTotalSteps(timeSelected ?? 5);
  const progress = currentStep === 0 ? 0 : Math.round((currentStep / total) * 100);
  const stepType = currentStep > 0 ? getStepType(currentStep, timeSelected) : null;
  const valid = currentStep === 0 ? !!timeSelected : isStepValid(currentStep, timeSelected, formData);

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Progress bar */}
      <div className="px-6 lg:px-12 pt-6 pb-2 max-w-[680px] mx-auto w-full">
        <div className="h-[3px] w-full bg-[#1f2937] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#0F6E56] rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
        {currentStep > 0 && (
          <p className="text-[#6B7280] text-[13px] mt-2 text-right">Step {currentStep} of {total}</p>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-hidden">
        <div className="w-full max-w-[680px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentStep} custom={direction} variants={stepV} initial="enter" animate="center" exit="exit">
              {currentStep === 0 ? (
                <TimeSelectionStep timeSelected={timeSelected} onSelect={onTimeSelect} onContinue={onNext} />
              ) : (
                <QuestionStep
                  stepType={stepType!}
                  question={QUESTIONS[stepType!] || ""}
                  formData={formData}
                  onChange={onFormChange}
                  isSubmitting={isSubmitting}
                  onSubmit={onNext}
                  valid={valid}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons for question steps */}
          {currentStep > 0 && stepType !== "contact" && (
            <div className="flex justify-between items-center mt-10">
              <button onClick={onBack} className="flex items-center gap-2 text-[#9CA3AF] hover:text-white text-[15px] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={onNext}
                disabled={!valid}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-[15px] transition-all ${valid ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {currentStep > 0 && stepType !== "contact" && currentStep === 1 && (
            <p className="text-center text-[#4B5563] text-[12px] mt-3">
              <button onClick={onBack} className="hover:text-[#6B7280]">← Back to options</button>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
          <div
            key={o.val}
            onClick={() => onSelect(o.val)}
            className={`relative cursor-pointer rounded-[16px] p-8 text-center border transition-all duration-200 ${timeSelected === o.val ? "border-[#0F6E56] bg-[#0F6E56]/10 shadow-[0_0_20px_rgba(15,110,86,0.2)]" : "border-white/8 bg-white/[0.03] hover:border-[#0F6E56]/40"}`}
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
        <button
          onClick={onContinue}
          disabled={!timeSelected}
          className={`w-full py-4 rounded-xl font-semibold text-[16px] transition-all duration-200 ${timeSelected ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function QuestionStep({ stepType, question, formData, onChange, isSubmitting, onSubmit, valid }: {
  stepType: string; question: string; formData: FormData; onChange: (k: keyof FormData, v: string | string[]) => void;
  isSubmitting: boolean; onSubmit: () => void; valid: boolean;
}) {
  return (
    <div className="pt-8">
      <h2 className="text-white text-[28px] lg:text-[36px] font-bold text-center mb-8">{question}</h2>

      {/* Industry */}
      {stepType === "industry" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{val:"Real Estate", icon: Building2, label:"Real Estate"},{val:"Healthcare", icon: Activity, label:"Healthcare"}].map(({val, icon: Icon, label}) => (
            <div key={val} onClick={() => onChange("industry", val)}
              className={`cursor-pointer rounded-[16px] p-10 border text-center min-h-[160px] flex flex-col items-center justify-center gap-3 transition-all duration-200 ${formData.industry === val ? "border-[#0F6E56] bg-[#0F6E56]/08" : "border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`}
              style={{ background: formData.industry === val ? "rgba(15,110,86,0.08)" : "" }}
            >
              <Icon className="w-10 h-10 text-[#0F6E56]" />
              <span className="text-white text-[20px] font-bold">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Company name */}
      {stepType === "company" && (
        <input type="text" value={formData.company} onChange={e => onChange("company", e.target.value)}
          placeholder="Your company name" autoFocus className={inputCls} style={{ fontSize: "22px" }}
        />
      )}

      {/* Team size */}
      {stepType === "teamSize" && (
        <div className="flex flex-wrap gap-3 justify-center">
          {TEAM_SIZES.map(s => (
            <button key={s} onClick={() => onChange("teamSize", s)} className={pillCls(formData.teamSize === s)} style={{ padding: "14px 28px", fontSize: "16px" }}>{s}</button>
          ))}
        </div>
      )}

      {/* Main challenge */}
      {stepType === "mainChallenge" && (
        <div>
          <textarea value={formData.mainChallenge} onChange={e => onChange("mainChallenge", e.target.value)}
            placeholder="Describe the problem that costs you the most time or money each week."
            autoFocus rows={5}
            className={`${inputCls} resize-none leading-relaxed`}
          />
          <p className="text-[#4B5563] text-[13px] mt-2 text-right">{formData.mainChallenge.length} characters {formData.mainChallenge.length < 20 && `(minimum 20)`}</p>
        </div>
      )}

      {/* Tools */}
      {stepType === "tools" && (
        <div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {TOOLS_LIST.map(t => (
              <button key={t} onClick={() => {
                const cur = formData.tools ?? [];
                onChange("tools", cur.includes(t) ? cur.filter(x => x !== t) : [...cur, t]);
              }} className={pillCls((formData.tools ?? []).includes(t))}>
                {t}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Any other tools? (optional)" className={inputCls} style={{ fontSize: "16px" }}
            onChange={e => {}} />
        </div>
      )}

      {/* AI experience */}
      {stepType === "aiExperience" && (
        <div className="grid grid-cols-1 gap-4">
          {AI_OPTIONS.map(o => (
            <div key={o} onClick={() => onChange("aiExperience", o)}
              className={`cursor-pointer rounded-[16px] p-6 border flex items-center gap-4 transition-all duration-200 ${formData.aiExperience === o ? "border-[#0F6E56] bg-[#0F6E56]/08" : "border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`}
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

      {/* Success vision */}
      {stepType === "successVision" && (
        <textarea value={formData.successVision} onChange={e => onChange("successVision", e.target.value)}
          placeholder="Describe the outcome that would make this worthwhile for your business."
          autoFocus rows={5} className={`${inputCls} resize-none leading-relaxed`}
        />
      )}

      {/* Referral source */}
      {stepType === "referralSource" && (
        <div className="flex flex-wrap gap-3 justify-center">
          {REFERRAL_OPTIONS.map(r => (
            <button key={r} onClick={() => onChange("referralSource", r)} className={pillCls(formData.referralSource === r)} style={{ padding: "14px 28px", fontSize: "16px" }}>{r}</button>
          ))}
        </div>
      )}

      {/* Contact (final step) */}
      {stepType === "contact" && (
        <div>
          <p className="text-[#9CA3AF] text-[16px] text-center mb-8">Your personalised AI Opportunity Snapshot will be delivered to your inbox within minutes.</p>
          <div className="flex flex-col gap-4 mb-8">
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
          <div className="flex flex-col gap-4">
            <button
              onClick={onSubmit}
              disabled={!valid || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-[18px] flex items-center justify-center gap-3 transition-all duration-200 ${valid && !isSubmitting ? "bg-[#0F6E56] text-white hover:bg-[#0c5945]" : "bg-[#0F6E56]/40 text-white/50 cursor-not-allowed"}`}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analysing your responses...</>
              ) : (
                <>Send Me My AI Opportunity Snapshot <Send className="w-5 h-5" /></>
              )}
            </button>
            <button onClick={() => {}} className="text-[#4B5563] text-[14px] hover:text-[#6B7280] transition-colors">
              <span className="cursor-pointer" onClick={() => document.dispatchEvent(new CustomEvent("assessmentBack"))}>
                ← Back
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Phase 3: Confirmation ──────────────────── */
function Phase3({ email }: { email: string }) {
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12 text-center"
    >
      <div className="w-full max-w-[600px]">
        <AnimatedCheck />
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-white text-[32px] lg:text-[36px] font-bold mt-8">
          Your report is on its way.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-[#9CA3AF] text-[16px] mt-4 leading-[1.8]">
          We are analysing your responses and preparing your personalised AI Opportunity Snapshot. Expect it in your inbox within the next few minutes.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-6 rounded-xl border border-[#0F6E56]/30 p-5 flex items-center gap-3 justify-center"
          style={{ background: "rgba(15,110,86,0.1)" }}>
          <Mail className="w-5 h-5 text-[#0F6E56] shrink-0" />
          <span className="text-[#9CA3AF] text-[15px]">Sending to <strong className="text-white">{email}</strong></span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <div className="h-px w-full bg-[#1f2937] my-8" />
          <h3 className="text-white text-[20px] font-semibold">Want to go deeper?</h3>
          <p className="text-[#9CA3AF] text-[15px] mt-2 mb-6">Book a free AI Opportunity Session with our founder to discuss your results in detail.</p>
          <div className="flex flex-col gap-3">
            <Link href="/book" className="block w-full bg-[#0F6E56] text-white font-semibold py-3.5 rounded-lg text-[16px] hover:bg-[#0c5945] transition-all">
              Book Your AI Opportunity Session
            </Link>
            <Link href="/" className="block w-full border border-[#1f2937] text-[#9CA3AF] font-medium py-3 rounded-lg text-[15px] hover:border-[#374151] hover:text-white transition-all">
              Return to Home
            </Link>
          </div>
          <p className="text-[#4B5563] text-[13px] mt-8 leading-relaxed">
            Check your spam folder if you do not see the email within 5 minutes.<br />
            Contact us at <a href="mailto:hello@clarivisintelligence.com" className="text-[#6B7280] hover:text-[#0F6E56] transition-colors">hello@clarivisintelligence.com</a> if you need help.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────── */
export default function AssessmentClient() {
  const [phase, setPhase] = useState<Phase>(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSelected, setTimeSelected] = useState<TimeOption>(null);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INIT);

  const updateForm = (key: keyof FormData, val: string | string[]) =>
    setFormData(d => ({ ...d, [key]: val }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/assessment-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, timeSelected }),
      });
    } catch {}
    setTimeout(() => { setIsSubmitting(false); setPhase(3); }, 2000);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!timeSelected) return;
      setDirection(1); setCurrentStep(1); return;
    }
    const total = getTotalSteps(timeSelected);
    const type = getStepType(currentStep, timeSelected);
    if (type === "contact") { handleSubmit(); return; }
    if (!isStepValid(currentStep, timeSelected, formData)) return;
    if (currentStep >= total - 1) { setDirection(1); setCurrentStep(total); return; }
    setDirection(1); setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep <= 1) { setDirection(-1); setCurrentStep(0); return; }
    setDirection(-1); setCurrentStep(c => c - 1);
  };

  // Listen for the back event from contact step
  useEffect(() => {
    const handler = () => handleBack();
    document.addEventListener("assessmentBack", handler);
    return () => document.removeEventListener("assessmentBack", handler);
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 2 || currentStep === 0) return;
      const active = document.activeElement as HTMLElement;
      const isTextarea = active?.tagName === "TEXTAREA";
      if (e.key === "Enter" && !isTextarea && !e.shiftKey) {
        if (isStepValid(currentStep, timeSelected, formData)) handleNext();
      }
      if (e.key === "Backspace" && (active?.tagName === "INPUT" || isTextarea)) {
        const el = active as HTMLInputElement | HTMLTextAreaElement;
        if (el.value === "") handleBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, currentStep, formData, timeSelected]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0f1a] overflow-y-auto flex flex-col">
      <TopBar />
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <Phase1 key="p1" onStart={() => { setPhase(2); setCurrentStep(0); }} />
        )}
        {phase === 2 && (
          <Phase2
            key="p2"
            currentStep={currentStep}
            timeSelected={timeSelected}
            formData={formData}
            direction={direction}
            isSubmitting={isSubmitting}
            onTimeSelect={t => setTimeSelected(t)}
            onFormChange={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {phase === 3 && <Phase3 key="p3" email={formData.email} />}
      </AnimatePresence>
    </div>
  );
}
