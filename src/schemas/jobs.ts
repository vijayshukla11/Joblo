/**
 * PostgreSQL Schema Definition for Jobs
 * Ready for Drizzle ORM / Cloud SQL mapping in Sprint 2.
 */
export interface JobSchema {
  id: string; // uuid PRIMARY KEY
  slug: string; // varchar(255) UNIQUE NOT NULL
  title: string; // varchar(255) NOT NULL
  organization: string; // varchar(255) NOT NULL
  location: string; // varchar(255) NOT NULL
  salaryMin: number; // integer
  salaryMax: number; // integer
  description: string; // text NOT NULL
  requirements: string[]; // jsonb NOT NULL DEFAULT '[]'
  benefits: string[]; // jsonb NOT NULL DEFAULT '[]'
  createdAt: string; // timestamp DEFAULT now()
  updatedAt: string; // timestamp DEFAULT now()
  isActive: boolean; // boolean DEFAULT true
  isGovernment: boolean; // boolean DEFAULT false
  gazetteId: string | null; // varchar(255) REFERENCES gazettes(id)
}
