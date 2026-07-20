-- SQL Seed File: 005_seed_editorial_authors.sql
-- Description: Seed initial mock data for the newly defined editorial authors table

INSERT INTO public.admin_authors (name, credentials, specialty, active_guides, email, bio, avatar_symbol)
VALUES
(
  'Dr. Arvinder Singh', 
  'PhD Career Advisory', 
  'Gazette Exams', 
  12, 
  'arvinder.singh@joblo.in', 
  'Senior advisor with 15+ years training public administration candidates.', 
  '👨‍💼'
),
(
  'Ritu Sen', 
  'Ex-HR Specialist Infosys', 
  'Corporate Prep', 
  8, 
  'ritu.sen@joblo.in', 
  'HR expert focusing on tech recruitment pipelines and corporate skill alignment.', 
  '👩‍💼'
)
ON CONFLICT (email) DO NOTHING;
