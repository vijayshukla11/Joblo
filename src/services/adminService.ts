import { Job, GovernmentJob, Company, Category, Applicant } from '../types';

// Let's declare our detailed Admin Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Applicant' | 'Employer' | 'Admin';
  status: 'Active' | 'Suspended' | 'Pending';
  created_at: string;
}

export interface AdminJobSeeker {
  id: string;
  name: string;
  email: string;
  resumeUrl: string;
  profileCompletion: number;
  status: 'Active' | 'Suspended';
  education: string;
  experience: string;
  appliedCount: number;
  savedCount: number;
  skills: string[];
}

export interface CompanyVerification {
  id: string;
  name: string;
  industry: string;
  jobsCount: number;
  verified: boolean;
  verificationStatus: 'Approved' | 'Pending' | 'Rejected';
  gstNumber: string;
  panPlaceholder: string;
  verificationNotes: string;
  documentUrl: string;
  logo?: string;
  website?: string;
  description?: string;
  location?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  slug?: string;
  legalName?: string;
  size?: string;
  foundedYear?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  parentCategory?: string;
  icon: string;
  ordering: number;
  seoSlug: string;
  description: string;
}

export interface AdminBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'Draft' | 'Published';
  categories: string[];
  tags: string[];
  featuredImage: string;
  author?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  created_at: string;
}

export interface CareerResource {
  id: string;
  title: string;
  category: 'Resume Tips' | 'Interview Questions' | 'Salary Guides' | 'Career Guides' | 'Skill Roadmaps';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topicOrRole?: string;
  excerpt: string;
  content: string;
  links: { name: string; url: string }[];
  seoTitle: string;
  seoDescription: string;
}

export interface AdminSeoPage {
  id: string;
  pagePath: string;
  metaTitle: string;
  metaDescription: string;
  openGraphImage: string;
  canonicalUrl: string;
  redirectUrl?: string;
  sitemapStatus: 'Included' | 'Excluded';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Resolved';
  replyMessage?: string;
  createdAt: string;
}

export interface SiteSettings {
  logo: string;
  favicon: string;
  homepageBanner: string;
  footerText: string;
  footerLinks: string[];
  socialLinks: { twitter: string; linkedin: string; github: string };
  contactDetails: { email: string; phone: string; address: string };
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  securityEnabled: boolean;
  notificationPrefs: { securityAlerts: boolean; systemLogs: boolean; weeklyReports: boolean };
}

export interface AdminActivity {
  id: string;
  text: string;
  time: string;
  type: 'user' | 'job' | 'company' | 'content' | 'security' | 'system';
}

export interface AdminAuthor {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  activeGuides: number;
  email: string;
  bio?: string;
  avatarSymbol?: string;
}

export interface AutomationWebhook {
  id: string;
  name: string;
  endpointUrl: string;
  method: 'POST' | 'GET' | 'PUT';
  intervalSchedule: string;
  lastRun: string;
  status: 'Healthy' | 'Failed' | 'Paused';
  isActive: boolean;
}

// LocalStorage Keys for Admin Portal
const KEYS = {
  USERS: 'joblo_admin_users',
  JOB_SEEKERS: 'joblo_admin_job_seekers',
  COMPANIES_VERIFICATION: 'joblo_admin_companies_verification',
  CATEGORIES: 'joblo_admin_categories',
  BLOGS: 'joblo_admin_blogs',
  CAREER_RESOURCES: 'joblo_admin_career_resources',
  GOV_JOBS: 'joblo_admin_gov_jobs',
  SEO: 'joblo_admin_seo',
  NEWSLETTER: 'joblo_admin_newsletter',
  CONTACTS: 'joblo_admin_contacts',
  SITE_SETTINGS: 'joblo_admin_site_settings',
  PROFILE: 'joblo_admin_profile',
  ACTIVITIES: 'joblo_admin_activities',
  AUTHORS: 'joblo_admin_authors',
  WEBHOOKS: 'joblo_admin_webhooks',
};

export class AdminService {
  constructor() {
    if (typeof window !== 'undefined') {
      this.initDatabase();
    }
  }

  private initDatabase() {
    // 1. Users initial seed
    if (!localStorage.getItem(KEYS.USERS)) {
      const initialUsers: AdminUser[] = [
        { id: 'usr-1', name: 'Vijay Kumar', email: 'vijay@example.com', role: 'Applicant', status: 'Active', created_at: '2026-06-15' },
        { id: 'usr-2', name: 'Rohan Sharma', email: 'rohan.sharma@companies.in', role: 'Employer', status: 'Pending', created_at: '2026-07-01' },
        { id: 'usr-3', name: 'Admin Root', email: 'admin@joblo.in', role: 'Admin', status: 'Active', created_at: '2026-01-01' },
        { id: 'usr-4', name: 'Anjali Gupta', email: 'anjali.g@gmail.com', role: 'Applicant', status: 'Active', created_at: '2026-07-10' },
        { id: 'usr-5', name: 'Siddharth Sen', email: 'sid.s@startup.co', role: 'Employer', status: 'Suspended', created_at: '2026-05-20' },
      ];
      localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    }

    // 2. Job Seekers initial seed
    if (!localStorage.getItem(KEYS.JOB_SEEKERS)) {
      const initialJobSeekers: AdminJobSeeker[] = [
        {
          id: 'jsk-1',
          name: 'Vijay Kumar',
          email: 'vijay@example.com',
          resumeUrl: 'https://joblo.in/resumes/vijay_resume_2026.pdf',
          profileCompletion: 92,
          status: 'Active',
          education: 'M.Tech in Software Engineering, IIT Bombay',
          experience: '3 Years (Ex-Amazon Developer)',
          appliedCount: 8,
          savedCount: 14,
          skills: ['React 19', 'TypeScript', 'Next.js 15', 'Tailwind CSS', 'GraphQL'],
        },
        {
          id: 'jsk-2',
          name: 'Anjali Gupta',
          email: 'anjali.g@gmail.com',
          resumeUrl: 'https://joblo.in/resumes/anjali_cv.pdf',
          profileCompletion: 76,
          status: 'Active',
          education: 'B.Des in Product Design, NID Ahmedabad',
          experience: 'Fresher (UX Design Intern at Swiggy)',
          appliedCount: 3,
          savedCount: 5,
          skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping', 'User Testing'],
        },
      ];
      localStorage.setItem(KEYS.JOB_SEEKERS, JSON.stringify(initialJobSeekers));
    }

    // 3. Companies Verification initial seed
    if (!localStorage.getItem(KEYS.COMPANIES_VERIFICATION)) {
      const initialVerification: CompanyVerification[] = [
        {
          id: 'comp-1',
          name: 'Linear Labs',
          industry: 'Software & Productivity Tools',
          jobsCount: 4,
          verified: true,
          verificationStatus: 'Approved',
          gstNumber: '27AAAAA1111A1Z1',
          panPlaceholder: 'LNRPL5501B',
          verificationNotes: 'MCA incorporation certificate verified. Matches core legal registry records.',
          documentUrl: 'https://joblo.in/documents/linear_incorporation.pdf',
        },
        {
          id: 'comp-2',
          name: 'TechLabs Sourcing',
          industry: 'Staffing & HR Solutions',
          jobsCount: 15,
          verified: false,
          verificationStatus: 'Pending',
          gstNumber: '29BBBBB2222B2Z2',
          panPlaceholder: 'TCHPL9902A',
          verificationNotes: 'GST declaration submitted. Waiting for physical office check or verification call.',
          documentUrl: 'https://joblo.in/documents/techlabs_gst.pdf',
        },
        {
          id: 'comp-3',
          name: 'Zomato India',
          industry: 'FoodTech & Logistics',
          jobsCount: 8,
          verified: true,
          verificationStatus: 'Approved',
          gstNumber: '07CCCCC3333C3Z3',
          panPlaceholder: 'ZMTPL7712C',
          verificationNotes: 'BSE Listed enterprise entity. Automatic verification approved.',
          documentUrl: 'https://joblo.in/documents/zomato_registration.pdf',
        },
        {
          id: 'comp-4',
          name: 'Vercel India',
          industry: 'Cloud Infrastructure & Hosting',
          jobsCount: 3,
          verified: true,
          verificationStatus: 'Approved',
          gstNumber: '29AAAAA1111A1Z1',
          panPlaceholder: 'ABCDE1234F',
          verificationNotes: 'MCA Indian subsidiary verification completed on Vercel Developer Systems India Pvt Ltd.',
          documentUrl: 'https://joblo.in/documents/vercel_mca_certificate.pdf',
        },
      ];
      localStorage.setItem(KEYS.COMPANIES_VERIFICATION, JSON.stringify(initialVerification));
    }

    // 4. Categories initial seed
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      const initialCategories: AdminCategory[] = [
        { id: 'cat-1', name: 'Software Engineering', icon: '💻', ordering: 1, seoSlug: 'software-engineering', description: 'React, Node, Cloud Native, DevOps & Frontend Architecture' },
        { id: 'cat-2', name: 'Product & UX Design', icon: '🎨', ordering: 2, seoSlug: 'design-jobs', description: 'UX/UI Research, Visual Design, and Figma design systems.' },
        { id: 'cat-3', name: 'Government Exams', icon: '🏛️', ordering: 3, seoSlug: 'government-exams', description: 'UPSC, SSC, State PSC, and Banking administrative roles.' },
        { id: 'cat-4', name: 'Global Remote Sourcing', icon: '🌍', ordering: 4, seoSlug: 'remote-jobs', description: '100% remote asynchronous developer positions with global payouts' },
      ];
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories));
    }

    // 5. Blogs initial seed
    if (!localStorage.getItem(KEYS.BLOGS)) {
      const initialBlogs: AdminBlog[] = [
        {
          id: 'blog-1',
          title: 'A Complete Guide to Next.js 15 Performance Enhancements',
          slug: 'nextjs-15-performance-enhancements',
          excerpt: 'Learn how to leverage Next.js 15 and React 19 to achieve instant first-contentful-paints in complex web portals.',
          content: 'Next.js 15 introduces partial pre-rendering, advanced caching control protocols, and default async route segment resolution. In this article, we cover how to leverage compiler optimizations to reduce browser bundle weights and speed up core web vitals for interactive consumer applications.',
          status: 'Published',
          categories: ['Software Engineering', 'Product & UX Design'],
          tags: ['nextjs', 'react', 'performance', 'frontend'],
          featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          seoTitle: 'Next.js 15 Performance Masterclass | JOB Lo',
          seoDescription: 'Learn how to leverage Next.js 15 compiler optimizations and React Server Components for maximum core web vitals.',
          created_at: '2026-07-15T10:30:00Z',
        },
        {
          id: 'blog-2',
          title: 'Navigating India DPDP Regulations for Talent Acquisition Team',
          slug: 'navigating-india-dpdp-regulations-recruiting',
          excerpt: 'An ultimate checklist for HR leaders in India to align candidate sourcing and screening with national DPDP mandates.',
          content: 'The Digital Personal Data Protection (DPDP) Act outlines strict consent mandates for storing, processing, and validating candidate resumes. Here is how your company can ensure total compliance without sacrificing applicant tracking speeds, incorporating end-to-end cryptographic consents.',
          status: 'Draft',
          categories: ['Software Engineering'],
          tags: ['compliance', 'dpdp', 'recruiting', 'hr'],
          featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
          seoTitle: 'India DPDP Compliance for HR and Recruitment | JOB Lo',
          seoDescription: 'Everything you need to know about the India Digital Personal Data Protection Act (DPDP) in candidate resume pipelines.',
          created_at: '2026-07-18T14:45:00Z',
        },
      ];
      localStorage.setItem(KEYS.BLOGS, JSON.stringify(initialBlogs));
    }

    // 6. Career Resources initial seed
    if (!localStorage.getItem(KEYS.CAREER_RESOURCES)) {
      const initialResources: CareerResource[] = [
        {
          id: 'res-1',
          title: 'Mastering the Frontend Engineering Behavioral Loop',
          category: 'Interview Questions',
          difficulty: 'Medium',
          topicOrRole: 'Frontend Engineer',
          excerpt: 'Common situational and system architectural questions asked at top-tier product scale teams.',
          content: 'When interviewing for senior frontend positions at companies like Linear or Vercel, questions range from handling long main-thread blockage to aligning web sockets under network latency. Practice with these key scenario responses.',
          links: [
            { name: 'System Design Prep Sheet', url: 'https://vercel.com' },
            { name: 'Core Web Vitals Checklist', url: 'https://web.dev' },
          ],
          seoTitle: 'Frontend Interview Prep Guide | JOB Lo',
          seoDescription: 'Practice behavioral and technical frontend interview questions with premium sample answers.',
        },
        {
          id: 'res-2',
          title: 'Modern ATS-Friendly Resume Construction Blueprint',
          category: 'Resume Tips',
          difficulty: 'Easy',
          topicOrRole: 'All Professions',
          excerpt: 'Optimize your layout, metrics density, and system parse structures to cross 95+ score ranks.',
          content: 'An ATS (Applicant Tracking System) parses your profile using semantic entity extractors. Avoid side columns, multi-color backgrounds, and embedded canvas graphics. Use simple Inter typography, descriptive bullet structures, and clear metrics.',
          links: [],
          seoTitle: 'ATS Resume Optimization Tips | JOB Lo',
          seoDescription: 'Step-by-step tutorial to optimize your resume for ATS parsers and secure interviews.',
        },
      ];
      localStorage.setItem(KEYS.CAREER_RESOURCES, JSON.stringify(initialResources));
    }

    // 7. Government Jobs initial seed
    if (!localStorage.getItem(KEYS.GOV_JOBS)) {
      const initialGovJobs: GovernmentJob[] = [
        {
          id: 'gov-1',
          slug: 'aso-mea-gazetted-recruitment-2026',
          title: 'Assistant Section Officer (ASO) Gazetted',
          department: 'Ministry of External Affairs',
          logo: '🏛️',
          location: 'New Delhi, Delhi NCR',
          salary: 'Pay Level 7 (₹44,900 - ₹1,42,400)',
          experience: 'Fresher',
          examBody: 'SSC',
          postedDate: '2 days ago',
          syllabusLink: 'https://ssc.gov.in/syllabus/aso',
          applicationDeadline: '2026-09-15',
          skillsRequired: ['Logical Reasoning', 'General English', 'Quantitative Aptitude'],
          eligibility: 'Bachelor Degree in any discipline from a recognized University. Age between 20 to 30 years.',
        },
        {
          id: 'gov-2',
          slug: 'nic-junior-software-architect-2026',
          title: 'Junior Software Architect (NIC)',
          department: 'National Informatics Centre',
          logo: '💻',
          location: 'Bengaluru, Karnataka',
          salary: 'Pay Level 10 (₹56,100 - ₹1,77,500)',
          experience: 'Required',
          examBody: 'UPSC',
          postedDate: '1 week ago',
          syllabusLink: 'https://nic.in/recruitment/syllabus',
          applicationDeadline: '2026-08-30',
          skillsRequired: ['TypeScript', 'SQL Database Design', 'Secure Network Protocols', 'Docker'],
          eligibility: 'B.E / B.Tech in CSE / IT or MCA with first class. Age limit up to 35 years.',
        },
      ];
      localStorage.setItem(KEYS.GOV_JOBS, JSON.stringify(initialGovJobs));
    }

    // 8. SEO settings initial seed
    if (!localStorage.getItem(KEYS.SEO)) {
      const initialSeo: AdminSeoPage[] = [
        {
          id: 'seo-1',
          pagePath: '/',
          metaTitle: 'JOB Lo | Premium Job Portal & AI Sourcing Hub',
          metaDescription: 'Connect with certified recruiters from premium teams like Vercel and Linear. Discover verified career opportunities.',
          openGraphImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          canonicalUrl: 'https://joblo.in',
          sitemapStatus: 'Included',
        },
        {
          id: 'seo-2',
          pagePath: '/jobs',
          metaTitle: 'Discover Tech & Corporate Positions | JOB Lo',
          metaDescription: 'Search high-impact developer, design, product, and banking jobs with verified salary indices.',
          openGraphImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
          canonicalUrl: 'https://joblo.in/jobs',
          sitemapStatus: 'Included',
        },
        {
          id: 'seo-3',
          pagePath: '/government-jobs',
          metaTitle: 'Active Government Gazettes & Exam Syllabi | JOB Lo',
          metaDescription: 'Explore daily updated government gazettes, department qualifications, age limits, and official syllabus links.',
          openGraphImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
          canonicalUrl: 'https://joblo.in/government-jobs',
          sitemapStatus: 'Included',
        },
      ];
      localStorage.setItem(KEYS.SEO, JSON.stringify(initialSeo));
    }

    // 9. Newsletter subscribers initial seed
    if (!localStorage.getItem(KEYS.NEWSLETTER)) {
      const initialNewsletter: NewsletterSubscriber[] = [
        { id: 'sub-1', email: 'vijaykumar@example.com', subscribedAt: '2026-06-15T11:00:00Z' },
        { id: 'sub-2', email: 'rohan.sharma@companies.in', subscribedAt: '2026-07-01T15:20:00Z' },
        { id: 'sub-3', email: 'shalini.roy@vercel.com', subscribedAt: '2026-07-10T09:15:00Z' },
        { id: 'sub-4', email: 'developer.talent@yahoo.com', subscribedAt: '2026-07-18T18:40:00Z' },
      ];
      localStorage.setItem(KEYS.NEWSLETTER, JSON.stringify(initialNewsletter));
    }

    // 10. Contact messages initial seed
    if (!localStorage.getItem(KEYS.CONTACTS)) {
      const initialContacts: ContactMessage[] = [
        {
          id: 'con-1',
          name: 'Arjun Sen',
          email: 'arjun@techstart.io',
          subject: 'Enterprise Recruiter License API',
          message: 'We are looking to bulk-sync 150 live positions from our internal ATS using REST hooks. Do you support API syndication or sitemap syncing directly?',
          status: 'Unread',
          createdAt: '2026-07-18T12:00:00Z',
        },
        {
          id: 'con-2',
          name: 'Meera Nair',
          email: 'meera.nair@gmail.com',
          subject: 'Government Job Syllabus Download Error',
          message: 'The official syllabus link for Ministry of External Affairs ASO is showing a 404 error page. Could you verify the resource coordinate? Thank you!',
          status: 'Resolved',
          replyMessage: 'We have updated the syllabus URL coordinate to query the latest MEA Gazetted PDF directly. Please re-download.',
          createdAt: '2026-07-16T14:10:00Z',
        },
      ];
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(initialContacts));
    }

    // 11. Site Settings initial seed
    if (!localStorage.getItem(KEYS.SITE_SETTINGS)) {
      const initialSettings: SiteSettings = {
        logo: '▲ JOB Lo',
        favicon: '▲',
        homepageBanner: 'Discover the Ultimate Tech & Government Career Pipeline',
        footerText: 'JOB Lo © 2026. Certified under Indian DPDP Guidelines. All compliance parameters cryptographically hashed.',
        footerLinks: ['Privacy Policy', 'Terms of Use', 'GDPR Logs', 'MCA Directory'],
        socialLinks: {
          twitter: 'https://x.com/joblo',
          linkedin: 'https://linkedin.com/company/joblo',
          github: 'https://github.com/joblo',
        },
        contactDetails: {
          email: 'support@joblo.in',
          phone: '+91 80 4912 1000',
          address: 'Indiranagar, Bengaluru, KA, India',
        },
      };
      localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(initialSettings));
    }

    // 12. Admin Profile initial seed
    if (!localStorage.getItem(KEYS.PROFILE)) {
      const initialProfile: AdminProfile = {
        name: 'Admin Root',
        email: 'admin@joblo.in',
        role: 'Master System Administrator',
        securityEnabled: true,
        notificationPrefs: {
          securityAlerts: true,
          systemLogs: true,
          weeklyReports: false,
        },
      };
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialProfile));
    }

    // 13. Activities initial seed
    if (!localStorage.getItem(KEYS.ACTIVITIES)) {
      const initialActivities: AdminActivity[] = [
        { id: 'act-1', text: 'Corporate client linear.app added 4 live tech positions.', time: 'Just now', type: 'job' },
        { id: 'act-2', text: 'Employer account verification requested by TechLabs Sourcing (GST: 29BBBBB2222B2Z2).', time: '1 hour ago', type: 'company' },
        { id: 'act-3', text: 'Administrative token root password was cycled successfully.', time: '3 hours ago', type: 'security' },
        { id: 'act-4', text: 'Blog draft "Navigating India DPDP Regulations" was created.', time: 'Yesterday, 14:45', type: 'content' },
        { id: 'act-5', text: 'System backup dispatched and archived to cold cloud stores successfully.', time: '2 days ago', type: 'system' },
      ];
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    }

    // 14. Authors initial seed
    if (!localStorage.getItem(KEYS.AUTHORS)) {
      const initialAuthors: AdminAuthor[] = [
        { id: 'auth-1', name: 'Dr. Arvinder Singh', credentials: 'PhD Career Advisory', specialty: 'Gazette Exams', activeGuides: 12, email: 'arvinder.singh@joblo.in', bio: 'Senior advisor with 15+ years training public administration candidates.', avatarSymbol: '👨‍💼' },
        { id: 'auth-2', name: 'Ritu Sen', credentials: 'Ex-HR Specialist Infosys', specialty: 'Corporate Prep', activeGuides: 8, email: 'ritu.sen@joblo.in', bio: 'HR expert focusing on tech recruitment pipelines and corporate skill alignment.', avatarSymbol: '👩‍💼' },
      ];
      localStorage.setItem(KEYS.AUTHORS, JSON.stringify(initialAuthors));
    }

    // 15. Webhooks initial seed
    if (!localStorage.getItem(KEYS.WEBHOOKS)) {
      const initialWebhooks: AutomationWebhook[] = [
        { id: 'web-1', name: 'National Gazette Scraper', endpointUrl: 'https://n8n.joblo.in/webhook/v1/national-gazette-scraper', method: 'POST', intervalSchedule: 'Every 4 Hours', lastRun: '1 hour ago', status: 'Healthy', isActive: true },
        { id: 'web-2', name: 'Drizzle Table Index Optimization', endpointUrl: 'https://n8n.joblo.in/webhook/v1/optimize-database-indexes', method: 'POST', intervalSchedule: 'Every 24 Hours', lastRun: '12 hours ago', status: 'Healthy', isActive: true },
        { id: 'web-3', name: 'OpenAI/Gemini Cache Eviction', endpointUrl: 'https://n8n.joblo.in/webhook/v1/evict-llm-cache', method: 'GET', intervalSchedule: 'Every 30 Minutes', lastRun: '5 mins ago', status: 'Healthy', isActive: true },
      ];
      localStorage.setItem(KEYS.WEBHOOKS, JSON.stringify(initialWebhooks));
    }
  }

  // --- RECENT ACTIVITIES ---
  async getActivities(): Promise<AdminActivity[]> {
    const data = localStorage.getItem(KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  }

  async addActivity(text: string, type: AdminActivity['type']): Promise<void> {
    const activities = await this.getActivities();
    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type,
    };
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify([newAct, ...activities.slice(0, 49)]));
  }

  // --- USER MANAGEMENT ---
  async getUsers(): Promise<AdminUser[]> {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  async saveUser(user: AdminUser): Promise<AdminUser> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    await this.addActivity(`User account "${user.name}" (${user.role}) was modified/created.`, 'user');
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const target = users.find(u => u.id === userId);
    const updated = users.filter(u => u.id !== userId);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    if (target) {
      await this.addActivity(`User account "${target.name}" was permanently pruned from system database.`, 'user');
    }
  }

  // --- JOB SEEKER MANAGEMENT ---
  async getJobSeekers(): Promise<AdminJobSeeker[]> {
    const data = localStorage.getItem(KEYS.JOB_SEEKERS);
    return data ? JSON.parse(data) : [];
  }

  async saveJobSeeker(seeker: AdminJobSeeker): Promise<AdminJobSeeker> {
    const seekers = await this.getJobSeekers();
    const index = seekers.findIndex(s => s.id === seeker.id);
    if (index >= 0) {
      seekers[index] = seeker;
    } else {
      seekers.unshift(seeker);
    }
    localStorage.setItem(KEYS.JOB_SEEKERS, JSON.stringify(seekers));
    return seeker;
  }

  // --- EMPLOYER MANAGEMENT & COMPANY VERIFICATION ---
  async getCompanyVerifications(): Promise<CompanyVerification[]> {
    const data = localStorage.getItem(KEYS.COMPANIES_VERIFICATION);
    return data ? JSON.parse(data) : [];
  }

  async saveCompanyVerification(verification: CompanyVerification): Promise<CompanyVerification> {
    const list = await this.getCompanyVerifications();
    const index = list.findIndex(c => c.id === verification.id);
    if (index >= 0) {
      list[index] = verification;
    } else {
      list.unshift(verification);
    }
    localStorage.setItem(KEYS.COMPANIES_VERIFICATION, JSON.stringify(list));
    await this.addActivity(`Company "${verification.name}" verification status set to ${verification.verificationStatus}.`, 'company');
    return verification;
  }

  // --- CORPORATE JOBS MANAGEMENT (Unified wrapper for general jobs) ---
  async getCorporateJobs(): Promise<Job[]> {
    const data = localStorage.getItem('joblo_employer_jobs');
    if (data) {
      return JSON.parse(data);
    }
    // Fallback to importing MOCK_JOBS if empty
    return [];
  }

  async saveCorporateJob(job: Job): Promise<Job> {
    const data = localStorage.getItem('joblo_employer_jobs');
    const jobs: Job[] = data ? JSON.parse(data) : [];
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = { ...job, updated_at: new Date().toISOString() };
    } else {
      jobs.unshift({ ...job, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem('joblo_employer_jobs', JSON.stringify(jobs));
    await this.addActivity(`Corporate position spec "${job.title}" was saved/updated.`, 'job');
    return job;
  }

  async deleteCorporateJob(jobId: string): Promise<void> {
    const data = localStorage.getItem('joblo_employer_jobs');
    if (data) {
      const jobs: Job[] = JSON.parse(data);
      const filtered = jobs.filter(j => j.id !== jobId);
      localStorage.setItem('joblo_employer_jobs', JSON.stringify(filtered));
      await this.addActivity(`Corporate position index ${jobId} was deleted.`, 'job');
    }
  }

  // --- CATEGORIES CMS ---
  async getCategories(): Promise<AdminCategory[]> {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  async saveCategory(category: AdminCategory): Promise<AdminCategory> {
    const list = await this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
    await this.addActivity(`Platform category index "${category.name}" was modified.`, 'content');
    return category;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const list = await this.getCategories();
    const filtered = list.filter(c => c.id !== categoryId);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
  }

  // --- BLOG CMS ---
  async getBlogs(): Promise<AdminBlog[]> {
    const data = localStorage.getItem(KEYS.BLOGS);
    return data ? JSON.parse(data) : [];
  }

  async saveBlog(blog: AdminBlog): Promise<AdminBlog> {
    const list = await this.getBlogs();
    const index = list.findIndex(b => b.id === blog.id);
    if (index >= 0) {
      list[index] = blog;
    } else {
      list.unshift(blog);
    }
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(list));
    await this.addActivity(`Blog article "${blog.title}" was saved as ${blog.status}.`, 'content');
    return blog;
  }

  async deleteBlog(blogId: string): Promise<void> {
    const list = await this.getBlogs();
    const filtered = list.filter(b => b.id !== blogId);
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(filtered));
    await this.addActivity(`Blog index ${blogId} permanently deleted.`, 'content');
  }

  // --- CAREER RESOURCES CMS ---
  async getCareerResources(): Promise<CareerResource[]> {
    const data = localStorage.getItem(KEYS.CAREER_RESOURCES);
    return data ? JSON.parse(data) : [];
  }

  async saveCareerResource(resource: CareerResource): Promise<CareerResource> {
    const list = await this.getCareerResources();
    const index = list.findIndex(r => r.id === resource.id);
    if (index >= 0) {
      list[index] = resource;
    } else {
      list.unshift(resource);
    }
    localStorage.setItem(KEYS.CAREER_RESOURCES, JSON.stringify(list));
    await this.addActivity(`Editorial asset "${resource.title}" (${resource.category}) was saved.`, 'content');
    return resource;
  }

  async deleteCareerResource(resourceId: string): Promise<void> {
    const list = await this.getCareerResources();
    const filtered = list.filter(r => r.id !== resourceId);
    localStorage.setItem(KEYS.CAREER_RESOURCES, JSON.stringify(filtered));
  }

  // --- GOVERNMENT JOB CMS ---
  async getGovernmentJobs(): Promise<GovernmentJob[]> {
    const data = localStorage.getItem(KEYS.GOV_JOBS);
    return data ? JSON.parse(data) : [];
  }

  async saveGovernmentJob(job: GovernmentJob): Promise<GovernmentJob> {
    const list = await this.getGovernmentJobs();
    const index = list.findIndex(j => j.id === job.id);
    if (index >= 0) {
      list[index] = job;
    } else {
      list.unshift(job);
    }
    localStorage.setItem(KEYS.GOV_JOBS, JSON.stringify(list));
    await this.addActivity(`Government Gazette vacancy "${job.title}" was posted/modified.`, 'job');
    return job;
  }

  async deleteGovernmentJob(jobId: string): Promise<void> {
    const list = await this.getGovernmentJobs();
    const filtered = list.filter(j => j.id !== jobId);
    localStorage.setItem(KEYS.GOV_JOBS, JSON.stringify(filtered));
    await this.addActivity(`Government Gazette position ID ${jobId} deleted from indices.`, 'job');
  }

  // --- SEO MANAGEMENT ---
  async getSeoPages(): Promise<AdminSeoPage[]> {
    const data = localStorage.getItem(KEYS.SEO);
    return data ? JSON.parse(data) : [];
  }

  async saveSeoPage(page: AdminSeoPage): Promise<AdminSeoPage> {
    const list = await this.getSeoPages();
    const index = list.findIndex(p => p.id === page.id);
    if (index >= 0) {
      list[index] = page;
    } else {
      list.push(page);
    }
    localStorage.setItem(KEYS.SEO, JSON.stringify(list));
    await this.addActivity(`SEO override definitions for path "${page.pagePath}" saved.`, 'system');
    return page;
  }

  // --- NEWSLETTER SUBSCRIBERS ---
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const data = localStorage.getItem(KEYS.NEWSLETTER);
    return data ? JSON.parse(data) : [];
  }

  async deleteNewsletterSubscriber(id: string): Promise<void> {
    const list = await this.getNewsletterSubscribers();
    const filtered = list.filter(s => s.id !== id);
    localStorage.setItem(KEYS.NEWSLETTER, JSON.stringify(filtered));
    await this.addActivity(`Email subscriber ID ${id} unsubscribed from updates.`, 'system');
  }

  async addNewsletterSubscriber(email: string): Promise<NewsletterSubscriber> {
    const list = await this.getNewsletterSubscribers();
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString(),
    };
    list.unshift(newSub);
    localStorage.setItem(KEYS.NEWSLETTER, JSON.stringify(list));
    return newSub;
  }

  // --- CONTACT MESSAGES ---
  async getContactMessages(): Promise<ContactMessage[]> {
    const data = localStorage.getItem(KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  }

  async saveContactMessage(message: ContactMessage): Promise<ContactMessage> {
    const list = await this.getContactMessages();
    const index = list.findIndex(m => m.id === message.id);
    if (index >= 0) {
      list[index] = message;
    } else {
      list.unshift(message);
    }
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(list));
    return message;
  }

  async deleteContactMessage(id: string): Promise<void> {
    const list = await this.getContactMessages();
    const filtered = list.filter(m => m.id !== id);
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(filtered));
  }

  // --- SITE SETTINGS ---
  async getSiteSettings(): Promise<SiteSettings> {
    const data = localStorage.getItem(KEYS.SITE_SETTINGS);
    return data ? JSON.parse(data) : {
      logo: '▲ JOB Lo',
      favicon: '▲',
      homepageBanner: 'Discover the Ultimate Tech & Government Career Pipeline',
      footerText: 'JOB Lo © 2026. Certified under Indian DPDP Guidelines.',
      footerLinks: ['Privacy Policy', 'Terms of Use'],
      socialLinks: { twitter: '', linkedin: '', github: '' },
      contactDetails: { email: '', phone: '', address: '' },
    };
  }

  async saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
    localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(settings));
    await this.addActivity('Platform branding and details settings saved globally.', 'system');
    return settings;
  }

  // --- ADMIN PROFILE ---
  async getAdminProfile(): Promise<AdminProfile> {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : {
      name: 'Admin Root',
      email: 'admin@joblo.in',
      role: 'Master System Administrator',
      securityEnabled: true,
      notificationPrefs: { securityAlerts: true, systemLogs: true, weeklyReports: false },
    };
  }

  async saveAdminProfile(profile: AdminProfile): Promise<AdminProfile> {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    await this.addActivity('Administrator credentials security settings updated.', 'security');
    return profile;
  }

  // --- EDITORIAL AUTHORS CMS ---
  async getAuthors(): Promise<AdminAuthor[]> {
    const data = localStorage.getItem(KEYS.AUTHORS);
    return data ? JSON.parse(data) : [];
  }

  async saveAuthor(author: AdminAuthor): Promise<AdminAuthor> {
    const list = await this.getAuthors();
    const index = list.findIndex(a => a.id === author.id);
    if (index >= 0) {
      list[index] = author;
    } else {
      list.unshift(author);
    }
    localStorage.setItem(KEYS.AUTHORS, JSON.stringify(list));
    await this.addActivity(`Editorial author "${author.name}" was modified/registered.`, 'content');
    return author;
  }

  async deleteAuthor(authorId: string): Promise<void> {
    const list = await this.getAuthors();
    const filtered = list.filter(a => a.id !== authorId);
    localStorage.setItem(KEYS.AUTHORS, JSON.stringify(filtered));
    await this.addActivity(`Editorial author ID ${authorId} was removed from registries.`, 'content');
  }

  // --- AUTOMATION WEBHOOKS ---
  async getWebhooks(): Promise<AutomationWebhook[]> {
    const data = localStorage.getItem(KEYS.WEBHOOKS);
    return data ? JSON.parse(data) : [];
  }

  async saveWebhook(webhook: AutomationWebhook): Promise<AutomationWebhook> {
    const list = await this.getWebhooks();
    const index = list.findIndex(w => w.id === webhook.id);
    if (index >= 0) {
      list[index] = webhook;
    } else {
      list.unshift(webhook);
    }
    localStorage.setItem(KEYS.WEBHOOKS, JSON.stringify(list));
    await this.addActivity(`Automation webhook "${webhook.name}" was modified.`, 'system');
    return webhook;
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    const list = await this.getWebhooks();
    const filtered = list.filter(w => w.id !== webhookId);
    localStorage.setItem(KEYS.WEBHOOKS, JSON.stringify(filtered));
    await this.addActivity(`Automation webhook ID ${webhookId} was removed.`, 'system');
  }
}

export const adminService = new AdminService();
