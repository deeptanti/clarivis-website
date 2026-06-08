import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AssessmentCTA from "./AssessmentCTA";
import type { ContentRow, ContentSummary } from "@/types/content";

const VERTICAL_LABELS: Record<string, string> = {
  "real-estate": "Real Estate",
  "healthcare": "Healthcare",
  "agribusiness": "Agribusiness",
};

interface ArticleLayoutProps {
  content: ContentRow;
  glossaryTerm?: ContentSummary | null;
  verticalSlug?: string;
}

export default function ArticleLayout({ content, glossaryTerm, verticalSlug }: ArticleLayoutProps) {
  const effectiveVertical = verticalSlug ?? content.vertical ?? content.pillar_vertical;
  const pillarHref = effectiveVertical
    ? `/${effectiveVertical}`
    : "/";
  const pillarLabel = effectiveVertical
    ? `AI Solutions for ${VERTICAL_LABELS[effectiveVertical] ?? effectiveVertical}`
    : "AI Solutions";
  const insightsHref = effectiveVertical ? `/${effectiveVertical}/insights` : "/";
  const glossaryHref = (slug: string) =>
    effectiveVertical
      ? `/${effectiveVertical}/insights/glossary/${slug}`
      : `/insights/glossary/${slug}`;

  return (
    <article className="w-full max-w-[760px] mx-auto px-6 py-[80px]">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[#6B7280] text-[13px] mb-8">
        <Link href={insightsHref} className="hover:text-[#0F6E56] transition-colors">
          Insights
        </Link>
        {content.vertical && (
          <>
            <span>/</span>
            <span className="capitalize">{VERTICAL_LABELS[content.vertical]}</span>
          </>
        )}
        <span>/</span>
        <span className="text-[#4B5563] truncate max-w-[240px]">{content.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        {content.vertical && (
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[#0F6E56]/30 bg-[#0F6E56]/15">
            <span className="text-[#0F6E56] text-xs font-semibold uppercase tracking-widest">
              {VERTICAL_LABELS[content.vertical]}
            </span>
          </div>
        )}
        <h1 className="text-white text-[32px] lg:text-[44px] font-extrabold leading-[1.15] tracking-tight mb-4">
          {content.title}
        </h1>
        <p className="text-[#9CA3AF] text-[18px] leading-[1.8]">{content.description}</p>
        {content.published_at && (
          <p className="text-[#4B5563] text-[13px] mt-4">
            {new Date(content.published_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
          <div
            className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          >
            DT
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold">Deep Tanti</p>
            <p className="text-[#6B7280] text-[12px]">
              Founder, Clarivis Intelligence. AI and cloud engineer with experience
              building ML systems for a 150,000-user healthtech platform.
              M.Sc Analytics, Harrisburg University.
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="prose prose-invert prose-p:text-[#CBD5E1] prose-headings:text-white prose-a:text-[#0F6E56] prose-strong:text-white prose-li:text-[#CBD5E1] prose-lead:text-[#9CA3AF] max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body}</ReactMarkdown>
      </div>

      {/* Internal links */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-5">
        <Link
          href={pillarHref}
          className="text-[#0F6E56] text-[14px] font-medium hover:opacity-75 transition-opacity"
        >
          → {pillarLabel}
        </Link>
        {glossaryTerm && (
          <Link
            href={glossaryHref(glossaryTerm.slug)}
            className="text-[#0F6E56] text-[14px] font-medium hover:opacity-75 transition-opacity"
          >
            → {glossaryTerm.title}
          </Link>
        )}
      </div>

      {/* Assessment CTA */}
      <AssessmentCTA />
    </article>
  );
}
