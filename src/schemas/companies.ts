/**
 * PostgreSQL Schema Definition for Companies
 * Ready for Drizzle ORM / Cloud SQL mapping in Sprint 2.
 */
export interface CompanySchema {
  id: string; // uuid PRIMARY KEY
  slug: string; // varchar(255) UNIQUE NOT NULL
  name: string; // varchar(255) NOT NULL
  industry: string; // varchar(255) NOT NULL
  size: string; // varchar(100) NOT NULL
  location: string; // varchar(255) NOT NULL
  website: string; // varchar(255)
  logoUrl: string | null; // varchar(512)
  about: string; // text NOT NULL
  rating: number; // numeric(3, 2) DEFAULT 0.0
  reviewCount: number; // integer DEFAULT 0
  isVerified: boolean; // boolean DEFAULT false
  createdAt: string; // timestamp DEFAULT now()
}
