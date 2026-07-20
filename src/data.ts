import {
  MOCK_JOBS as CONST_JOBS,
  MOCK_COMPANIES as CONST_COMPANIES,
  MOCK_GUIDES as CONST_GUIDES,
  MOCK_INTERVIEW_PREP as CONST_PREP,
  MOCK_FAQS as CONST_FAQS
} from './constants';
import { Job, Company, CareerGuide, InterviewPrep, FAQItem } from './types';

export const MOCK_JOBS: Job[] = CONST_JOBS.map(job => ({
  ...job,
  company: job.companyName,
  logo: job.companyLogo,
  // Map back types to satisfy older layout files
  type: job.employmentType as any,
  category: 'Tech'
}));

export const MOCK_COMPANIES: Company[] = CONST_COMPANIES.map(company => ({
  ...company,
  openings: company.openingsCount
}));

export const MOCK_GUIDES: CareerGuide[] = CONST_GUIDES.map(guide => ({
  ...guide,
  author: {
    name: guide.authorName,
    role: guide.authorRole,
    verified: guide.authorVerified
  }
}));

export const MOCK_INTERVIEW_PREP: InterviewPrep[] = [...CONST_PREP];
export const MOCK_FAQS: FAQItem[] = [...CONST_FAQS];
