# Administrative Control Panel (Admin Portal) - JOB Lo

This document serves as the official administrative, operational, and architectural documentation for the JOB Lo Admin Portal. The Admin Portal is designed to provide 100% full-circle CRUD, audit, scrapers, firewalls, and LLM telemetry management for India's largest AI Career Platform.

---

## 🏛️ System Architecture

The Admin Portal is constructed using a decoupled modular architecture. It utilizes React 18+ with TypeScript and Tailwind CSS, orchestrated under a robust tabbed view model inside `AdminDashboardPage.tsx`.

The data layer is managed by the unified `AdminService` (`/src/services/adminService.ts`), which handles local transactional state, bulk processes, activity auditing, and forms with full high-fidelity live preview.

---

## 📂 Admin Module Directory

The Administrative Control Panel is segmented into **13 highly integrated administrative sub-modules**:

### 1. System Overview (`/src/features/admin/overview`)
- **Metric Indicator Bento Grid**: Real-time aggregation of Total Users, Job Seekers, Employers, Verified Companies, Corporate/Gov Jobs, Applications, Blogs, and contacts.
- **Traffic & Financial Metrics**: Simulated daily visitors, monthly unique sourcing spikes, and paid employer plan revenues.
- **System Health Checks**: Real-time DB latency (ping), CPU loading, memory consumption, and gateway check indicators.
- **Auditable Activity Log**: Staggered feed logging recent operational events (e.g. KYC status, password rotation, scraping launches).

### 2. User Accounts (`/src/features/admin/users`)
- **Dual-Pane Directories**: Segmented views for User Base registers and detailed Job Seeker Profiles.
- **Full-Circle CRUD**: Add/Edit users with customizable roles, verify verification checkmarks, and configure account statuses.
- **Compliance Commands**: Support for Suspend, Activate, Delete, and Restore commands.
- **Fidelity Inspector**: Deep-dive user inspect sliders exposing resumes, applied/saved counts, skills vectors, and educational backgrounds.
- **Export Framework**: Standard CSV export downloads for external auditable reports.

### 3. Verified Companies (`/src/features/admin/companies`)
- **KYC Verification Queue**: Allows physical audits of MCA incorporation certificates, GSTIN, PAN numbers, and legal declarations.
- **Brand Directory Editor**: CMS editor allowing administrators to create brand assets, map offices, set company size thresholds, and declare URLs.
- **High-Fidelity live Preview**: Double-column brand page layout emulator including SEO SERP indicators.
- **Bulk Operations**: Mass-approve or bulk-reject brand verifications instantly.

### 4. Corporate Jobs (`/src/features/admin/jobs`)
- **Vacancy Registries**: Monitor salary scales, category indexes, office types (Remote, Hybrid, Onsite), and application links.
- **Approval Lifecycle**: Publish or revert jobs to drafts individually or in batches.
- **SEO Sync**: Auto-slugify job listings to render search-engine indexing tags instantly.

### 5. Government Gazettes (`/src/features/admin/government-jobs`)
- **Daily Scrapes & Indexing**: Admin panel to curate and manually index state/central government notifications.
- **Exam syllabus Mapping**: Curate exam bodies (SSC, UPSC, State PSC) and official downloadable syllabus coordinates.
- **Eligibility Validators**: Precise fields for salaries, age limits, post qualifications, and deadlines.

### 6. Editorial Content (`/src/features/admin/content`)
- **Blogs CMS**: Create high-impact Markdown-supported blogs with image preset builders, category tags, and author tags.
- **Category Directories**: Hierarchy ordering and SEO slugs for all platform sectors.
- **Career Prep Curations**: Easy, Medium, and Hard preparation resources for technical and corporate interviews.
- **SEO SERP Live Simulator**: Emulates exact Google search result previews including Titles, Canonical Links, and Meta descriptions.

### 7. Author Bios (`/src/features/admin/authors`)
- **Specialist Registries**: Manage verified career advisory authors, PhD specialists, and HR contributors.
- **Fidelity Statistics**: Tracks total active guides published under each professional profile.

### 8. Abuse & Verification Reports (`/src/features/admin/reports`)
- **Abuse Audit logs**: Track flagged postings, spam applications, and fraudulent candidate CVs.
- **Actions Panel**: Block listings, warning alerts, and content pruning.

### 9. Automation Webhooks (`/src/features/admin/automation`)
- **N8N / Trigger Integrations**: Schedule scraper intervals, trigger DB indexes, and evict Redis caches.
- **Status Monitors**: Check webhook execution speeds, schedule intervals, and last-run indicators.

### 10. AI LLM Monitoring (`/src/features/admin/ai-monitoring`)
- **LLM Token Telemetry**: Logs model prompt/completion tokens, latencies, and success/fail statuses for Gemini API pipelines.

### 11. Sourcing Analytics (`/src/features/admin/analytics`)
- **D3/Recharts Emulators**: Render visual representation for registration pipelines, applicant geographic counts, and conversion ratios.

### 12. Security Firewall (`/src/features/admin/security`)
- **DPDP Compliance Logs**: Complete auditable security tracking.
- **Firewall Gates**: Monitor blocked malicious IPs, captcha enforcements, and API key rotations.

### 13. Portal Settings (`/src/features/admin/settings`)
- **Branding Panel**: Edit logo titles, favicons, banners, and support coordinates.
- **Rotate Passwords**: Cycle system credentials securely.
- **Trigger Alarms**: Map critical notifications for security alerts, cron webhooks, and compliance audits.
