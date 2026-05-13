import RealEstateSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Real Estate Developers and Brokers in India",
  description:
    "AI systems for real estate developers, brokers, and property managers in India. Lead qualification, broker portals, collections automation, and sales dashboards. ROI within 90 days.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/real-estate" },
};

export default function Page() {
  return <RealEstateSolutionsContent />;
}
