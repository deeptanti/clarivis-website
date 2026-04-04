import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { userProfile, conversationHistory, timeSelected } = await request.json()
    const apiKey = process.env.ANTHROPIC_API_KEY
    let snapshotContent = null

    if (apiKey) {
      const summaryResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are generating a structured AI Opportunity Snapshot from an assessment conversation. Return ONLY valid JSON, no other text.',
          messages: [{
            role: 'user',
            content: `Based on this assessment for ${userProfile.name} at ${userProfile.company || 'their company'} in ${userProfile.industry}:\n\n${conversationHistory.map((m: { role: string, content: string }) => `${m.role}: ${m.content}`).join('\n')}\n\nReturn this exact JSON:\n{"executiveSummary":"2-3 sentence summary","readinessScore":65,"opportunities":[{"rank":1,"title":"name","problem":"specific problem","solution":"how AI solves it","indicativeROI":"measurable outcome","timeToROI":"X weeks"}],"recommendedFirstStep":"recommendation"}`
          }]
        })
      })
      const summaryResult = await summaryResponse.json()
      try { snapshotContent = JSON.parse(summaryResult.content[0].text) } catch { }
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
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const oppHTML = opportunities.slice(0, 3).map((o: { rank: number, title: string, problem: string, solution: string, indicativeROI: string, timeToROI: string }) => `
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;margin-bottom:12px;">
          <div style="background:#0F6E56;color:#fff;font-size:12px;font-weight:700;width:28px;height:28px;border-radius:50%;text-align:center;line-height:28px;margin-right:12px;">0${o.rank}</div>
          <h4 style="color:#fff;font-size:18px;font-weight:700;margin:0;">${o.title}</h4>
        </div>
        <p style="color:#9CA3AF;font-size:14px;margin:0 0 6px 0;"><strong style="color:#CBD5E1;">Problem:</strong> ${o.problem}</p>
        <p style="color:#9CA3AF;font-size:14px;margin:0 0 12px 0;"><strong style="color:#CBD5E1;">Solution:</strong> ${o.solution}</p>
        <div style="background:rgba(15,110,86,0.1);border:1px solid rgba(15,110,86,0.25);border-radius:8px;padding:10px 14px;display:inline-block;">
          <span style="color:#0F6E56;font-size:13px;font-weight:600;">📈 ${o.indicativeROI}</span>
          <span style="color:#6B7280;font-size:12px;margin-left:12px;">⏱ ${o.timeToROI} to deploy</span>
        </div>
      </div>`).join('')

    const emailHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#0a0f1a;">
  <div style="background:#0a0f1a;padding:32px 40px;text-align:center;border-bottom:1px solid #1f2937;">
    <h1 style="color:#0F6E56;font-size:22px;margin:0 0 4px 0;">Clarivis Intelligence</h1>
    <p style="color:#9CA3AF;font-size:13px;margin:0;">Clarity in every decision. Intelligence in every system.</p>
  </div>
  <div style="background:#0d1117;padding:32px 40px;text-align:center;border-bottom:1px solid #1f2937;">
    <p style="color:#0F6E56;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px 0;">AI OPPORTUNITY SNAPSHOT</p>
    <h2 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 8px 0;">${userProfile.name}</h2>
    <p style="color:#9CA3AF;font-size:15px;margin:0;">${userProfile.company || 'Your Business'} · ${userProfile.industry} · ${dateStr}</p>
  </div>
  <div style="padding:32px 40px;background:#0d1117;border-bottom:1px solid #1f2937;">
    <h3 style="color:#0F6E56;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px 0;">Executive Summary</h3>
    <p style="color:#CBD5E1;font-size:16px;line-height:1.8;margin:0;">${snapshotContent?.executiveSummary || `Based on your ${timeSelected}-minute assessment, we have identified high-impact AI opportunities for ${userProfile.company || 'your business'}. Your challenge around "${(userProfile.mainChallenge || '').substring(0, 80)}" represents a significant opportunity for AI automation.`}</p>
  </div>
  <div style="padding:32px 40px;background:#0a0f1a;">${oppHTML}</div>
  <div style="padding:32px 40px;background:#071a14;text-align:center;">
    <h3 style="color:#fff;font-size:20px;font-weight:700;margin:0 0 12px 0;">Ready to go deeper?</h3>
    <p style="color:#9CA3AF;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Book a free 45-minute AI Opportunity Session with our founder to discuss your situation and get a full implementation plan with ROI projections.</p>
    <a href="https://clarivisintelligence.com/book" style="background:#0F6E56;color:#fff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">Book Your AI Opportunity Session →</a>
  </div>
  <div style="padding:24px 40px;background:#0a0f1a;text-align:center;border-top:1px solid #1f2937;">
    <p style="color:#6B7280;font-size:13px;margin:0 0 8px 0;">Deep Tanti · Founder, Clarivis Intelligence</p>
    <p style="color:#6B7280;font-size:12px;margin:0;">Rajkot, Gujarat, India · <a href="mailto:hello@clarivisintelligence.com" style="color:#0F6E56;">hello@clarivisintelligence.com</a></p>
    <p style="color:#374151;font-size:11px;margin:16px 0 0 0;">You received this because you completed the Clarivis Assessment.</p>
  </div>
</div></body></html>`

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await Promise.all([
        resend.emails.send({
          from: 'Deep Tanti — Clarivis Intelligence <deeptanti1@gmail.com>',
          to: userProfile.email,
          subject: `Your AI Opportunity Snapshot — ${userProfile.company || userProfile.name}`,
          html: emailHTML
        }),
        resend.emails.send({
          from: 'Clarivis Assessment <deeptanti1@gmail.com>',
          to: 'deeptanti1@gmail.com',
          subject: `Assessment Complete — ${userProfile.name} — ${userProfile.company} — ${userProfile.industry}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
            <h2 style="color:#0F6E56;">New Assessment Submission</h2>
            <p><strong>Name:</strong> ${userProfile.name}</p><p><strong>Email:</strong> ${userProfile.email}</p>
            <p><strong>Phone:</strong> ${userProfile.phone}</p><p><strong>Company:</strong> ${userProfile.company || 'Not provided'}</p>
            <p><strong>Industry:</strong> ${userProfile.industry}</p><p><strong>Team Size:</strong> ${userProfile.teamSize || 'Not provided'}</p>
            <p><strong>Time Selected:</strong> ${timeSelected} minutes</p>
            <p><strong>Main Challenge:</strong> ${userProfile.mainChallenge}</p>
            <h3>Conversation</h3>
            <div style="background:#f9f9f9;padding:16px;border-radius:8px;">
              ${conversationHistory.map((m: { role: string, content: string }) => `<p><strong>${m.role === 'user' ? userProfile.name : 'AI Agent'}:</strong> ${m.content}</p>`).join('')}
            </div>
            <div style="margin-top:24px;padding:16px;background:#0F6E56;border-radius:8px;text-align:center;">
              <a href="mailto:${userProfile.email}" style="color:white;text-decoration:none;font-weight:600;">Reply to ${userProfile.name}</a>
            </div></div>`
        })
      ])
    }

    return NextResponse.json({ success: true, opportunities: opportunities.slice(0, 3) })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 })
  }
}
