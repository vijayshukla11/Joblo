/**
 * Safe, type-safe environment variable parsing and export layer.
 * Prevents runtime crashes from missing critical keys during deployment.
 */
export const environment = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  
  appUrl: import.meta.env.VITE_APP_URL || 'https://localhost:3000',

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  database: {
    url: import.meta.env.VITE_DATABASE_URL || '',
  },

  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  },

  n8n: {
    webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  },

  analytics: {
    trackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  },
};
