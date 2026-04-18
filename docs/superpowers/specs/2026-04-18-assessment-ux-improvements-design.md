# Assessment UX Improvements — Design Spec
**Date:** 2026-04-18
**Goal:** Increase booking rate (Phase 7 → /book) for both cold and warm visitors
**Approach:** Approach B — Phase 7 overhaul + two upstream friction fixes
**File in scope:** `src/app/assessment/page-client.tsx` only. No API, schema, or route changes.

---

## Context

The Clarivis Assessment is a 7-phase flow (welcome → time selection → intake form → AI chat → contact capture → loading → results). The primary conversion goal is getting users who complete the assessment to book an AI Opportunity Session. This is a pilot with no traffic data yet, so changes are based on first-principles UX analysis.

Three phases have identified issues that directly reduce booking rate:
1. **Phase 7 (Results)** — the booking moment is weak
2. **Phase 1 (Welcome)** — competing CTA creates an escape route before the user starts
3. **Phase 5 (Chat)** — countdown framing produces thin conversations, weakening the report

---

## Change 1: Phase 7 Results Page Overhaul

### 1a. Personalised booking CTA copy
**Current:** Button reads "Book Your AI Opportunity Session" for every user.
**Change:** Button reads `"Book a Session — Let's Start with ${opps[0].title}"` using the top opportunity title surfaced by Claude. Falls back to "Book Your AI Opportunity Session" if opportunities array is empty.

### 1b. Bridge paragraph before the CTA block
**Current:** Opportunities display → two buttons. No copy connecting results to action.
**Change:** Add a short paragraph immediately above the CTA block:

> "The next step is a free 45-minute call with our founder. We go deeper into your top opportunity, validate the ROI estimate for your specific situation, and give you a clear starting point. No obligation."

### 1c. CTA hierarchy fix
**Current:** "Book Your AI Opportunity Session" (green button) and "Return to Home" (grey button) sit side by side with similar visual weight.
**Change:** Remove the "Return to Home" button. Replace with a plain text link below the booking button: "or return to home →". One primary action, one low-prominence escape.

### 1d. Readiness score copy fix
**Current:**
- ≥70: "Strong foundation for AI adoption"
- ≥50: "Ready to start with targeted AI"
- <50: "High opportunity: clear starting points identified" ← counterintuitive

**Change:**
- ≥70: "Strong foundation, ready to scale with AI"
- ≥50: "Solid starting point: targeted AI will accelerate growth"
- <50: "Untapped potential: AI can make a significant impact here"

### 1e. Founding offer urgency signal
**Current:** No urgency signal on the results page.
**Change:** Add one line of small text directly below the booking button:
`"Founding rate available for clients who engage before June 2026."`
Styled as `text-[#4B5563] text-[12px]` (subtle, not pushy).

---

## Change 2: Phase 1 Welcome Screen — Remove Dual Card

### Problem
The bottom of Phase 1 shows two cards: "Clarivis Assessment (You are here)" and "AI Opportunity Session" with a full "Book Your Session" link button. Warm visitors may skip the assessment and book directly, removing them from lead capture. Cold visitors face decision paralysis.

### Change
Remove the two-card comparison block entirely (lines ~133–151 in current code, from the `<div className="mt-10 pt-8 border-t...">` to the closing `</div>`, plus the paragraph after it).

Replace with a single plain text line below the "Start Assessment" button:
`"Prefer to talk directly? Book a session instead."` — linked to `/book`, styled as `text-[#4B5563] text-[13px]`.

---

## Change 3: Phase 5 Chat — Remove Countdown Anxiety

### 3a. Strip the exchange count numbers from the UI
**Current:** 
- Mobile header: `"{turnsUsed}/{maxTurns} exchanges"` text
- Chat footer: `"{turnsUsed} of {maxTurns} exchanges used"` text

**Change:** Remove both text labels. Keep the progress bar (both mobile and desktop sidebar). The bar communicates pace without triggering countdown anxiety.

### 3b. Hide "End Session Early" until MIN_TURNS_FOR_QUALITY
**Current:** "End Session Early" button renders whenever `!disabled` (from the first exchange onward).
**Change:** Add condition: only render when `turnsUsed >= MIN_TURNS_FOR_QUALITY` (already defined as 3). Before 3 turns, the option doesn't exist. After 3, it appears as it does now.

**Code change:**
```tsx
// Before
{!disabled && <button onClick={()=>setShowModal(true)} ...>End Session Early</button>}

// After
{!disabled && turnsUsed >= MIN_TURNS_FOR_QUALITY && <button onClick={()=>setShowModal(true)} ...>End Session Early</button>}
```

---

## What This Does Not Change
- No API routes touched
- No Supabase schema changes
- No changes to intake form steps or time selection
- No changes to the email sent to users or the PDF generation
- The "End Session Early" modal copy and logic remain as-is once the button appears

---

## Success Signal
More users clicking "Book a Session" from Phase 7. Measurable via the existing `book_session_clicked` PostHog event already tracked on that button.
