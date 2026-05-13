"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ContentSummary } from "@/types/content";

const VERTICAL_LABELS: Record<string, string> = {
  "real-estate": "Real Estate",
  "healthcare": "Healthcare",
  "agribusiness": "Agribusiness",
};

const TYPE_LABELS: Record<string, string> = {
  guide: "Guide",
  article: "Article",
  glossary: "Glossary",
  faq: "FAQ",
};

const HUBS = [
  {
    label: "Real Estate",
    href: "/solutions/real-estate",
    desc: "AI for developers, brokers, and property managers",
  },
  {
    label: "Healthcare",
    href: "/solutions/healthcare",
    desc: "AI for clinics, diagnostic labs, and hospitals",
  },
  {
    label: "Agribusiness",
    href: "/solutions/agribusiness",
    desc: "AI for farmland operators, input suppliers, and traders",
  },
];

function contentHref(item: ContentSummary): string {
  if (item.content_type === "guide") return `/insights/guides/${item.vertical}/${item.slug}`;
  if (item.content_type === "glossary") return `/insights/glossary/${item.slug}`;
  if (item.content_type === "faq") return `/insights/faq/${item.vertical}/${item.slug}`;
  return `/insights/${item.vertical}/${item.slug}`;
}

interface Props {
  recent: ContentSummary[];
}

export default function InsightsContent({ recent }: Props) {
  return (
    <main className="w-full bg-[#0d1117] min-h-screen">
      {/* Hero */}
      <section className="relative w-full pt-[120px] pb-[80px] bg-[#1A1A2E]">
        <div className="container mx-auto px-6 max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15"
          >
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              INSIGHTS
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white text-[36px] lg:text-[52px] font-extrabold leading-[1.1] tracking-tight"
          >
            AI for Indian business. Practical, vertical-specific, and real.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#9CA3AF] text-[18px] leading-[1.8] mt-4 max-w-[580px] mx-auto"
          >
            Guides, glossary, and analysis covering real estate, healthcare, and
            agribusiness. Written for the Indian business owner, not the Silicon Valley
            engineer.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-[1100px] py-[60px]">
        {/* Vertical solution hubs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {HUBS.map((hub, i) => (
            <motion.div
              key={hub.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={hub.href}
                className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-7 transition-all duration-200 hover:-translate-y-0.5 h-full"
              >
                <h2 className="text-white text-[20px] font-bold mb-2">{hub.label}</h2>
                <p className="text-[#6B7280] text-[14px]">{hub.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent content grid */}
        {recent.length > 0 ? (
          <>
            <h2 className="text-white text-[22px] font-bold mb-6">Latest</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <Link
                    href={contentHref(item)}
                    className="block bg-[#111827] border border-[#1f2937] hover:border-[#0F6E56]/60 rounded-[16px] p-6 h-full transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex gap-2 mb-3">
                      {item.vertical && (
                        <span className="text-[#0F6E56] text-[11px] font-semibold uppercase tracking-wider">
                          {VERTICAL_LABELS[item.vertical]}
                        </span>
                      )}
                      <span className="text-[#4B5563] text-[11px] uppercase tracking-wider">
                        {TYPE_LABELS[item.content_type]}
                      </span>
                    </div>
                    <h3 className="text-white text-[16px] font-bold mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[#6B7280] text-[13px] leading-[1.6] line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-[#4B5563] text-[16px]">
            Content launching soon. Check back next week.
          </div>
        )}
      </div>
    </main>
  );
}
