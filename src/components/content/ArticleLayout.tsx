import type { ReactNode } from "react";
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
  embed?: ReactNode;
  showHeader?: boolean;
  read_time?: number | null;
}

export default function ArticleLayout({
  content,
  glossaryTerm,
  verticalSlug,
  embed,
  showHeader = true,
  read_time,
}: ArticleLayoutProps) {
  const effectiveVertical = verticalSlug ?? content.vertical ?? content.pillar_vertical;
  const pillarHref = effectiveVertical ? `/${effectiveVertical}` : "/";
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
        <Link
          href={insightsHref}
          className="hover:opacity-75 transition-opacity"
          style={{ color: 'var(--v-accent)' }}
        >
          Insights
        </Link>
        {content.vertical && (
          <>
            <span>/</span>
            <span className="capitalize">{VERTICAL_LABELS[content.vertical]}</span>
          </>
        )}
        <span>/</span>
        <span className="truncate max-w-[240px]" style={{ color: 'var(--v-muted)' }}>
          {content.title}
        </span>
      </nav>

      {/* Header — only rendered in standalone mode */}
      {showHeader && (
        <header className="mb-10">
          {content.vertical && (
            <div
              className="inline-block mb-4 px-3 py-1 rounded-full"
              style={{
                border: '1px solid color-mix(in srgb, var(--v-accent) 30%, transparent)',
                background: 'color-mix(in srgb, var(--v-accent) 15%, transparent)',
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--v-accent)' }}
              >
                {VERTICAL_LABELS[content.vertical]}
              </span>
            </div>
          )}
          <h1 className="text-white text-[32px] lg:text-[44px] font-extrabold leading-[1.15] tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-[18px] leading-[1.8]" style={{ color: 'var(--v-muted)' }}>
            {content.description}
          </p>
          {content.published_at && (
            <p className="text-[13px] mt-4" style={{ color: 'var(--v-muted)' }}>
              {new Date(content.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {read_time != null && <span> · {read_time} min read</span>}
            </p>
          )}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--v-accent)' }}
            >
              DT
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">Deep Tanti</p>
              <p className="text-[12px]" style={{ color: '#6B7280' }}>
                Founder, Clarivis Intelligence. AI and cloud engineer with experience
                building ML systems for a 150,000-user healthtech platform.
                M.Sc Analytics, Harrisburg University.
              </p>
            </div>
          </div>
        </header>
      )}

      {/* Body */}
      <div className="prose prose-invert prose-p:text-[#CBD5E1] prose-headings:text-white prose-a:text-[#0F6E56] prose-strong:text-white prose-li:text-[#CBD5E1] prose-lead:text-[#9CA3AF] max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body}</ReactMarkdown>
      </div>

      {embed}

      {/* Internal links */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-5">
        <Link
          href={pillarHref}
          className="text-[14px] font-medium hover:opacity-75 transition-opacity"
          style={{ color: 'var(--v-accent)' }}
        >
          → {pillarLabel}
        </Link>
        {glossaryTerm && (
          <Link
            href={glossaryHref(glossaryTerm.slug)}
            className="text-[14px] font-medium hover:opacity-75 transition-opacity"
            style={{ color: 'var(--v-accent)' }}
          >
            → {glossaryTerm.title}
          </Link>
        )}
      </div>

      {/* Assessment CTA — only in standalone mode; guide page provides its own */}
      {showHeader && <AssessmentCTA />}
    </article>
  );
}
