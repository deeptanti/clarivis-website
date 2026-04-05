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
const INIT: FormData = { name:"", email:"", phone:"", industry:"", company:"", teamSize:"", mainChallenge:"", tools:[], aiExperience:"", successDefinition:"" };

/* ─── Constants ── */
const TEAM_SIZES = ["1 to 10","11 to 30","31 to 50","50 plus"];
const TOOLS_LIST = ["WhatsApp","Excel or Sheets","CRM Software","Accounting Software","ERP System","Custom Software","None"];
const AI_OPTS = ["No, completely new","Yes, with mixed results","Yes, successfully"];
const QUESTIONS: Record<string,string> = { industry:"What industry are you in?", company:"What is your company called?", teamSize:"How many people work in your business?", mainChallenge:"What is your biggest operational challenge right now?", tools:"Which tools does your team currently use?", aiExperience:"Have you tried AI or automation before?", successDefinition:"What would success look like in 90 days?" };

/* ─── Helpers ── */
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
function isContactValid(f:FormData) { return f.name.trim().length>0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) && f.phone.trim().length>0; }
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
const pCls = (a:boolean) => `cursor-pointer px-5 py-3 rounded-xl border text-[15px] font-medium transition-all ${a?"border-[#0F6E56] bg-[#0F6E56]/10 text-white":"border-[#1f2937] bg-[#111827] text-[#9CA3AF] hover:border-[#0F6E56]/40"}`;

function TopBar() {
  return (
    <div className="sticky top-0 z-10 bg-[#0a0f1a] border-b border-[#1f2937] px-6 lg:px-8 py-4 flex items-center justify-between shrink-0">
      <Link href="/"><Image src="/images/logo.png" alt="Clarivis Intelligence" width={140} height={35} priority /></Link>
      <div className="flex items-center gap-3">
        <Link href="/book" className="hidden sm:inline-flex items-center px-4 py-2 rounded-md border border-[#0F6E56] text-[#0F6E56] text-sm font-medium hover:bg-[#0F6E56]/10 transition-all">Book a Call Instead</Link>
        <Link href="/" className="w-9 h-9 rounded-full border border-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all" aria-label="Exit"><X className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function AnimatedCheck({ size=80 }:{size?:number}) {
  return (
    <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:200,damping:18,delay:0.2}}
      className="rounded-full bg-[#0F6E56] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(15,110,86,0.4)]"
      style={{width:size,height:size}}>
      <motion.svg viewBox="0 0 24 24" fill="none" style={{width:size*0.5,height:size*0.5}}>
        <motion.path d="M5 13l4 4L19 7" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.7,delay:0.5,ease:"easeInOut"}} />
      </motion.svg>
    </motion.div>
  );
}

/* ─── Phase 1 ── */
function Phase1({onStart}:{onStart:()=>void}) {
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 py-12">
      <div className="w-full max-w-[800px]">
        <div className="flex justify-center mb-6"><span className="px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15 text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">FREE — NO CREDIT CARD REQUIRED</span></div>
        <h1 className="text-white text-[32px] lg:text-[52px] font-extrabold leading-tight text-center tracking-tight">Start the Clarivis Assessment</h1>
        <p className="text-[#9CA3AF] text-[18px] text-center max-w-[560px] mx-auto mt-4 leading-[1.8]">Answer a few questions. Chat with our AI. Receive your personalised AI Opportunity Snapshot instantly.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1}} onClick={onStart}
            className="relative cursor-pointer rounded-[20px] p-8 lg:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-[12px] hover:border-[#0F6E56]/50 hover:shadow-[0_0_30px_rgba(15,110,86,0.15)] transition-all duration-300 group">
            <span className="absolute top-4 right-4 text-[#0F6E56] text-[11px] font-bold uppercase tracking-wider bg-[#0F6E56]/15 border border-[#0F6E56]/30 px-3 py-1 rounded-full">INSTANT REPORT</span>
            <ClipboardList className="w-12 h-12 text-[#0F6E56] mb-5" />
            <h2 className="text-white text-[24px] font-bold">Clarivis Assessment</h2>
            <p className="text-[#9CA3AF] text-[15px] leading-[1.8] mt-3 mb-6">Answer questions, chat with our AI, and receive a personalised AI Opportunity Snapshot by email.</p>
            <div className="flex flex-col gap-3 mb-8">{["Takes 5 to 20 minutes","AI chat personalised to your business","PDF report emailed instantly"].map((f,i)=>(
              <div key={i} className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#0F6E56] shrink-0"/><span className="text-[#9CA3AF] text-[14px]">{f}</span></div>
            ))}</div>
            <button onClick={onStart} className="w-full bg-[#0F6E56] text-white font-semibold py-3.5 rounded-lg text-[16px] hover:bg-[#0c5945] transition-all">Start the Assessment</button>
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="relative rounded-[20px] p-8 lg:p-10 border border-white/10 bg-white/[0.03] backdrop-blur-[12px] hover:border-[#0F6E56]/30 transition-all duration-300">
            <span className="absolute top-4 right-4 text-[#6B7280] text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">LIVE SESSION</span>
            <Calendar className="w-12 h-12 text-[#0F6E56] mb-5" />
            <h2 className="text-white text-[24px] font-bold">AI Opportunity Session</h2>
            <p className="text-[#9CA3AF] text-[15px] leading-[1.8] mt-3 mb-6">A focused 45-minute conversation with our founder. Walk away with a clear AI roadmap.</p>
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
  const opts = [{val:5 as const,num:"5",label:"Quick Snapshot",desc:"Key opportunities identified fast. 6 to 8 chat exchanges.",rec:false},{val:10 as const,num:"10",label:"Full Assessment",desc:"Complete picture with ROI context. 12 to 14 chat exchanges.",rec:true},{val:20 as const,num:"20",label:"Deep Dive",desc:"Thorough analysis of your full operation. 22 to 25 chat exchanges.",rec:false}];
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
            <input type="tel" value={formData.phone} onChange={e=>onChange("phone",e.target.value)} placeholder="+91 98765 43210" className={iCls} />
            <p className="text-[#4B5563] text-[13px] mt-1.5 pl-1">(We may call to discuss your results)</p>
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

  /* ── Track every step entry (including first) ── */
  useEffect(()=>{
    const sType = getStepType(step,timeSelected);
    const label = sType==="confirm"
      ? "Phase 4: Confirm — Ready to Chat"
      : `Phase 4: Step ${step} — ${QUESTIONS[sType]||sType}`;
    onScreenChange(label);
    trackEvent("p4_step_entered",{phase:4,screenDetail:label,stepNumber:step,stepType:sType,timeSelected});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[step]);

  const goNext = ()=>{ if(stepType==="confirm"){trackEvent("p4_complete",{phase:4,screenDetail:"Phase 4: Confirm — Start AI Chat",timeSelected,industry:formData.industry,company:formData.company});onComplete();return;} if(!valid)return; setDir(1);setStep(s=>s+1); };
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
                <div key={v} onClick={()=>onChange("industry",v)} className={`cursor-pointer rounded-[16px] p-10 border flex flex-col items-center gap-3 min-h-[160px] justify-center transition-all ${formData.industry===v?"border-[#0F6E56]":"border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`} style={{background:formData.industry===v?"rgba(15,110,86,0.08)":""}}>
                  <Icon className="w-10 h-10 text-[#0F6E56]"/><span className="text-white text-[20px] font-bold">{v}</span>
                </div>
              ))}</div>}
              {stepType==="company"&&<input type="text" value={formData.company} onChange={e=>onChange("company",e.target.value)} placeholder="Your company name" autoFocus className={iCls} style={{fontSize:"22px"}}/>}
              {stepType==="teamSize"&&<div className="flex flex-wrap gap-3 justify-center">{TEAM_SIZES.map(s=><button key={s} onClick={()=>onChange("teamSize",s)} className={pCls(formData.teamSize===s)} style={{padding:"14px 28px",fontSize:"16px"}}>{s}</button>)}</div>}
              {stepType==="mainChallenge"&&<div><textarea value={formData.mainChallenge} onChange={e=>onChange("mainChallenge",e.target.value)} placeholder="Describe the problem that costs you the most time or money each week." autoFocus rows={5} className={`${iCls} resize-none leading-relaxed`}/><p className="text-[#4B5563] text-[13px] mt-2 text-right">{formData.mainChallenge.length} chars {formData.mainChallenge.length<20&&"(min 20)"}</p></div>}
              {stepType==="tools"&&<div><div className="flex flex-wrap gap-3 justify-center mb-4">{TOOLS_LIST.map(t=><button key={t} onClick={()=>{const c=formData.tools??[];onChange("tools",c.includes(t)?c.filter(x=>x!==t):[...c,t]);}} className={pCls((formData.tools??[]).includes(t))}>{t}</button>)}</div></div>}
              {stepType==="aiExperience"&&<div className="grid grid-cols-1 gap-4">{AI_OPTS.map(o=><div key={o} onClick={()=>onChange("aiExperience",o)} className={`cursor-pointer rounded-[16px] p-6 border flex items-center gap-4 transition-all ${formData.aiExperience===o?"border-[#0F6E56]":"border-[#1f2937] bg-[#111827] hover:border-[#0F6E56]/40"}`} style={{background:formData.aiExperience===o?"rgba(15,110,86,0.08)":""}}><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.aiExperience===o?"border-[#0F6E56] bg-[#0F6E56]":"border-[#374151]"}`}>{formData.aiExperience===o&&<Check className="w-3 h-3 text-white"/>}</div><span className="text-white text-[17px] font-medium">{o}</span></div>)}</div>}
              {stepType==="successDefinition"&&<textarea value={formData.successDefinition} onChange={e=>onChange("successDefinition",e.target.value)} placeholder="Describe the outcome that would make this worthwhile." autoFocus rows={5} className={`${iCls} resize-none leading-relaxed`}/>}
              {stepType==="confirm"&&<div className="text-center py-8">
                <div className="w-20 h-20 rounded-full border-2 border-[#0F6E56] flex items-center justify-center mx-auto mb-8" style={{background:"rgba(15,110,86,0.1)"}}><Zap className="w-9 h-9 text-[#0F6E56]"/></div>
                <h2 className="text-white text-[28px] font-bold">You are ready.</h2>
                <p className="text-[#9CA3AF] text-[16px] mt-3 max-w-[400px] mx-auto">Click below to start your personalised AI chat. Our AI has been briefed on your business.</p>
                <button onClick={onComplete} className="mt-10 w-full max-w-[400px] mx-auto flex items-center justify-center gap-3 bg-[#0F6E56] text-white font-bold py-4 rounded-xl text-[18px] hover:bg-[#0c5945] transition-all">Start My AI Chat</button>
              </div>}
            </motion.div>
          </AnimatePresence>
          {stepType!=="confirm"&&<div className="flex justify-between items-center mt-10">
            <button onClick={goBack} className="flex items-center gap-2 text-[#9CA3AF] hover:text-white text-[15px] transition-colors"><ArrowLeft className="w-4 h-4"/>Back</button>
            <button onClick={goNext} disabled={!valid} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-[15px] transition-all ${valid?"bg-[#0F6E56] text-white hover:bg-[#0c5945]":"bg-[#0F6E56]/30 text-white/30 cursor-not-allowed"}`}>Continue <ArrowRight className="w-4 h-4"/></button>
          </div>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase 5: Chat ── */
function Phase5({formData,timeSelected,maxTurns,messages,setMessages,onComplete,onLogData}:{formData:FormData;timeSelected:TimeOption;maxTurns:number;messages:Message[];setMessages:React.Dispatch<React.SetStateAction<Message[]>>;onComplete:()=>void;onLogData:(d:{model:string;systemPromptVersion:string})=>void}) {
  const [input,setInput] = useState("");
  const [isTyping,setIsTyping] = useState(false);
  const [showModal,setShowModal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const greetingFired = useRef(false);
  const turnsUsed = messages.filter(m=>m.role==="user").length;
  const turnsRemaining = maxTurns - turnsUsed;
  const disabled = turnsRemaining<=0||isTyping;

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

  useEffect(()=>{ if(messages.length===0&&!greetingFired.current){greetingFired.current=true;callAPI([]);} },[]);

  const handleSend = async()=>{
    if(!input.trim()||disabled) return;
    const msg:Message = {role:"user",content:input.trim()};
    const next = [...messages,msg];
    const turnNum = turnsUsed+1;
    trackEvent("p5_turn_sent",{phase:5,screenDetail:`Phase 5: AI Chat — Turn ${turnNum}`,chatTurns:turnNum,timeSelected});
    setMessages(next); setInput(""); await callAPI(next);
  };

  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Left Panel */}
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((m,i)=>(
            <div key={i} className={`flex gap-3 ${m.role==="user"?"justify-end":"justify-start"}`}>
              {m.role==="assistant"&&<div className="w-7 h-7 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0 mt-1 text-white text-[10px] font-bold">CI</div>}
              <div className={`max-w-[75%] px-4 py-3 rounded-[16px] text-white text-[15px] leading-[1.7] ${m.role==="user"?"rounded-tr-[4px] border border-[#0F6E56]/30":"rounded-tl-[4px] bg-[#111827]"}`}
                style={m.role==="user"?{background:"rgba(15,110,86,0.2)"}:{}}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping&&<div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0 text-white text-[10px] font-bold">CI</div>
            <div className="bg-[#111827] px-4 py-4 rounded-[16px] rounded-tl-[4px] flex gap-1.5 items-center">
              {[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 rounded-full bg-[#0F6E56]" animate={{y:[0,-6,0]}} transition={{duration:0.6,repeat:Infinity,delay:i*0.2}}/>)}
            </div>
          </div>}
          <div ref={endRef}/>
        </div>

        {/* Input area */}
        <div className="border-t border-[#1f2937] p-4 shrink-0">
          <div className="flex gap-3 items-center">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}}
              placeholder={disabled?"Session complete — generating your report...":"Type your message..."}
              disabled={disabled} className="flex-1 bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white text-[16px] placeholder-[#4B5563] focus:outline-none focus:border-[#0F6E56] transition-all disabled:opacity-40"/>
            <button onClick={handleSend} disabled={disabled||!input.trim()} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${!disabled&&input.trim()?"bg-[#0F6E56] hover:bg-[#0c5945]":"bg-[#1f2937] opacity-40"}`}>
              <Send className="w-4 h-4 text-white"/>
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-[#4B5563] text-[12px]">{turnsUsed} of {maxTurns} exchanges used</p>
            {!disabled&&<button onClick={()=>setShowModal(true)} className="text-[#4B5563] text-[12px] hover:text-[#6B7280] transition-colors">End Session Early</button>}
          </div>
        </div>
      </div>

      {/* End session modal */}
      {showModal&&<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
        <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 max-w-[400px] w-full text-center">
          <h3 className="text-white text-[20px] font-bold mb-3">End your session now?</h3>
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
function Phase6({formData,messages,timeSelected,setOpportunities,onComplete,logData}:{formData:FormData;messages:Message[];timeSelected:TimeOption;setOpportunities:(o:Opp[])=>void;onComplete:()=>void;logData:{model:string;systemPromptVersion:string}}) {
  const steps = ["Analysing your conversation","Identifying your top opportunities","Calculating indicative ROI","Preparing your PDF report"];
  useEffect(()=>{
    const t = setTimeout(async()=>{
      try {
        const [pdfRes] = await Promise.all([
          fetch("/api/generate-pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userProfile:formData,conversationHistory:messages,timeSelected})}),
          fetch("/api/log-conversation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userProfile:formData,conversationHistory:messages,model:logData.model,systemPromptVersion:logData.systemPromptVersion,timeSelected,completedAt:new Date().toISOString()})}).catch(()=>{})
        ]);
        const data = await pdfRes.json();
        if(data.opportunities) setOpportunities(data.opportunities);
      } catch {}
      onComplete();
    },4000);
    return ()=>clearTimeout(t);
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
function Phase7({formData,opportunities}:{formData:FormData;opportunities:Opp[]}) {
  const opps = opportunities.length>0?opportunities:getDefaultOpps(formData.industry||"Real Estate");
  const firstName = formData.name.split(" ")[0]||"Your";
  const today = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  return (
    <motion.div variants={phaseV} initial="hidden" animate="show" exit="exit" className="flex flex-col items-center px-6 py-12 min-h-[calc(100vh-73px)]">
      <div className="w-full max-w-[700px]">
        <div className="text-center mb-8">
          <AnimatedCheck size={80}/>
          <motion.h2 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="text-white text-[28px] lg:text-[32px] font-bold mt-6">Your report is ready.</motion.h2>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="text-[#9CA3AF] text-[16px] mt-2">Your AI Opportunity Snapshot PDF has been sent to <strong className="text-white">{formData.email}</strong>. Check your inbox.</motion.p>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.65}} className="mt-4 rounded-xl border border-[#0F6E56]/30 p-4 flex items-center gap-3 justify-center" style={{background:"rgba(15,110,86,0.08)"}}>
            <Mail className="w-5 h-5 text-[#0F6E56] shrink-0"/><span className="text-[#9CA3AF] text-[14px]">Sent to <strong className="text-white">{formData.email}</strong></span>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.7}} className="bg-[#111827] border border-[#1f2937] rounded-[20px] p-8 lg:p-10">
          <div className="flex items-center justify-between mb-4">
            {formData.company&&<span className="text-[#0F6E56] text-[12px] font-bold uppercase tracking-[0.15em]">{formData.company}</span>}
            {formData.industry&&<span className="bg-[#0F6E56]/15 border border-[#0F6E56]/30 text-[#0F6E56] text-[11px] font-semibold px-3 py-1 rounded-full uppercase">{formData.industry}</span>}
          </div>
          <h3 className="text-white text-[20px] lg:text-[22px] font-bold">{firstName}&apos;s AI Opportunity Snapshot</h3>
          <p className="text-[#6B7280] text-[13px] mt-1">Generated {today}</p>
          <div className="h-px w-full my-6" style={{background:"rgba(15,110,86,0.3)"}}/>
          <div className="flex flex-col gap-6">
            {opps.map((o,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.8+i*0.15}} className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center shrink-0 text-white text-[12px] font-bold mt-0.5">0{o.rank}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-white text-[16px] font-bold">{o.title}</span>
                    <span className="text-[#0F6E56] text-[11px] font-semibold bg-[#0F6E56]/10 border border-[#0F6E56]/30 px-2.5 py-0.5 rounded-full">{o.indicativeROI}</span>
                  </div>
                  <p className="text-[#9CA3AF] text-[14px] leading-[1.6]">{o.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="h-px w-full my-6" style={{background:"rgba(15,110,86,0.3)"}}/>
          <p className="text-[#4B5563] text-[13px] italic">This is a summary. Your full detailed PDF report including ROI projections has been sent to your email.</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.1}} className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link href="/book" className="flex-1 sm:flex-none sm:min-w-[220px] text-center bg-[#0F6E56] text-white font-semibold py-4 rounded-lg text-[15px] hover:bg-[#0c5945] transition-all px-6">Book Your AI Opportunity Session</Link>
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
  const [opportunities,setOpportunities] = useState<Opp[]>([]);
  const [logData,setLogData] = useState({model:"claude-sonnet-4-20250514",systemPromptVersion:"1.0"});

  /* ── Tracking ── */
  const currentScreenRef = useRef("Phase 1: Welcome");

  // Track phase transitions (Phase 4 tracks itself via onScreenChange)
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

  // Dropoff tracking — fires on tab close / navigate away / phone screen off
  useEffect(()=>{
    return setupDropoffTracking(()=>currentScreenRef.current);
  },[]);

  const updateForm = (key:keyof FormData,val:string|string[])=>setFormData(d=>({...d,[key]:val}));

  const fireEarlyCapture = ()=>{
    fetch("/api/assessment-notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:formData.name,email:formData.email,phone:formData.phone,timeSelected})}).catch(()=>{});
  };

  const handleTimeSelect = (t:TimeOption)=>{setTimeSelected(t);setMaxTurns(getMaxTurns(t));};

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0f1a] overflow-y-auto flex flex-col">
      <TopBar/>
      <AnimatePresence mode="wait">
        {phase===1&&<Phase1 key="p1" onStart={()=>{trackEvent("p1_start_clicked",{phase:1,screenDetail:"Phase 1: Welcome"});setPhase(2);}}/>}
        {phase===2&&<Phase2 key="p2" timeSelected={timeSelected} onSelect={handleTimeSelect} onContinue={()=>{trackEvent("p2_time_selected",{phase:2,screenDetail:"Phase 2: Time Selection",timeValue:timeSelected});setPhase(3);}}/>}
        {phase===3&&<Phase3 key="p3" formData={formData} onChange={(k,v)=>updateForm(k,v as string)} onContinue={()=>{trackEvent("p3_contact_submitted",{phase:3,screenDetail:"Phase 3: Contact Details",name:formData.name,email:formData.email,phone:formData.phone,timeSelected});fireEarlyCapture();setPhase(4);}} onBack={()=>setPhase(2)}/>}
        {phase===4&&<Phase4 key="p4" timeSelected={timeSelected} formData={formData} onChange={updateForm} onComplete={()=>setPhase(5)} onBack={()=>setPhase(3)} onScreenChange={(label)=>{currentScreenRef.current=label;}}/>}
        {phase===5&&<Phase5 key="p5" formData={formData} timeSelected={timeSelected} maxTurns={maxTurns} messages={messages} setMessages={setMessages} onComplete={()=>{trackEvent("p5_chat_ended",{phase:5,screenDetail:"Phase 5: AI Chat — Max Turns",chatTurns:Math.floor(messages.length/2),timeSelected});setPhase(6);}} onLogData={(d)=>setLogData(d)}/>}
        {phase===6&&<Phase6 key="p6" formData={formData} messages={messages} timeSelected={timeSelected} setOpportunities={setOpportunities} onComplete={()=>setPhase(7)} logData={logData}/>}
        {phase===7&&<Phase7 key="p7" formData={formData} opportunities={opportunities}/>}
      </AnimatePresence>
    </div>
  );
}
