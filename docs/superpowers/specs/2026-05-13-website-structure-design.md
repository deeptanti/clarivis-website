# Website Structure Design
**Date:** 2026-05-13
**Author:** Deep Tanti + Claude
**Status:** Approved for implementation

---

## 1. Goals

**Primary:** Conversion clarity. Every page exists to build enough confidence for the visitor to start the Clarivis Assessment.

**Secondary:** SEO authority. Build topical authority across three verticals (real estate, healthcare, agribusiness) through structured, tiered content that Google treats as genuinely helpful, not a content farm.

**Primary conversion action:** Start the Clarivis Assessment (`/assessment`).

---

## 2. Navigation Structure

```
Home  |  How It Works  |  Solutions  |  About  |  [Start Assessment →]
```

Five items. The Assessment is a styled CTA button in the nav, not a text link. Nothing else competes for click attention. No Contact, no Book, no Services, no Products in the top nav.

---

## 3. Core Page Map

### Pages That Stay (modified)

| URL | Purpose | Key Changes |
|---|---|---|
| `/` | Homepage | Sections: Hero → Problem → Process teaser (4 stages) → Verticals (as context, not nav) → Products preview (tabbed) → Final CTA. No structural change, copy may tighten. |
| `/about` | Founder story, methodology, credentials | No structural change |
| `/assessment` | AI Readiness Assessment product | No structural change. This is the conversion destination for all CTAs. |
| `/privacy` | Privacy policy | No change |
| `/terms` | Terms of use | No change |

### Pages Being Created

| URL | Purpose | What It Contains |
|---|---|---|
| `/how-it-works` | Full 4-stage process explanation | Stage 1 (Assessment, free), Stage 2 (Paid Audit — includes the founding offer currently on `/audit`), Stage 3 (AI Product Build), Stage 4 (AI Growth Plan/Retainer). Each stage: what happens, what you get, how long it takes, what it costs. CTA after each stage to start the Assessment. |
| `/solutions` | Single hub replacing both `/services` and `/products` | Vertical tab switcher (Real Estate, Healthcare, Agribusiness). Each tab: vertical pain points, relevant AI products with features, outcomes, CTA to Assessment. |

### Vertical Sub-Pages (SEO, not in nav)

| URL | Purpose |
|---|---|
| `/solutions/real-estate` | Deep real estate vertical page. Linked from `/solutions` tab and from `/insights/real-estate/*` content. |
| `/solutions/healthcare` | Deep healthcare vertical page. |
| `/solutions/agribusiness` | Deep agribusiness vertical page. |

These replace `/services/real-estate`, `/services/healthcare`, `/services/agribusiness`.

### Pages Being Retired

| URL | What Happens to Its Content |
|---|---|
| `/services` | Content absorbed into `/solutions` and `/how-it-works` |
| `/products` | Content absorbed into `/solutions` |
| `/audit` | Founding offer callout moves inside `/how-it-works` Stage 2 section |
| `/book` | Merged into `/contact`. Calendly link remains accessible from footer and assessment flow. |
| `/contact` | Demoted to footer. Not in primary nav. |

### Footer Link Groups

```
Company          Process              Solutions            Insights
About            How It Works         Real Estate          Guides
Contact          Start Assessment     Healthcare           Case Studies
Privacy Policy   Book a Call*         Agribusiness         Glossary
Terms of Use                                               FAQ

* "Book a Call" in footer links directly to the Calendly URL, not an internal page.
```

---

## 4. URL Redirects Required

All old URLs must 301 redirect to preserve any existing SEO equity.

| Old URL | Redirects To |
|---|---|
| `/services` | `/solutions` |
| `/services/real-estate` | `/solutions/real-estate` |
| `/services/healthcare` | `/solutions/healthcare` |
| `/services/agribusiness` | `/solutions/agribusiness` |
| `/products` | `/solutions` |
| `/audit` | `/how-it-works` |
| `/book` | `/contact` |

---

## 5. SEO Content Architecture

### Principle

Topical authority through a pillar-cluster model. Each vertical solution page (`/solutions/[vertical]`) is the pillar. All content pieces link up to their pillar. The pillar links back down to supporting content. Every content piece ends with an Assessment CTA.

### Content Hub URL Structure

```
/insights                                    ← Hub listing all content
  /insights/guides/                          ← Long-form cornerstone guides
    /insights/guides/real-estate/[slug]
    /insights/guides/healthcare/[slug]
    /insights/guides/agribusiness/[slug]
  /insights/real-estate/[slug]               ← Supporting articles
  /insights/healthcare/[slug]
  /insights/agribusiness/[slug]
  /insights/glossary/[term]                  ← AI/automation term definitions
  /insights/compare/[slug]                   ← Tool and approach comparisons
  /insights/case-studies/[slug]              ← Client results
  /insights/faq/[vertical]/[slug]            ← FAQ clusters
  /insights/real-estate/cities/[city]        ← City/region pages (Month 3)
  /insights/healthcare/cities/[city]
  /insights/agribusiness/cities/[city]
```

### Internal Linking Rules (Non-Negotiable)

Every content piece must link to:
1. Its vertical solution page (`/solutions/[vertical]`)
2. One related glossary term
3. The Assessment (`/assessment`)

The Assessment must never be more than two clicks from any content page.

---

## 6. Tiered Content Strategy (30-Day Launch Plan)

### Why Tiered

Google's Helpful Content system penalises domains where a significant portion of content is thin or generic — at the domain level, not just the page level. Publishing 300 pieces uniformly risks dragging the whole domain down if quality is inconsistent. A tiered structure ensures the highest-authority pages are established first and act as quality anchors.

### Tier 1: Cornerstone Guides (Week 1, 9 total)

3 guides per vertical. Publish these first before any other content. 2000+ words each. These become the internal linking hubs for all Tier 2 and 3 content.

**Format:** Comprehensive, opinionated guides targeting high-volume, medium-competition keywords. Must include India-specific data, real operational examples, and vertical-specific context that a generic AI content farm cannot produce.

**Real Estate examples:**
- "Complete Guide to AI Lead Management for Real Estate Developers in India (2026)"
- "How to Automate Channel Partner Management: The Developer's Guide"
- "AI for RERA Compliance: What Real Estate Developers Need to Know"

**Healthcare examples:**
- "Complete Guide to AI for Multispecialty Clinics in India"
- "How to Eliminate No-Shows with Automated Appointment Management"
- "AI Revenue Cycle Automation for Diagnostic Labs: A Practical Guide"

**Agribusiness examples:**
- "Managing 200+ Field Staff Without HR Infrastructure: A Complete Guide"
- "Investor Pipeline Management for Managed Farmland Operators"
- "How to Stop Lead Data Leaks in Agro-Investment Businesses"

### Tier 2: Supporting Articles (Weeks 2-4, ~180 total, 4/day)

800-1200 words each. Problem-specific, targeting long-tail keywords with buyer intent. Must contain at least one India-specific or vertical-specific data point or example that cannot be fabricated by a generic model — this is the quality gate.

**Content brief format for each piece:**
- Target keyword (exact phrase)
- Vertical and buyer profile
- 3 pain points to address
- 1 Tier 1 cornerstone to link to
- 1 glossary term to link to
- Word count (800-1200)

**Cadence:** Rotate verticals daily. Day 1 = Real Estate, Day 2 = Healthcare, Day 3 = Agribusiness, repeat.

### Tier 3: Glossary and FAQ (Weeks 2-4, ~80 total, 4/day alongside Tier 2)

600-800 words each. AI and automation terms explained for non-technical Indian business owners. Near-zero competition. High internal linking value.

**Glossary target terms (examples):**
- `ai-lead-qualifier`
- `revenue-cycle-automation`
- `whatsapp-business-automation`
- `ai-voice-agent`
- `workflow-automation-india`
- `payment-collections-automation`
- `channel-partner-portal`
- `field-staff-management-software`

**FAQ clusters:** 10 FAQ pieces per vertical. Format: "What does X cost in India?", "How long does X take to implement?", "Does X work for small clinics/developers/farms?" Targets zero-click and featured snippet positions.

### Tier 4: Comparison Pages (Month 2, 20 total)

High-intent late-stage traffic. Targets buyers comparing tools or approaches. Positions Clarivis as the implementation partner who deploys the right stack, not a tool vendor.

**Examples:**
- "n8n vs Make for Real Estate Automation in India"
- "Vapi vs Retell AI for Patient Appointment Calling"
- "WhatsApp vs Voice for Payment Collections Follow-up"
- "Custom AI Build vs Off-the-Shelf CRM: What Real Estate Developers Should Know"

### Tier 5: City and Region Pages (Month 3, 30 total)

10 target cities × 3 verticals. Captures local search intent with no competition. Each page: city-specific market context + same pain points and products + Assessment CTA.

**Priority cities:** Rajkot, Ahmedabad, Surat, Vadodara, Pune, Mumbai, Bangalore, Hyderabad, Delhi, Chennai.

**URL pattern:** `/insights/[vertical]/cities/[city-slug]` e.g. `/insights/real-estate/cities/rajkot` — the `/cities/` segment prevents collision with regular article slugs.

### 30-Day Content Volume Summary

| Week | Content Type | Daily Volume | Weekly Total |
|---|---|---|---|
| Week 1 | Cornerstone guides only | 1-2/day | 9 cornerstones |
| Week 2 | Articles (4) + Glossary/FAQ (4) | 8/day (scaling to 10) | ~56 pieces |
| Week 3 | Articles (5) + Glossary/FAQ (5) | 10/day | ~70 pieces |
| Week 4 | Articles (5) + Glossary/FAQ (5) | 10/day | ~70 pieces |
| **Total** | | | **~205 pieces** |

Note: 205 pieces in 30 days is more realistic than 300 given the quality gate requirement. Tier 4 and 5 extend into months 2-3 to reach 300+ total.

### Crawl Budget Management

New and growing domains have limited crawl budget. Tactics to maximise indexing speed:
- Submit XML sitemap to Google Search Console daily during ramp-up
- Use Search Console URL inspection to manually request indexing for Tier 1 cornerstones on publication day
- Internal linking from the `/insights` hub page to all new pieces ensures Googlebot discovers them
- Avoid publishing more than 10 new pieces per day during the first two weeks to avoid triggering spam signals

---

## 7. Quality Gate (Non-Negotiable)

Every content piece published under Clarivis Intelligence must pass this check before going live:

**Does it contain at least one of the following?**
- A specific India market reference (pricing in INR, regulatory context like RERA/GST/MCA, regional business culture)
- A specific operational detail from a real vertical (how a 200-person field team operates, how RERA demand letters work, how multispecialty clinics handle no-shows)
- A named tool, stack, or workflow that Clarivis actually uses or recommends

If a piece contains none of these, it is generic AI content and should not be published. Rewrite with specific context or discard.

---

## 8. What Is Not Being Built Now

The following are known future additions, not in scope for this implementation:

- Case studies page (publish when Hebbevu audit is complete and client approves)
- City/region pages (Month 3)
- Comparison pages (Month 2)
- A CMS or headless content management system (content can be hand-coded as MDX or a simple Supabase-backed content model — decide at build time)
- Results/social proof section on homepage (add when 2-3 case studies exist)

---

## 9. Implementation Sequence

1. Set up 301 redirects for all retired URLs (do first, before any page changes go live)
2. Build `/how-it-works` page
3. Build `/solutions` with vertical tab switcher
4. Build `/solutions/real-estate`, `/solutions/healthcare`, `/solutions/agribusiness` (replaces old service sub-pages)
5. Update nav (remove old items, add CTA button)
6. Update footer with new link groups
7. Remove `/audit`, `/book`, `/products`, `/services` from codebase
8. Build `/insights` hub and content infrastructure
9. Publish 9 cornerstone guides (Week 1)
10. Begin 10/day content cadence (Weeks 2-4)
