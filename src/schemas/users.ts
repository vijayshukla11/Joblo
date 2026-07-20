/**
 * PostgreSQL Schema Definition for Users & Profiles
 * Ready for Drizzle ORM / Cloud SQL mapping in Sprint 2.
 */
export interface UserSchema {
  id: string; // uuid PRIMARY KEY (references supabase.auth.users)
  email: string; // varchar(255) UNIQUE NOT NULL
  fullName: string; // varchar(255) NOT NULL
  role: 'applicant' | 'employer' | 'admin'; // varchar(50) DEFAULT 'applicant'
  createdAt: string; // timestamp DEFAULT now()
  updatedAt: string; // timestamp DEFAULT now()
}

export interface ProfileSchema {
  userId: string; // uuid PRIMARY KEY REFERENCES users(id)
  resumeUrl: string | null; // varchar(512)
  skills: string[]; // jsonb NOT NULL DEFAULT '[]'
  experienceYears: number; // integer DEFAULT 0
  educationLevel: string | null; // varchar(255)
  savedJobIds: string[]; // jsonb NOT NULL DEFAULT '[]'
}
