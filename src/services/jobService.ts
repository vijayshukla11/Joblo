import { jobRepository } from '../repositories/jobRepository';
import { Job, GovernmentJob, Company, Category, Skill, Location, CareerGuide, FAQItem } from '../types';

export class JobService {
  // Mock analytics logging
  trackInteraction(analyticsId: string, payload?: Record<string, any>): void {
    console.log(`[Analytics Track] ID: ${analyticsId}`, payload || {});
  }

  async searchJobs(query: string, filterType: string): Promise<Job[]> {
    const jobs = await jobRepository.getJobs();
    const cleanQuery = query.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        cleanQuery === '' ||
        job.title.toLowerCase().includes(cleanQuery) ||
        job.companyName.toLowerCase().includes(cleanQuery) ||
        job.description.toLowerCase().includes(cleanQuery) ||
        job.skills.some(skill => skill.toLowerCase().includes(cleanQuery));

      const matchesType =
        filterType === 'All' ||
        (filterType === 'Remote' && job.employmentType === 'Remote') ||
        (filterType === 'Full-time' && job.employmentType === 'Full-time') ||
        (filterType === 'Internship' && job.employmentType === 'Internship');

      return matchesSearch && matchesType;
    });
  }

  async searchGovernmentJobs(query: string): Promise<GovernmentJob[]> {
    const govJobs = await jobRepository.getGovernmentJobs();
    const cleanQuery = query.toLowerCase().trim();

    return govJobs.filter((job) => {
      return (
        cleanQuery === '' ||
        job.title.toLowerCase().includes(cleanQuery) ||
        job.department.toLowerCase().includes(cleanQuery) ||
        job.examBody.toLowerCase().includes(cleanQuery) ||
        job.skillsRequired.some(skill => skill.toLowerCase().includes(cleanQuery))
      );
    });
  }

  async getPopularSearches(): Promise<string[]> {
    return ['SSC CGL Exam 2026', 'Remote Frontend React 19', 'UPSC Cadet Eligibility', 'Vercel Bengaluru UI', 'Stripe Developer Contract'];
  }
}

export const jobService = new JobService();
