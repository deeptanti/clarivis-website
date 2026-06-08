import HowItWorksContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Consulting Process: 4 Stages to ROI",
  description:
    "Free Assessment to measurable ROI in 90 days. Clarivis Intelligence delivers AI systems through four stages: Assessment, Operational Audit, AI Product Build, and AI Growth Plan.",
  alternates: { canonical: "https://clarivisintelligence.com/how-it-works" },
};

export default function Page() {
  return <HowItWorksContent />;
}
