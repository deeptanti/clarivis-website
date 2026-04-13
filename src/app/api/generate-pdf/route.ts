import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import PDFDocument from 'pdfkit'

function generateSnapshotPDF(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      const buffers: Buffer[] = []
      
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      
      const renderBackground = () => {
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0a0f1a');
      }
      doc.on('pageAdded', renderBackground);
      renderBackground();

      const { userProfile, opportunities, readinessScore, executiveSummary, recommendedFirstStep, dateStr } = data;

      doc.fillColor('#0F6E56').fontSize(24).text('Clarivis Intelligence', { align: 'center' });
      doc.fillColor('#ffffff').fontSize(20).text('AI Opportunity Snapshot', { align: 'center' });
      doc.moveDown(0.5);
      
      doc.fontSize(14).text(`${userProfile.name} | ${userProfile.company || 'Your Business'} | ${userProfile.industry}`, { align: 'center' });
      doc.fillColor('#9CA3AF').fontSize(12).text(dateStr, { align: 'center' });
      doc.moveDown(2);

      if (executiveSummary) {
        doc.fillColor('#0F6E56').fontSize(16).text('Executive Summary');
        doc.moveDown(0.5);
        doc.fillColor('#CBD5E1').fontSize(12).text(executiveSummary, { lineGap: 4 });
        doc.moveDown(1.5);
      }

      if (readinessScore) {
        doc.fillColor('#0F6E56').fontSize(16).text('AI Readiness Score: ' + readinessScore + ' / 100');
        doc.moveDown(1.5);
      }

      doc.fillColor('#0F6E56').fontSize(16).text('Top AI Opportunities');
      doc.moveDown(0.5);
      
      opportunities.slice(0, 3).forEach((opp: any) => {
        doc.fillColor('#ffffff').fontSize(14).text(`0${opp.rank}. ${opp.title}`);
        doc.moveDown(0.2);
        doc.fillColor('#9CA3AF').fontSize(11).text('Problem: ', { continued: true }).fillColor('#CBD5E1').text(opp.problem);
        doc.moveDown(0.2);
        doc.fillColor('#9CA3AF').fontSize(11).text('Solution: ', { continued: true }).fillColor('#CBD5E1').text(opp.solution);
        doc.moveDown(0.2);
        doc.fillColor('#0F6E56').fontSize(11).text(`ROI: ${opp.indicativeROI} | Time to ROI: ${opp.timeToROI}`);
        doc.moveDown(1);
      });

      if (recommendedFirstStep) {
        doc.fillColor('#0F6E56').fontSize(16).text('Recommended First Step');
        doc.moveDown(0.5);
        doc.fillColor('#CBD5E1').fontSize(12).text(recommendedFirstStep, { lineGap: 4 });
        doc.moveDown(2);
      }

      doc.fillColor('#9CA3AF').fontSize(11).text('hello@clarivisintelligence.com', { align: 'center' });
      doc.fillColor('#0F6E56').text('https://clarivisintelligence.com/book', { align: 'center', link: 'https://clarivisintelligence.com/book' });

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

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
      pdfBuffer = await generateSnapshotPDF({ userProfile, opportunities, readinessScore, executiveSummary, recommendedFirstStep, dateStr })
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
