import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { Document, Page, View, Text, StyleSheet, renderToBuffer, Image, Link } from '@react-pdf/renderer'
import React from 'react'

const styles = StyleSheet.create({
  navy: { backgroundColor: '#0A0F1A' },
  surface: { backgroundColor: '#111827' },
  border: { borderColor: '#1F2937' },
  textTeal: { color: '#0F6E56' },
  bgTeal: { backgroundColor: '#0F6E56' },
  bgTealLight: { backgroundColor: '#D1FAE5' },
  bgTealDim: { backgroundColor: '#052E16' },
  textWhite: { color: '#FFFFFF' },
  textGrey1: { color: '#9CA3AF' },
  textGrey2: { color: '#6B7280' },
  textGrey3: { color: '#4B5563' },
  textGrey4: { color: '#1F2937' },
  textLight: { color: '#CBD5E1' },

  // Custom composites
  page: { backgroundColor: '#0A0F1A', fontFamily: 'Helvetica' },
  pageInner: { padding: 40 },
  topBar: { width: '100%', height: 4, backgroundColor: '#0F6E56' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: '#0F6E56', width: '100%' },
  pageFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderTopColor: '#1F2937', paddingHorizontal: 40, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' },

  sectionHeader: { color: '#0F6E56', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 20 },
  sectionLine: { height: 2, backgroundColor: '#0F6E56', marginTop: 5, marginBottom: 16 }
});

const PageFooter = () => (
  <View style={styles.pageFooter}>
    <Link src="mailto:hello@clarivisintelligence.com" style={{ textDecoration: 'none' }}>
      <Text style={{ color: '#4B5563', fontSize: 8 }}>hello@clarivisintelligence.com</Text>
    </Link>
    <Text style={{ color: '#4B5563', fontSize: 8 }}>+91 84018 14334</Text>
    <Text style={{ color: '#4B5563', fontSize: 8 }}>© 2026 Clarivis Intelligence</Text>
    <Text style={{ color: '#4B5563', fontSize: 8 }}>clarivisintelligence.com</Text>
  </View>
);

const SnapshotDocument = ({ data }: { data: any }) => {
  const { userProfile, opportunities, snapshotContent, conversationHistory } = data;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Handle fallbacks
  const readinessScore = snapshotContent?.readinessScore ?? null;
  const executiveSummary = snapshotContent?.executiveSummary ?? null;

  const getReadinessLabel = (score: number) => {
    if (score >= 70) return "Strong Foundation for AI";
    if (score >= 50) return "Ready for Targeted AI";
    return "High Opportunity Identified";
  };

  const getReadinessDesc = (score: number) => {
    if (score >= 70) return "Your team displays high operational maturity. AI implementation will likely be rapid with minimal friction.";
    if (score >= 50) return "You have solid fundamentals. We recommend starting with a targeted workflow before scaling AI widely.";
    return "Significant inefficiencies identified. Implementing core AI systems will yield dramatic and immediate ROI.";
  };

  // Filter conversation to last 6 user messages
  const userSignals: string[] = [];
  if (Array.isArray(conversationHistory)) {
    const userMsgs = conversationHistory.filter((m: any) => m.role === 'user').slice(-6);
    userMsgs.forEach((m: any) => userSignals.push(m.content));
  }

  // Determine top opportunities to show
  const opps = opportunities || [];

  return (
    <Document>
      {/* PAGE 1 — COVER */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />
        <View style={{ position: 'absolute', top: 36, left: 36 }}>
          <Image src="https://clarivisintelligence.com/images/logo.png" style={{ width: 260, height: 65, objectFit: 'contain' }} />
        </View>
        <View style={{ padding: 50 }}>
          <View style={{ height: 65 }} />

          <View style={{ marginTop: 120 }}>
            <Text style={{ color: '#0F6E56', fontSize: 10, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase' }}>AI OPPORTUNITY SNAPSHOT</Text>
            <View style={{ height: 2, backgroundColor: '#0F6E56', width: 48, marginTop: 16, marginBottom: 24 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 'bold' }}>{userProfile?.name || 'Client'}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 20, marginTop: 6 }}>{userProfile?.company || 'Your Company'}</Text>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8 }}>
                <Text style={{ color: '#9CA3AF', fontSize: 9 }}>{userProfile?.industry || 'Unknown Industry'}</Text>
              </View>
              {userProfile?.teamSize && (
                <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 9 }}>Team: {userProfile.teamSize}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: 40, right: 50 }}>
          <Text style={{ color: '#4B5563', fontSize: 8 }}>Prepared by Clarivis Intelligence</Text>
          <Text style={{ color: '#4B5563', fontSize: 8, marginTop: 2 }}>{dateStr}</Text>
        </View>
        <View style={styles.bottomBar} />
      </Page>

      {/* PAGE 2 — WHAT WE FOUND */}
      <Page size="A4" style={[styles.page, styles.pageInner]}>
        <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 10, padding: 24, marginBottom: 24, flexDirection: 'row' }}>
          <View style={{ width: '40%' }}>
            <Text style={{ color: '#0F6E56', fontSize: 8, fontWeight: 'bold', letterSpacing: 1.5 }}>AI READINESS SCORE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
              <Text style={{ color: '#0F6E56', fontSize: 52, fontWeight: 'bold', lineHeight: 1 }}>{readinessScore ?? 0}</Text>
              <Text style={{ color: '#6B7280', fontSize: 16 }}>/100</Text>
            </View>
            <View style={{ width: 140, height: 8, backgroundColor: '#1F2937', borderRadius: 4, marginTop: 12 }}>
              <View style={{ height: 8, backgroundColor: '#0F6E56', borderRadius: 4, width: `${Math.min(readinessScore ?? 0, 100)}%` }} />
            </View>
          </View>
          <View style={{ width: '60%', paddingLeft: 24, borderLeftWidth: 1, borderLeftColor: '#1F2937' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>{readinessScore === null ? "High Opportunity Identified" : getReadinessLabel(readinessScore)}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 10, lineHeight: 1.6, marginTop: 8 }}>{getReadinessDesc(readinessScore ?? 0)}</Text>
            <Text style={{ color: '#6B7280', fontSize: 10, lineHeight: 1.6, marginTop: 8 }}>
              {(readinessScore ?? 0) >= 70 ? "Your processes and team structure are well-suited for rapid AI deployment. The primary work is selecting the right interventions and sequencing them for maximum early impact." :
                (readinessScore ?? 0) >= 50 ? "You have the foundations in place. The key is identifying the two or three highest-leverage points where AI removes friction your team already feels every day." :
                  "Lower readiness is not a barrier — it is an opportunity. Businesses at this stage often see the most dramatic transformation because the baseline is unoptimised."}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionHeader}>EXECUTIVE SUMMARY</Text>
          <View style={styles.sectionLine} />
          <Text style={{ color: '#CBD5E1', fontSize: 11, lineHeight: 1.8 }}>{executiveSummary || "Assessment complete. Your full executive summary will appear here based on your conversation responses."}</Text>
          <View style={{ height: 1, backgroundColor: '#1F2937', marginTop: 16, marginBottom: 16, width: '100%' }} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, backgroundColor: '#111827', borderRadius: 8, padding: 12, marginHorizontal: 4 }}>
              <Text style={{ color: '#0F6E56', fontSize: 18, fontWeight: 'bold' }}>{userProfile.teamSize || 'N/A'}</Text>
              <Text style={{ color: '#6B7280', fontSize: 8 }}>TEAM SIZE</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#111827', borderRadius: 8, padding: 12, marginHorizontal: 4 }}>
              <Text style={{ color: '#0F6E56', fontSize: 18, fontWeight: 'bold' }}>{userProfile.industry || 'N/A'}</Text>
              <Text style={{ color: '#6B7280', fontSize: 8 }}>VERTICAL</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#111827', borderRadius: 8, padding: 12, marginHorizontal: 4 }}>
              <Text style={{ color: '#0F6E56', fontSize: 18, fontWeight: 'bold' }}>{snapshotContent?.readinessScore ? `${snapshotContent.readinessScore}/100` : 'N/A'}</Text>
              <Text style={{ color: '#6B7280', fontSize: 8 }}>READINESS</Text>
            </View>
          </View>
        </View>

        {Array.isArray(conversationHistory) && conversationHistory.length > 4 && userSignals.length > 0 ? (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionHeader}>KEY SIGNALS FROM YOUR ASSESSMENT</Text>
            <View style={styles.sectionLine} />
            {userSignals.slice(0, 3).map((sig, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#0F6E56', marginTop: 5, marginRight: 8 }} />
                <Text style={{ color: '#CBD5E1', fontSize: 10, lineHeight: 1.5, flex: 1 }}>
                  {sig.length > 120 ? sig.substring(0, 117) + '...' : sig}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <PageFooter />
      </Page>

      {/* PAGE 3 — YOUR TOP AI OPPORTUNITIES */}
      <Page size="A4" style={[styles.page, styles.pageInner]}>
        <Text style={styles.sectionHeader}>YOUR TOP AI OPPORTUNITIES</Text>
        <View style={styles.sectionLine} />
        <Text style={{ color: '#6B7280', fontSize: 10, fontStyle: 'italic', marginBottom: 20 }}>Based on your assessment, these are the three highest-impact AI opportunities identified for {userProfile?.company || 'your business'}.</Text>

        {opps.slice(0, 3).map((opp: any, idx: number) => (
          <View key={idx} style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 10, padding: 20, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#0F6E56', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>0{opp.rank}</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginLeft: 10, flex: 1 }}>{opp.title}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#0F6E56', fontSize: 8, fontWeight: 'bold', letterSpacing: 1 }}>PROBLEM</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 10, lineHeight: 1.5, marginTop: 3 }}>{opp.problem}</Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#0F6E56', fontSize: 8, fontWeight: 'bold', letterSpacing: 1 }}>SOLUTION</Text>
              <Text style={{ color: '#CBD5E1', fontSize: 10, lineHeight: 1.5, marginTop: 3 }}>{opp.solution}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#052E16', borderWidth: 1, borderColor: '#0F6E56', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8 }}>
                <Text style={{ color: '#0F6E56', fontSize: 9, fontWeight: 'bold' }}>ROI: {opp.indicativeROI}</Text>
              </View>
              <View style={{ backgroundColor: '#1F2937', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text style={{ color: '#6B7280', fontSize: 9 }}>Deploy: {opp.timeToROI}</Text>
              </View>
            </View>
          </View>
        ))}

        <PageFooter />
      </Page>

      {/* PAGE 4 — THE CONVERSATION */}
      <Page size="A4" style={[styles.page, styles.pageInner]}>
        <Text style={styles.sectionHeader}>HOW WE ARRIVED HERE</Text>
        <View style={styles.sectionLine} />
        <Text style={{ color: '#6B7280', fontSize: 10, lineHeight: 1.6, marginBottom: 20 }}>The following is drawn from your AI assessment with Clarivis Intelligence. Every recommendation in this report is grounded in what you told us.</Text>

        {Array.isArray(conversationHistory) && conversationHistory.filter((m: any, idx: number) => !(idx === 0 && m.role === 'assistant')).slice(0, 12).map((m: any, idx: number) => {
          const text = m.content.length > 200 ? m.content.substring(0, 197) + '...' : m.content;
          if (m.role === 'assistant') {
            return (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, paddingRight: 80 }}>
                <View style={{ width: 22, height: 22, backgroundColor: '#0F6E56', borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 2, flexShrink: 0 }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'Helvetica-Bold' }}>C</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#111827', borderRadius: 8, padding: 10 }}>
                  <Text style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.5 }}>{text}</Text>
                </View>
              </View>
            );
          } else {
            const firstLetter = (userProfile?.name || 'Client').charAt(0).toUpperCase();
            return (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 14, paddingLeft: 80 }}>
                <View style={{ flex: 1, backgroundColor: '#0D1F17', borderRadius: 8, borderWidth: 1, borderColor: '#1F4D3A', padding: 10 }}>
                  <Text style={{ fontSize: 10, color: '#CBD5E1', lineHeight: 1.5 }}>{text}</Text>
                </View>
                <View style={{ width: 22, height: 22, backgroundColor: '#1F2937', borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginTop: 2, flexShrink: 0 }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{firstLetter}</Text>
                </View>
              </View>
            );
          }
        })}

        <PageFooter />
      </Page>

      {/* PAGE 5 — YOUR NEXT STEP */}
      <Page size="A4" style={[styles.page, styles.pageInner]}>
        <View style={{ marginBottom: 28 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', lineHeight: 1.3 }}>The snapshot reveals the opportunity.</Text>
          <Text style={{ color: '#0F6E56', fontSize: 22, fontWeight: 'bold', lineHeight: 1.3 }}>The audit reveals the full picture.</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 11, lineHeight: 1.7, marginTop: 12 }}>This report was generated from a conversation. The Clarivis AI Operational Audit goes deeper — interviewing your team, mapping every process, and producing a complete implementation plan with documented ROI projections.</Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionHeader}>WHAT THE AUDIT DELIVERS</Text>
          <View style={styles.sectionLine} />

          <View style={{ width: '100%' }}>
            {[0, 2, 4].map(i => {
              const deliverables = [
                { title: "Updated AI Opportunity Snapshot", desc: "Refined with full process data and team interviews" },
                { title: "Current State Process Map", desc: "Every workflow documented from source to outcome" },
                { title: "AI Readiness Score", desc: "Benchmarked against your vertical and team size" },
                { title: "Automation Opportunity Matrix", desc: "All opportunities ranked by ROI, effort, and time to value" },
                { title: "90-Day Implementation Roadmap", desc: "Week by week, owner by owner, milestone by milestone" },
                { title: "Vendor and Tool Recommendations", desc: "Exact tools, exact integrations, exact costs" }
              ];
              const DeliverableCard = ({ item }: { item: any }) => (
                <View style={{ flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 6, padding: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#0F6E56', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: 'bold' }}>✓</Text>
                  </View>
                  <View style={{ paddingLeft: 8, flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>{item.title}</Text>
                    <Text style={{ color: '#6B7280', fontSize: 9, lineHeight: 1.4, marginTop: 4 }}>{item.desc}</Text>
                  </View>
                </View>
              );
              return (
                <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                  <DeliverableCard item={deliverables[i]} />
                  <DeliverableCard item={deliverables[i + 1]} />
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ backgroundColor: '#0F6E56', borderRadius: 10, padding: 24, marginTop: 20, flexDirection: 'row' }}>
          <View style={{ width: '65%', backgroundColor: 'transparent' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }}>The Clarivis AI Operational Audit</Text>
            <Text style={{ color: '#D1FAE5', fontSize: 11, marginTop: 6 }}>4 weeks. 5 sessions. 6 deliverables.</Text>
            <Text style={{ color: '#A7F3D0', fontSize: 10, marginTop: 8, lineHeight: 1.5, fontStyle: 'italic' }}>Clients consistently identify operational savings and revenue opportunities that far exceed the audit investment — typically visible within 90 days of implementation.</Text>
          </View>
          <View style={{ width: '35%', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <Link src="https://clarivisintelligence.com/book" style={{ textDecoration: 'none' }}>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 6,
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignSelf: 'flex-start',
                marginTop: 12,
              }}>
                <Text style={{
                  color: '#0F6E56',
                  fontSize: 10,
                  fontFamily: 'Helvetica-Bold',
                  textDecoration: 'none',
                }}>
                  Book Your Free AI Opportunity Session →
                </Text>
              </View>
            </Link>
          </View>
        </View>

        <View style={{ backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderLeftWidth: 3, borderLeftColor: '#0F6E56', borderRadius: 8, padding: 16, marginTop: 24 }}>
          <Text style={{ color: '#0F6E56', fontSize: 8, fontWeight: 'bold', letterSpacing: 1.5 }}>RECOMMENDED FIRST STEP</Text>
          <Text style={{ color: '#CBD5E1', fontSize: 11, lineHeight: 1.6, marginTop: 6 }}>{snapshotContent?.recommendedFirstStep || "Book a free AI Opportunity Session to discuss your highest-priority opportunity in detail."}</Text>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
};

export async function POST(request: NextRequest) {
  try {
    const { userProfile, conversationHistory, timeSelected, assessmentId } = await request.json()
    const apiKey = process.env.ANTHROPIC_API_KEY
    let snapshotContent = null

    if (apiKey) {
      const summaryResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          // Raised from 1000 — the full JSON schema with 3 opportunities can easily exceed 1000 tokens
          max_tokens: 3000,
          system: 'You are generating a structured AI Opportunity Snapshot from an assessment conversation. Return ONLY valid JSON with no preamble, no markdown fences, and no trailing text.',
          messages: [{
            role: 'user',
            content: `Based on this assessment for ${userProfile.name} at ${userProfile.company || 'their company'} in ${userProfile.industry}:\n\n${conversationHistory.map((m: { role: string, content: string }) => `${m.role}: ${m.content}`).join('\n')}\n\nReturn this exact JSON structure (no markdown, no code blocks, raw JSON only):\n{"executiveSummary":"2-3 sentence summary of the business situation and AI potential","readinessScore":65,"opportunities":[{"rank":1,"title":"opportunity name","problem":"specific problem identified","solution":"how AI solves it specifically","indicativeROI":"measurable outcome with number","timeToROI":"X weeks"},{"rank":2,"title":"opportunity name","problem":"specific problem","solution":"AI solution","indicativeROI":"measurable outcome","timeToROI":"X weeks"},{"rank":3,"title":"opportunity name","problem":"specific problem","solution":"AI solution","indicativeROI":"measurable outcome","timeToROI":"X weeks"}],"recommendedFirstStep":"specific actionable recommendation for the single highest-impact first move"}`
          }]
        })
      })
      const summaryResult = await summaryResponse.json()
      if (summaryResult.content?.[0]?.text) {
        try {
          // Strip any accidental markdown fences before parsing
          const raw = summaryResult.content[0].text.replace(/```json|```/g, '').trim()
          snapshotContent = JSON.parse(raw)
        } catch (e) {
          console.error('Snapshot JSON parse failed:', e)
        }
      }
    }

    const defaultOpps = userProfile.industry === 'Real Estate' ? [
      { rank: 1, title: 'AI Lead Qualifier', problem: 'Slow lead response losing site visits', solution: 'Automated response within 60 seconds', indicativeROI: 'Up to 40% more site visits booked', timeToROI: '4-6 weeks' },
      { rank: 2, title: 'Sales Pipeline Dashboard', problem: 'No live pipeline visibility', solution: 'Real-time management intelligence', indicativeROI: 'Real-time management decisions', timeToROI: '4-6 weeks' },
      { rank: 3, title: 'Collections Agent', problem: 'Manual payment follow-up', solution: 'Automated reminders via voice and WhatsApp', indicativeROI: 'Up to 60% fewer overdue accounts', timeToROI: '3-4 weeks' },
    ] : [
      { rank: 1, title: 'Patient Appointment Agent', problem: 'High no-show rate costing revenue', solution: 'Automated reminders at 48h, 24h, 2h', indicativeROI: 'Up to 40% reduction in no-shows', timeToROI: '3-4 weeks' },
      { rank: 2, title: 'Billing Automation', problem: 'Manual billing errors and slow collections', solution: 'Automated invoice generation and reconciliation', indicativeROI: 'Revenue cycle errors reduced to zero', timeToROI: '4-6 weeks' },
      { rank: 3, title: 'Clinical Dashboard', problem: 'No operational visibility', solution: 'Live dashboard across all departments', indicativeROI: 'Management reporting fully automated', timeToROI: '4-6 weeks' },
    ]

    const opportunities = snapshotContent?.opportunities || defaultOpps
    const readinessScore = snapshotContent?.readinessScore ?? null
    const executiveSummary = snapshotContent?.executiveSummary ?? null
    const recommendedFirstStep = snapshotContent?.recommendedFirstStep ?? null
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    // ── Generate PDF ────────────────────────────────────────────────────────
    let pdfBuffer: Buffer | undefined
    try {
      pdfBuffer = await renderToBuffer(
        <SnapshotDocument data={{ userProfile, opportunities, snapshotContent, conversationHistory }} />
      )
    } catch (e) {
      console.error('PDF generation failed:', e)
    }

    // ── Email HTML ────────────────────────────────────────────────────────────
    const topOpp = opportunities[0]
    const emailHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#0a0f1a;padding:32px;text-align:center;">
  <h1 style="color:#0F6E56;font-size:22px;margin:0 0 24px 0;">Clarivis Intelligence</h1>
  <p style="color:#fff;font-size:16px;line-height:1.6;margin:0 0 24px 0;text-align:left;">Hi ${userProfile.name.split(' ')[0] || 'there'}, your AI Opportunity Snapshot is ready — please find it attached.</p>
  ${topOpp ? `
  <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;text-align:left;margin-bottom:24px;">
    <p style="color:#0F6E56;font-size:12px;font-weight:700;margin:0 0 8px 0;text-transform:uppercase;">Top Highlight</p>
    <h3 style="color:#fff;font-size:18px;margin:0 0 8px 0;">${topOpp.title}</h3>
    <p style="color:#CBD5E1;font-size:14px;margin:0;">${topOpp.indicativeROI}</p>
  </div>` : ''}
  <a href="https://clarivisintelligence.com/book" style="background:#0F6E56;color:#fff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;margin-bottom:32px;">Book Now</a>
  <div style="border-top:1px solid #1f2937;padding-top:24px;">
    <p style="color:#6B7280;font-size:12px;margin:0;">hello@clarivisintelligence.com · <a href="#" style="color:#6B7280;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`

    // ── Database — only write fields not already set by assessment-notify ────
    // assessment-notify already created/updated the assessments and leads records.
    // Here we only mark completion and link the assessment ID if provided.
    if (userProfile.email) {
      if (assessmentId) {
        await supabaseAdmin.from('assessments').update({
          completed: true,
          readiness_score: readinessScore,
          executive_summary: executiveSummary,
          recommended_first_step: recommendedFirstStep,
        }).eq('id', assessmentId)
      } else {
        // Fallback: match by email if no ID was threaded through
        await supabaseAdmin.from('assessments').update({
          completed: true,
          readiness_score: readinessScore,
          executive_summary: executiveSummary,
          recommended_first_step: recommendedFirstStep,
        }).eq('email', userProfile.email)
      }
    }

    // ── Email ────────────────────────────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      // EMAIL_FROM should be set in env once domain is verified in Resend.
      // Format: "Deep Tanti — Clarivis Intelligence <hello@clarivisintelligence.com>"
      // Until then the onboarding@resend.dev sender is used as a fallback.
      const fromProspect = process.env.EMAIL_FROM || 'Deep Tanti — Clarivis Intelligence <hello@clarivisintelligence.com>'
      const fromInternal = process.env.EMAIL_FROM_INTERNAL || 'Clarivis Assessment <hello@clarivisintelligence.com>'

      await Promise.all([
        resend.emails.send({
          from: fromProspect,
          to: userProfile.email,
          subject: `Your AI Opportunity Snapshot — ${userProfile.company || userProfile.name}`,
          html: emailHTML,
          attachments: pdfBuffer ? [{
            filename: `Clarivis-AI-Snapshot-${userProfile.company || userProfile.name}.pdf`,
            content: pdfBuffer,
          }] : undefined
        }),
        resend.emails.send({
          from: fromInternal,
          to: process.env.FOUNDER_EMAIL || 'hello@clarivisintelligence.com',
          subject: `Assessment Complete — ${userProfile.name} — ${userProfile.company} — ${userProfile.industry}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#0F6E56;">New Assessment Submission</h2>
            <p><strong>Name:</strong> ${userProfile.name}</p>
            <p><strong>Email:</strong> ${userProfile.email}</p>
            <p><strong>Phone:</strong> ${userProfile.phone}</p>
            <p><strong>Company:</strong> ${userProfile.company || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${userProfile.industry}</p>
            <p><strong>Team Size:</strong> ${userProfile.teamSize || 'Not provided'}</p>
            <p><strong>Time Selected:</strong> ${timeSelected} minutes</p>
            <p><strong>Main Challenge:</strong> ${userProfile.mainChallenge}</p>
            ${readinessScore ? `<p><strong>AI Readiness Score:</strong> ${readinessScore}/100</p>` : ''}
            ${recommendedFirstStep ? `<p><strong>Recommended First Step:</strong> ${recommendedFirstStep}</p>` : ''}
            <h3>Top Opportunities</h3>
            <ol>${opportunities.slice(0, 3).map((o: { title: string, indicativeROI: string }) => `<li><strong>${o.title}</strong> — ${o.indicativeROI}</li>`).join('')}</ol>
            <h3>Conversation</h3>
            <div style="background:#f9f9f9;padding:16px;border-radius:8px;">
              ${conversationHistory.map((m: { role: string, content: string }) => `<p><strong>${m.role === 'user' ? userProfile.name : 'AI Agent'}:</strong> ${m.content}</p>`).join('')}
            </div>
            <div style="margin-top:24px;padding:16px;background:#0F6E56;border-radius:8px;text-align:center;">
              <a href="mailto:${userProfile.email}" style="color:white;text-decoration:none;font-weight:600;">Reply to ${userProfile.name}</a>
            </div>
          </div>`
        })
      ])
    }

    return NextResponse.json({
      success: true,
      opportunities: opportunities.slice(0, 3),
      readinessScore: snapshotContent?.readinessScore ?? null,
      executiveSummary: snapshotContent?.executiveSummary ?? null,
      recommendedFirstStep: snapshotContent?.recommendedFirstStep ?? null,
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 })
  }
}
