import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import React from 'react'

const e = React.createElement;

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  headerBar: { backgroundColor: '#1A1A2E', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'column' },
  headerTitle: { color: '#0F6E56', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#9CA3AF', fontSize: 9, marginTop: 6 },
  headerRight: { flexDirection: 'column', alignItems: 'flex-end' },
  headerRightTitle: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  headerRightDate: { color: '#9CA3AF', fontSize: 9, marginTop: 4 },
  
  clientBlock: { backgroundColor: '#F3F4F6', padding: 16, marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clientLeft: { flexDirection: 'column' },
  clientName: { color: '#1A1A2E', fontSize: 12, fontWeight: 'bold' },
  clientDetails: { color: '#6B7280', fontSize: 10, marginTop: 6 },
  clientRight: { alignItems: 'flex-end' },
  clientScoreLabel: { color: '#0F6E56', fontSize: 9, textTransform: 'uppercase' },
  clientScoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  clientScoreNum: { color: '#0F6E56', fontSize: 32, fontWeight: 'bold' },
  clientScoreMax: { color: '#6B7280', fontSize: 12 },

  sectionLabel: { color: '#0F6E56', fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#0F6E56', paddingBottom: 4 },
  execSummaryText: { color: '#374151', fontSize: 10, lineHeight: 1.6, marginTop: 8 },

  oppCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 14, marginBottom: 10, marginTop: 8 },
  oppTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  oppRankCircle: { backgroundColor: '#0F6E56', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  oppRankText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  oppTitle: { color: '#1A1A2E', fontSize: 13, fontWeight: 'bold' },
  oppDetailRow: { flexDirection: 'row', marginTop: 4 },
  oppDetailLabel: { color: '#0F6E56', fontSize: 9, fontWeight: 'bold', marginRight: 4 },
  oppDetailText: { color: '#6B7280', fontSize: 9 },
  oppPillsRow: { flexDirection: 'row', marginTop: 12 },
  oppRnPill: { backgroundColor: '#F0FDF9', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, marginRight: 8 },
  oppRnText: { color: '#0F6E56', fontSize: 9 },
  oppTimePill: { backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  oppTimeText: { color: '#6B7280', fontSize: 9 },

  recStepLeftBorder: { borderLeftWidth: 3, borderLeftColor: '#0F6E56', paddingLeft: 12, marginTop: 12 },
  recStepText: { color: '#374151', fontSize: 10, lineHeight: 1.6 },

  footerBar: { backgroundColor: '#1A1A2E', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  footerText: { color: '#9CA3AF', fontSize: 9 },
  footerCenter: { color: '#9CA3AF', fontSize: 8 }
});

const SnapshotDocument = ({ data }: { data: any }) => {
  const { userProfile, opportunities, readinessScore, executiveSummary, recommendedFirstStep, dateStr } = data;
  
  return e(Document, null,
    e(Page, { size: "A4", style: styles.page },
      e(View, { style: styles.headerBar },
        e(View, { style: styles.headerLeft },
          e(Text, { style: styles.headerTitle }, "CLARIVIS INTELLIGENCE"),
          e(Text, { style: styles.headerSubtitle }, "Clarity in every decision. Intelligence in every system.")
        ),
        e(View, { style: styles.headerRight },
          e(Text, { style: styles.headerRightTitle }, "AI OPPORTUNITY SNAPSHOT"),
          e(Text, { style: styles.headerRightDate }, dateStr)
        )
      ),
      e(View, { style: styles.clientBlock },
        e(View, { style: styles.clientLeft },
          e(Text, { style: styles.clientName }, `${userProfile.name} • ${userProfile.company || 'Your Business'}`),
          e(Text, { style: styles.clientDetails }, `${userProfile.industry} ${userProfile.teamSize ? `• Team: ${userProfile.teamSize}` : ''}`)
        ),
        readinessScore ? e(View, { style: styles.clientRight },
          e(Text, { style: styles.clientScoreLabel }, "AI READINESS SCORE"),
          e(View, { style: styles.clientScoreRow },
            e(Text, { style: styles.clientScoreNum }, String(readinessScore)),
            e(Text, { style: styles.clientScoreMax }, "/100")
          )
        ) : null
      ),
      executiveSummary ? e(View, null,
        e(Text, { style: styles.sectionLabel }, "EXECUTIVE SUMMARY"),
        e(Text, { style: styles.execSummaryText }, executiveSummary)
      ) : null,
      e(View, null,
        e(Text, { style: styles.sectionLabel }, "YOUR TOP AI OPPORTUNITIES"),
        e(View, { style: { marginTop: 8 } },
          opportunities.slice(0, 3).map((opp: any, idx: number) =>
            e(View, { key: idx, style: styles.oppCard },
              e(View, { style: styles.oppTitleRow },
                e(View, { style: styles.oppRankCircle },
                  e(Text, { style: styles.oppRankText }, String(opp.rank))
                ),
                e(Text, { style: styles.oppTitle }, opp.title)
              ),
              e(View, { style: styles.oppDetailRow },
                e(Text, { style: styles.oppDetailLabel }, "Problem:"),
                e(Text, { style: styles.oppDetailText }, opp.problem)
              ),
              e(View, { style: styles.oppDetailRow },
                e(Text, { style: styles.oppDetailLabel }, "Solution:"),
                e(Text, { style: styles.oppDetailText }, opp.solution)
              ),
              e(View, { style: styles.oppPillsRow },
                e(View, { style: styles.oppRnPill },
                  e(Text, { style: styles.oppRnText }, opp.indicativeROI)
                ),
                e(View, { style: styles.oppTimePill },
                  e(Text, { style: styles.oppTimeText }, opp.timeToROI)
                )
              )
            )
          )
        )
      ),
      recommendedFirstStep ? e(View, null,
        e(Text, { style: styles.sectionLabel }, "RECOMMENDED FIRST STEP"),
        e(View, { style: styles.recStepLeftBorder },
          e(Text, { style: styles.recStepText }, recommendedFirstStep)
        )
      ) : null,
      e(View, { style: styles.footerBar },
        e(Text, { style: styles.footerText }, "hello@clarivisintelligence.com"),
        e(Text, { style: styles.footerCenter }, "© 2026 Clarivis Intelligence"),
        e(Text, { style: styles.footerText }, "clarivisintelligence.com/book")
      )
    )
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
      pdfBuffer = await renderToBuffer(e(SnapshotDocument, { data: { userProfile, opportunities, readinessScore, executiveSummary, recommendedFirstStep, dateStr } }))
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
  <a href="https://clarivisintelligence.com/book" style="background:#0F6E56;color:#fff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;margin-bottom:32px;">Book Your AI Opportunity Session →</a>
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
