import { CandidateProfile, Job } from '../types';
import { profileService } from '../services/profileService';
import { candidateActivityService, ApplicationRecord } from '../services/candidateActivityService';

export class CandidateRepository {
  /**
   * Fetch a candidate's profile
   */
  async getProfile(userId: string): Promise<CandidateProfile> {
    return profileService.getProfile(userId);
  }

  /**
   * Save or update a candidate's profile
   */
  async saveProfile(profile: CandidateProfile): Promise<{ data: CandidateProfile | null; error: Error | null }> {
    return profileService.saveProfile(profile);
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
    return profileService.uploadProfilePhoto(userId, file);
  }

  /**
   * Upload resume document
   */
  async uploadResume(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
    return profileService.uploadResume(userId, file);
  }

  /**
   * Delete resume document
   */
  async deleteResume(resumeUrl: string): Promise<{ success: boolean; error: Error | null }> {
    return profileService.deleteResume(resumeUrl);
  }

  /**
   * Get all bookmarked jobs
   */
  async getSavedJobs(userId: string): Promise<Job[]> {
    return candidateActivityService.getSavedJobs(userId);
  }

  /**
   * Bookmark a job vacancy
   */
  async saveJob(userId: string, jobId: string): Promise<{ success: boolean; error: Error | null }> {
    return candidateActivityService.saveJob(userId, jobId);
  }

  /**
   * Remove job bookmark
   */
  async removeSavedJob(userId: string, jobId: string): Promise<{ success: boolean; error: Error | null }> {
    return candidateActivityService.removeSavedJob(userId, jobId);
  }

  /**
   * Get all applications submitted by candidate
   */
  async getApplications(userId: string): Promise<Array<ApplicationRecord & { job?: Job }>> {
    return candidateActivityService.getApplications(userId);
  }

  /**
   * Submit application to a job vacancy
   */
  async applyToJob(userId: string, jobId: string, resumeUrl: string = ''): Promise<{ success: boolean; error: Error | null }> {
    return candidateActivityService.applyToJob(userId, jobId, resumeUrl);
  }
}

export const candidateRepository = new CandidateRepository();
export default candidateRepository;
