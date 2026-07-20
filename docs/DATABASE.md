# Database Architecture and Migration Schemas - JOB Lo

This document maps out the database architecture for the JOB Lo platform, detailing tables, fields, index schemas, and trigger automations designed for production deployments (such as Supabase/PostgreSQL).

---

## 🗄️ Database Tables Overview

All schemas are declared under the `public` schema. Table definitions incorporate standard constraints, UUID primary keys, and foreign key references.

```
                  +------------------------+
                  |    admin_categories    |
                  +------------------------+
                              | (parent_id)
                              v
                  +------------------------+
                  |      admin_blogs       |
                  +------------------------+
                              |
                  +------------------------+
                  | admin_career_resources |
                  +------------------------+
```

---

## 📂 Migration Directory Structure (`/database/migrations`)

Our migrations are segmented sequentially to ensure logical schema bootstrapping:

### 1. `001_candidate_profile_wizard_schema.sql`
- **Purpose**: Boots user accounts, candidate profile vectors, education, and experience trackers.

### 2. `002_employer_experience_schema.sql`
- **Purpose**: Sets up corporate recruiter plans, verification parameters, and company-employer relationships.

### 3. `003_admin_portal_schema.sql`
- **Purpose**: Defines standard administrative support tables:
  - `admin_categories`: Platform category listings with custom parent hierarchy and emoji icons.
  - `admin_blogs`: Full Markdown blogs with SEO Title, description, and keywords.
  - `admin_career_resources`: Curated preparation guides with difficulty levels.
  - `admin_government_jobs`: Central and state government recruitment records.
  - `admin_seo_settings`: Dynamic page overrides for meta indexing.
  - `admin_newsletter_subscribers`: Newsletter sign-ups.
  - `admin_contact_messages`: Customer contact forms with replies.
  - `admin_site_settings`: Global key-value JSON configurations.

### 4. `004_cms_seo_improvements.sql`
- **Purpose**: Extends corporate and company profiles with additional metadata (e.g. description, website, size, founded_year, custom SEO tags).

### 5. `005_editorial_authors_schema.sql`
- **Purpose**: Sets up the `admin_authors` table, tracking credentials, specialties, bios, and total guides published.

### 6. `006_automation_webhooks_schema.sql`
- **Purpose**: Bootstraps the `admin_automation_webhooks` table, organizing automated scrapers, cron schedulers, and webhook statuses.

### 7. `007_telemetry_and_security_schema.sql`
- **Purpose**: Defines `admin_ai_monitoring_logs` (AI token latencies) and `admin_security_logs` (DPDP compliance logging).

---

## 🔄 Triggers & Automation

To maintain synchronization across timestamps, every administrative table incorporates an automatic `updated_at` modification trigger.

```sql
CREATE OR REPLACE FUNCTION public.handle_admin_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

This trigger automatically updates the `updated_at` column to `CURRENT_TIMESTAMP` whenever a row is modified, preventing stale data.

---

## 🌱 Seeds Directory Structure (`/database/seeds`)

All seed files are stored inside `/database/seeds` and align exactly with the schemas above:
- `001_seed_job_seeker_experience.sql`
- `002_seed_employer_experience.sql`
- `003_seed_admin_portal.sql`
- `004_seed_cms_seo_improvements.sql`
- `005_seed_editorial_authors.sql`
- `006_seed_automation_webhooks.sql`
- `007_seed_telemetry_and_security.sql`
