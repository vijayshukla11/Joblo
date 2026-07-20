# Supabase API Specifications - JOB Lo

This file documents the API boundaries, query structures, and JSON payloads for connecting to the real Supabase database layer.

---

## 📡 Authentication API

All authentication requests run through Supabase Auth.

### 1. Register User
- **Method**: `signUp`
- **Request Parameters**:
  ```json
  {
    "email": "candidate@gmail.com",
    "password": "secure_password_123",
    "options": {
      "data": {
        "name": "Karan Malhotra",
        "role": "Applicant"
      }
    }
  }
  ```

### 2. Login User
- **Method**: `signInWithPassword`
- **Request Parameters**:
  ```json
  {
    "email": "candidate@gmail.com",
    "password": "secure_password_123"
  }
  ```

---

## 💾 Database API

### 1. Candidate Profile CRUD
- **Table**: `public.profiles`
- **Get Profile**:
  ```sql
  SELECT * FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  ```
- **Upsert Profile**:
  ```json
  {
    "user_id": "usr-uuid-12345",
    "full_name": "Karan Malhotra",
    "phone": "+91 98765 43210",
    "city": "Mumbai",
    "state": "Maharashtra",
    "skills": ["React", "PostgreSQL", "Tailwind CSS"],
    "is_profile_wizard_completed": true,
    "wizard_step": 8
  }
  ```

### 2. Job Listings CRUD
- **Table**: `public.jobs`
- **Get Published Jobs (Public)**:
  ```sql
  SELECT * FROM public.jobs WHERE status = 'Published' ORDER BY created_at DESC;
  ```
- **Create Job (Employer)**:
  ```json
  {
    "company_id": "comp-uuid-98765",
    "title": "Senior React Engineer",
    "slug": "senior-react-engineer-mumbai",
    "salary": "₹15,00,000 - ₹22,00,000",
    "skills": ["React 19", "TypeScript", "Vite"],
    "location": "Mumbai (Hybrid)",
    "status": "Published"
  }
  ```

### 3. Application Pipeline
- **Table**: `public.job_applications`
- **Apply to Job**:
  ```json
  {
    "job_id": "job-uuid-11111",
    "applicant_id": "profile-uuid-22222",
    "applicant_name": "Karan Malhotra",
    "applicant_email": "candidate@gmail.com",
    "resume_url": "https://example.com/resumes/karan_resume.pdf",
    "status": "Applied"
  }
  ```
- **Update Hiring Stage (Recruiter)**:
  ```json
  {
    "status": "Interview Scheduled",
    "timeline": [
      {
        "date": "20/07/2026",
        "status": "Interview Scheduled",
        "description": "Recruiter rescheduled technical session for 23rd July."
      }
    ]
  }
  ```

---

## 🪣 File Storage API

All storage upload APIs utilize the standard Supabase Storage client:

- **Upload Resume Document**:
  ```typescript
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload('userId/resume_12345.pdf', file);
  ```
- **Upload Avatar Photo**:
  ```typescript
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload('userId/avatar_12345.png', file);
  ```
