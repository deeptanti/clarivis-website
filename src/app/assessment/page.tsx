import AssessmentClient from "./page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Free AI Readiness Assessment — Get Your AI Opportunity Snapshot',
  description: 'Take the free Clarivis AI Readiness Assessment. Answer a few questions, have a conversation with our AI, and receive a personalised AI Opportunity Snapshot PDF identifying your top opportunities with indicative ROI. Takes 5 to 20 minutes.',
  alternates: { canonical: 'https://clarivisintelligence.com/assessment' },
};

export default function Page() {
  return (
    <>
      {/* Server-rendered content for search engine indexing */}
      <div className="sr-only">
        <h1>Free AI Readiness Assessment for Your Business</h1>
        <p>
          The Clarivis AI Readiness Assessment is a free, personalised tool for
          business owners in real estate, healthcare, and agribusiness. Complete a
          short intake form, have a guided conversation with our AI, and receive a
          detailed AI Opportunity Snapshot PDF delivered to your inbox. The report
          identifies your top three AI opportunities with indicative ROI and a
          recommended first step. Takes 5 to 20 minutes. No credit card required.
        </p>
        <ul>
          <li>Completely free — no commitment required</li>
          <li>Personalised to your industry and business size</li>
          <li>AI Opportunity Snapshot PDF delivered instantly to your email</li>
          <li>Identifies your top three AI opportunities with ROI estimates</li>
          <li>Available for real estate, healthcare, and agribusiness</li>
        </ul>
      </div>
      <AssessmentClient />
    </>
  );
}
