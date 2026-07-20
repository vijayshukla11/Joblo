/**
 * Supabase Client Connection Manager
 * 
 * Provides official connection handlers for database, storage, and authentication services.
 * Integrates with the official @supabase/supabase-js SDK.
 */

import { createClient } from '@supabase/supabase-js';
import { environment } from '../config/environment';

const supabaseUrl = environment.supabase.url;
const supabaseAnonKey = environment.supabase.anonKey;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the official Supabase client if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to retrieve the active Supabase client or a dummy client
 */
export function getSupabaseClient() {
  if (supabase) {
    return supabase;
  }
  
  // Return a dummy client proxy to prevent runtime undefined reference errors during early build phases
  return new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'isConfigured') return () => false;
      return () => {
        console.warn(`[Supabase SDK] Attempted to access "${String(prop)}" but Supabase is not configured.`);
        return Promise.resolve({ data: null, error: new Error('Supabase client not configured') });
      };
    }
  });
}

/**
 * React Hook to monitor connection status of Supabase DB integration.
 */
export function useSupabaseConnection() {
  return {
    isConfigured: isSupabaseConfigured,
    supabaseUrl: supabaseUrl || 'Not configured',
    hasCredentials: isSupabaseConfigured
  };
}

export default supabase;
