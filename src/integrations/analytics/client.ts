import { environment } from '../../config/environment';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private trackingId: string;

  constructor() {
    this.trackingId = environment.analytics.trackingId;
    if (this.trackingId) {
      console.log(`[Analytics Integration] Initialized with GA4 ID: ${this.trackingId}`);
    }
  }

  trackEvent(event: AnalyticsEvent) {
    const timestamp = new Date().toISOString();
    
    console.log(`[Analytics Event] ${event.category.toUpperCase()} | ${event.action} | Label: ${event.label || 'N/A'}`, {
      ...event.metadata,
      timestamp,
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
