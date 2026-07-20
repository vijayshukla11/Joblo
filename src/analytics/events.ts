/**
 * Consolidated Event Definitions for JOB Lo
 * To enforce standardized schema payloads across all features and teams.
 */

export const ANALYTICS_EVENTS = {
  // Navigation & Search
  SEARCH_DISPATCHED: 'SEARCH_DISPATCHED',
  FILTER_APPLIED: 'FILTER_APPLIED',
  OUTBOUND_REDIRECT: 'OUTBOUND_REDIRECT',

  // Job Application Flow
  APPLICATION_START: 'APPLICATION_START',
  APPLICATION_COMPLETE: 'APPLICATION_COMPLETE',
  
  // AI Matching Flow
  AI_RESUME_UPLOAD: 'AI_RESUME_UPLOAD',
  AI_MATCH_REQUEST: 'AI_MATCH_REQUEST',
  AI_RECOMMENDATION_VIEWED: 'AI_RECOMMENDATION_VIEWED',

  // Sourcing & Gazettes
  GAZETTE_INDEX_SEARCH: 'GAZETTE_INDEX_SEARCH',
  SOURCING_API_CLICK: 'SOURCING_API_CLICK',

  // User Authentication
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGOUT: 'USER_LOGOUT',
} as const;

export type AnalyticsEventName = keyof typeof ANALYTICS_EVENTS;

export interface EventPayload {
  eventName: AnalyticsEventName;
  properties?: Record<string, any>;
  userId?: string;
  timestamp: string;
}
