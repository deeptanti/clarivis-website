import HowItWorksContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works: AI Consulting Process in 4 Stages",
  description:
    "Clarivis Intelligence delivers AI systems through a four-stage process: free Assessment, Operational Audit, AI Product Build, and monthly AI Growth Plan. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/how-it-works" },
};

export default function Page() {
  return <HowItWorksContent />;
}
