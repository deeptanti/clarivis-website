import Link from "next/link";

interface AssessmentCTAProps {
  heading?: string;
  subtext?: string;
}

export default function AssessmentCTA({
  heading = "Ready to see what AI can do for your business?",
  subtext = "The Clarivis Assessment is free, takes 5 to 20 minutes, and ends with a personalised AI Opportunity Snapshot. No credit card, no commitment.",
}: AssessmentCTAProps) {
  return (
    <div className="mt-12 rounded-[16px] border border-[#0F6E56]/30 bg-[#0F6E56]/10 p-8 text-center">
      <h3 className="text-white text-[22px] font-bold mb-3">{heading}</h3>
      <p className="text-[#9CA3AF] text-[15px] mb-6 max-w-[480px] mx-auto leading-relaxed">{subtext}</p>
      <Link
        href="/assessment"
        className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0c5945] text-white px-7 py-3 rounded-md font-medium text-sm transition-colors"
      >
        Start the Clarivis Assessment
      </Link>
    </div>
  );
}
