import supabaseClient from '../integrations/supabase/client';
import { Job } from '../types';
import { jobRepository } from '../repositories/jobRepository';

export interface SavedJobRecord {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  job_id: string;
  resume_url: string;
  status: string;
  stage?: string; // Backwards compatibility
  applied_at: string;
}

export const candidateActivityService = {
  /**
   * Fetch all jobs bookmarked by the user.
   */
  async getSavedJobs(userId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabaseClient
        .from('saved_jobs')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[CandidateActivityService] Error fetching saved jobs:', error);
        return [];
      }

      if (data && data.length > 0) {
        const allJobs = await jobRepository.getJobs();
        const savedIds = data.map((item: any) => String(item.job_id));
        return allJobs.filter(job => savedIds.includes(String(job.id)));
      }
    } catch (e) {
      console.error('[CandidateActivityService] Exception in getSavedJobs:', e);
    }
    return [];
  },

  /**
   * Bookmark a job.
   */
  async saveJob(userId: string, jobId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Check if already saved to prevent duplicates
      const { data } = await supabaseClient
        .from('saved_jobs')
        .select('*')
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (data && data.length > 0) {
        return { success: true, error: null }; // Already saved
      }

      const { error } = await supabaseClient
        .from('saved_jobs')
        .insert({ user_id: userId, job_id: jobId });

      if (error) {
        return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
      }

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Remove job bookmark.
   */
  async removeSavedJob(userId: string, jobId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabaseClient
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (error) {
        return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
      }

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Check if job is bookmarked.
   */
  async isJobSaved(userId: string, jobId: string): Promise<boolean> {
    try {
      const { data } = await supabaseClient
        .from('saved_jobs')
        .select('*')
        .eq('user_id', userId)
        .eq('job_id', jobId);

      return !!(data && data.length > 0);
    } catch {
      return false;
    }
  },

  /**
   * Get all applications submitted by candidate.
   */
  async getApplications(userId: string): Promise<Array<ApplicationRecord & { job?: Job }>> {
    try {
      const { data, error } = await supabaseClient
        .from('applications')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[CandidateActivityService] Error fetching applications:', error);
        return [];
      }

      if (data) {
        const allJobs = await jobRepository.getJobs();
        return data.map((app: any) => {
          const matchedJob = allJobs.find(j => String(j.id) === String(app.job_id));
          return {
            id: app.id,
            user_id: app.user_id,
            job_id: app.job_id,
            resume_url: app.resume_url || '',
            status: app.status || 'Applied',
            stage: app.stage || app.status || 'Under Review',
            applied_at: app.applied_at || app.created_at || 'Recent',
            job: matchedJob
          };
        });
      }
    } catch (e) {
      console.error('[CandidateActivityService] Exception in getApplications:', e);
    }
    return [];
  },

  /**
   * Submit an application.
   */
  async applyToJob(userId: string, jobId: string, resumeUrl: string = ''): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Check if already applied
      const { data } = await supabaseClient
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .eq('job_id', jobId);

      if (data && data.length > 0) {
        return { success: false, error: new Error('You have already submitted an application for this position.') };
      }

      const { error } = await supabaseClient
        .from('applications')
        .insert({
          user_id: userId,
          job_id: jobId,
          resume_url: resumeUrl,
          status: 'Sourced (Automated Scan Passed)',
          stage: 'Under Review',
          applied_at: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });

      if (error) {
        return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
      }

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Withdraw/Cancel an application.
   */
  async withdrawApplication(appId: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabaseClient
        .from('applications')
        .delete()
        .eq('id', appId);

      if (error) {
        return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
      }

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Check if user applied to job.
   */
  async hasApplied(userId: string, jobId: string): Promise<boolean> {
    try {
      const { data } = await supabaseClient
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .eq('job_id', jobId);

      return !!(data && data.length > 0);
    } catch {
      return false;
    }
  }
};
