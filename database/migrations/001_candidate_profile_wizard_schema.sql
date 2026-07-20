-- SQL Migration: 001_candidate_profile_wizard_schema.sql
-- Description: Alter table 'profiles' to support comprehensive candidate onboarding wizard details

-- 1. Create candidate profiles table if not exists, otherwise alter it
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    skills TEXT[], -- Array of core technical skill strings
    experience TEXT, -- Legacy experience text block
    education TEXT, -- Legacy education text block
    linkedin_url VARCHAR(512),
    github_url VARCHAR(512),
    portfolio_url VARCHAR(512),
    resume_url VARCHAR(512),
    profile_photo VARCHAR(512),

    -- Extended Basic coordinates
    address TEXT,
    pincode VARCHAR(10),

    -- Extended Academic indices
    edu_10th_percentage NUMERIC(5, 2),
    edu_12th_percentage NUMERIC(5, 2),
    edu_diploma_percentage NUMERIC(5, 2),
    edu_graduation_percentage NUMERIC(5, 2),
    edu_masters_percentage NUMERIC(5, 2),
    edu_university VARCHAR(255),
    edu_passing_year VARCHAR(4),
    edu_cgpa VARCHAR(20),

    -- Extended Career practice matrices
    exp_is_fresher BOOLEAN DEFAULT FALSE,
    exp_company VARCHAR(255),
    exp_designation VARCHAR(255),
    exp_joining_date DATE,
    exp_leaving_date DATE,
    exp_responsibilities TEXT,
    exp_achievements TEXT,

    -- Extended Skill categories
    skills_technical TEXT[],
    skills_soft TEXT[],
    skills_languages TEXT[],
    skills_level VARCHAR(50) DEFAULT 'Intermediate',
    skills_certificates TEXT[],

    -- Automated Resume Tracker indicators
    resume_ats_score INT DEFAULT 0,
    resume_last_updated VARCHAR(50),

    -- Career preferences
    pref_role VARCHAR(255),
    pref_industry VARCHAR(255),
    pref_city VARCHAR(255),
    pref_state VARCHAR(255),
    pref_expected_salary VARCHAR(50),
    pref_current_salary VARCHAR(50),
    pref_notice_period VARCHAR(50) DEFAULT 'Immediate',
    pref_employment_type VARCHAR(50) DEFAULT 'Full-time',
    pref_work_mode VARCHAR(50) DEFAULT 'Remote',
    pref_open_to_relocate BOOLEAN DEFAULT FALSE,

    -- Extended Social & Professional links
    link_website VARCHAR(512),
    link_behance VARCHAR(512),
    link_dribbble VARCHAR(512),

    -- Achievements portfolios
    ach_projects TEXT,
    ach_awards TEXT,
    ach_hackathons TEXT,
    ach_publications TEXT,
    ach_volunteer TEXT,

    -- Recruiter privacy / Notifications preferences
    settings_notif_recommendations BOOLEAN DEFAULT TRUE,
    settings_notif_updates BOOLEAN DEFAULT TRUE,
    settings_notif_invites BOOLEAN DEFAULT TRUE,
    settings_notif_tips BOOLEAN DEFAULT TRUE,
    settings_notif_gov_alerts BOOLEAN DEFAULT TRUE,
    settings_notif_system BOOLEAN DEFAULT TRUE,
    settings_privacy_public BOOLEAN DEFAULT TRUE,

    -- Meta onboarding flow controls
    is_profile_wizard_completed BOOLEAN DEFAULT FALSE,
    wizard_step INT DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ensure timezone trigger on profiles table updates
CREATE OR REPLACE FUNCTION public.handle_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profiles_updated_at();

-- 3. Row-Level Security (RLS) setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select of public profiles" 
    ON public.profiles FOR SELECT 
    USING (settings_privacy_public = TRUE);

CREATE POLICY "Allow user manage own profile details" 
    ON public.profiles FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
