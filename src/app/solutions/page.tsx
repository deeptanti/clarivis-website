import SolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Real Estate, Healthcare and Agribusiness",
  description:
    "Purpose-built AI systems for real estate developers, healthcare clinics, and agribusiness operators. 15 AI products across 3 verticals, deployed in 4-6 weeks with ROI tracked from day one.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions" },
};

export default function Page() {
  return <SolutionsContent />;
}
