-- SQL Seed: 004_seed_cms_seo_improvements.sql
-- Description: Insert rich seed data reflecting the new CMS and SEO improvements

-- 1. Seed some blogs with authors and SEO fields
INSERT INTO public.admin_blogs (title, slug, content, excerpt, status, categories, tags, featured_image, author, seo_title, seo_description, seo_keywords)
VALUES 
('How to Crack any Technical Interview in 2026', 'crack-technical-interview-2026', 'Technical interviews in 2026 require a blend of deep understanding of web standards, cloud-native deployments, and interactive live architectures like WebSockets. Focus on mock problem solving, core algorithm practices, and continuous deployment logs.', 'A comprehensive strategy from senior engineering leaders on how to clear tech interviews at top firms like Linear and Vercel.', 'Published', ARRAY['Software Engineering'], ARRAY['interview', 'career', 'tech'], 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', 'Ritu Sen', 'How to Crack Tech Interviews in 2026 | JOB Lo', 'Crack any technical coding or system design interview with our expert guide curated by HR Specialists.', 'tech interview prep, coding, systems design'),
('Navigating the New Age of Remote Sourcing', 'navigating-remote-sourcing', 'Remote sourcing has transitioned from a fringe benefit to a standard operational protocol. Teams operating across multiple time zones require highly structured asynchronous tools. Developers need to showcase proactive documentation habits and stellar task management skills.', 'Learn how global remote teams screen, select, and onboard engineers across international borders.', 'Draft', ARRAY['Global Remote Sourcing'], ARRAY['remote', 'recruiting', 'trends'], 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Dr. Arvinder Singh', 'Global Remote Sourcing Trends | JOB Lo', 'Master remote work applications and understand how companies source developers globally.', 'remote jobs, remote work, global recruiting')
ON CONFLICT (slug) DO NOTHING;

-- 2. Update existing companies with SEO fields and slugs (assuming IDs from previous migration)
UPDATE public.companies SET 
    slug = 'linear-labs-india',
    seo_title = 'Linear Labs Careers | Job Openings & Culture',
    seo_description = 'Work at Linear Labs in India. View open software engineering and designer positions with verified high salary scales.',
    seo_keywords = 'linear, design software, developer jobs'
WHERE name = 'Linear Labs';

UPDATE public.companies SET 
    slug = 'zomato-india-careers',
    seo_title = 'Zomato India Careers | FoodTech Opportunities',
    seo_description = 'Explore careers in foodtech and logistics at Zomato India. Apply directly for verified office or field roles.',
    seo_keywords = 'zomato jobs, foodtech, product management'
WHERE name = 'Zomato India';
