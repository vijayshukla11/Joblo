-- SQL Migration: 003_admin_portal_schema.sql
-- Description: Create schemas for admin dashboard components (categories, blogs, career resources, government jobs, seo management, newsletter subscribers, contact inbox, site settings)

-- 1. Create categories table (parent-sub structures, orderings, icons)
CREATE TABLE IF NOT EXISTS public.admin_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES public.admin_categories(id) ON DELETE SET NULL,
    icon VARCHAR(100) DEFAULT '💼',
    ordering INT DEFAULT 0,
    seo_slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create blogs cms table
CREATE TABLE IF NOT EXISTS public.admin_blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(512) NOT NULL,
    slug VARCHAR(512) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft' or 'Published'
    categories VARCHAR(255)[], -- Tagged categories
    tags VARCHAR(255)[],
    featured_image VARCHAR(512) DEFAULT 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    seo_title VARCHAR(255),
    seo_description VARCHAR(512),
    seo_keywords VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create career resources table
CREATE TABLE IF NOT EXISTS public.admin_career_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(512) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Resume Tips', 'Interview Questions', 'Salary Guides', 'Career Guides', 'Skill Roadmaps'
    difficulty VARCHAR(50), -- 'Easy', 'Medium', 'Hard' (mostly for interview prep)
    topic_or_role VARCHAR(255),
    excerpt TEXT,
    content TEXT NOT NULL,
    resources_links JSONB DEFAULT '[]'::jsonb, -- Extra resources
    seo_title VARCHAR(255),
    seo_description VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create government jobs table
CREATE TABLE IF NOT EXISTS public.admin_government_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(512) NOT NULL,
    department VARCHAR(255) NOT NULL,
    slug VARCHAR(512) UNIQUE NOT NULL,
    logo VARCHAR(100) DEFAULT '🏛️',
    location VARCHAR(255) DEFAULT 'All India',
    state VARCHAR(100) DEFAULT 'Central', -- e.g., 'Maharashtra', 'Karnataka'
    salary VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    age_limit VARCHAR(100) NOT NULL,
    posted_date DATE DEFAULT CURRENT_DATE,
    last_date DATE NOT NULL,
    official_link VARCHAR(512) NOT NULL,
    exam_body VARCHAR(100) NOT NULL, -- 'SSC', 'UPSC', 'State PSC', 'Bank PO', 'Railways'
    syllabus_link VARCHAR(512),
    skills_required TEXT[] DEFAULT '{}'::text[],
    eligibility TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Central Gazetted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create seo settings / overrides table
CREATE TABLE IF NOT EXISTS public.admin_seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path VARCHAR(255) UNIQUE NOT NULL, -- e.g., '/jobs', '/government-jobs', '/'
    meta_title VARCHAR(255) NOT NULL,
    meta_description VARCHAR(512) NOT NULL,
    open_graph_image VARCHAR(512),
    canonical_url VARCHAR(512),
    redirect_to VARCHAR(255), -- If set, redirect requests
    sitemap_priority NUMERIC(3, 2) DEFAULT 0.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.admin_newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create contact messages table
CREATE TABLE IF NOT EXISTS public.admin_contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Unread', -- 'Unread', 'Resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create site settings table
CREATE TABLE IF NOT EXISTS public.admin_site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL, -- 'branding', 'footer', 'homepage_banner', 'social_links', 'contact_details'
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Add automatic update triggers
CREATE OR REPLACE FUNCTION public.handle_admin_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to admin_categories
CREATE TRIGGER tr_admin_categories_updated_at BEFORE UPDATE ON public.admin_categories FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
-- Apply updated_at trigger to admin_blogs
CREATE TRIGGER tr_admin_blogs_updated_at BEFORE UPDATE ON public.admin_blogs FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
-- Apply updated_at trigger to admin_career_resources
CREATE TRIGGER tr_admin_career_resources_updated_at BEFORE UPDATE ON public.admin_career_resources FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
-- Apply updated_at trigger to admin_government_jobs
CREATE TRIGGER tr_admin_government_jobs_updated_at BEFORE UPDATE ON public.admin_government_jobs FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
-- Apply updated_at trigger to admin_seo_settings
CREATE TRIGGER tr_admin_seo_settings_updated_at BEFORE UPDATE ON public.admin_seo_settings FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
-- Apply updated_at trigger to admin_contact_messages
CREATE TRIGGER tr_admin_contact_messages_updated_at BEFORE UPDATE ON public.admin_contact_messages FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
