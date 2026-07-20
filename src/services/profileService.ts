import supabaseClient from '../integrations/supabase/client';
import { CandidateProfile } from '../types';

export const profileService = {
  /**
   * Fetch candidate profile for a user ID.
   * If not found, returns a blank/default profile.
   */
  async getProfile(userId: string): Promise<CandidateProfile> {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[ProfileService] Error fetching profile:', error);
      }

      if (data) {
        return {
          id: data.id,
          user_id: data.user_id,
          full_name: data.full_name || '',
          phone: data.phone || '',
          dob: data.dob || '',
          gender: data.gender || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || 'India',
          skills: Array.isArray(data.skills) ? data.skills : (data.skills ? JSON.parse(data.skills) : []),
          experience: data.experience || '',
          education: data.education || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          portfolio_url: data.portfolio_url || '',
          resume_url: data.resume_url || '',
          profile_photo: data.profile_photo || '',
          
          address: data.address || '',
          pincode: data.pincode || '',
          edu_10th_percentage: data.edu_10th_percentage || '',
          edu_12th_percentage: data.edu_12th_percentage || '',
          edu_diploma_percentage: data.edu_diploma_percentage || '',
          edu_graduation_percentage: data.edu_graduation_percentage || '',
          edu_masters_percentage: data.edu_masters_percentage || '',
          edu_university: data.edu_university || '',
          edu_passing_year: data.edu_passing_year || '',
          edu_cgpa: data.edu_cgpa || '',
          exp_is_fresher: data.exp_is_fresher !== undefined ? data.exp_is_fresher : false,
          exp_company: data.exp_company || '',
          exp_designation: data.exp_designation || '',
          exp_joining_date: data.exp_joining_date || '',
          exp_leaving_date: data.exp_leaving_date || '',
          exp_responsibilities: data.exp_responsibilities || '',
          exp_achievements: data.exp_achievements || '',
          skills_technical: Array.isArray(data.skills_technical) ? data.skills_technical : [],
          skills_soft: Array.isArray(data.skills_soft) ? data.skills_soft : [],
          skills_languages: Array.isArray(data.skills_languages) ? data.skills_languages : [],
          skills_level: data.skills_level || '',
          skills_certificates: Array.isArray(data.skills_certificates) ? data.skills_certificates : [],
          resume_ats_score: data.resume_ats_score || 0,
          resume_last_updated: data.resume_last_updated || '',
          pref_role: data.pref_role || '',
          pref_industry: data.pref_industry || '',
          pref_city: data.pref_city || '',
          pref_state: data.pref_state || '',
          pref_expected_salary: data.pref_expected_salary || '',
          pref_current_salary: data.pref_current_salary || '',
          pref_notice_period: data.pref_notice_period || '',
          pref_employment_type: data.pref_employment_type || '',
          pref_work_mode: data.pref_work_mode || '',
          pref_open_to_relocate: data.pref_open_to_relocate !== undefined ? data.pref_open_to_relocate : false,
          link_website: data.link_website || '',
          link_behance: data.link_behance || '',
          link_dribbble: data.link_dribbble || '',
          ach_projects: data.ach_projects || '',
          ach_awards: data.ach_awards || '',
          ach_hackathons: data.ach_hackathons || '',
          ach_publications: data.ach_publications || '',
          ach_volunteer: data.ach_volunteer || '',
          settings_notif_recommendations: data.settings_notif_recommendations !== undefined ? data.settings_notif_recommendations : true,
          settings_notif_updates: data.settings_notif_updates !== undefined ? data.settings_notif_updates : true,
          settings_notif_invites: data.settings_notif_invites !== undefined ? data.settings_notif_invites : true,
          settings_notif_tips: data.settings_notif_tips !== undefined ? data.settings_notif_tips : true,
          settings_notif_gov_alerts: data.settings_notif_gov_alerts !== undefined ? data.settings_notif_gov_alerts : true,
          settings_notif_system: data.settings_notif_system !== undefined ? data.settings_notif_system : true,
          settings_privacy_public: data.settings_privacy_public !== undefined ? data.settings_privacy_public : true,
          is_profile_wizard_completed: data.is_profile_wizard_completed !== undefined ? data.is_profile_wizard_completed : false,
          wizard_step: data.wizard_step || 1
        };
      }
    } catch (e) {
      console.error('[ProfileService] Exception in getProfile:', e);
    }

    // Default empty profile
    return {
      id: '',
      user_id: userId,
      full_name: '',
      phone: '',
      dob: '',
      gender: '',
      city: '',
      state: '',
      country: 'India',
      skills: [],
      experience: '',
      education: '',
      linkedin_url: '',
      github_url: '',
      portfolio_url: '',
      resume_url: '',
      profile_photo: '',
      
      address: '',
      pincode: '',
      edu_10th_percentage: '',
      edu_12th_percentage: '',
      edu_diploma_percentage: '',
      edu_graduation_percentage: '',
      edu_masters_percentage: '',
      edu_university: '',
      edu_passing_year: '',
      edu_cgpa: '',
      exp_is_fresher: false,
      exp_company: '',
      exp_designation: '',
      exp_joining_date: '',
      exp_leaving_date: '',
      exp_responsibilities: '',
      exp_achievements: '',
      skills_technical: [],
      skills_soft: [],
      skills_languages: [],
      skills_level: '',
      skills_certificates: [],
      resume_ats_score: 0,
      resume_last_updated: '',
      pref_role: '',
      pref_industry: '',
      pref_city: '',
      pref_state: '',
      pref_expected_salary: '',
      pref_current_salary: '',
      pref_notice_period: '',
      pref_employment_type: '',
      pref_work_mode: '',
      pref_open_to_relocate: false,
      link_website: '',
      link_behance: '',
      link_dribbble: '',
      ach_projects: '',
      ach_awards: '',
      ach_hackathons: '',
      ach_publications: '',
      ach_volunteer: '',
      settings_notif_recommendations: true,
      settings_notif_updates: true,
      settings_notif_invites: true,
      settings_notif_tips: true,
      settings_notif_gov_alerts: true,
      settings_notif_system: true,
      settings_privacy_public: true,
      is_profile_wizard_completed: false,
      wizard_step: 1
    };
  },

  /**
   * Save or update the candidate profile in Supabase.
   */
  async saveProfile(profile: CandidateProfile): Promise<{ data: CandidateProfile | null; error: Error | null }> {
    try {
      const formatted = {
        ...profile,
        skills: profile.skills
      };

      const { data, error } = await supabaseClient
        .from('profiles')
        .upsert(formatted);

      if (error) {
        return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      return { data: profile, error: null };
    } catch (e: any) {
      return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Upload profile picture.
   */
  async uploadProfilePhoto(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;
      const { error } = await supabaseClient.storage.from('avatars').upload(filePath, file);

      if (error) {
        return { url: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      const { data } = supabaseClient.storage.from('avatars').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (e: any) {
      return { url: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Upload resume document.
   */
  async uploadResume(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/resume_${Date.now()}.${fileExt}`;
      const { error } = await supabaseClient.storage.from('resumes').upload(filePath, file);

      if (error) {
        return { url: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      const { data } = supabaseClient.storage.from('resumes').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (e: any) {
      return { url: null, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Delete resume document.
   */
  async deleteResume(resumeUrl: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      if (resumeUrl.includes('storage/resumes/')) {
        const path = resumeUrl.split('storage/resumes/').pop();
        if (path) {
          await supabaseClient.storage.from('resumes').remove([path]);
        }
      }
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  },

  /**
   * Calculate profile completion percentage.
   * Splitting into 8 core sections representing Step 1 to Step 8.
   * Each section completed awards 12.5% progress.
   */
  calculateCompletion(profile: CandidateProfile | null): number {
    if (!profile) return 0;
    let sectionsCompleted = 0;

    // Section 1: Basic Info
    if (profile.full_name && profile.phone && profile.dob && profile.gender) {
      sectionsCompleted += 1;
    }
    // Section 2: Education
    if (profile.edu_university && profile.edu_passing_year && (profile.edu_10th_percentage || profile.edu_graduation_percentage)) {
      sectionsCompleted += 1;
    }
    // Section 3: Experience
    if (profile.exp_is_fresher || (profile.exp_company && profile.exp_designation)) {
      sectionsCompleted += 1;
    }
    // Section 4: Skills
    if ((profile.skills_technical && profile.skills_technical.length > 0) || (profile.skills && profile.skills.length > 0)) {
      sectionsCompleted += 1;
    }
    // Section 5: Resume
    if (profile.resume_url) {
      sectionsCompleted += 1;
    }
    // Section 6: Career Preferences
    if (profile.pref_role && profile.pref_industry && profile.pref_city) {
      sectionsCompleted += 1;
    }
    // Section 7: Professional Links
    if (profile.linkedin_url || profile.github_url || profile.portfolio_url) {
      sectionsCompleted += 1;
    }
    // Section 8: Achievements
    if (profile.ach_projects || profile.ach_awards || profile.ach_hackathons) {
      sectionsCompleted += 1;
    }

    // Convert to percentage: each section is 12.5%, rounded to nearest integer
    // e.g., 1 -> 12%, 2 -> 25%, 3 -> 37%, 4 -> 50%, 5 -> 62%, 6 -> 75%, 7 -> 87%, 8 -> 100%
    // Let's make it exactly match the standard steps: 0 -> 10% base default if name is filled, etc. Let's make it clean and proportional.
    const stepsScore = sectionsCompleted * 12.5;
    
    // We can also have individual field increments for higher resolution, or make it exactly step-wise:
    if (sectionsCompleted === 0) {
      return profile.full_name ? 10 : 0;
    }
    
    return Math.min(Math.round(stepsScore), 100);
  }
};
