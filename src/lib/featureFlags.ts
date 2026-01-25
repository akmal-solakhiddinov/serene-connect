// Feature flags configuration
// Set to true when the feature is fully implemented and working

export const featureFlags = {
  // Auth features
  authentication: true,
  
  // Chat features  
  conversations: true,
  messages: true,
  messageEdit: false,
  messageDelete: false,
  attachments: false,
  
  // Profile features
  userProfile: true,
  editProfile: false,
  
  // Real-time features
  realTimeUpdates: false,
  typingIndicator: false,
  
  // Search features
  userSearch: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
