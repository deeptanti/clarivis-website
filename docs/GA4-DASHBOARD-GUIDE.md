# GA4 Dashboard Usage Guide for Clarivis Intelligence

## Quick Start

The GA4 dashboards provide real-time visibility into how users interact with your website, the assessment funnel, and where they convert to leads.

### Access Your Dashboards
1. Go to Google Analytics
2. Select property: Clarivis Intelligence (G-T1127E5MED)
3. Click "Explore" or go to your saved dashboard

## Dashboard 1: Conversion Funnel

**What it shows:** Drop-off percentage at each assessment phase, showing where users abandon.

**How to read it:**
- Left column: step name
- Middle column: number of users
- Right column: percentage of users who made it to that step

**Action items:**
- If any phase shows > 30% drop-off: that phase needs UX improvement
- Phase 4 (AI Chat) is typically hardest — if > 30% drop, test question clarity
- Phase 2-3 should be 90%+ completion (quick decision stages)

**Example interpretation:**
```
Phase 1: 500 users (100%)
Phase 2: 475 users (95%)
Phase 3: 420 users (84%)  ← Big drop here, investigate
Phase 4: 380 users (76%)
Phase 5: 340 users (68%)
Phase 6: 320 users (64%)
Phase 7: 285 users (57%)
Booking: 89 users (18%)
```

---

## Dashboard 2: Vertical Performance

**What it shows:** Which industry (Real Estate, Healthcare, Agribusiness) converts best.

**Metrics:**
- Users: Traffic to that vertical's content/assessment
- Completion Rate: % of users who complete the assessment
- Booking Rate: % of completers who click booking CTA

**Action items:**
- If Healthcare completion rate < 50%: investigate messaging, UX
- Real Estate typically > 60%: use as baseline for others
- If Agribusiness > Real Estate: opportunity to invest more there

**Example:**
```
Real Estate: 60% completion, 35% booking rate — STRONG
Healthcare: 53% completion, 22% booking rate — Needs work
Agribusiness: 58% completion, 28% booking rate — Growing
```

---

## Dashboard 3: Traffic Quality

**What it shows:** Which traffic sources bring the best leads (measured by conversion rate, not just volume).

**Columns:**
- Traffic Source (google, linkedin, direct, etc.)
- Sessions: Total sessions from that source
- Assessment Starts: How many started assessment
- Completion Rate: % of starters who complete
- Booking Rate: % of completers who book

**Action items:**
- High completion rate but low booking rate: content good, CTA needs work
- Low completion rate: traffic quality issue or audience mismatch
- Organic search usually best for quality (high completion)
- Paid ads need careful targeting (check cost-per-lead)

**Example:**
```
Organic Search: 62% completion, 8% booking — High quality, low intent
LinkedIn Ads: 68% completion, 12% booking — Best performance
Google Ads: 51% completion, 4% booking — Consider pausing
Direct: 55% completion, 5% booking — Direct visits, but low conversion
```

---

## Dashboard 4: Assessment Engagement by Phase & Vertical

**What it shows:** Where each industry struggles in the assessment flow.

**Format:** Table with phases down rows, industries across columns, completion % in cells.

**Action items:**
- If Healthcare Phase 4 < 75%: AI chat questions too technical
- If any industry drops >15% at one phase: A/B test that phase
- Focus on equalizing phase-to-phase drop-off across industries

**Example troubleshooting:**
- Healthcare drops at Phase 4? → Simplify AI questions for that vertical
- Real Estate only drops at Phase 5? → Contact form too long or confusing

---

## Dashboard 5: Time-to-Conversion

**What it shows:** Assessment duration and how long users wait before booking.

**Key metrics:**
- Avg Assessment Duration: How long users spend in assessment
- % Completing in < 5 min: Quick completions (might indicate rushing)
- % Completing in > 20 min: Overthinking (might be confused)
- Days to Booking: How many days after assessment do they book?
- % Booking Same-Day: Hot leads (high priority follow-up)

**Action items:**
- If avg > 20 min: Simplify questions or process
- If avg < 5 min: Users rushing, not fully engaging (quality issue)
- Target sweet spot: 8-12 min
- If > 50% never book: Create email nurture sequence

**Example:** 
- Avg 8.2 min, 45% same-day booking = good engagement
- Avg 12.5 min, 20% never book = consider email follow-up

---

## Dashboard 6: KPI Scorecard (Weekly View)

**What it shows:** One-screen summary of all key metrics for this week.

**Metrics to track:**
- Assessment Starts: How many people began the assessment
- Assessment Completions: How many finished
- Completion Rate: Completion % (should be 50-65%)
- Contact Form Submissions: Alternative lead source
- Booking Clicks: How many clicked "Book a Session"
- Estimated Booking Rate: Booking clicks ÷ Assessment completions

**Week-over-week comparison:**
- Is starts up/down? (Traffic trend)
- Is completion rate stable? (Product quality)
- Is booking rate up/down? (CTA effectiveness)

**Red flags:**
- Completion rate < 50%: UX issue
- Completion rate declining: investigate recent changes
- Booking rate < 15%: post-assessment CTA needs work

---

## Weekly Review Routine (10 minutes)

Every Monday morning:

1. **Check KPI Scorecard** (2 min)
   - Completion rate trending right? 
   - Booking rate stable?
   - Note any big changes

2. **Drill into Funnel** (3 min)
   - Any phase drop > 30%?
   - If yes: mark for UX audit

3. **Review Vertical Performance** (3 min)
   - Any vertical < 50% completion?
   - If yes: plan messaging refresh

4. **Spot-check Traffic Quality** (2 min)
   - New traffic source?
   - Low-performing source worth pausing?

---

## Common Questions & Troubleshooting

**Q: Why is my completion rate 40%?**
A: Below 50% suggests friction in the assessment. Common causes:
- Questions too technical (test simpler wording)
- Assessment too long (Phase 4 chat limits?)
- Mobile UX issues (test on phone)
- Targeting: wrong audience for phase content

**Q: How long should the assessment take?**
A: Target 8-15 minutes. If yours is much longer:
- Consider reducing Phase 4 chat turns
- Streamline Phase 5 contact form
- Test with real users

**Q: Why aren't people booking after completing?**
A: Low booking rate despite high completion suggests:
- CTA not visible/prominent enough
- Booking text doesn't match expectations
- Calendly integration issue
- Consider adding email follow-up

**Q: How much traffic should I have?**
A: Depends on marketing spend. With any traffic:
- First 7 days: warm up data, don't act on it
- Week 2+: enough data to spot real patterns
- After 1 month: ready to optimize

**Q: When should I act on data?**
A: Only when the pattern is clear:
- Same issue 2 weeks in a row = real problem
- Single spike = noise
- 20+ completions per phase = enough data to trust

**Q: Can I combine multiple strategies?**
A: Yes, but test one change at a time so you know what worked:
- Week 1: Change Phase 4 questions
- Week 2: Check results
- Week 3: Change something else
- This way you can attribute improvements

---

## Reports Checklist

- [ ] Conversion Funnel created and saved
- [ ] Vertical Performance dashboard created
- [ ] Traffic Quality report created  
- [ ] Assessment Engagement heatmap created
- [ ] Time-to-Conversion dashboard created
- [ ] KPI Scorecard created
- [ ] All reports added to main dashboard
- [ ] Team members have view access
- [ ] Bookmark/favorites added for quick access

---

## Next Steps After Setup

1. **Run 24-48 hours of traffic** to populate dashboards
2. **Check data quality** — verify events match your actions
3. **Review Conversion Funnel** — identify biggest drop-off
4. **Audit traffic quality** — understand where best leads come from
5. **Plan first optimization** — pick one issue to fix
6. **Measure impact** — recheck reports in 1 week

---

## Support & Questions

If you need to troubleshoot:
1. Check if events are firing in GA4 Realtime view (Admin > Realtime)
2. Verify GA4_API_SECRET is set on the server
3. Check browser console for errors when using assessment
4. Review server logs for /api/track-visit errors

For data interpretation questions, refer to the action items in each dashboard section above.
