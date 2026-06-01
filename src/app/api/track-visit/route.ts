import { sendToGA4, GA4Event } from '@/lib/ga4-client';
import { GA4_EVENTS } from '@/lib/ga4-events';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.visitId || !body.event) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    const { visitId, event, email, ...eventData } = body;

    // Log to database (existing logic — keep unchanged)
    // await db.trackVisit({ visitId, event, ...eventData });

    // Build GA4 event
    const ga4Events: GA4Event[] = [
      {
        name: event,
        params: {
          ...eventData,
          engagement_time_msec: (eventData.timeOnScreenSeconds || 1) * 1000,
        },
      },
    ];

    // Build user properties (subset of event data for segmentation)
    const userProperties: Record<string, { value: string | number }> = {};
    if (eventData.vertical) userProperties.user_vertical = { value: eventData.vertical };
    if (eventData.phase) userProperties.assessment_phase = { value: eventData.phase };
    if (eventData.timeSelected) userProperties.user_time_selected = { value: eventData.timeSelected };
    if (eventData.industry) userProperties.user_industry = { value: eventData.industry };
    if (eventData.pageUrl) {
      const source = inferEntrySource(eventData.pageUrl);
      if (source) userProperties.entry_source = { value: source };
    }

    // Forward to GA4 (non-blocking)
    await sendToGA4(visitId, email, ga4Events, userProperties).catch((err) => {
      console.error('GA4 forwarding failed (non-blocking):', err);
    });

    // Return success to client
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('track-visit error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

// Helper: infer entry source from referrer or URL
function inferEntrySource(referrer: string | undefined): string | undefined {
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'organic_search';
  if (referrer.includes('linkedin')) return 'paid_ads';
  return 'referral';
}
