-- SQL Seed File: 003_seed_admin_portal.sql
-- Description: Seed initial mock data for newly defined administration portal tables

-- 1. Seed categories
INSERT INTO public.admin_categories (name, parent_id, icon, ordering, seo_slug, description)
VALUES 
('Software Engineering', NULL, '💻', 1, 'software-engineering', 'React, Node, Cloud Native, DevOps & Frontend Architecture'),
('Frontend Systems', NULL, '🎨', 2, 'frontend-systems', 'Figma design tokens, micro-interactions, CSS modules & Web performance'),
('Public Services', NULL, '🏛️', 3, 'public-services', 'Central ministries, state commissions, and civil servant opportunities'),
('Global Remote Opportunities', NULL, '🌍', 4, 'remote-sourcing', '100% remote asynchronous developer positions with global payouts')
ON CONFLICT (seo_slug) DO NOTHING;

-- 2. Seed some admin blogs
INSERT INTO public.admin_blogs (title, slug, content, excerpt, status, categories, tags, featured_image, seo_title, seo_description, seo_keywords)
VALUES
(
  'A Complete Guide to Next.js 15 Performance Enhancements',
  'nextjs-15-performance-enhancements',
  'Next.js 15 introduces partial pre-rendering, advanced caching control protocols, and default async route segment resolution. In this article, we cover how to leverage compiler optimizations to reduce browser bundle weights...',
  'Learn how to leverage Next.js 15 and React 19 to achieve instant first-contentful-paints in complex web portals.',
  'Published',
  ARRAY['Software Engineering', 'Frontend Systems'],
  ARRAY['nextjs', 'react', 'web-dev'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'Next.js 15 Performance Masterclass | JOB Lo',
  'Learn how to leverage Next.js 15 compiler optimizations and React Server Components for maximum core web vitals.',
  'nextjs 15, react 19, frontend performance'
),
(
  'Navigating India DPDP Regulations for Talent Acquisition Team',
  'navigating-india-dpdp-regulations-recruiting',
  'The Digital Personal Data Protection (DPDP) Act outlines strict consent mandates for storing, processing, and validating candidate resumes. Here is how your company can ensure total compliance...',
  'An ultimate checklist for HR leaders in India to align candidate sourcing and screening with national DPDP mandates.',
  'Draft',
  ARRAY['Software Engineering'],
  ARRAY['compliance', 'dpdp', 'recruiting'],
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  'India DPDP Compliance for HR and Recruitment | JOB Lo',
  'Everything you need to know about the India Digital Personal Data Protection Act (DPDP) in candidate resume pipelines.',
  'dpdp act, compliance, recruitment india'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Career Resources
INSERT INTO public.admin_career_resources (title, category, difficulty, topic_or_role, excerpt, content, resources_links, seo_title, seo_description)
VALUES
(
  'Mastering the Frontend Engineering Behavioral Loop',
  'Interview Questions',
  'Medium',
  'Frontend Engineer',
  'Common situational and system architectural questions asked at top-tier product scale teams.',
  'When interviewing for senior frontend positions at companies like Linear or Vercel, questions range from handling long main-thread blockage to aligning web sockets under network latency. Practice with these key scenario responses...',
  '[{"name": "System Design Prep Sheet", "url": "https://vercel.com"}, {"name": "Performance Checklist", "url": "https://linear.app"}]'::jsonb,
  'Frontend Interview Prep Guide | JOB Lo',
  'Practice behavioral and technical frontend interview questions with premium sample answers.'
),
(
  'Modern ATS-Friendly Resume Construction Blueprint',
  'Resume Tips',
  'Easy',
  'All Professions',
  'Optimize your layout, metrics density, and system parse structures to cross 95+ score ranks.',
  'An ATS (Applicant Tracking System) parses your profile using semantic entity extractors. Avoid side columns, multi-color backgrounds, and embedded canvas graphics. Use simple Inter typography, descriptive bullet structures, and clear metrics...',
  '[]'::jsonb,
  'ATS Resume Optimization Tips | JOB Lo',
  'Step-by-step tutorial to optimize your resume for ATS parsers and secure interviews.'
)
ON CONFLICT (title) DO NOTHING;

-- 4. Seed Government Jobs
INSERT INTO public.admin_government_jobs (title, department, slug, logo, location, state, salary, qualification, age_limit, last_date, official_link, exam_body, syllabus_link, skills_required, eligibility, category)
VALUES
(
  'Assistant Section Officer (ASO) Gazetted',
  'Ministry of External Affairs',
  'aso-mea-gazetted-recruitment-2026',
  '🏛️',
  'New Delhi',
  'Central',
  'Pay Level 7 (₹44,900 - ₹1,42,400)',
  'Bachelor Degree in any discipline',
  '20 to 30 Years',
  '2026-09-15',
  'https://ssc.gov.in',
  'SSC',
  'https://ssc.gov.in/syllabus/aso',
  ARRAY['Logical Reasoning', 'General English', 'Quantitative Aptitude'],
  'Must be a citizen of India. Graduation certificate from a recognized university required.',
  'Central Gazetted'
),
(
  'Junior Software Architect (NIC)',
  'National Informatics Centre',
  'nic-junior-software-architect-2026',
  '💻',
  'Bengaluru, Karnataka',
  'Central',
  'Pay Level 10 (₹56,100 - ₹1,77,500)',
  'B.E / B.Tech in CSE / IT or MCA',
  '21 to 35 Years',
  '2026-08-30',
  'https://nic.in',
  'UPSC',
  'https://nic.in/recruitment/syllabus',
  ARRAY['TypeScript', 'SQL Database Design', 'Secure Network Protocols'],
  'First-class degree in computer disciplines. Age relaxations apply for scheduled classes.',
  'Technical Grade-A'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed SEO Settings
INSERT INTO public.admin_seo_settings (page_path, meta_title, meta_description, open_graph_image, canonical_url, sitemap_priority)
VALUES
('/', 'JOB Lo | Premium Job Portal & AI Sourcing Hub', 'Connect with certified recruiters from premium teams like Vercel and Linear. Discover verified career opportunities.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'https://joblo.in', 1.00),
('/jobs', 'Discover Tech & Corporate Positions | JOB Lo', 'Search high-impact developer, design, product, and banking jobs with verified salary indices.', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', 'https://joblo.in/jobs', 0.90),
('/government-jobs', 'Active Government Gazettes & Exam Syllabi | JOB Lo', 'Explore daily updated government gazettes, department qualifications, age limits, and official syllabus links.', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80', 'https://joblo.in/government-jobs', 0.90)
ON CONFLICT (page_path) DO NOTHING;

-- 6. Seed Newsletter Subscribers
INSERT INTO public.admin_newsletter_subscribers (email)
VALUES
('vijaykumar@example.com'),
('rohan.sharma@companies.in'),
('shalini.roy@vercel.com'),
('developer.talent@yahoo.com')
ON CONFLICT (email) DO NOTHING;

-- 7. Seed Contact messages
INSERT INTO public.admin_contact_messages (name, email, subject, message, status)
VALUES
('Arjun Sen', 'arjun@techstart.io', 'Enterprise Recruiter License API', 'We are looking to bulk-sync 150 live positions from our internal ATS using REST hooks. Do you support API syndication?', 'Unread'),
('Meera Nair', 'meera.nair@gmail.com', 'Government Job Syllabus Download Error', 'The official syllabus link for Ministry of External Affairs ASO is showing a 404 error page. Could you verify the resource coordinate?', 'Resolved')
ON CONFLICT (email, subject) DO NOTHING;

-- 8. Seed Site general Settings
INSERT INTO public.admin_site_settings (setting_key, setting_value)
VALUES
('branding', '{"logo": "▲ JOB Lo", "favicon": "▲", "homepage_banner": "Discover the Ultimate Tech & Government Career Pipeline"}'::jsonb),
('footer', '{"text": "JOB Lo © 2026. Certified under Indian DPDP Guidelines. All compliance parameters cryptographically hashed.", "links": ["Privacy Policy", "Terms of Use", "GDPR Logs", "MCA Directory"]}'::jsonb),
('social_links', '{"twitter": "https://x.com/joblo", "linkedin": "https://linkedin.com/company/joblo", "github": "https://github.com/joblo"}'::jsonb),
('contact_details', '{"support_email": "support@joblo.in", "helpline": "+91 80 4912 1000", "hq": "Indiranagar, Bengaluru, KA, India"}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
