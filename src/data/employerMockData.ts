import { Job, Company, Applicant, CompanyProfile } from '../types';

export const initialCompanyProfile: CompanyProfile = {
  name: "Vercel India",
  legalName: "Vercel Developer Systems India Pvt Ltd",
  logo: "▲",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  gstNumber: "29AAAAA1111A1Z1",
  panPlaceholder: "ABCDE1234F",
  about: "Vercel provides the developer experience and infrastructure to build, deploy, and scale the modern web. We enable developers to host websites and web applications that deploy instantly and scale automatically.",
  industry: "Information Technology & Services",
  foundedYear: "2015",
  size: "501 - 1,000 Employees",
  headOffice: "Bengaluru, Karnataka",
  branches: ["Mumbai, Maharashtra", "Gurugram, Haryana"],
  website: "https://vercel.com",
  linkedin: "https://linkedin.com/company/vercel",
  facebook: "https://facebook.com/vercel",
  instagram: "https://instagram.com/vercel",
  twitter_x: "https://twitter.com/vercel",
  companyEmail: "careers-india@vercel.com",
  recruiterName: "Shalini Roy",
  recruiterMobile: "+91 80 4912 3000",
  supportEmail: "support@vercel.com",
  mission: "To make the web faster, more accessible, and easier to build for every developer in India.",
  vision: "A globally fast web experience where frontend development has zero operational barriers.",
  hiringStatus: "Active",
  benefits: [
    "Competitive Stock Options (RSUs)",
    "Comprehensive Health & Wellness Coverage",
    "Remote-First Workspace Reimbursements",
    "Continuous Learning & Dev Budget (₹1,50,000/yr)",
    "Generous Parental & Caregiver Leave"
  ],
  officeGallery: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=85"
  ],
  culture: "We value speed, accessibility, and stellar UX. Our culture is remote-first, collaborative, and focused on enabling engineers to ship premium web products without friction.",
  awards: [
    "Best Workplaces in Tech 2025 - Great Place to Work",
    "Top Developer Tool of the Decade - Dev Awards",
    "Industry Innovator in Frontend Delivery - Cloud Insights"
  ],
  isProfileComplete: true,
  wizardStep: 5
};

export const mockEmployerJobs: Job[] = [
  {
    id: "job-vercel-1",
    title: "Senior Frontend Engineer - Next.js",
    slug: "senior-frontend-engineer-nextjs-vercel",
    companyId: "c-101",
    companyName: "Vercel India",
    companyLogo: "▲",
    location: "Bengaluru, Karnataka",
    country: "India",
    salary: "₹32,00,000 - ₹45,00,000 / year",
    employmentType: "Full-time",
    category: "Tech",
    experience: "5 - 8 Years",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel Deployments"],
    description: "We are seeking an expert Frontend Engineer with a deep obsession with web performance, developer experience, and design precision. You will lead development on our core enterprise Next.js application frameworks and build visual orchestration engines for developer workflows.",
    benefits: ["Equity RSUs", "Full Remote Setup Budget", "Medical Insurance", "Performance Bonuses"],
    applicationLink: "https://vercel.com/careers/nextjs-senior-frontend",
    deadline: "2026-09-30",
    isHot: true,
    isRemote: true,
    isFeatured: true,
    isUrgent: true,
    status: "Published",
    postedDate: "3 days ago"
  },
  {
    id: "job-vercel-2",
    title: "React Core Developer",
    slug: "react-core-developer-vercel",
    companyId: "c-101",
    companyName: "Vercel India",
    companyLogo: "▲",
    location: "Remote (India)",
    country: "India",
    salary: "₹24,00,000 - ₹35,00,000 / year",
    employmentType: "Full-time",
    category: "Tech",
    experience: "3 - 6 Years",
    skills: ["React", "TypeScript", "Compiler Optimization", "CSS Modules", "Webpack"],
    description: "Join the team that helps render millions of production-grade pages daily. This role is focused on refining client-side rendering capabilities, React Server Components lifecycle integration, and building hyper-responsive components with motion animations.",
    benefits: ["Flexible Working Hours", "Skill Enhancement Credits", "Tech Reimbursement"],
    applicationLink: "https://vercel.com/careers/react-core-dev",
    deadline: "2026-10-15",
    isHot: false,
    isRemote: true,
    isFeatured: true,
    isUrgent: false,
    status: "Published",
    postedDate: "1 week ago"
  },
  {
    id: "job-vercel-3",
    title: "Lead Design Engineer (UI/UX)",
    slug: "lead-design-engineer-vercel",
    companyId: "c-101",
    companyName: "Vercel India",
    companyLogo: "▲",
    location: "Bengaluru, Karnataka",
    country: "India",
    salary: "₹28,00,000 - ₹40,00,000 / year",
    employmentType: "Full-time",
    category: "Design",
    experience: "6+ Years",
    skills: ["Figma", "Tailwind CSS", "Framer Motion", "Design Systems", "Web Accessibility"],
    description: "Own the visual representation and system architectures of our next-generation developer consoles. In this role, you will bridge the gap between pure product designs and interactive, robust Tailwind codebases.",
    benefits: ["Premium Dental & Optical Plans", "Corporate Wellness Program", "Gym Membership"],
    applicationLink: "",
    deadline: "2026-08-20",
    isHot: true,
    isRemote: false,
    isFeatured: false,
    isUrgent: true,
    status: "Draft",
    postedDate: "Created Yesterday"
  },
  {
    id: "job-vercel-4",
    title: "Technical Writer - Next.js Framework",
    slug: "technical-writer-nextjs-vercel",
    companyId: "c-101",
    companyName: "Vercel India",
    companyLogo: "▲",
    location: "Remote (India)",
    country: "India",
    salary: "₹15,00,000 - ₹22,00,000 / year",
    employmentType: "Contract",
    category: "Content",
    experience: "2 - 5 Years",
    skills: ["Markdown", "Next.js", "Technical Editing", "API Documentation", "Git"],
    description: "Work closely with our framework engineers to compose premium, readable, and highly precise documentation, guides, and codebase specifications for thousands of next-generation global developers.",
    benefits: ["Co-working Space Allowance", "Annual Retreat Voucher"],
    applicationLink: "",
    deadline: "2026-07-01",
    isHot: false,
    isRemote: true,
    isFeatured: false,
    isUrgent: false,
    status: "Archived",
    postedDate: "Archived 2 weeks ago"
  }
];

export const mockApplicants: Applicant[] = [
  {
    id: "app-1",
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98765 43210",
    jobId: "job-vercel-1",
    jobTitle: "Senior Frontend Engineer - Next.js",
    appliedDate: "2026-07-18",
    status: "Interview Scheduled",
    experience: "6 Years",
    education: "B.Tech in Computer Science, IIT Bombay",
    resumeUrl: "arjun_mehta_resume.pdf",
    resumeSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Webpack", "Performance Tuning"],
    coverLetter: "Dear Hiring Team,\n\nI have been building full-stack React and Next.js applications for the past 5 years and have been following Vercel's innovations closely. At my current organization, I led the migration of our customer dashboard to Next.js App Router, resulting in a 42% improvement in LCP and an overall perfect 100 lighthouse score.\n\nI am extremely excited about the prospect of bringing my performance-oriented frontend engineering expertise to the Vercel India office.\n\nSincerely,\nArjun Mehta",
    timeline: [
      { date: "2026-07-18", status: "Applied", description: "Application sourced via JOB Lo verification crawler" },
      { date: "2026-07-18", status: "Shortlisted", description: "Skills match threshold passed (>85% score)" },
      { date: "2026-07-19", status: "Interview Scheduled", description: "Technical Round 1 scheduled with Lead Frontend Architect" }
    ],
    notes: [
      "Extremely strong performance benchmarks from previous role.",
      "Knows RSC streaming lifecycle thoroughly. Highly recommended for Senior role."
    ]
  },
  {
    id: "app-2",
    name: "Priyanka Sen",
    email: "priyanka.sen@outlook.com",
    phone: "+91 87654 32109",
    jobId: "job-vercel-1",
    jobTitle: "Senior Frontend Engineer - Next.js",
    appliedDate: "2026-07-19",
    status: "Shortlisted",
    experience: "5.5 Years",
    education: "M.Tech in Software Systems, BITS Pilani",
    resumeUrl: "priyanka_sen_cv.pdf",
    resumeSkills: ["Next.js", "GraphQL", "TypeScript", "Jest", "CI/CD", "Tailwind CSS", "Micro-frontends"],
    coverLetter: "Hello,\n\nAs a frontend specialist focused on robust engineering, automated testing, and web standards, I believe I fit the Senior Frontend Engineer description perfectly. I have created complex state systems, custom Webpack bundler plugins, and maintain an active open-source component library.\n\nI look forward to discussing how I can add value to Vercel's mission.",
    timeline: [
      { date: "2026-07-19", status: "Applied", description: "Direct application submitted through rec-portal" },
      { date: "2026-07-19", status: "Shortlisted", description: "System verified. High alignment with required skills." }
    ],
    notes: [
      "Strong testing portfolio. Expressed deep interest in web vitals orchestration."
    ]
  },
  {
    id: "app-3",
    name: "Rohan Das",
    email: "rohan.das@yahoo.com",
    phone: "+91 76543 21098",
    jobId: "job-vercel-2",
    jobTitle: "React Core Developer",
    appliedDate: "2026-07-17",
    status: "Applied",
    experience: "4 Years",
    education: "B.E in Information Technology, DTU",
    resumeUrl: "rohan_das_react.pdf",
    resumeSkills: ["React", "Redux", "TypeScript", "REST APIs", "Tailwind CSS", "Git"],
    coverLetter: "Hi there,\n\nI am a certified React developer with 4 years of experience shipping enterprise dashboards and SaaS pages. I build pixel-perfect interfaces and write clean, maintainable typescript code.\n\nHope to hear from you soon!",
    timeline: [
      { date: "2026-07-17", status: "Applied", description: "Application received and queued for review" }
    ],
    notes: []
  },
  {
    id: "app-4",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@techcorp.com",
    phone: "+91 99887 76655",
    jobId: "job-vercel-2",
    jobTitle: "React Core Developer",
    appliedDate: "2026-07-15",
    status: "Rejected",
    experience: "2 Years",
    education: "B.Sc in Computer Science, Delhi University",
    resumeUrl: "vikram_m_resume.pdf",
    resumeSkills: ["HTML", "CSS", "Basic React", "JavaScript", "Bootstrap"],
    coverLetter: "Hello Vercel team,\n\nI want to apply for the React Developer position. I have been practicing react for some months and built a personal blog and some widgets.\n\nThank you.",
    timeline: [
      { date: "2026-07-15", status: "Applied", description: "Application submitted" },
      { date: "2026-07-16", status: "Rejected", description: "Candidate does not meet minimum experience threshold (3 years) or required framework skills." }
    ],
    notes: [
      "Inadequate core architecture experience for this pipeline."
    ]
  }
];

export const mockActivities = [
  { id: "act-1", text: "Arjun Mehta was moved to 'Interview Scheduled' for Senior Frontend Engineer.", time: "Today, 10:30 AM" },
  { id: "act-2", text: "Priyanka Sen submitted a direct application for Senior Frontend Engineer.", time: "Today, 08:15 AM" },
  { id: "act-3", text: "New draft job 'Lead Design Engineer (UI/UX)' was created.", time: "Yesterday, 04:45 PM" },
  { id: "act-4", text: "Technical Writer position has been moved to 'Archived' status.", time: "2 days ago" }
];
