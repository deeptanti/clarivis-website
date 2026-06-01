import { createHash } from 'crypto';

// GA4 Configuration
export const GA4_MEASUREMENT_ID = 'G-T1127E5MED';
export const GA4_API_URL = 'https://www.google-analytics.com/mp/collect';

// Type Definitions
export interface GA4Event {
  name: string;
  params: Record<string, string | number | boolean>;
}

export interface GA4Request {
  client_id: string;
  user_id?: string;
  events: GA4Event[];
  user_properties?: Record<string, { value: string | number }>;
}

/**
 * Hash email using SHA-256
 */
function hashEmail(email: string): string {
  const hash = createHash('sha256');
  hash.update(email.toLowerCase());
  return hash.digest('hex');
}

/**
 * Send events to GA4 Measurement Protocol API
 */
export async function sendToGA4(
  visitId: string,
  userEmail: string | undefined,
  events: GA4Event[],
  userProperties?: Record<string, { value: string | number }>
): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;

  if (!apiSecret) {
    console.error('GA4_API_SECRET environment variable is not set');
    return;
  }

  try {
    // Hash email if provided
    let hashedEmail: string | undefined;
    if (userEmail) {
      hashedEmail = hashEmail(userEmail);
    }

    // Build GA4Request payload
    const request: GA4Request = {
      client_id: visitId,
      ...(hashedEmail && { user_id: hashedEmail }),
      events,
      ...(userProperties && { user_properties: userProperties }),
    };

    // POST to GA4 API
    const url = `${GA4_API_URL}?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error(`GA4 API error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending event to GA4:', error);
  }
}
