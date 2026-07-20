# Services and Repositories Mapping - JOB Lo

This document maps out the backend services, repositories, and transactional queries across the JOB Lo full-stack system.

---

## 🏗️ Architectural Framework

We implement a modular **Service-Repository Pattern**:
1. **Views/UI**: Call high-level Services to complete business processes.
2. **Services**: Manage logical evaluations, data transformation, telemetry logging, and triggers.
3. **Repositories**: Act as the direct data access layer (DAL), communicating with Supabase via SQL queries.

```
+------------+        +------------------+        +-------------------------+
|  React UI  | -----> | Business Service | -----> |  Supabase Repository    |
| (Dashboard)|        | (ProfileService) |        | (CandidateRepository)   |
+------------+        +------------------+        +-------------------------+
                                                               |
                                                               v
                                                      +------------------+
                                                      |  Supabase Client |
                                                      |   (PostgreSQL)   |
                                                      +------------------+
```

---

## 📂 Active Services & Repository Mapping

### 1. Authentication Service (`src/services/authService.ts`)
Handles core identity gateways.
- **Supabase Integration**: Uses Supabase Auth `signUp`, `signInWithPassword`, and `signOut`.
- **Session Mapping**: Synchronizes standard JWT tokens, maintains role metadata in `user_metadata`, and enables role-based dashboard redirects on initialization.

### 2. Candidate Service (`src/repositories/candidateRepository.ts`)
Combines `profileService.ts` and `candidateActivityService.ts`.
- **Read Profile**: Queries `profiles` table filtering by `user_id`.
- **Upsert Profile**: Synchronizes full multipage onboarding wizard fields.
- **Bookmarks**: Tracks saved jobs via `saved_jobs` junction table.
- **Applications**: Handles job seeker applications inside `applications`.

### 3. Recruiter Service (`src/repositories/employerRepository.ts`)
Exposes methods from `employerService.ts`.
- **Company Profile**: CRUD operations on company branding, office galleries, and corporate GST records.
- **Job Posting**: Custom CRUD queries on the `jobs` table, including draft-to-published pipelines and automated slug creation.
- **Recruitment Pipeline**: Maps applications submitted, filters applicants, and modifies pipeline interview status.

### 4. CMS & Public Content Service (`src/repositories/cmsRepository.ts`)
Feeds data from `adminService.ts` into public-facing feeds.
- **Public Jobs**: Dynamic feed with full search, category filtering, remote flags, and salary ranges.
- **Government Gazettes**: Renders administrative syllabus sheets, post caps, and eligibility forms.
- **Blogs Hub**: Handles markdown blog feeds, seo slugs, cover images, and tags.
- **Career Preparation**: Feeds curated FAQ items, difficulty-rated interview preparation questions, and resume templates.

### 5. Administrative Services (`src/repositories/adminRepository.ts`)
Used exclusively inside the root Admin Dashboard panel.
- **User Audits**: Direct select queries on global users and active recruiter licenses.
- **Security & Telemetry Logs**: Displays DPDP compliance telemetry, API latencies, and automation schedules.
- **Webhook Integrations**: Updates, deletes, and monitors data automation pipelines.
