import { ANALYTICS_EVENTS, AnalyticsEventName } from './events';
import { analyticsService } from '../integrations/analytics/client';

/**
 * Centered trackers wrapper layer to easily hook analytics onto buttons, cards and search queries.
 */
export const trackers = {
  trackSearch: (query: string, location: string, isGovernment: boolean) => {
    analyticsService.trackEvent({
      category: 'search',
      action: ANALYTICS_EVENTS.SEARCH_DISPATCHED,
      label: query,
      metadata: { location, isGovernment }
    });
  },

  trackOutboundClick: (jobTitle: string, companyName: string, isGovernment: boolean) => {
    analyticsService.trackEvent({
      category: 'outbound_referral',
      action: ANALYTICS_EVENTS.OUTBOUND_REDIRECT,
      label: `${jobTitle} | ${companyName}`,
      metadata: { isGovernment }
    });
  },

  trackAiMatch: (jobTitle: string, matchScore: number) => {
    analyticsService.trackEvent({
      category: 'ai_features',
      action: ANALYTICS_EVENTS.AI_MATCH_REQUEST,
      label: jobTitle,
      value: matchScore,
      metadata: { timestamp: new Date().toISOString() }
    });
  },

  trackAuth: (action: 'login' | 'register' | 'logout', success: boolean, role?: string) => {
    analyticsService.trackEvent({
      category: 'user_auth',
      action: action === 'login' ? ANALYTICS_EVENTS.USER_LOGIN : action === 'register' ? ANALYTICS_EVENTS.USER_REGISTER : ANALYTICS_EVENTS.USER_LOGOUT,
      label: success ? 'success' : 'failure',
      metadata: { role }
    });
  }
};
export default trackers;
