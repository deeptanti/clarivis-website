import BookPageContent from "./page-client";

export const metadata = {
  title: 'Book a Free AI Opportunity Session: 45 Minutes with Our Founder',
  description: 'Book a free 45-minute AI Opportunity Session with Clarivis Intelligence. Speak directly with our founder and walk away with a clear, prioritised picture of where AI can generate ROI in your business within 90 days.',
  alternates: { canonical: 'https://clarivisintelligence.com/book' },
};

export default function Page() {
  return <BookPageContent />;
}
