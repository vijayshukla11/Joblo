import { CompanyProfile, Job, Applicant } from '../types';
import { employerService } from '../services/employerService';

export class EmployerRepository {
  /**
   * Fetch company/employer profile details
   */
  async getCompanyProfile(): Promise<CompanyProfile> {
    return employerService.getCompanyProfile();
  }

  /**
   * Update company/employer profile details
   */
  async updateCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
    return employerService.updateCompanyProfile(profile);
  }

  /**
   * Retrieve job listings posted by the employer
   */
  async getJobs(): Promise<Job[]> {
    return employerService.getJobs();
  }

  /**
   * Create or update a job vacancy
   */
  async saveJob(job: Job): Promise<Job> {
    return employerService.saveJob(job);
  }

  /**
   * Permanently delete a job listing
   */
  async deleteJob(jobId: string): Promise<boolean> {
    return employerService.deleteJob(jobId);
  }

  /**
   * Duplicate job listing as a draft
   */
  async duplicateJob(jobId: string): Promise<Job | null> {
    return employerService.duplicateJob(jobId);
  }

  /**
   * Get applicants in the recruitment pipeline for employer's jobs
   */
  async getApplicants(): Promise<Applicant[]> {
    return employerService.getApplicants();
  }

  /**
   * Update candidate status in recruitment pipeline
   */
  async updateApplicantStatus(applicantId: string, status: Applicant['status'], logDescription: string): Promise<Applicant | null> {
    return employerService.updateApplicantStatus(applicantId, status, logDescription);
  }

  /**
   * Retrieve recruitment activities
   */
  async getActivities(): Promise<{ id: string; text: string; time: string }[]> {
    return employerService.getActivities();
  }
}

export const employerRepository = new EmployerRepository();
export default employerRepository;
