import AgribusinessSolutionsContent from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Solutions for Agribusiness Operators in India",
  description:
    "AI systems for managed farmland operators, input suppliers, and agro-investment firms in India. Workforce management, investor CRM, lead access control, and operations dashboards.",
  alternates: { canonical: "https://clarivisintelligence.com/solutions/agribusiness" },
};

export default function Page() {
  return <AgribusinessSolutionsContent />;
}
