"use client";
import { useState, useEffect, useRef } from "react";
import { trackEvent, setupDropoffTracking } from "@/lib/tracker";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ClipboardList, Calendar, Check, X, ArrowLeft, ArrowRight, Send, FileText, Zap, Building2, Activity, Mail } from "lucide-react";

/* ─── Types ── */
type Phase = 1|2|3|4|5|6|7;
type TimeOption = 5|10|20|null;
type Message = { role: "user"|"assistant"; content: string };
interface FormData { name:string; email:string; phone:string; industry:string; company:string; teamSize:string; mainChallenge:string; tools:string[]; aiExperience:string; successDefinition:string; }
interface Opp { rank:number; title:string; problem:string; solution:string; indicativeROI:string; timeToROI:string; }
interface SnapshotData { opportunities: Opp[]; readinessScore: number | null; executiveSummary: string | null; recommendedFirstStep: string | null; }
const INIT: FormData = { name:"", email:"", phone:"", industry:"", company:"", teamSize:"", mainChallenge:"", tools:[], aiExperience:"", successDefinition:"" };

/* ─── Constants ── */
const TEAM_SIZES = ["1 to 10","11 to 30","31 to 50","50 plus"];
const TOOLS_LIST = ["WhatsApp","Excel or Sheets","CRM Software","Accounting Software","ERP System","Custom Software","None"];
const AI_OPTS = ["No, completely new","Yes, with mixed results","Yes, successfully"];
const QUESTIONS: Record<string,string> = { industry:"What industry are you in?", company:"What is your company called?", teamSize:"How many people work in your business?", mainChallenge:"What is your biggest operational challenge right now?", tools:"Which tools does your team currently use?", aiExperience:"Have you tried AI or automation before?", successDefinition:"What would success look like in 90 days?" };

// Minimum turns before "End Session Early" generates a meaningful report
const MIN_TURNS_FOR_QUALITY = 3;

/* ─── Helpers ── */
function trackPostHog(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog) {
    (window as unknown as { posthog: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog.capture(event, properties)
  }
}

function identifyPostHog(email: string, properties: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as unknown as { posthog?: { identify: (e: string, p: Record<string, unknown>) => void } }).posthog) {
    (window as unknown as { posthog: { identify: (e: string, p: Record<string, unknown>) => void } }).posthog.identify(email, properties)
  }
}
function getMaxTurns(t: TimeOption) { return t===5?8:t===10?14:25; }
function getTotalSteps(t: TimeOption) { return t===5?5:t===10?7:8; }
function getStepType(step:number, time:TimeOption) {
  const total = getTotalSteps(time);
  if (step===total) return "confirm";
  return ["industry","company","teamSize","mainChallenge","tools","aiExperience","successDefinition"][step-1]??"confirm";
}
function isStepValid(step:number,time:TimeOption,f:FormData) {
  switch(getStepType(step,time)) {
    case "industry": return !!f.industry;
    case "company": return f.company.trim().length>0;
    case "teamSize": return !!f.teamSize;
    case "mainChallenge": return f.mainChallenge.trim().length>=20;
    case "tools": return true;
    case "aiExperience": return !!f.aiExperience;
    case "successDefinition": return f.successDefinition.trim().length>0;
    default: return true;
  }
}
function isContactValid(f:FormData) {
  const phoneDigits = f.phone.replace(/\D/g, '');
  return (
    f.name.trim().length>0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) &&
    phoneDigits.length >= 7  // minimum 7 digits — covers international formats
  );
}
function getDefaultOpps(industry:string):Opp[] {
  return industry==="Real Estate" ? [
    {rank:1,title:"AI Lead Qualifier",problem:"Slow lead response losing site visits",solution:"Automated response within 60 seconds",indicativeROI:"Up to 40% more site visits booked",timeToROI:"4-6 weeks"},
    {rank:2,title:"Sales Pipeline Dashboard",problem:"No live pipeline visibility",solution:"Real-time management intelligence",indicativeROI:"Real-time management decisions",timeToROI:"4-6 weeks"},
    {rank:3,title:"Collections Agent",problem:"Manual payment follow-up",solution:"Automated reminders via voice and WhatsApp",indicativeROI:"Up to 60% fewer overdue accounts",timeToROI:"3-4 weeks"},
  ] : [
    {rank:1,title:"Patient Appointment Agent",problem:"High no-show rate costing revenue",solution:"Automated reminders at 48h, 24h, 2h",indicativeROI:"Up to 40% reduction in no-shows",timeToROI:"3-4 weeks"},
    {rank:2,title:"Billing Automation",problem:"Manual billing errors",solution:"Automated invoice generation and reconciliation",indicativeROI:"Revenue cycle errors reduced to zero",timeToROI:"4-6 weeks"},
    {rank:3,title:"Clinical Dashboard",problem:"No operational visibility",solution:"Live dashboard across all departments",indicativeROI:"Management reporting fully automated",timeToROI:"4-6 weeks"},
  ];
}

/* ─── Animation ── */
const phaseV = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.5}}, exit:{opacity:0,y:-20,transition:{duration:0.3}} };
const stepV = { enter:(d:number)=>({x:d>0?80:-80,opacity:0}), center:{x:0,opacity:1,transition:{duration:0.3,ease:[0.4,0,0.2,1] as [number,number,number,number]}}, exit:(d:number)=>({x:d>0?-80:80,opacity:0,transition:{duration:0.25}}) };

/* ─── Shared UI ── */
const iCls = "w-full bg-[#111827] border border-[#1f2937] rounded-xl px-5 py-4 text-white text-[18px] placeholder-[#4B5563] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56] transition-all";
const pCls = (a:boolean) => `cursor-pointer px-5 py-3 rounded-xl border text-[15px] font-medium transition-all ${a?"border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]":"border-[#1f2937] bg-[#111827] text-[#9CA3AF] hover:border-[#374151]"}`;

/* ─── TopBar ── */
function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#1f2937] bg-[#0a0f1a]/80 backdrop-blur-md">
      <Link href="/"><Image src="/images/logo.png" alt="Clarivis" width={100} height={26} /></Link>
      <Link href="/" className="flex items-center gap-1.5 text-[#6B7280] text-[13px] hover:text-white transition-colors"><X className="w-4 h-4"/>Exit</Link>
    </div>
  );
}

/* ─── Animated Check ── */
function AnimatedCheck({size=60}:{size?:number}) {
  return (
    <motion.div initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:200,damping:15}} className="mx-auto rounded-full bg-[#0F6E56]/20 flex items-center justify-center" style={{width:size,height:size}}>
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:"spring",stiffness:300}}>
        <Check className="text-[#0F6E56]" style={{width:size*0.45,height:size*0.45}}/>
      </motion.div>
    </motion.div>
  );
}

/* ─── Phase 1: Welcome ── */
function Phase1({onStart}:{onStart:()=>void}) {
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12">
      <div className="w-full max-w-[640px] text-center">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.5}} className="w-20 h-20 rounded-2xl bg-[#0F6E56]/20 flex items-center justify-center mx-auto mb-8">
          <ClipboardList className="w-10 h-10 text-[#0F6E56]"/>
        </motion.div>
        <h1 className="text-white text-[36px] lg:text-[44px] font-bold leading-tight mb-4">Your AI Opportunity Assessment</h1>
        <p className="text-[#9CA3AF] text-[18px] leading-relaxed mb-10">Answer a few questions and have a conversation with our AI. You will receive a personalised AI Opportunity Snapshot identifying your top opportunities with indicative ROI.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          {[["Completely free","No credit card, no commitment"],["Personalised to you","Based on your specific situation"],["Instant report","Delivered to your email on completion"],["Confidential","Your information is never shared"]].map(([t,d])=>(
            <div key={t} className="flex items-start gap-3 bg-[#111827] border border-[#1f2937] rounded-xl p-4">
              <Check className="w-4 h-4 text-[#0F6E56] mt-0.5 shrink-0"/>
              <div><p className="text-white text-[14px] font-semibold">{t}</p><p className="text-[#6B7280] text-[13px]">{d}</p></div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={onStart} className="w-full sm:w-auto sm:min-w-[220px] bg-[#0F6E56] text-white font-bold py-4 px-8 rounded-xl text-[17px] hover:bg-[#0c5945] transition-all flex items-center justify-center gap-2">Start Assessment <ArrowRight className="w-5 h-5"/></button>
        </div>
        <p className="text-[#4B5563] text-[13px] mt-6">Takes 5–20 minutes depending on the time you choose</p>
        <div className="mt-10 pt-8 border-t border-[#1f2937] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div whileHover={{y:-2}} className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-6 text-left">
            <ClipboardList className="w-8 h-8 text-[#0F6E56] mb-3"/>
            <h3 className="text-white font-bold text-[16px] mb-1">Clarivis Assessment</h3>
            <p className="text-[#6B7280] text-[14px]">Self-serve AI chat. Complete now and receive your report instantly.</p>
            <span className="inline-block mt-3 text-[#0F6E56] text-[13px] font-semibold">You are here →</span>
          </motion.div>
          <motion.div whileHover={{y:-2}} className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-6 text-left opacity-70">
            <Calendar className="w-8 h-8 text-[#0F6E56] mb-3"/>
            <h3 className="text-white font-bold text-[16px] mb-1">AI Opportunity Session</h3>
            <p className="text-[#6B7280] text-[14px]">45 minutes with our founder. Personalised verbal analysis. Walk away with a clear AI roadmap.</p>
            <div className="flex flex-col gap-3 mb-8">{["45 minutes with our founder","Personalised verbal analysis","Follow-up report within 24 hours"].map((f,i)=>(
              <div key={i} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#0F6E56] shrink-0"/><span className="text-[#9CA3AF] text-[14px]">{f}</span></div>
            ))}</div>
            <Link href="/book" className="block w-full border border-[#0F6E56] text-[#0F6E56] font-semibold py-3.5 rounded-lg text-[16px] text-center hover:bg-[#0F6E56]/10 transition-all">Book Your Session</Link>
          </motion.div>
        </div>
        <p className="text-center text-[#6B7280] text-[14px] mt-6">Most people start with the Assessment and book a session after receiving their report.</p>
      </div>
    </motion.div>
  );
}

/* ─── Phase 2 ── */
function Phase2({timeSelected,onSelect,onContinue}:{timeSelected:TimeOption;onSelect:(t:TimeOption)=>void;onContinue:()=>void}) {
  // Exchange counts reflect the actual maxTurns values (8, 14, 25)
  const opts = [
    {val:5 as const,num:"5",label:"Quick Snapshot",desc:"Key opportunities identified fast. Up to 8 exchanges.",rec:false},
    {val:10 as const,num:"10",label:"Full Assessment",desc:"Complete picture with ROI context. Up to 14 exchanges.",rec:true},
    {val:20 as const,num:"20",label:"Deep Dive",desc:"Thorough analysis of your full operation. Up to 25 exchanges.",rec:false}
  ];
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12">
      <div className="w-full max-w-[680px] text-center">
        <p className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.2em] font-semibold mb-3">BEFORE WE BEGIN</p>
        <h2 className="text-white text-[36px] lg:text-[40px] font-bold">How much time do you have?</h2>
        <p className="text-[#9CA3AF] text-[16px] mt-3">We personalise your assessment and AI chat based on the time you have available.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {opts.map(o=>(
            <div key={o.val} onClick={()=>onSelect(o.val)} className={`relative cursor-pointer rounded-[16px] p-8 text-center border transition-all duration-200 ${timeSelected===o.val?"border-[#0F6E56] bg-[#0F6E56]/10 shadow-[0_0_20px_rgba(15,110,86,0.2)]":"border-white/[0.08] bg-white/[0.03] hover:border-[#0F6E56]/40"}`}>
              {o.rec&&<div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-[#0F6E56] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">RECOMMENDED</span></div>}
              <div className="text-[#0F6E56] text-[64px] font-extrabold leading-none">{o.num}</div>
              <div className="text-[#9CA3AF] text-[14px] mt-1">minutes</div>
              <div className="text-white text-[18px] font-semibold mt-3">{o.label}</div>
              <div className="text-[#6B7280] text-[13px] mt-1">{o.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-[400px] mx-auto">
          <button onClick={onContinue} disabled={!timeSelected} className={`w-full py-4 rounded-xl font-semibold text-[16px] transition-all ${timeSelected?"bg-[#0F6E56] text-white hover:bg-[#0c5945]":"bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}>Continue</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase 3 ── */
function Phase3({formData,onChange,onContinue,onBack}:{formData:FormData;onChange:(k:keyof FormData,v:string)=>void;onContinue:()=>void;onBack:()=>void}) {
  const valid = isContactValid(formData);
  const phoneDigits = formData.phone.replace(/\D/g, '');
  const phoneInvalid = formData.phone.trim().length > 0 && phoneDigits.length < 7;
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12">
      <div className="w-full max-w-[560px] text-center">
        <p className="text-[#9CA3AF] text-[12px] uppercase tracking-[0.2em] font-semibold mb-3">BEFORE WE START</p>
        <h2 className="text-white text-[32px] lg:text-[36px] font-bold">Where should we send your report?</h2>
        <p className="text-[#9CA3AF] text-[16px] mt-3 mb-10">We will email your AI Opportunity Snapshot PDF the moment your assessment is complete.</p>
        <div className="flex flex-col gap-4 text-left mb-8">
          <input type="text" value={formData.name} onChange={e=>onChange("name",e.target.value)} placeholder="Your full name" autoFocus className={iCls} />
          <input type="email" value={formData.email} onChange={e=>onChange("email",e.target.value)} placeholder="your@email.com" className={iCls} />
          <div>
            <input type="tel" value={formData.phone} onChange={e=>onChange("phone",e.target.value)} placeholder="+91 98765 43210" className={`${iCls} ${phoneInvalid?"border-red-500/50":""}`} />
            {phoneInvalid
              ? <p className="text-red-400 text-[13px] mt-1.5 pl-1">Please enter a valid phone number</p>
              : <p className="text-[#4B5563] text-[13px] mt-1.5 pl-1">(We may call to discuss your results)</p>
            }
          </div>
        </div>
        <button onClick={onContinue} disabled={!valid} className={`w-full py-4 rounded-xl font-bold text-[17px] transition-all ${valid?"bg-[#0F6E56] text-white hover:bg-[#0c5945]":"bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}>Continue to Assessment</button>
        <button onClick={onBack} className="mt-4 flex items-center gap-1.5 text-[#4B5563] text-[14px] hover:text-[#6B7280] transition-colors mx-auto"><ArrowLeft className="w-3.5 h-3.5"/>Back to time selection</button>
      </div>
    </motion.div>
  );
}

/* ─── Phase 4 ── */
function Phase4({timeSelected,formData,onChange,onComplete,onBack,onScreenChange}:{timeSelected:TimeOption;formData:FormData;onChange:(k:keyof FormData,v:string|string[])=>void;onComplete:()=>void;onBack:()=>void;onScreenChange:(label:string)=>void}) {
  const [step,setStep] = useState(1);
  const [dir,setDir] = useState(1);
  const total = getTotalSteps(timeSelected);
  const stepType = getStepType(step,timeSelected);
  const valid = isStepValid(step,timeSelected,formData);
  const progress = Math.round((step/total)*100);

  useEffect(()=>{
    const sType = getStepType(step,timeSelected);
    const label = sType==="confirm"
      ?"Phase 4: Confirm — Ready to Chat"
      :`Phase 4: Step ${step} — ${QUESTIONS[sType]||sType}`;
    onScreenChange(label);
    trackEvent("p4_step_entered",{phase:4,screenDetail:label,stepNumber:step,stepType:sType,timeSelected});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[step]);

  const goNext = ()=>{ if(stepType==="confirm"){trackEvent("p4_complete",{phase:4,screenDetail:"Phase 4: Confirm — Start AI Chat",timeSelected,industry:formData.industry,company:formData.company});onComplete();return;} if(!valid)return; trackPostHog('assessment_step_completed', {step: step,totalSteps: total,industry: formData.industry || null});setDir(1);setStep(s=>s+1); };
  const goBack = ()=>{ if(step<=1){onBack();return;} setDir(-1);setStep(s=>s-1); };
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col min-h-[calc(100vh-73px)]">
      <div className="px-6 pt-6 pb-2 max-w-[680px] mx-auto w-full">
        <div className="h-[3px] w-full bg-[#1f2937] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#0F6E56] rounded-full" animate={{width:`${progress}%`}} transition={{duration:0.4}}/>
        </div>
        <p className="text-[#6B7280] text-[13px] mt-2 text-right">Step {step} of {total}</p>
      </div>
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-[680px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={stepV} initial="enter" animate="center" exit="exit" className="pt-6">
              {stepType!=="confirm"&&<h2 className="text-white text-[28px] lg:text-[36px] font-bold text-center mb-8">{QUESTIONS[stepType]}</h2>}
              {stepType==="industry"&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[{v:"Real Estate",I:Building2},{v:"Healthcare",I:Activity}].map(({v,I:Icon})=>(
                <div key={v} onClick={()=>onChange("industry",v)} className={`cursor-pointer rounded-[16px] p-10 border flex flex-col items-center gap-3 min-h-[160px] justify-center transition-all ${formData.industry===v?"border-[#0F6E56]":"border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`} style={{background:formData.industry===v?"rgba(15,110,86,0.1)":""}}>
                  <Icon className={`w-10 h-10 ${formData.industry===v?"text-[#0F6E56]":"text-[#6B7280]"}`}/>
                  <span className={`text-[18px] font-semibold ${formData.industry===v?"text-white":"text-[#9CA3AF]"}`}>{v}</span>
                </div>
              ))}</div>}
              {stepType==="company"&&<input type="text" value={formData.company} onChange={e=>onChange("company",e.target.value)} placeholder="e.g. Horizon Developers" autoFocus className={iCls+" text-center text-[24px]"} onKeyDown={e=>e.key==="Enter"&&valid&&goNext()}/>}
              {stepType==="teamSize"&&<div className="grid grid-cols-2 gap-4">{TEAM_SIZES.map(s=><div key={s} onClick={()=>onChange("teamSize",s)} className={pCls(formData.teamSize===s)+" text-center py-5 text-[18px]"}>{s}</div>)}</div>}
              {stepType==="mainChallenge"&&<div><textarea value={formData.mainChallenge} onChange={e=>onChange("mainChallenge",e.target.value)} placeholder="Describe your biggest operational challenge in detail..." rows={5} autoFocus className={iCls+" resize-none text-[16px]"}/><p className="text-[#4B5563] text-[13px] mt-2 text-right">{formData.mainChallenge.length}/20 minimum</p></div>}
              {stepType==="tools"&&<div className="flex flex-wrap gap-3 justify-center">{TOOLS_LIST.map(t=>{const sel=(formData.tools as string[]).includes(t);return<div key={t} onClick={()=>{const cur=formData.tools as string[];onChange("tools",sel?cur.filter(x=>x!==t):[...cur,t]);}} className={pCls(sel)+" px-6 py-3.5"}>{ sel&&<Check className="w-4 h-4 inline mr-1.5"/>}{t}</div>;})}</div>}
              {stepType==="aiExperience"&&<div className="flex flex-col gap-4">{AI_OPTS.map(o=><div key={o} onClick={()=>onChange("aiExperience",o)} className={pCls(formData.aiExperience===o)+" text-center py-5 text-[17px]"}>{o}</div>)}</div>}
              {stepType==="successDefinition"&&<div><textarea value={formData.successDefinition} onChange={e=>onChange("successDefinition",e.target.value)} placeholder="e.g. Our leads are followed up within 5 minutes and we have full pipeline visibility..." rows={4} autoFocus className={iCls+" resize-none text-[16px]"}/></div>}
              {stepType==="confirm"&&<div className="text-center">
                <AnimatedCheck size={72}/>
                <h2 className="text-white text-[28px] font-bold mt-6 mb-4">You are all set.</h2>
                <p className="text-[#9CA3AF] text-[16px] mb-6">Our AI is ready to begin. It will ask you focused questions, then generate your personalised AI Opportunity Snapshot.</p>
                <div className="bg-[#111827] border border-[#1f2937] rounded-[16px] p-6 text-left mb-8 space-y-3">
                  {formData.company&&<div className="flex justify-between"><span className="text-[#6B7280] text-[14px]">Company</span><span className="text-white text-[14px] font-medium">{formData.company}</span></div>}
                  {formData.industry&&<div className="flex justify-between"><span className="text-[#6B7280] text-[14px]">Industry</span><span className="text-white text-[14px] font-medium">{formData.industry}</span></div>}
                  {formData.teamSize&&<div className="flex justify-between"><span className="text-[#6B7280] text-[14px]">Team size</span><span className="text-white text-[14px] font-medium">{formData.teamSize}</span></div>}
                  <div className="flex justify-between"><span className="text-[#6B7280] text-[14px]">Session</span><span className="text-[#0F6E56] text-[14px] font-semibold">{timeSelected} minutes</span></div>
                </div>
              </div>}
              {stepType!=="confirm"&&<div className="flex flex-col items-center gap-4 mt-8">
                <button onClick={goNext} disabled={!valid} className={`w-full max-w-[360px] py-4 rounded-xl font-semibold text-[16px] transition-all flex items-center justify-center gap-2 ${valid?"bg-[#0F6E56] text-white hover:bg-[#0c5945]":"bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}>Continue <ArrowRight className="w-4 h-4"/></button>
                <button onClick={goBack} className="flex items-center gap-1.5 text-[#4B5563] text-[14px] hover:text-[#6B7280] transition-colors"><ArrowLeft className="w-3.5 h-3.5"/>Back</button>
              </div>}
              {stepType==="confirm"&&<button onClick={goNext} className="w-full bg-[#0F6E56] text-white font-bold py-4 rounded-xl text-[17px] hover:bg-[#0c5945] transition-all flex items-center justify-center gap-2">Start AI Assessment <ArrowRight className="w-5 h-5"/></button>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase 5: Chat ── */
function Phase5({formData,timeSelected,maxTurns,messages,setMessages,onComplete,onLogData}:{formData:FormData;timeSelected:TimeOption;maxTurns:number;messages:Message[];setMessages:React.Dispatch<React.SetStateAction<Message[]>>;onComplete:()=>void;onLogData:(d:Record<string,string>)=>void}) {
  const [input,setInput] = useState("");
  const [isTyping,setIsTyping] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const greetingFired = useRef(false);
  const turnsUsed = messages.filter(m=>m.role==="user").length;
  const turnsRemaining = maxTurns - turnsUsed;
  const disabled = turnsRemaining<=0||isTyping;
  const tooFewTurns = turnsUsed < MIN_TURNS_FOR_QUALITY;

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,isTyping]);

  const callAPI = async(history:Message[])=>{
    setIsTyping(true);
    try {
      const res = await fetch("/api/assessment-chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history,userProfile:formData,timeSelected,maxTurns})});
      const data = await res.json();
      setMessages(m=>[...m,{role:"assistant",content:data.response}]);
      if(data.logData) onLogData(data.logData);
      if(data.isLastTurn) setTimeout(()=>onComplete(),1500);
    } catch { setMessages(m=>[...m,{role:"assistant",content:"I apologise for the interruption. Your report will be generated from our conversation so far."}]); }
    setIsTyping(false);
  };

  useEffect(()=>{ if(messages.length===0&&!greetingFired.current){greetingFired.current=true;trackPostHog('chat_started', {industry: formData.industry,timeSelected: timeSelected,company: formData.company});callAPI([]);} },[]);

  const handleSend = async()=>{
    if(!input.trim()||disabled) return;
    const msg:Message = {role:"user",content:input.trim()};
    const next = [...messages,msg];
    const turnNum = turnsUsed+1;
    trackEvent("p5_turn_sent",{phase:5,screenDetail:`Phase 5: AI Chat — Turn ${turnNum}`,chatTurns:turnNum,timeSelected});
    trackPostHog('chat_turn', {turnNumber: turnNum,maxTurns: maxTurns,industry: formData.industry});
    setMessages(next); setInput(""); await callAPI(next);
  };

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Left Panel — desktop only */}
      <div className="hidden lg:flex flex-col w-[300px] shrink-0 bg-[#111827] border-r border-[#1f2937] p-6 overflow-y-auto">
        <Image src="/images/logo.png" alt="Clarivis" width={110} height={28} className="mb-7"/>
        <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-3">Your Profile</p>
        {([["Name",formData.name],["Company",formData.company],["Industry",formData.industry],["Team",formData.teamSize]] as [string,string][]).filter(([,v])=>v).map(([k,v])=>(
          <div key={k} className="flex justify-between py-2 border-b border-[#1f2937]">
            <span className="text-[#6B7280] text-[13px]">{k}</span>
            <span className="text-[#CBD5E1] text-[13px] font-medium text-right max-w-[140px]">{v}</span>
          </div>
        ))}
        <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mt-6 mb-3">Your Session</p>
        <span className="inline-block bg-[#0F6E56]/15 border border-[#0F6E56]/30 text-[#0F6E56] text-[12px] font-semibold px-3 py-1 rounded-full w-fit">{timeSelected} minutes</span>
        <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mt-6 mb-2">Progress</p>
        <p className="text-white text-[14px] font-semibold">{turnsRemaining} exchanges remaining</p>
        <div className="mt-2 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#0F6E56] rounded-full" animate={{width:`${(turnsUsed/maxTurns)*100}%`}} transition={{duration:0.3}}/>
        </div>
        <p className="text-[#374151] text-[11px] mt-auto pt-6">Powered by Claude AI</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-[#0a0f1a] min-w-0">
        {/* Mobile progress bar */}
        <div className="lg:hidden px-4 py-2 border-b border-[#1f2937] flex items-center justify-between">
          <span className="text-[#6B7280] text-[12px]">{turnsUsed}/{maxTurns} exchanges</span>
          <div className="flex-1 mx-4 h-1 bg-[#1f2937] rounded-full overflow-hidden">
            <div className="h-full bg-[#0F6E56] rounded-full transition-all" style={{width:`${(turnsUsed/maxTurns)*100}%`}}/>
          </div>
          <span className="text-[#6B7280] text-[12px]">{timeSelected}min</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((m,i)=>(
            <div key={i} className={`flex gap-3 ${m.role==="user"?"justify-end":""}`}>
              {m.role==="assistant"&&<div className="w-8 h-8 rounded-full bg-[#0F6E56]/20 flex items-center justify-center shrink-0 mt-1"><Zap className="w-4 h-4 text-[#0F6E56]"/></div>}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${m.role==="assistant"?"bg-[#111827] text-[#CBD5E1]":"bg-[#0F6E56] text-white"}`}>
                {m.content.split('\n').map((line,j)=><span key={j}>{line}{j<m.content.split('\n').length-1&&<br/>}</span>)}
              </div>
            </div>
          ))}
          {isTyping&&<div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-[#0F6E56]/20 flex items-center justify-center shrink-0"><Zap className="w-4 h-4 text-[#0F6E56]"/></div><div className="bg-[#111827] rounded-2xl px-4 py-3"><div className="flex gap-1.5">{[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 rounded-full bg-[#6B7280]" animate={{y:[0,-4,0]}} transition={{duration:0.6,delay:i*0.15,repeat:Infinity}}/>)}</div></div></div>}
          <div ref={endRef}/>
        </div>
        <div className="p-4 border-t border-[#1f2937] bg-[#0a0f1a]">
          <div className="flex gap-3 items-end max-w-[800px] mx-auto">
            <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} rows={1} placeholder={turnsRemaining<=0?"Session complete — generating your report...":"Type your message..."} disabled={disabled} className="flex-1 bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white text-[16px] placeholder-[#4B5563] focus:outline-none focus:border-[#0F6E56] transition-all disabled:opacity-40 resize-none" style={{maxHeight:"120px"}}/>
            <button onClick={handleSend} disabled={disabled||!input.trim()} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${!disabled&&input.trim()?"bg-[#0F6E56] hover:bg-[#0c5945]":"bg-[#1f2937] opacity-40"}`}>
              <Send className="w-4 h-4 text-white"/>
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 max-w-[800px] mx-auto">
            <p className="text-[#4B5563] text-[12px]">{turnsUsed} of {maxTurns} exchanges used</p>
            {!disabled&&<button onClick={()=>setShowModal(true)} className="text-[#4B5563] text-[12px] hover:text-[#6B7280] transition-colors">End Session Early</button>}
          </div>
        </div>
      </div>

      {/* End session modal */}
      {showModal&&<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
        <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 max-w-[420px] w-full text-center">
          <h3 className="text-white text-[20px] font-bold mb-3">End your session now?</h3>
          {tooFewTurns
            ? <p className="text-amber-400 text-[14px] mb-2">You have only had {turnsUsed} exchange{turnsUsed!==1?"s":""}. A few more will give you a much more personalised report.</p>
            : null
          }
          <p className="text-[#9CA3AF] text-[15px] mb-8">Your report will be generated from the conversation so far.</p>
          <div className="flex flex-col gap-3">
            <button onClick={()=>{trackEvent("p5_chat_ended",{phase:5,screenDetail:"Phase 5: AI Chat — Ended Early",chatTurns:turnsUsed,timeSelected});setShowModal(false);onComplete();}} className="w-full bg-[#0F6E56] text-white font-semibold py-3 rounded-lg hover:bg-[#0c5945] transition-all">Generate My Report</button>
            <button onClick={()=>setShowModal(false)} className="w-full border border-[#374151] text-[#9CA3AF] font-medium py-3 rounded-lg hover:border-[#6B7280] transition-all">Continue Chatting</button>
          </div>
        </motion.div>
      </div>}
    </motion.div>
  );
}

/* ─── Phase 6: Loading ── */
function Phase6({formData,messages,timeSelected,setSnapshotData,onComplete,logData,assessmentId}:{formData:FormData;messages:Message[];timeSelected:TimeOption;setSnapshotData:(d:SnapshotData)=>void;onComplete:()=>void;logData:Record<string,string>;assessmentId:string|null}) {
  const steps = ["Analysing your conversation","Identifying your top opportunities","Calculating indicative ROI","Preparing your personalised report"];
  const hasCompleted = useRef(false);

  useEffect(()=>{
    if(hasCompleted.current) return;
    identifyPostHog(formData.email, {name: formData.name,email: formData.email,phone: formData.phone,company: formData.company,industry: formData.industry,teamSize: formData.teamSize,mainChallenge: formData.mainChallenge,completedAssessment: true,assessmentCompletedAt: new Date().toISOString()});
    trackPostHog('assessment_completed', {industry: formData.industry,timeSelected: timeSelected,company: formData.company,totalTurns: Math.floor(messages.length / 2)});

    // ── RACE CONDITION FIX ──────────────────────────────────────────────────
    // We no longer use a fixed setTimeout to advance to Phase 7.
    // We wait for both API calls to resolve, then advance. The minimum 4-second
    // display is enforced by Promise.all-ing with a 4s delay promise.
    const minDisplayTime = new Promise(res => setTimeout(res, 4000));

    const apiCalls = Promise.all([
      fetch("/api/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userProfile:formData,conversationHistory:messages,timeSelected,assessmentId})})
        .then(r=>r.json()),
      fetch("/api/log-conversation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        userProfile:formData,
        conversationHistory:messages,
        model:logData.model,
        systemPromptVersion:logData.systemPromptVersion,
        timeSelected,
        completedAt:new Date().toISOString(),
        assessmentId,
        promptVersionId: logData.promptVersionId || null,
        modelId: logData.modelId || null,
      })}).catch(()=>null),
    ]);

    Promise.all([apiCalls, minDisplayTime]).then(([[pdfData]])=>{
      if(hasCompleted.current) return;
      hasCompleted.current = true;
      if(pdfData?.opportunities) {
        setSnapshotData({
          opportunities: pdfData.opportunities,
          readinessScore: pdfData.readinessScore ?? null,
          executiveSummary: pdfData.executiveSummary ?? null,
          recommendedFirstStep: pdfData.recommendedFirstStep ?? null,
        });
      }
      onComplete();
    }).catch(()=>{
      if(hasCompleted.current) return;
      hasCompleted.current = true;
      onComplete();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 text-center">
      <motion.div animate={{scale:[1,1.12,1],opacity:[0.7,1,0.7]}} transition={{duration:1.5,repeat:Infinity,ease:"easeInOut"}}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8" style={{background:"rgba(15,110,86,0.2)",boxShadow:"0 0 40px rgba(15,110,86,0.3)"}}>
        <FileText className="w-10 h-10 text-[#0F6E56]"/>
      </motion.div>
      <h2 className="text-white text-[28px] font-bold">Generating your AI Opportunity Snapshot...</h2>
      <div className="flex flex-col gap-4 mt-8 text-left">
        {steps.map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.5+i*1,duration:0.4}} className="flex items-center gap-3">
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.7+i*1,type:"spring"}} className="w-5 h-5 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white"/>
            </motion.div>
            <span className="text-[#9CA3AF] text-[16px]">{s}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Phase 7: Summary ── */
function Phase7({formData,snapshotData}:{formData:FormData;snapshotData:SnapshotData}) {
  const opps = snapshotData.opportunities.length>0 ? snapshotData.opportunities : getDefaultOpps(formData.industry||"Real Estate");
  const firstName = formData.name.split(" ")[0]||"Your";
  const today = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center px-6 py-12 min-h-[calc(100vh-73px)]">
      <div className="w-full max-w-[700px]">
        <div className="text-center mb-8">
          <AnimatedCheck size={80}/>
          <motion.h2 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="text-white text-[28px] lg:text-[32px] font-bold mt-6">Your report is ready, {firstName}.</motion.h2>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="text-[#9CA3AF] text-[16px] mt-2">Your AI Opportunity Snapshot has been sent to <strong className="text-white">{formData.email}</strong>.</motion.p>
        </div>

        {/* Readiness Score — shown when Claude generated it */}
        {snapshotData.readinessScore !== null && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.65}} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mb-6 flex items-center gap-6">
            <div className="shrink-0 w-20 h-20 rounded-full border-2 border-[#0F6E56] bg-[#0F6E56]/10 flex flex-col items-center justify-center">
              <span className="text-[#0F6E56] text-[26px] font-extrabold leading-none">{snapshotData.readinessScore}</span>
              <span className="text-[#6B7280] text-[10px] mt-0.5">/ 100</span>
            </div>
            <div>
              <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-1">AI Readiness Score</p>
              <p className="text-white text-[16px] font-semibold">
                {snapshotData.readinessScore >= 70 ? "Strong foundation for AI adoption" : snapshotData.readinessScore >= 50 ? "Ready to start with targeted AI" : "High opportunity — clear starting points identified"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Executive Summary */}
        {snapshotData.executiveSummary && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.7}} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 mb-6">
            <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-3">Executive Summary</p>
            <p className="text-[#CBD5E1] text-[15px] leading-relaxed">{snapshotData.executiveSummary}</p>
          </motion.div>
        )}

        {/* Opportunities */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.75}}>
          <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-4">Your Top AI Opportunities</p>
          <div className="flex flex-col gap-4 mb-6">
            {opps.slice(0,3).map((o,i)=>(
              <motion.div key={o.rank} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.8+i*0.1}} className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0">
                    <span className="text-white text-[11px] font-bold">0{o.rank}</span>
                  </div>
                  <h3 className="text-white font-bold text-[17px]">{o.title}</h3>
                </div>
                <p className="text-[#6B7280] text-[13px] mb-1"><span className="text-[#9CA3AF] font-medium">Problem: </span>{o.problem}</p>
                <p className="text-[#6B7280] text-[13px] mb-3"><span className="text-[#9CA3AF] font-medium">Solution: </span>{o.solution}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#0F6E56]/10 border border-[#0F6E56]/25 text-[#0F6E56] text-[12px] font-medium px-3 py-1 rounded-full">📈 {o.indicativeROI}</span>
                  <span className="bg-[#1f2937] text-[#6B7280] text-[12px] px-3 py-1 rounded-full">⏱ {o.timeToROI}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended First Step */}
        {snapshotData.recommendedFirstStep && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.05}} className="bg-[#071a14] border border-[#0F6E56]/30 rounded-2xl p-6 mb-6">
            <p className="text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider mb-2">Recommended First Step</p>
            <p className="text-[#CBD5E1] text-[15px] leading-relaxed">{snapshotData.recommendedFirstStep}</p>
          </motion.div>
        )}

        {/* Report sent confirmation */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.1}} className="bg-[#111827] border border-[#1f2937] rounded-xl p-4 flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-[#0F6E56] shrink-0"/>
          <p className="text-[#9CA3AF] text-[14px]">Your full detailed PDF report has been sent to <strong className="text-white">{formData.email}</strong>.</p>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.15}} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/book" onClick={() => trackPostHog('book_session_clicked', {source: 'assessment_summary',industry: formData.industry})} className="flex-1 sm:flex-none sm:min-w-[220px] text-center bg-[#0F6E56] text-white font-semibold py-4 rounded-lg text-[15px] hover:bg-[#0c5945] transition-all px-6">Book Your AI Opportunity Session</Link>
          <Link href="/" className="flex-1 sm:flex-none sm:min-w-[160px] text-center border border-[#1f2937] text-[#9CA3AF] font-medium py-4 rounded-lg text-[15px] hover:border-[#374151] hover:text-white transition-all px-6">Return to Home</Link>
        </motion.div>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}} className="text-center text-[#4B5563] text-[13px] mt-6">
          Questions? Email <a href="mailto:hello@clarivisintelligence.com" className="text-[#6B7280] hover:text-[#0F6E56] transition-colors">hello@clarivisintelligence.com</a>
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─── Main ── */
export default function AssessmentClient() {
  const [phase,setPhase] = useState<Phase>(1);
  const [timeSelected,setTimeSelected] = useState<TimeOption>(null);
  const [maxTurns,setMaxTurns] = useState(14);
  const [formData,setFormData] = useState<FormData>(INIT);
  const [messages,setMessages] = useState<Message[]>([]);
  const [snapshotData,setSnapshotData] = useState<SnapshotData>({opportunities:[],readinessScore:null,executiveSummary:null,recommendedFirstStep:null});
  // assessmentId is returned by assessment-notify on early capture and threaded through to generate-pdf and log-conversation
  const [assessmentId,setAssessmentId] = useState<string|null>(null);
  const [logData,setLogData] = useState<Record<string,string>>({model:"claude-sonnet-4-20250514",systemPromptVersion:"1.0"});

  const currentScreenRef = useRef("Phase 1: Welcome");

  const PHASE_LABELS: Partial<Record<Phase,string>> = {
    1:"Phase 1: Welcome",
    2:"Phase 2: Time Selection",
    3:"Phase 3: Contact Details",
    5:"Phase 5: AI Chat",
    6:"Phase 6: Generating Report",
    7:"Phase 7: Complete",
  };
  useEffect(()=>{
    const label = PHASE_LABELS[phase];
    if(label){
      currentScreenRef.current = label;
      trackEvent(`p${phase}_entered`,{phase,screenDetail:label});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[phase]);

  useEffect(()=>{
    return setupDropoffTracking(()=>currentScreenRef.current);
  },[]);

  const updateForm = (key:keyof FormData,val:string|string[])=>setFormData(d=>({...d,[key]:val}));

  const fireEarlyCapture = async()=>{
    try {
      const res = await fetch("/api/assessment-notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:formData.name,email:formData.email,phone:formData.phone,timeSelected})});
      const data = await res.json();
      // Thread the assessmentId through so generate-pdf and log-conversation can link records
      if(data.assessmentId) setAssessmentId(data.assessmentId);
    } catch {}
  };

  const handleTimeSelect = (t:TimeOption)=>{setTimeSelected(t);setMaxTurns(getMaxTurns(t));};

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0f1a] overflow-y-auto flex flex-col">
      <TopBar/>
      <AnimatePresence mode="wait">
        {phase===1&&<Phase1 key="p1" onStart={()=>{trackPostHog('assessment_started', { source: 'entry_screen' });trackEvent("p1_start_clicked",{phase:1,screenDetail:"Phase 1: Welcome"});setPhase(2);}}/>}
        {phase===2&&<Phase2 key="p2" timeSelected={timeSelected} onSelect={handleTimeSelect} onContinue={()=>{trackEvent("p2_time_selected",{phase:2,screenDetail:"Phase 2: Time Selection",timeValue:timeSelected});trackPostHog('time_selected', { minutes: timeSelected });setPhase(3);}}/>}
        {phase===3&&<Phase3 key="p3" formData={formData} onChange={(k,v)=>updateForm(k,v as string)} onContinue={()=>{trackEvent("p3_contact_submitted",{phase:3,screenDetail:"Phase 3: Contact Details",name:formData.name,email:formData.email,phone:formData.phone,timeSelected});identifyPostHog(formData.email, {name: formData.name,email: formData.email,phone: formData.phone,timeSelected: timeSelected,source: 'clarivis_assessment',firstSeen: new Date().toISOString()});trackPostHog('contact_captured', {timeSelected: timeSelected,source: 'assessment'});fireEarlyCapture();setPhase(4);}} onBack={()=>setPhase(2)}/>}
        {phase===4&&<Phase4 key="p4" timeSelected={timeSelected} formData={formData} onChange={updateForm} onComplete={()=>setPhase(5)} onBack={()=>setPhase(3)} onScreenChange={(label)=>{currentScreenRef.current=label;}}/>}
        {phase===5&&<Phase5 key="p5" formData={formData} timeSelected={timeSelected} maxTurns={maxTurns} messages={messages} setMessages={setMessages} onComplete={()=>{trackEvent("p5_chat_ended",{phase:5,screenDetail:"Phase 5: AI Chat — Max Turns",chatTurns:Math.floor(messages.length/2),timeSelected});setPhase(6);}} onLogData={(d)=>setLogData(d)}/>}
        {phase===6&&<Phase6 key="p6" formData={formData} messages={messages} timeSelected={timeSelected} setSnapshotData={setSnapshotData} onComplete={()=>setPhase(7)} logData={logData} assessmentId={assessmentId}/>}
        {phase===7&&<Phase7 key="p7" formData={formData} snapshotData={snapshotData}/>}
      </AnimatePresence>
    </div>
  );
}
