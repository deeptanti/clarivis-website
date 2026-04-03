import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Clarivis Intelligence. How we collect, use, and protect your data.",
};

const sections = [
  {
    title: "1. Introduction",
    content:
      "Clarivis Intelligence Private Limited ('Clarivis Intelligence', 'we', 'our', or 'us') is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website clarivisintelligence.com or engage with our services. Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We collect information you provide directly to us, including when you complete our AI Readiness Assessment, submit a contact form, or communicate with us by email or phone. This may include your name, company name, email address, phone number, industry, and details about your business operations.\n\nWe also collect information automatically when you visit our website, including usage data, pages visited, time spent on pages, and device information. This is collected through Google Analytics and Microsoft Clarity, which may include session recordings and heatmap data showing how you interact with our pages.",
  },
  {
    title: "3. How We Use Your Information",
    content:
      "We use the information we collect to provide and improve our services, respond to your enquiries, send you our AI Opportunity Snapshot report following your assessment, communicate with you about our services, analyse website usage to improve user experience, and comply with legal obligations.",
  },
  {
    title: "4. Microsoft Clarity and Session Recording",
    content:
      "We use Microsoft Clarity to better understand how users interact with our website. This service captures anonymised session recordings and heatmap data. Microsoft may use this data in accordance with their own privacy policy. No personally identifiable information is captured in session recordings. You can opt out by declining cookies in our cookie banner.",
  },
  {
    title: "5. Google Analytics",
    content:
      "We use Google Analytics to understand traffic patterns and user behaviour on our website. Google Analytics collects anonymised data including pages visited, session duration, and geographic location at a country level. You can opt out of Google Analytics tracking by declining cookies in our cookie banner or by installing the Google Analytics opt-out browser add-on.",
  },
  {
    title: "6. Data Sharing",
    content:
      "We do not sell your personal information. We do not share your information with third parties except as necessary to provide our services, comply with legal obligations, or with your explicit consent. Our analytics providers Google and Microsoft process data in accordance with their respective privacy policies.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain personal information you provide through contact forms and assessments for as long as necessary to respond to your enquiry and for a period of up to two years thereafter for business records. Analytics data is retained according to the default retention periods of Google Analytics and Microsoft Clarity.",
  },
  {
    title: "8. Your Rights",
    content:
      "You have the right to access, correct, or delete your personal information held by us. You may also withdraw consent for analytics tracking by declining cookies. To exercise these rights, contact us at hello@clarivisintelligence.com.",
  },
  {
    title: "9. Security",
    content:
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission is completely secure and we cannot guarantee absolute security.",
  },
  {
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Your continued use of our website after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "11. Contact Us",
    content:
      "If you have questions about this Privacy Policy or our data practices, please contact us at hello@clarivisintelligence.com or write to us at Clarivis Intelligence Private Limited, Rajkot, Gujarat, India.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="mx-auto max-w-[800px] px-6 pt-[120px] pb-[80px]">
        {/* Breadcrumb */}
        <p className="text-[#6B7280] text-[13px] mb-6">
          <Link href="/" className="hover:text-[#0F6E56] transition-colors">Home</Link>
          {" / "}
          <span className="text-[#9CA3AF]">Privacy Policy</span>
        </p>

        {/* Headline */}
        <h1 className="text-white text-[42px] font-extrabold tracking-tight mb-2">
          Privacy Policy
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
            This Privacy Policy was prepared for general informational purposes. We recommend consulting a qualified legal professional to ensure full compliance with applicable laws.
          </p>
        </div>
      </div>
    </div>
  );
}
