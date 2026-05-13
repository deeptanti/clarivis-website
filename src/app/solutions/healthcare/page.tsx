import HealthcareSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Clinics, Diagnostic Labs and Hospitals in India",
  description:
    "AI systems for multispecialty clinics, diagnostic labs, and hospitals in India. Patient appointment automation, billing, clinical dashboards, and report delivery. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/healthcare" },
};

export default function Page() {
  return <HealthcareSolutionsContent />;
}
