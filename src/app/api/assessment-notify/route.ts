import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const isEarlyCapture = !data.industry

    if (isEarlyCapture) {
      console.log('Early capture:', data.name, data.email)

      const { data: assessment } = await supabaseAdmin
        .from('assessments')
        .insert([{
          session_id: data.sessionId || null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          time_selected: data.timeSelected,
          source: 'assessment',
          completed: false
        }])
        .select()
        .single()

      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Clarivis Intelligence <onboarding@resend.dev>',
          to: 'hello@clarivisintelligence.com',
          subject: `Assessment Started — ${data.name}`,
          html: `<div style="font-family:sans-serif;padding:24px;">
            <h2 style="color:#0F6E56;">New Assessment Started</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Time Selected:</strong> ${data.timeSelected} minutes</p>
            <p style="color:#666;font-size:13px;">They are completing the assessment questions now.</p>
          </div>`
        })
      }

      return NextResponse.json({ success: true, assessmentId: assessment?.id })
    }

    const { data: assessment } = await supabaseAdmin
      .from('assessments')
      .upsert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        industry: data.industry,
        team_size: data.teamSize,
        time_selected: data.timeSelected,
        main_challenge: data.mainChallenge,
        tools: Array.isArray(data.tools) ? data.tools.join(', ') : data.tools,
        ai_experience: data.aiExperience,
        success_definition: data.successDefinition,
        source: 'assessment',
        completed: true
      }], { onConflict: 'email' })
      .select()
      .single()

    await supabaseAdmin.from('leads').upsert([{
      assessment_id: assessment?.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      source: 'assessment',
      stage: 'New'
    }], { onConflict: 'email' })

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Clarivis Intelligence <onboarding@resend.dev>',
        to: 'hello@clarivisintelligence.com',
        subject: `Assessment Complete — ${data.name} — ${data.company} — ${data.industry}`,
        html: `<div style="font-family:sans-serif;padding:24px;">
          <h2 style="color:#0F6E56;">Assessment Completed</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
          <p><strong>Industry:</strong> ${data.industry}</p>
          <p><strong>Team Size:</strong> ${data.teamSize || 'Not provided'}</p>
          <p><strong>Time Selected:</strong> ${data.timeSelected} minutes</p>
          <p><strong>Main Challenge:</strong> ${data.mainChallenge}</p>
          <p style="margin-top:16px;"><a href="mailto:${data.email}" style="background:#0F6E56;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">Reply to ${data.name}</a></p>
        </div>`
      })

      await resend.emails.send({
        from: 'Deep Tanti — Clarivis Intelligence <onboarding@resend.dev>',
        to: data.email,
        subject: `Your AI Opportunity Snapshot — ${data.company || data.name}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0a0f1a;padding:32px;text-align:center;">
            <h1 style="color:#0F6E56;margin:0;">Clarivis Intelligence</h1>
            <p style="color:#9CA3AF;margin:8px 0 0;">Clarity in every decision. Intelligence in every system.</p>
          </div>
          <div style="padding:32px;background:#ffffff;">
            <h2 style="color:#1a1a2e;">Hi ${data.name},</h2>
            <p style="color:#444;line-height:1.7;">Thank you for completing the Clarivis Assessment. Your personalised AI Opportunity Snapshot is attached above and has been prepared based on your responses.</p>
            <p style="color:#444;line-height:1.7;">Based on what you shared about your ${data.industry} business, our AI agent has identified your top opportunities. The next step is a free 45-minute AI Opportunity Session where we go deeper into your specific situation.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://clarivisintelligence.com/book" style="background:#0F6E56;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Book Your AI Opportunity Session</a>
            </div>
            <p style="color:#444;">Warm regards,<br><strong>Deep Tanti</strong><br>Founder, Clarivis Intelligence</p>
          </div>
          <div style="background:#0a0f1a;padding:20px;text-align:center;">
            <p style="color:#6B7280;font-size:12px;margin:0;">Clarivis Intelligence Private Limited · Rajkot, Gujarat, India</p>
          </div>
        </div>`
      })
    }

    return NextResponse.json({ success: true, assessmentId: assessment?.id })

  } catch (error) {
    console.error('Assessment notify error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
