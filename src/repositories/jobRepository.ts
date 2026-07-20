import { Job, GovernmentJob, Company, Category, Skill, Location, CareerGuide, InterviewPrep, FAQItem, Testimonial } from '../types';
import supabaseClient from '../integrations/supabase/client';
import { adminService } from '../services/adminService';
import {
  MOCK_JOBS,
  MOCK_GOVERNMENT_JOBS,
  MOCK_COMPANIES,
  MOCK_CATEGORIES,
  MOCK_SKILLS,
  MOCK_LOCATIONS,
  MOCK_GUIDES,
  MOCK_INTERVIEW_PREP,
  MOCK_FAQS,
  MOCK_TESTIMONIALS
} from '../constants';

export class JobRepository {
  async getJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabaseClient.from('jobs').select('*');
      if (error) {
        console.error('[JobRepository] Error getting jobs from Supabase:', error);
        return [...MOCK_JOBS];
      }
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          slug: item.slug || String(item.id),
          title: item.title,
          companyId: item.companyId || 'c-1',
          companyName: item.companyName || item.company || 'Corporate Partner',
          companyLogo: item.companyLogo || '⚡',
          location: item.location || 'India',
          country: item.country || 'India',
          salary: item.salary || 'Competitive Pay',
          employmentType: item.employmentType || item.employment_type || 'Full-time',
          experience: item.experience || '0-2 years',
          postedDate: item.postedDate || item.posted_at || 'Recent',
          skills: Array.isArray(item.skills) ? item.skills : (item.skills ? String(item.skills).split(',').map(s => s.trim()) : []),
          description: item.description || '',
          isHot: item.isHot !== undefined ? item.isHot : false,
          isRemote: item.isRemote !== undefined ? item.isRemote : false,
          aiMatchScore: item.aiMatchScore || 80,
          category: item.category || 'Tech',
          status: item.status || 'Published',
          benefits: Array.isArray(item.benefits) ? item.benefits : (item.benefits ? String(item.benefits).split(',').map((b: string) => b.trim()) : []),
          applicationLink: item.applicationLink || item.application_link || '',
          deadline: item.deadline || '',
          isFeatured: item.isFeatured !== undefined ? item.isFeatured : (item.is_featured !== undefined ? item.is_featured : false),
          isUrgent: item.isUrgent !== undefined ? item.isUrgent : (item.is_urgent !== undefined ? item.is_urgent : false),
          created_at: item.created_at || '',
          updated_at: item.updated_at || ''
        }));
      }
    } catch (e) {
      console.error('[JobRepository] Exception in getJobs:', e);
    }
    return [...MOCK_JOBS];
  }

  async getGovernmentJobs(): Promise<GovernmentJob[]> {
    try {
      const live = await adminService.getGovernmentJobs();
      if (live && live.length > 0) {
        return live;
      }
    } catch (e) {
      console.error('[JobRepository] Error fetching live government jobs:', e);
    }
    return [...MOCK_GOVERNMENT_JOBS];
  }

  async getCompanies(): Promise<Company[]> {
    try {
      const verifications = await adminService.getCompanyVerifications();
      const verifiedCompanies: Company[] = verifications.map((v) => ({
        id: v.id,
        name: v.name,
        logo: v.logo || '🏢',
        industry: v.industry || 'Corporate Sourcing',
        location: v.location || 'India',
        rating: 4.8,
        size: v.size || '50-100',
        website: v.website || 'https://linear.app',
        slug: v.slug || v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        openingsCount: 3
      }));
      if (verifiedCompanies && verifiedCompanies.length > 0) {
        const combined = [...verifiedCompanies];
        MOCK_COMPANIES.forEach((mockComp) => {
          if (!combined.some((c) => c.name.toLowerCase() === mockComp.name.toLowerCase())) {
            combined.push(mockComp);
          }
        });
        return combined;
      }
    } catch (e) {
      console.error('[JobRepository] Error getting merged companies:', e);
    }
    return [...MOCK_COMPANIES];
  }

  async getCategories(): Promise<Category[]> {
    try {
      const live = await adminService.getCategories();
      if (live && live.length > 0) {
        return live.map(l => ({
          id: l.id,
          name: l.name,
          slug: l.seoSlug || l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: l.icon || '💼',
          jobCount: 12,
          description: l.description || 'Verified job category directory'
        }));
      }
    } catch (e) {
      console.error('[JobRepository] Error getting live categories:', e);
    }
    return [...MOCK_CATEGORIES];
  }

  async getSkills(): Promise<Skill[]> {
    return [...MOCK_SKILLS];
  }

  async getLocations(): Promise<Location[]> {
    return [...MOCK_LOCATIONS];
  }

  async getGuides(): Promise<CareerGuide[]> {
    return [...MOCK_GUIDES];
  }

  async getInterviewQuestions(): Promise<InterviewPrep[]> {
    return [...MOCK_INTERVIEW_PREP];
  }

  async getFAQs(): Promise<FAQItem[]> {
    return [...MOCK_FAQS];
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return [...MOCK_TESTIMONIALS];
  }
}

export const jobRepository = new JobRepository();
