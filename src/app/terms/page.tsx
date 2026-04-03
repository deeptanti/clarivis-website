import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for Clarivis Intelligence website and services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the Clarivis Intelligence website at clarivisintelligence.com, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.",
  },
  {
    title: "2. Use of the Website",
    content:
      "You may use our website for lawful purposes only. You agree not to use our website in any way that violates applicable laws or regulations, to transmit any unsolicited or unauthorised advertising, to attempt to gain unauthorised access to any part of our website or systems, or to engage in any conduct that restricts or inhibits use of the website by others.",
  },
  {
    title: "3. AI Readiness Assessment",
    content:
      "Our free AI Readiness Assessment is provided for informational purposes. The AI Opportunity Snapshot report generated from your assessment represents our analysis based on information you provide and should not be construed as a guarantee of specific business outcomes. Actual results will vary based on implementation, your business conditions, and other factors.",
  },
  {
    title: "4. Intellectual Property",
    content:
      "All content on this website including text, graphics, logos, and software is the property of Clarivis Intelligence Private Limited and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
  },
  {
    title: "5. Disclaimer of Warranties",
    content:
      "Our website and its content are provided on an as-is basis without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.",
  },
  {
    title: "6. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, Clarivis Intelligence Private Limited shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.",
  },
  {
    title: "7. Third Party Links",
    content:
      "Our website may contain links to third party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them.",
  },
  {
    title: "8. Governing Law",
    content:
      "These Terms of Use are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Rajkot, Gujarat, India.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.",
  },
  {
    title: "10. Contact",
    content:
      "For questions about these Terms of Use, contact us at hello@clarivisintelligence.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-[800px] px-6 pt-[120px] pb-[80px]">
        {/* Breadcrumb */}
        <p className="text-[#6B7280] text-[13px] mb-6">
          <Link href="/" className="hover:text-[#0F6E56] transition-colors">Home</Link>
          {" / "}
          <span className="text-[#9CA3AF]">Terms of Use</span>
        </p>

        {/* Headline */}
        <h1 className="text-white text-[42px] font-extrabold tracking-tight mb-2">
          Terms of Use
        </h1>
        <p className="text-[#6B7280] text-[15px] mb-8">Last updated: April 2026</p>

        {/* Teal Divider */}
        <div className="h-px w-full bg-[#0F6E56]/40 mb-12" />

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-white text-[20px] font-bold mb-3">{section.title}</h2>
              {section.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-[#9CA3AF] text-[16px] leading-[1.8] mb-3">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Legal disclaimer */}
        <div className="mt-16 pt-8 border-t border-[#1f2937]">
          <p className="text-[#4B5563] text-[13px] italic leading-relaxed">
            This Terms of Use document was prepared for general informational purposes. We recommend consulting a qualified legal professional to ensure full compliance with applicable laws.
          </p>
        </div>
      </div>
    </div>
  );
}
