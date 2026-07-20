export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  rating: number;
  openingsCount: number;
  openings?: number; // Legacy support
  location: string;
  website: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  jobCount: number;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  popularity: 'High' | 'Medium' | 'Trending';
}

export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
  isTechHub: boolean;
  isGovHub: boolean;
  jobCount: number;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  company?: string; // Legacy support
  location: string;
  country: string;
  salary: string; // e.g., "₹18,00,000 - ₹24,00,000 / year"
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  category?: 'Tech' | 'Finance' | 'Government' | 'Marketing' | 'Healthcare' | 'Education' | 'Design' | string; // Extended
  experience: string; // e.g., "1-3 years"
  postedDate: string; // e.g., "2 hours ago"
  skills: string[];
  description: string;
  isHot?: boolean;
  isRemote?: boolean;
  aiMatchScore?: number; // Match rating for the AI Job Match feed
  savedStatus?: boolean;
  status?: 'Draft' | 'Published' | 'Archived';
  benefits?: string[];
  applicationLink?: string;
  deadline?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GovernmentJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  logo: string;
  location: string;
  salary: string; // e.g., "Pay Level 7 (₹44,900 - ₹1,42,400)"
  experience: 'Fresher' | 'Required';
  examBody: 'SSC' | 'UPSC' | 'State PSC' | 'Bank PO' | 'Railways';
  postedDate: string;
  syllabusLink?: string;
  applicationDeadline: string;
  skillsRequired: string[];
  eligibility: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface CareerGuide {
  id: string;
  title: string;
  category: 'Resume' | 'Interview' | 'Career Growth' | 'Government Exams' | string;
  readTime: string;
  excerpt: string;
  authorName: string;
  authorRole: string;
  authorVerified: boolean;
  lastUpdated: string;
  author?: { // Legacy support
    name: string;
    role: string;
    verified: boolean;
  };
}

export interface InterviewPrep {
  id: string;
  topic: string;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  type?: 'text' | 'roadmap' | 'suggestions';
  roadmapSteps?: { title: string; desc: string; duration: string }[];
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  skills: string[];
  experience: string;
  education: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  resume_url: string;
  profile_photo: string;
  
  // Basic Info additional
  address?: string;
  pincode?: string;

  // Education additional
  edu_10th_percentage?: string;
  edu_12th_percentage?: string;
  edu_diploma_percentage?: string;
  edu_graduation_percentage?: string;
  edu_masters_percentage?: string;
  edu_university?: string;
  edu_passing_year?: string;
  edu_cgpa?: string;

  // Experience additional
  exp_is_fresher?: boolean;
  exp_company?: string;
  exp_designation?: string;
  exp_joining_date?: string;
  exp_leaving_date?: string;
  exp_responsibilities?: string;
  exp_achievements?: string;

  // Skills additional
  skills_technical?: string[];
  skills_soft?: string[];
  skills_languages?: string[];
  skills_level?: string;
  skills_certificates?: string[];

  // Resume additional
  resume_ats_score?: number;
  resume_last_updated?: string;

  // Career Preferences
  pref_role?: string;
  pref_industry?: string;
  pref_city?: string;
  pref_state?: string;
  pref_expected_salary?: string;
  pref_current_salary?: string;
  pref_notice_period?: string;
  pref_employment_type?: string;
  pref_work_mode?: string;
  pref_open_to_relocate?: boolean;

  // Professional Links
  link_website?: string;
  link_behance?: string;
  link_dribbble?: string;

  // Achievements, projects, etc.
  ach_projects?: string;
  ach_awards?: string;
  ach_hackathons?: string;
  ach_publications?: string;
  ach_volunteer?: string;

  // Security / Settings
  settings_notif_recommendations?: boolean;
  settings_notif_updates?: boolean;
  settings_notif_invites?: boolean;
  settings_notif_tips?: boolean;
  settings_notif_gov_alerts?: boolean;
  settings_notif_system?: boolean;
  settings_privacy_public?: boolean;

  // Meta workflow
  is_profile_wizard_completed?: boolean;
  wizard_step?: number;

  created_at?: string;
  updated_at?: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Rejected' | 'Interview Scheduled';
  experience: string;
  education: string;
  resumeUrl: string;
  resumeSkills: string[];
  coverLetter: string;
  timeline: { date: string; status: string; description: string }[];
  notes: string[];
}

export interface CompanyProfile {
  name: string;
  legalName?: string;
  logo: string;
  coverImage: string;
  gstNumber?: string;
  panPlaceholder?: string;
  industry: string;
  size: string;
  foundedYear: string;
  website: string;
  linkedin: string;
  facebook?: string;
  instagram?: string;
  twitter_x?: string;
  headOffice: string;
  branches: string[];
  about: string;
  mission?: string;
  vision?: string;
  culture: string;
  benefits: string[];
  officeGallery: string[];
  hiringStatus: 'Active' | 'On Hold' | 'Selective';
  awards: string[];
  companyEmail?: string;
  recruiterName?: string;
  recruiterMobile?: string;
  supportEmail?: string;
  isProfileComplete?: boolean;
  wizardStep?: number;
}


