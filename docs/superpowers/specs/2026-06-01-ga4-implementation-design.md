# GA4 Implementation Design — Clarivis Intelligence Website

**Date:** 2026-06-01  
**Project:** Clarivis Intelligence Website  
**Objective:** Implement GA4 as single source of truth for analytics, tracking all conversion funnels, traffic quality, and vertical performance with actionable dashboards.

---

## 1. Overview

### Current State
- **GA4:** Basic gtag.js (G-T1127E5MED) with page views only
- **PostHog:** Event tracking (to be removed)
- **Custom Tracker:** `/api/track-visit` endpoint for page views + assessment events
- **Clarity:** Session recordings (keep)

### Target State
- **GA4:** All conversion tracking, funnel analysis, traffic attribution
- **Backend:** `/api/track-visit` forwards all events to GA4 Measurement Protocol (server-side)
- **No PostHog:** Remove initialization, simplify event pipeline
- **No Custom Tracker Complexity:** Keep endpoint for data redundancy, but GA4 is source of truth

### Why Server-Side via Measurement Protocol?
- **Data Quality:** Validate events on backend before GA4
- **Scalability:** Easy to add backend events (form submissions, API calls) later
- **Cost:** No GTM Server-Side container fees, use existing `/api/track-visit`
- **Privacy:** Events from server, harder to block/manipulate

---

## 2. User Journey Maps

### Path A: Assessment → Booking (High Intent)
1. Land on site → Navigate via navbar
2. Click solution page (/solutions/real-estate|healthcare|agribusiness)
3. Click "Start the Clarivis Assessment" CTA
4. **Assessment Phases 1-7:**
   - Phase 1: Welcome
   - Phase 2: Time Selection (30/60/90 min)
   - Phase 3: Structured Intake (company details)
   - Phase 4: AI Chat (multi-step questions)
   - Phase 5: Contact Details
   - Phase 6: Generating Report (loading)
   - Phase 7: Complete (report + opportunities shown)
5. Click "Book a Session" → Calendly direct
6. **Conversion:** User books discovery call

### Path B: Content → Assessment → Booking (SEO-First)
1. Land on /insights/guides/[vertical]/[slug] (organic search)
2. Scroll article (50%+)
3. Click "Start the Clarivis Assessment" (content CTA)
4. [Same as Path A, steps 4-6]

### Path C: Direct Contact (Lower Intent)
1. Land on /contact (footer/direct link)
2. Fill contact form → Submit to /api/contact endpoint (NEW)
3. **Note:** Currently form is non-functional (preventDefault only)
4. **Action Required:** Create /api/contact endpoint + email

### Path D: Footer Navigation
- Any page → Click footer links (Start Assessment, Book a Call, solutions)
- These are tracked as navigation events

---

## 3. GA4 Events & Properties

### Events (What Fires When)

| Event | Trigger | Properties |
|-------|---------|-----------|
| `assessment_started` | Phase 1 entry | vertical, entry_source, utm_source, utm_medium, utm_campaign |
| `assessment_phase_progressed` | Phase advance (1→2, 2→3, etc) | from_phase, to_phase, time_on_phase_seconds, vertical |
| `assessment_abandoned` | User leaves mid-assessment | phase_abandoned, time_on_phase_seconds, vertical |
| `assessment_completed` | Phase 7 report shown | total_duration_seconds, readiness_score, opportunities_count, vertical |
| `contact_form_submitted` | Form submit success | email, industry, company_provided, vertical |
| `booking_cta_clicked` | Calendly link clicked | cta_location, source_page, vertical |
| `cta_clicked` | "Start Assessment" button clicked | cta_name, cta_location, source_page, vertical |
| `navigation_clicked` | Navbar/footer link clicked | nav_section, nav_item, source_page |
| `content_engaged` | Scroll 50%+ on insights page | scroll_depth, content_slug, content_type, vertical |

### Custom Dimensions (User Properties, on Every Event)

These are GA4 user properties that segment all events:

- `user_vertical`: "real-estate" | "healthcare" | "agribusiness"
- `user_industry_size`: "0-50" | "51-100" | "101-500" | "500+"
- `user_time_selected`: 30 | 60 | 90 (minutes)
- `entry_source`: "organic_search" | "paid_ads" | "direct" | "referral" | "email"
- `assessment_phase`: 1-7 (current phase, updates as user progresses)
- `user_email`: [hashed for privacy]

---

## 4. Backend Implementation

### `/api/track-visit` Changes

**Current behavior:** Accepts events, logs to database, done.

**New behavior:** Accept events, log to database AND forward to GA4 Measurement Protocol.

**Flow:**
```
Browser (trackEvent)
  → POST /api/track-visit
    → Validate event shape
    → Log to database (existing)
    → Forward to GA4 Measurement Protocol (NEW)
    → Return 200 OK
```

**GA4 Measurement Protocol Request:**
```
POST https://www.google-analytics.com/mp/collect?measurement_id=G-T1127E5MED&api_secret=[SECRET]
{
  "client_id": "[sessionId or hashed email]",
  "user_id": "[email hash]",
  "events": [
    {
      "name": "assessment_phase_progressed",
      "params": {
        "from_phase": 2,
        "to_phase": 3,
        "time_on_phase_seconds": 120,
        "vertical": "real-estate",
        "engagement_time_msec": 120000
      }
    }
  ],
  "user_properties": {
    "user_vertical": { "value": "real-estate" },
    "entry_source": { "value": "organic_search" },
    "assessment_phase": { "value": "3" }
  }
}
```

**Required additions:**
- GA4 API secret stored in `.env.local`
- GA4 client library (e.g., `google-analytics` or manual HTTP requests)
- Error handling: if GA4 request fails, log error but don't fail user event
- Rate limiting: batch requests if high volume

---

## 5. Frontend Changes

### Remove PostHog
- Delete `src/components/PostHogProvider.tsx` initialization
- Remove `trackPostHog()` calls from assessment flow
- Remove `posthog-js` from `package.json`

### Keep Custom Tracker
- Keep `/lib/tracker.ts` as-is (sends to `/api/track-visit`)
- No changes to `trackEvent()` function
- No changes to `VisitorTracker` component

### Update Assessment Event Names
Current: `p1_start_clicked`, `p4_complete`, etc.  
New: `assessment_started`, `assessment_phase_progressed`, etc.

**Files to update:**
- `src/app/assessment/page-client.tsx` — phase event names
- Keep property structure (phase, duration, vertical, etc.)

### Add Missing Event: Contact Form
**File:** `src/app/contact/page-client.tsx`
- Currently form has `onSubmit={(e) => e.preventDefault()}`
- Add: Real submit handler that calls `/api/contact`
- Add: `trackEvent('contact_form_submitted', {...})`

---

## 6. GA4 Configuration (Dashboard Setup)

### Goals to Create

1. **assessment_started** — Top of funnel
2. **assessment_completed** — Mid-funnel (report generation)
3. **booking_cta_clicked** — Bottom of funnel (booking intent)
4. **contact_form_submitted** — Alternative lead source

### Conversion Events

Mark these as conversion events in GA4:
- `assessment_completed` (primary)
- `booking_cta_clicked` (secondary)
- `contact_form_submitted` (secondary)

### Custom Reports (Dashboards)

**Dashboard 1: Conversion Funnel**
- Steps: assessment_started → phase 2 progressed → ... → assessment_completed → booking_cta_clicked
- Segments: by vertical, by traffic source
- Shows drop-off % at each step

**Dashboard 2: Vertical Performance**
- Metric: Completion rate by vertical (real-estate vs healthcare vs agribusiness)
- Metric: Booking rate by vertical
- Metric: Avg readiness score by vertical

**Dashboard 3: Traffic Quality**
- Table: utm_source, utm_medium → assessment starts → completion rate → booking rate
- Identifies best-performing traffic sources
- Flags underperforming ad campaigns

**Dashboard 4: Assessment Engagement**
- Heatmap: Completion % by phase, segmented by vertical
- Identifies where each vertical struggles (Phase 4 for healthcare, etc)

**Dashboard 5: Time-to-Conversion**
- Avg assessment duration
- % abandoning <5 min
- Days to booking after completion

**Dashboard 6: KPI Scorecard**
- Week/month: assessment starts, completions, completion %, booking clicks, booking %

---

## 7. Implementation Sequence

### Phase 1: Backend & GA4 Config (Week 1)
1. Create GA4 Measurement Protocol integration in `/api/track-visit`
2. Add GA4 API secret to `.env.local`
3. Test: manually trigger events, verify they appear in GA4 real-time
4. Create goals and conversion events in GA4 UI

### Phase 2: Frontend Events (Week 1)
1. Update assessment event names (`p1_start_clicked` → `assessment_started`)
2. Remove PostHog initialization + calls
3. Fix contact form: create `/api/contact` endpoint + tracking
4. Deploy and verify events flow through

### Phase 3: Dashboard Setup (Week 2)
1. Create 6 custom reports in GA4
2. Set up alerts (completion rate < 50%, booking rate < 20%)
3. Share dashboard with team
4. Document how to read/act on each report

### Phase 4: Validation & Optimization (Week 2)
1. Run traffic for 3-5 days
2. Verify data accuracy (events match user actions)
3. Identify quick wins (traffic source changes, CTA placement, etc.)
4. Deprecate custom tracker logging (optional, keep for now as backup)

---

## 8. Data Privacy & Security

- **User ID:** Hash email address using SHA-256, never send raw email to GA4 via client
- **IP Redaction:** GA4 respects `anonymizeIp: true` in gtag.js (already configured)
- **Consent:** Existing cookie banner covers analytics consent
- **GDPR:** GA4 event data deletion = user request → invalidate user_id in backend

---

## 9. Success Criteria

- ✅ All 9 events firing correctly in GA4 real-time (verify within 24 hours)
- ✅ Funnel report shows accurate drop-off %
- ✅ Vertical breakdown shows real-estate > healthcare performance
- ✅ Traffic quality report identifies organic search as top source
- ✅ Contact form fully functional and tracked
- ✅ No PostHog calls in codebase
- ✅ Assessment completion rate measurable and reportable
- ✅ Team can read dashboards and act on insights weekly

---

## 10. Known Issues & Fixes Required

| Issue | Impact | Fix |
|-------|--------|-----|
| Contact form non-functional | Can't track leads | Create `/api/contact` endpoint + submission handler |
| PostHog duplication | Event noise, harder to debug | Remove all PostHog references |
| Event naming inconsistent | Hard to read dashboards | Standardize to snake_case, phase-based naming |
| No traffic source tracking | Can't attribute quality | Ensure UTM params passed through phases |
| Assessment phases labeled "p1", "p2" instead of descriptive names | Confusing dashboards | Rename to "phase_1_welcome", etc. |

---

## Appendix: Event Examples

**Assessment Phase 2 → 3 Transition**
```json
{
  "event": "assessment_phase_progressed",
  "from_phase": 2,
  "to_phase": 3,
  "time_on_phase_seconds": 180,
  "vertical": "real-estate",
  "time_selected": 60,
  "user_email": "[hash]",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "real-estate-ai"
}
```

**Assessment Completed**
```json
{
  "event": "assessment_completed",
  "phase": 7,
  "total_duration_seconds": 900,
  "readiness_score": 78,
  "opportunities_count": 3,
  "vertical": "real-estate",
  "user_email": "[hash]",
  "time_selected": 60,
  "entry_source": "organic_search"
}
```

**Contact Form Submitted**
```json
{
  "event": "contact_form_submitted",
  "email": "[provided]",
  "industry": "healthcare",
  "company_provided": true,
  "vertical": "healthcare",
  "utm_source": "direct"
}
```
