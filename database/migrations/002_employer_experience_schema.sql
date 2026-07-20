-- SQL Migration: 002_employer_experience_schema.sql
-- Description: Define database schemas for Companies, Job Postings, and Applications to support the Employer Experience

-- 1. Create companies table (Employer Profiles)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    logo VARCHAR(512),
    cover_image VARCHAR(512),
    gst_number VARCHAR(15),
    pan_placeholder VARCHAR(10),
    industry VARCHAR(255),
    size VARCHAR(100),
    founded_year VARCHAR(4),
    website VARCHAR(512),
    linkedin VARCHAR(512),
    facebook VARCHAR(512),
    instagram VARCHAR(512),
    twitter_x VARCHAR(512),
    head_office VARCHAR(255),
    branches TEXT[], -- Array of branch location strings
    about TEXT,
    mission TEXT,
    vision TEXT,
    culture TEXT,
    benefits TEXT[], -- Array of core company benefits
    office_photos TEXT[], -- Array of image URLs for office gallery
    hiring_status VARCHAR(50) DEFAULT 'Active', -- Active, On Hold, Selective
    company_email VARCHAR(255),
    recruiter_name VARCHAR(255),
    recruiter_mobile VARCHAR(20),
    support_email VARCHAR(255),
    
    -- Setup Wizard Control
    is_profile_complete BOOLEAN DEFAULT FALSE,
    wizard_step INT DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) DEFAULT 'Tech',
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    salary VARCHAR(100) DEFAULT 'Competitive',
    employment_type VARCHAR(100) DEFAULT 'Full-time', -- Full-time, Part-time, Contract, Internship
    experience VARCHAR(100),
    skills TEXT[] NOT NULL, -- Required skills array
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    benefits TEXT[],
    deadline DATE,
    is_remote BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Published', -- Published, Draft, Archived
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Candidate snapshots (for offline/crawled pipelines or safety)
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20),
    applicant_experience VARCHAR(100),
    applicant_education VARCHAR(255),
    
    resume_url VARCHAR(512),
    resume_skills TEXT[],
    cover_letter TEXT,
    
    -- Workflow state
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Shortlisted, Interview Scheduled, Rejected
    timeline JSONB DEFAULT '[]'::jsonb, -- Array of chronological stage log events
    notes TEXT[] DEFAULT '{}'::text[], -- Internal recruiter feedback comments
    
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enable updated_at trigger for companies, jobs, and job_applications
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_companies_updated_at ON public.companies;
CREATE TRIGGER tr_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_jobs_updated_at ON public.jobs;
CREATE TRIGGER tr_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER tr_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row-Level Security (RLS) setup
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Companies Policies
CREATE POLICY "Allow public select of companies" 
    ON public.companies FOR SELECT USING (TRUE);

CREATE POLICY "Allow employer manage own company details" 
    ON public.companies FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Jobs Policies
CREATE POLICY "Allow public select of published jobs" 
    ON public.jobs FOR SELECT 
    USING (status = 'Published');

CREATE POLICY "Allow employers to manage their jobs" 
    ON public.jobs FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.companies 
        WHERE public.companies.id = public.jobs.company_id 
        AND public.companies.user_id = auth.uid()
    ));

-- Applications Policies
CREATE POLICY "Allow employers to view applications for their jobs" 
    ON public.job_applications FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.jobs
        JOIN public.companies ON public.companies.id = public.jobs.company_id
        WHERE public.jobs.id = public.job_applications.job_id
        AND public.companies.user_id = auth.uid()
    ));

CREATE POLICY "Allow employers to update applications for their jobs" 
    ON public.job_applications FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.jobs
        JOIN public.companies ON public.companies.id = public.jobs.company_id
        WHERE public.jobs.id = public.job_applications.job_id
        AND public.companies.user_id = auth.uid()
    ));

CREATE POLICY "Allow applicants to manage own applications" 
    ON public.job_applications FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = public.job_applications.applicant_id 
        AND public.profiles.user_id = auth.uid()
    ));
