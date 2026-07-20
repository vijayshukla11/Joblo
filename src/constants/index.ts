import { Job, Company, Category, Skill, Location, GovernmentJob, CareerGuide, InterviewPrep, FAQItem, Testimonial } from '../types';

export const MOCK_COMPANIES: Company[] = [
  { id: 'c-1', name: 'Linear Labs', logo: '⚡', industry: 'Software / Productivity Tools', size: '100-250', rating: 4.9, openingsCount: 4, location: 'Remote / Bengaluru', website: 'https://linear.app' },
  { id: 'c-2', name: 'Vercel', logo: '▲', industry: 'Cloud Infrastructure & Hosting', size: '500-1000', rating: 4.8, openingsCount: 3, location: 'Remote / Delhi NCR', website: 'https://vercel.com' },
  { id: 'c-3', name: 'Stripe India', logo: '💳', industry: 'Financial Payments & API', size: '5000+', rating: 4.7, openingsCount: 5, location: 'Mumbai, Maharashtra', website: 'https://stripe.com' },
  { id: 'c-4', name: 'State Bank of India', logo: '🏦', industry: 'Public Sector Banking', size: '200,000+', rating: 4.3, openingsCount: 12, location: 'All India', website: 'https://sbi.co.in' },
  { id: 'c-5', name: 'BrowserStack', logo: '☁️', industry: 'Web & Mobile Testing', size: '1000-2000', rating: 4.5, openingsCount: 2, location: 'Mumbai / Remote', website: 'https://browserstack.com' }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-tech', name: 'Software & Technology', slug: 'tech-jobs', icon: '💻', jobCount: 18450, description: 'React, Node, Cloud, Product Design & QA engineering roles.' },
  { id: 'cat-gov', name: 'Government & Public Sector', slug: 'government-jobs', icon: '🏛️', jobCount: 3120, description: 'UPSC, SSC, State PSC, and Banking administrative roles.' },
  { id: 'cat-design', name: 'Product & Creative Design', slug: 'design-jobs', icon: '🎨', jobCount: 4120, description: 'UX/UI Research, Visual Design, and Figma design systems.' },
  { id: 'cat-remote', name: 'Global Remote Hub', slug: 'remote-jobs', icon: '🌍', jobCount: 8120, description: '100% work-from-home positions with international compensation.' }
];

export const MOCK_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'React 19', category: 'Tech', popularity: 'High' },
  { id: 'sk-2', name: 'TypeScript', category: 'Tech', popularity: 'High' },
  { id: 'sk-3', name: 'Next.js 15', category: 'Tech', popularity: 'High' },
  { id: 'sk-4', name: 'Tailwind CSS', category: 'Tech', popularity: 'High' },
  { id: 'sk-5', name: 'Figma', category: 'Design', popularity: 'Medium' },
  { id: 'sk-6', name: 'Quantitative Aptitude', category: 'Government', popularity: 'High' },
  { id: 'sk-7', name: 'General English', category: 'Government', popularity: 'Medium' },
  { id: 'sk-8', name: 'Logical Reasoning', category: 'Government', popularity: 'High' },
  { id: 'sk-9', name: 'Data Interpretation', category: 'Government', popularity: 'Trending' }
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-1', city: 'Bengaluru', state: 'Karnataka', country: 'India', isTechHub: true, isGovHub: false, jobCount: 12450 },
  { id: 'loc-2', city: 'New Delhi', state: 'Delhi NCR', country: 'India', isTechHub: true, isGovHub: true, jobCount: 8900 },
  { id: 'loc-3', city: 'Mumbai', state: 'Maharashtra', country: 'India', isTechHub: true, isGovHub: true, jobCount: 6540 },
  { id: 'loc-4', city: 'Remote', state: 'Worldwide', country: 'Global', isTechHub: true, isGovHub: false, jobCount: 15400 }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    slug: 'frontend-engineer-react-linear',
    title: 'Frontend Engineer (React 19 & TypeScript)',
    companyId: 'c-1',
    companyName: 'Linear Labs',
    companyLogo: '⚡',
    location: 'Bengaluru, Karnataka',
    country: 'India',
    salary: '₹18,00,000 - ₹24,00,000 / year',
    employmentType: 'Full-time',
    experience: '1-3 years',
    postedDate: '2 hours ago',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js 15'],
    description: 'We are seeking a frontend engineer who values beautiful typography, precise spacing, and fast bundle sizes. You will collaborate closely with our core systems team to craft sleek interfaces for our issue tracker.',
    isHot: true,
    isRemote: false,
    aiMatchScore: 94,
    savedStatus: false
  },
  {
    id: 'job-2',
    slug: 'product-designer-vercel',
    title: 'Product Designer (Figma & UX)',
    companyId: 'c-2',
    companyName: 'Vercel',
    companyLogo: '▲',
    location: 'Remote',
    country: 'Global',
    salary: '₹15,00,000 - ₹22,00,000 / year',
    employmentType: 'Remote',
    experience: '3-5 years',
    postedDate: '3 hours ago',
    skills: ['Figma', 'UX Design', 'Design Systems', 'HTML/CSS', 'Prototyping'],
    description: 'Shape the future of cloud computing interfaces. Collaborate with developer advocates and framework architects to build seamless deployment experiences. Focus on dark/light aesthetics, high-speed layout rendering, and micro-interactions.',
    isHot: false,
    isRemote: true,
    aiMatchScore: 89,
    savedStatus: false
  },
  {
    id: 'job-3',
    slug: 'financial-analyst-stripe',
    title: 'Financial Systems Analyst',
    companyId: 'c-3',
    companyName: 'Stripe India',
    companyLogo: '💳',
    location: 'Mumbai, Maharashtra',
    country: 'India',
    salary: '₹14,00,000 - ₹19,00,000 / year',
    employmentType: 'Full-time',
    experience: '3-5 years',
    postedDate: '2 days ago',
    skills: ['SQL', 'Financial Modeling', 'Data Analysis', 'Excel', 'Corporate Finance'],
    description: 'Support Stripe’s expanding billing and bank-clearance rails in India. You will analyze transaction settlement ratios, regional tax configurations, and optimize treasury workflows with banking partners.',
    isHot: false,
    isRemote: false,
    aiMatchScore: 78,
    savedStatus: false
  },
  {
    id: 'job-4',
    slug: 'qa-engineer-browserstack',
    title: 'Senior Quality Assurance Specialist',
    companyId: 'c-5',
    companyName: 'BrowserStack',
    companyLogo: '☁️',
    location: 'Mumbai, Maharashtra',
    country: 'India',
    salary: '₹12,00,000 - ₹16,00,000 / year',
    employmentType: 'Full-time',
    experience: '3-5 years',
    postedDate: '1 day ago',
    skills: ['Selenium', 'Cypress', 'TypeScript', 'Jest', 'Automation'],
    description: 'Lead automated regression testing across multiple platform browsers. You will design, build, and run continuous testing suites to ensure flawless application runtimes and high stability.',
    isHot: true,
    isRemote: false,
    aiMatchScore: 82,
    savedStatus: false
  }
];

export const MOCK_GOVERNMENT_JOBS: GovernmentJob[] = [
  {
    id: 'gov-1',
    slug: 'ssc-aso-recruitment',
    title: 'Assistant Section Officer (ASO)',
    department: 'Central Secretariat Service',
    logo: '🇮🇳',
    location: 'New Delhi, Delhi',
    salary: 'Pay Level 7 (₹44,900 - ₹1,42,400 / month basic)',
    experience: 'Fresher',
    examBody: 'SSC',
    postedDate: '1 day ago',
    applicationDeadline: 'August 15, 2026',
    skillsRequired: ['General Awareness', 'Quantitative Aptitude', 'Logical Reasoning', 'General English'],
    eligibility: 'Bachelor’s Degree in any discipline from a recognized University.',
    syllabusLink: 'https://ssc.gov.in/syllabus',
  },
  {
    id: 'gov-2',
    slug: 'sbi-po-selection',
    title: 'Probationary Officer (PO)',
    department: 'State Bank of India',
    logo: '🏦',
    location: 'Mumbai / Pan India',
    salary: '₹41,960 - ₹63,840 / month basic + Allowances',
    experience: 'Fresher',
    examBody: 'Bank PO',
    postedDate: 'Yesterday',
    applicationDeadline: 'August 30, 2026',
    skillsRequired: ['Data Interpretation', 'Banking Awareness', 'Logical Reasoning', 'Quantitative Aptitude'],
    eligibility: 'Graduation in any discipline from a recognized University or equivalent.',
    syllabusLink: 'https://sbi.co.in/careers',
  },
  {
    id: 'gov-3',
    slug: 'upsc-civil-services',
    title: 'Civil Services Examination 2026',
    department: 'IAS / IPS / IFS Cadet Corps',
    logo: '🏛️',
    location: 'All India Services',
    salary: 'Pay Level 10 (₹56,100 - ₹2,50,000 / month basic)',
    experience: 'Fresher',
    examBody: 'UPSC',
    postedDate: '3 days ago',
    applicationDeadline: 'August 10, 2026',
    skillsRequired: ['General Studies', 'CSAT', 'Essay Writing', 'Analytical Thinking'],
    eligibility: 'Graduate in any subject. Minimum Age 21 years.',
    syllabusLink: 'https://upsc.gov.in/syllabus',
  }
];

export const MOCK_GUIDES: CareerGuide[] = [
  {
    id: 'guide-1',
    title: 'Writing ATS-Friendly Resumes for Indian Off-Campus Opportunities',
    category: 'Resume Guide',
    readTime: '6 min read',
    excerpt: 'Learn exactly how to bypass standard automated screening portals, how to structure tech skills clearly, and how to represent GitHub metrics effectively.',
    authorName: 'Kunal Shah',
    authorRole: 'Chief Career Mentor, JOB Lo',
    authorVerified: true,
    lastUpdated: 'July 2026'
  },
  {
    id: 'guide-2',
    title: 'Understanding the SSC CGL Tier-1 and Tier-2 Selection Metrics',
    category: 'Exam Guide',
    readTime: '8 min read',
    excerpt: 'An exhaustive, step-by-step breakdown of syllabus weights, scoring trends, and essential quantitative prep modules to secure top executive positions.',
    authorName: 'Suresh Kumar',
    authorRole: 'Retired Under Secretary & Exam Mentor',
    authorVerified: true,
    lastUpdated: 'June 2026'
  },
  {
    id: 'guide-3',
    title: 'Salary Negotiation Tactics in the Bengaluru Tech Ecosystem',
    category: 'Career Growth',
    readTime: '7 min read',
    excerpt: 'Why accepting the first written offer costs you lakhs over time. Master competitive verbal positioning to maximize your compensation package safely.',
    authorName: 'Neha Sen',
    authorRole: 'Former Director of Executive Talent Acquisition',
    authorVerified: true,
    lastUpdated: 'May 2026'
  }
];

export const MOCK_INTERVIEW_PREP: InterviewPrep[] = [
  {
    id: 'q-1',
    topic: 'React & Frontend Architecture',
    role: 'Frontend Engineer',
    difficulty: 'Medium',
    question: 'How do React 19 Actions manage form submission and automatic pending states?',
    answer: 'React 19 introduces native Actions support. When you pass an async function to the HTML `<form action={fn}>` attribute, React handles the execution lifecycle automatically. It manages pending states internally, which you can hook into using `useFormStatus` or `useActionState`. This removes the need for manual state variables like `isLoading` or `isPending` inside your components.'
  },
  {
    id: 'q-2',
    topic: 'Quantitative Aptitude',
    role: 'Government Aspirant (Banking/SSC)',
    difficulty: 'Hard',
    question: 'A boat covers a certain distance upstream in 6 hours and downstream in 4 hours. What is the ratio of the boat’s speed in still water to the speed of the stream?',
    answer: 'Let speed of the boat in still water be x km/h, and speed of the stream be y km/h.\n1. Upstream Speed = (x - y) km/h\n2. Downstream Speed = (x + y) km/h\nSince the distance is equal:\nDistance = Upstream Speed * Upstream Time = Downstream Speed * Downstream Time\n=> (x - y) * 6 = (x + y) * 4\n=> 6x - 6y = 4x + 4y\n=> 2x = 10y => x/y = 5/1.\nAnswer: The ratio of boat speed to stream speed is 5:1.'
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does JOB Lo ensure the validity of listed job vacancies?',
    answer: 'Unlike massive aggregator scrapers that list outdated or spam listings, we source positions directly through verified corporate APIs or official state-level Gazette announcements. Every single tech post has a direct connection to corporate talent pipelines, and government vacancies are audited against official agency timelines.'
  },
  {
    id: 'faq-2',
    question: 'Can I check both government and private tech jobs in India?',
    answer: 'Yes! We are India’s first dual-stream platform. We understand that Indian career paths are diverse. Freshers can search for centralized public sector exams (SSC, UPSC, SBI) alongside remote developer contracts and on-site engineering roles in Bengaluru and Mumbai.'
  },
  {
    id: 'faq-3',
    question: 'What is the AI Job Match and how does it safeguard user privacy?',
    answer: 'The AI Job Match is a local-first browser tool. By uploading your resume or listing your core skills, we compute an immediate alignment score against our active vacancy database. Your document content is analyzed securely client-side and never saved on third-party servers, guaranteeing 100% data privacy.'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Rohan Deshmukh',
    role: 'Associate Software Engineer',
    company: 'Linear Labs',
    avatar: '👨‍💻',
    quote: 'I submitted my resume on JOB Lo, got a 92% AI Match recommendation for Linear, and applied. Within 2 weeks, I signed my contract. Zero brokerage, zero spam emails.',
    verified: true
  },
  {
    id: 't-2',
    name: 'Anjali Verma',
    role: 'Assistant Section Officer (ASO)',
    company: 'Ministry of External Affairs',
    avatar: '👩‍💼',
    quote: 'JOB Lo’s exam guides are clean and ad-free. The syllabus roadmap and notification alerts are always accurate. It made navigating the SSC process so simple.',
    verified: true
  }
];
