import { environment } from '../config/environment';
import { supabaseClient } from '../integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authService = {
  isConfigured(): boolean {
    return supabaseClient.isConfigured();
  },

  /**
   * Login using Supabase Auth (or simulation)
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    if (!email || !password) {
      return { user: null, error: new Error('Email and password are required.') };
    }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      if (data && data.user) {
        const rawUser = data.user;
        const meta = rawUser.user_metadata || {};
        const user: User = {
          id: rawUser.id,
          email: rawUser.email || email,
          name: meta.name || email.split('@')[0],
          role: meta.role || (email.includes('admin') ? 'Admin' : (email.includes('employer') ? 'Employer' : 'Applicant'))
        };
        return { user, error: null };
      }

      return { user: null, error: new Error('Invalid login response.') };
    } catch (e: any) {
      return { user: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Sign Up using Supabase Auth (or simulation)
   */
  async signUp(name: string, email: string, password: string, role: string = 'Applicant'): Promise<{ user: User | null; error: Error | null }> {
    if (!name || !email || !password) {
      return { user: null, error: new Error('Name, email, and password are required.') };
    }

    if (password.length < 6) {
      return { user: null, error: new Error('Password must be at least 6 characters.') };
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        return { user: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      if (data && data.user) {
        const rawUser = data.user;
        const user: User = {
          id: rawUser.id,
          email: rawUser.email || email,
          name,
          role
        };
        return { user, error: null };
      }

      return { user: null, error: new Error('Registration failed.') };
    } catch (e: any) {
      return { user: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Log Out using Supabase Auth (or simulation)
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabaseClient.auth.signOut();
      return { error: error || null };
    } catch (e: any) {
      return { error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Forgot Password / Password Reset Link Request
   */
  async forgotPassword(email: string): Promise<{ success: boolean; error: Error | null }> {
    if (!email) {
      return { success: false, error: new Error('Email is required.') };
    }

    try {
      if (supabaseClient.isConfigured()) {
        const { error } = await supabaseClient.from('').select('*'); // Check proxy
        // Direct call to auth service:
        const { error: resetError } = await (supabaseClient as any).auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/employer-reset-password`
        });
        if (resetError) return { success: false, error: resetError };
      } else {
        await new Promise(r => setTimeout(r, 600));
        console.log(`[Auth Simulation] Password reset link dispatched to ${email}`);
      }
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Reset Password (Confirm New Password)
   */
  async resetPassword(password: string): Promise<{ success: boolean; error: Error | null }> {
    if (!password || password.length < 6) {
      return { success: false, error: new Error('Password must be at least 6 characters.') };
    }

    try {
      if (supabaseClient.isConfigured()) {
        const { error: updateError } = await (supabaseClient as any).auth.updateUser({ password });
        if (updateError) return { success: false, error: updateError };
      } else {
        await new Promise(r => setTimeout(r, 600));
        console.log(`[Auth Simulation] Password successfully updated.`);
      }
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Verify Active Session on Mount
   */
  async getCurrentSessionUser(): Promise<User | null> {
    try {
      const sessionResult = await supabaseClient.getSession();
      if (sessionResult && sessionResult.user) {
        const user = sessionResult.user;
        const meta = user.user_metadata || {};
        return {
          id: user.id,
          email: user.email || '',
          name: meta.name || user.email?.split('@')[0] || 'User',
          role: meta.role || (user.email?.includes('admin') ? 'Admin' : (user.email?.includes('employer') ? 'Employer' : 'Applicant'))
        };
      }
    } catch (e) {
      console.error('[AuthService] Error parsing active session:', e);
    }
    return null;
  }
};

export default authService;
