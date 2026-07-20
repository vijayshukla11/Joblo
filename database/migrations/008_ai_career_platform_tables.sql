-- SQL Migration: 008_ai_career_platform_tables.sql
-- Description: Define database schemas for AI History, AI Usage, Resume Analysis, Interview Sessions, Career Roadmaps, and ATS Reports.

-- 1. Create AI History Logs table (Module 13 / 14)
CREATE TABLE IF NOT EXISTS public.ai_history_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- References auth.users or candidate profiles
    module VARCHAR(100) NOT NULL, -- 'Resume Parser', 'ATS Engine', etc.
    prompt_text TEXT,
    response_text TEXT,
    response_time_ms INT DEFAULT 0,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create AI Usage Metrics table for aggregates
CREATE TABLE IF NOT EXISTS public.ai_usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) UNIQUE NOT NULL,
    total_calls INT DEFAULT 0,
    success_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    avg_latency_ms INT DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Candidate Resume Analyses table (Module 2 / 4)
CREATE TABLE IF NOT EXISTS public.candidate_resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    raw_resume_text TEXT NOT NULL,
    parsed_json JSONB NOT NULL,
    optimized_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Candidate ATS Reports table (Module 3)
CREATE TABLE IF NOT EXISTS public.candidate_ats_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_id UUID,
    job_title VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    report_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Candidate Career Roadmaps table (Module 6 / 7)
CREATE TABLE IF NOT EXISTS public.candidate_career_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    target_role VARCHAR(255) NOT NULL,
    timeframe_months INT NOT NULL DEFAULT 12,
    roadmap_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Candidate Interview Sessions table (Module 8)
CREATE TABLE IF NOT EXISTS public.candidate_interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed'
    session_data JSONB NOT NULL, -- holds complete question-answer list and scores
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.ai_history_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_ats_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_interview_sessions ENABLE ROW LEVEL SECURITY;

-- Simple Access Policies (Candidates read/write their own records, admin read all)
CREATE POLICY "Allow users to view their own AI history" 
    ON public.ai_history_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own Resume analysis" 
    ON public.candidate_resume_analyses FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to manage their own Resume analysis" 
    ON public.candidate_resume_analyses FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own ATS reports" 
    ON public.candidate_ats_reports FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own Career roadmaps" 
    ON public.candidate_career_roadmaps FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own Interview sessions" 
    ON public.candidate_interview_sessions FOR ALL 
    USING (auth.uid() = user_id);
