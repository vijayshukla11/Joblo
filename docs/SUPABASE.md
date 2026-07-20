# Supabase Integration and Security Guide - JOB Lo

This document outlines the design and deployment parameters for the real full-stack Supabase integration. It details environment configurations, authentication session models, file storage systems, and Row-Level Security (RLS) access control rules.

---

## 🔌 Connection Setup

The application uses a unified, safe proxy layer to manage connections. The client detects the presence of local keys in the workspace environment, enabling live backend requests when available and gracefully falling back to a persistent LocalStorage simulator when unconfigured:

- **Config Entry Point**: `/src/lib/supabase.ts` (Official `@supabase/supabase-js` instance)
- **Hybrid Proxy Gateway**: `/src/integrations/supabase/client.ts`

### Environment Variables (.env)
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_DATABASE_URL="postgresql://postgres:your-db-pass@db.your-project-id.supabase.co:5432/postgres"
```

---

## 🔐 Authentication & Session Persistence

Authentication is fully integrated using **Supabase Auth**. This includes persistent sessions, protected route redirection, and role-based access.

### 1. Unified Authentication Provider (`AuthContext.tsx`)
Monitors auth sessions on boot using `supabaseClient.auth.getSession()` and maps the session to the standard user profile.

### 2. User Roles
- **Admin**: System operators who manage CMS, company verifications, audit logs, and newsletters.
- **Employer**: Recruiter accounts who post jobs, view applicant lists, update hiring pipelines, and edit profiles.
- **Applicant**: Job seekers who complete onboarding wizards, build resumes, bookmark jobs, and apply to listings.

### 3. Auth Flow Mapping
- **Sign Up**: Creates a new user in Supabase Auth, mapping a custom metadata role payload:
  ```typescript
  supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } }
  });
  ```
- **Sign In**: Standard session request via `signInWithPassword`.
- **Session Persistence**: Auto-managed via cookies and LocalStorage token states.

---

## 🪣 Storage Buckets

File uploads utilize the **Supabase Storage** API. We configure granular buckets to categorize public assets and secure documents.

| Bucket Name | Target Sub-directories | Max File Size | Allowed File Types | Public Access |
| :--- | :--- | :--- | :--- | :--- |
| `resumes` | `{userId}/resume_*.pdf` | 10MB | PDF, DOCX | Private (Authorized Only) |
| `avatars` | `{userId}/avatar_*.*` | 5MB | JPEG, PNG, WEBP | Public Read |
| `company-logos`| `{companyId}/logo_*.*` | 5MB | JPEG, PNG | Public Read |
| `blog-images` | `blog_covers/` | 10MB | JPEG, PNG, WEBP | Public Read |
| `government-pdfs`| `circulars/` | 20MB | PDF | Public Read |

---

## 🛡️ Row Level Security (RLS) Policies

All public tables have **Row Level Security (RLS)** enabled to prevent unauthorized manipulation and data leaks.

### 1. Candidate Profiles (`public.profiles`)
- **Select**: Anyone can select profiles if the user sets `settings_privacy_public = true`.
- **Insert/Update/Delete**: Only the authenticated user whose `auth.uid()` matches the profile's `user_id` can modify it.
  ```sql
  CREATE POLICY "Allow user manage own profile details" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  ```

### 2. Companies (`public.companies`)
- **Select**: Anyone can view companies (Public).
- **Insert/Update/Delete**: Recruiter matching `auth.uid() = user_id` can write.
  ```sql
  CREATE POLICY "Allow employer manage own company details" 
  ON public.companies FOR ALL 
  USING (auth.uid() = user_id);
  ```

### 3. Jobs (`public.jobs`)
- **Select**: Anyone can read jobs marked as `'Published'`.
- **Insert/Update/Delete**: Employers whose companies own the job listing can write.
  ```sql
  CREATE POLICY "Allow employers to manage their jobs" 
  ON public.jobs FOR ALL 
  USING (EXISTS (
      SELECT 1 FROM public.companies 
      WHERE public.companies.id = public.jobs.company_id 
      AND public.companies.user_id = auth.uid()
  ));
  ```

### 4. Job Applications (`public.job_applications`)
- **Read**: Authorized employers owning the referenced job, OR the applicant themselves.
- **Write**: Only the applicant themselves on creation; only the hiring employer can update the pipeline stage status.

### 5. Public CMS Content (`admin_categories`, `admin_blogs`, `admin_government_jobs`, etc.)
- **Select**: Enabled for all public visitors.
- **Modify**: Only authenticated system operators belonging to the `'Admin'` role are granted write/delete access.
