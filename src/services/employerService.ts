import { Applicant, CompanyProfile, Job } from '../types';
import { initialCompanyProfile, mockEmployerJobs, mockApplicants } from '../data/employerMockData';

// LocalStorage Keys
const KEYS = {
  PROFILE: 'joblo_employer_profile',
  JOBS: 'joblo_employer_jobs',
  APPLICANTS: 'joblo_employer_applicants',
  ACTIVITIES: 'joblo_employer_activities'
};

export class EmployerService {
  // Initialize storage if empty
  constructor() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(KEYS.PROFILE)) {
        localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialCompanyProfile));
      }
      if (!localStorage.getItem(KEYS.JOBS)) {
        localStorage.setItem(KEYS.JOBS, JSON.stringify(mockEmployerJobs));
      }
      if (!localStorage.getItem(KEYS.APPLICANTS)) {
        localStorage.setItem(KEYS.APPLICANTS, JSON.stringify(mockApplicants));
      }
      if (!localStorage.getItem(KEYS.ACTIVITIES)) {
        const initialActivities = [
          { id: 'act-1', text: "Arjun Mehta was moved to 'Interview Scheduled' for Senior Frontend Engineer.", time: "Just now" },
          { id: 'act-2', text: "Priyanka Sen submitted a direct application for Senior Frontend Engineer.", time: "1 hour ago" },
          { id: 'act-3', text: "New draft job 'Lead Design Engineer (UI/UX)' was created.", time: "Yesterday, 04:45 PM" },
          { id: 'act-4', text: "Technical Writer position has been moved to 'Archived' status.", time: "2 days ago" }
        ];
        localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(initialActivities));
      }
    }
  }

  // --- COMPANY PROFILE SERVICES ---
  async getCompanyProfile(): Promise<CompanyProfile> {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : { ...initialCompanyProfile };
  }

  async updateCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    this.addActivity(`Company profile was updated and validated successfully.`);
    return profile;
  }

  // --- JOB MANAGEMENT SERVICES ---
  async getJobs(): Promise<Job[]> {
    const data = localStorage.getItem(KEYS.JOBS);
    return data ? JSON.parse(data) : [...mockEmployerJobs];
  }

  async saveJob(job: Job): Promise<Job> {
    const jobs = await this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    
    if (index >= 0) {
      jobs[index] = { ...job, updated_at: new Date().toISOString() };
      this.addActivity(`Job vacancy details for "${job.title}" were modified.`);
    } else {
      job.id = job.id || `job-vercel-${Date.now()}`;
      job.slug = job.slug || `${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
      job.postedDate = 'Just now';
      job.created_at = new Date().toISOString();
      jobs.unshift(job);
      this.addActivity(`New job listing "${job.title}" was published.`);
    }
    
    localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs));
    return job;
  }

  async deleteJob(jobId: string): Promise<boolean> {
    const jobs = await this.getJobs();
    const filtered = jobs.filter(j => j.id !== jobId);
    localStorage.setItem(KEYS.JOBS, JSON.stringify(filtered));
    this.addActivity(`Job listing ID ${jobId} was permanently deleted.`);
    return true;
  }

  async duplicateJob(jobId: string): Promise<Job | null> {
    const jobs = await this.getJobs();
    const source = jobs.find(j => j.id === jobId);
    if (!source) return null;

    const copy: Job = {
      ...source,
      id: `job-vercel-${Date.now()}`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${source.title} (Copy)`,
      postedDate: 'Just now',
      status: 'Draft',
      created_at: new Date().toISOString()
    };

    jobs.unshift(copy);
    localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs));
    this.addActivity(`Duplicated "${source.title}" into draft vacancy "${copy.title}".`);
    return copy;
  }

  // --- APPLICANT PIPELINE SERVICES ---
  async getApplicants(): Promise<Applicant[]> {
    const data = localStorage.getItem(KEYS.APPLICANTS);
    return data ? JSON.parse(data) : [...mockApplicants];
  }

  async updateApplicantStatus(applicantId: string, status: Applicant['status'], logDescription: string): Promise<Applicant | null> {
    const applicants = await this.getApplicants();
    const index = applicants.findIndex(a => a.id === applicantId);
    if (index < 0) return null;

    const applicant = applicants[index];
    applicant.status = status;
    applicant.timeline.push({
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status,
      description: logDescription
    });

    localStorage.setItem(KEYS.APPLICANTS, JSON.stringify(applicants));
    this.addActivity(`Applicant ${applicant.name} status updated to '${status}'.`);
    return applicant;
  }

  async addApplicantNote(applicantId: string, note: string): Promise<Applicant | null> {
    const applicants = await this.getApplicants();
    const index = applicants.findIndex(a => a.id === applicantId);
    if (index < 0) return null;

    const applicant = applicants[index];
    applicant.notes.push(note);

    localStorage.setItem(KEYS.APPLICANTS, JSON.stringify(applicants));
    return applicant;
  }

  async removeApplicantNote(applicantId: string, noteIndex: number): Promise<Applicant | null> {
    const applicants = await this.getApplicants();
    const index = applicants.findIndex(a => a.id === applicantId);
    if (index < 0) return null;

    const applicant = applicants[index];
    applicant.notes = applicant.notes.filter((_, i) => i !== noteIndex);

    localStorage.setItem(KEYS.APPLICANTS, JSON.stringify(applicants));
    return applicant;
  }

  // --- RECENT ACTIVITY LOGS ---
  async getActivities(): Promise<{ id: string; text: string; time: string }[]> {
    const data = localStorage.getItem(KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  }

  addActivity(text: string) {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(KEYS.ACTIVITIES);
    const activities = data ? JSON.parse(data) : [];
    activities.unshift({
      id: `act-${Date.now()}`,
      text,
      time: 'Just now'
    });
    // Keep only latest 10 activities
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 10)));
  }
}

export const employerService = new EmployerService();
