/**
 * GA4 Event Name Constants
 */
export const GA4_EVENTS = {
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_PHASE_PROGRESSED: 'assessment_phase_progressed',
  ASSESSMENT_ABANDONED: 'assessment_abandoned',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  BOOKING_CTA_CLICKED: 'booking_cta_clicked',
  CTA_CLICKED: 'cta_clicked',
  NAVIGATION_CLICKED: 'navigation_clicked',
  CONTENT_ENGAGED: 'content_engaged',
  PAGE_VIEW: 'page_view',
} as const;

/**
 * Type for all GA4 event names
 */
export type GA4EventName = typeof GA4_EVENTS[keyof typeof GA4_EVENTS];

/**
 * GA4 Event Payload Interface
 * Contains optional properties for all possible event data
 */
export interface GA4EventPayload {
  // Assessment Events
  assessment_id?: string;
  assessment_type?: string;
  vertical?: string;
  phase_number?: number;
  completion_time?: number;

  // Form & CTA Events
  form_name?: string;
  form_field?: string;
  cta_name?: string;
  cta_type?: string;
  cta_position?: string;

  // Navigation Events
  link_text?: string;
  link_url?: string;
  navigation_type?: string;

  // Content Events
  content_type?: string;
  content_id?: string;
  content_title?: string;
  engagement_time?: number;
  scroll_depth?: number;

  // Page & Session Events
  page_path?: string;
  page_title?: string;
  referrer?: string;
  session_id?: string;

  // Generic properties
  value?: number | string;
  currency?: string;
  [key: string]: string | number | boolean | undefined;
}
