-- SQL Migration: 005_editorial_authors_schema.sql
-- Description: Define database schema for editorial authors who verify and write career guides / resources.

CREATE TABLE IF NOT EXISTS public.admin_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    credentials VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL DEFAULT 'Corporate Prep', -- 'Corporate Prep', 'Gazette Exams', 'Resume Design', 'Skill Mapping'
    active_guides INT DEFAULT 0,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_symbol VARCHAR(50) DEFAULT '👨‍💼',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updating the updated_at timestamp automatically
CREATE TRIGGER tr_admin_authors_updated_at 
BEFORE UPDATE ON public.admin_authors 
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_tables_updated_at();
