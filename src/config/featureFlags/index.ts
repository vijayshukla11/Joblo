/**
 * Scalable Feature Flags configuration.
 * Controls progressive rollout of interactive features scheduled for Sprint 2.
 */
export const featureFlags = {
  enableAiChatcoach: true,
  enableSourcingPipelines: true,
  enableGazetteScrapers: false, // Prep work only
  enableResumeParsing: true,
  enableEnterpriseDashboard: false, // Planned for mid-Sprint 2
  enableRealtimeAlerts: false,
};

export type FeatureFlags = typeof featureFlags;
export type FeatureFlagKey = keyof FeatureFlags;
export const isFeatureEnabled = (key: FeatureFlagKey): boolean => {
  return featureFlags[key] ?? false;
};
