-- SQL Migration: 004_cms_seo_improvements.sql
-- Description: Improve Content Management System schemas by adding author and SEO fields to blogs, companies, and government jobs.

-- 1. Add author and SEO metadata fields to admin_blogs
ALTER TABLE public.admin_blogs 
ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Ritu Sen';

-- 2. Add slug, seo_title, seo_description, and seo_keywords fields to companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(512),
ADD COLUMN IF NOT EXISTS seo_keywords VARCHAR(512);

-- 3. Add seo_title, seo_description, and seo_keywords fields to admin_government_jobs
ALTER TABLE public.admin_government_jobs 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(512),
ADD COLUMN IF NOT EXISTS seo_keywords VARCHAR(512);
