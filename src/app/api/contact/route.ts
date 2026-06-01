// src/app/api/contact/route.ts

import { sendToGA4 } from '@/lib/ga4-client';
import { GA4_EVENTS } from '@/lib/ga4-events';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  industry: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactFormData;

    // Validate required fields
    const { name, email, company, industry, message } = body;
    if (!name || !email || !company || !industry || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // TODO: Send email to hello@clarivisintelligence.com with contact details
    // This is a placeholder — integrate with Resend or your email service
    // For now, just log to console
    console.log('Contact form submission:', { name, email, company, industry });

    // Forward to GA4
    const visitId = request.headers.get('x-visit-id') || 'contact-form-' + Date.now();
    const ga4Events = [
      {
        name: GA4_EVENTS.CONTACT_FORM_SUBMITTED,
        params: {
          email,
          industry,
          company_provided: !!company,
          vertical: industry.toLowerCase(),
          engagement_time_msec: 1000,
        },
      },
    ];

    await sendToGA4(visitId, email, ga4Events, {
      user_vertical: { value: industry.toLowerCase() },
    }).catch((err) => {
      console.error('GA4 forwarding failed:', err);
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
