/**
 * Analytics & User Telemetry Pipeline
 * 
 * Provides centralized event tracking to replace disjointed console logs
 * with structured pipelines for GA4 or Microsoft Clarity.
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private trackingId: string | undefined;

  constructor() {
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID;
    if (this.trackingId) {
      console.log(`[Analytics] Google Analytics 4 initialized with ID: ${this.trackingId}`);
    }
  }

  /**
   * Tracks custom client interactions.
   */
  trackEvent(event: AnalyticsEvent) {
    const timestamp = new Date().toISOString();
    
    // 1. Output to local developer console under telemetry format
    console.log(`[Telemetry Event] ${event.category.toUpperCase()} | ${event.action} | Label: ${event.label || 'N/A'}`, {
      ...event.metadata,
      timestamp,
    });

    // 2. If GA4 or Google Tag Manager exists in the document window, dispatch it
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  }

  /**
   * Specifically tracks outbound job apply transitions.
   */
  trackOutboundClick(jobTitle: string, company: string, url: string) {
    this.trackEvent({
      category: 'outbound_apply',
      action: 'SOURCING_OUTBOUND_CLICK',
      label: `${jobTitle} @ ${company}`,
      metadata: { targetUrl: url }
    });
  }
}

export const analytics = new AnalyticsService();
export default analytics;
