import { useEffect, useState } from 'react';
import { MOCK_JOBS, MOCK_GOVERNMENT_JOBS } from '../constants';

interface SEOMetadata {
  title: string;
  description: string;
}

const STATIC_SEO_MAP: Record<string, SEOMetadata> = {
  '/': {
    title: 'JOB Lo | Direct Tech & Government Jobs Sourcing Gateway',
    description: 'Settle into certified corporate tech careers or verified public sector positions in India. Access open, ad-free direct sourcing, syllabus guides, and automated AI job matching.',
  },
  '/index.html': {
    title: 'JOB Lo | Direct Tech & Government Jobs Sourcing Gateway',
    description: 'Settle into certified corporate tech careers or verified public sector positions in India. Access open, ad-free direct sourcing, syllabus guides, and automated AI job matching.',
  },
  '/jobs': {
    title: 'Corporate & Tech Jobs Directory',
    description: 'Browse premium, active tech & corporate job openings in India\'s top tech hubs. Apply directly to verified employer application systems with zero middleman interference.',
  },
  '/government-jobs': {
    title: 'Indian Government Jobs Portal (Public Gazettes)',
    description: 'Explore active public service job opportunities verified from official gazettes and bulletins. Sort by SSC, UPSC, Bank PO, and Railways, with official syllabus details.',
  },
  '/companies': {
    title: 'Verified Premium Partner Companies Directory',
    description: 'Browse verified companies hiring actively in India. Review real workforce sizes, corporate ratings, and active direct recruitment pipelines.',
  },
  '/career-guides': {
    title: 'Expert Recruiter Career Guides',
    description: 'Master resume writing, interview preparation, and competitive exams. Study framework guides compiled and verified by recruitment experts.',
  },
  '/salary-guide': {
    title: 'National Salary Comparison & Intelligence Guide',
    description: 'Compare salary distributions for various software and engineering profiles in India. Analyze experience levels and compensation bounds.',
  },
  '/interview-preparation': {
    title: 'Curated Interview Q&A Preparation Guides',
    description: 'Ace your upcoming tech and general career interviews. Practice curated questions with expert-verified high-quality model answers.',
  },
  '/resume-builder': {
    title: 'Interactive Dynamic Resume Builder',
    description: 'Build a high-performance ATS-optimized resume in minutes. Add personal info, experience, skills, and download instant structured PDF resumes.',
  },
  '/ai-job-match': {
    title: 'AI-Powered Smart Match Feed',
    description: 'Upload your resume and leverage certified LLM matchmaking. Get customized fit scores, match breakdowns, and personalized application recommendations.',
  },
  '/dashboard': {
    title: 'Candidate Application Tracking Dashboard',
    description: 'Monitor your applied positions, active pipeline stages, saved job listings, and interview schedules in one unified candidate panel.',
  },
  '/login': {
    title: 'Candidate & Recruiter Secure Portal Login',
    description: 'Access your JOB Lo candidate portal or enterprise recruiter panel securely under DPDP compliance standards.',
  },
  '/register': {
    title: 'Create Candidate or Employer Portal Account',
    description: 'Join JOB Lo as a candidate to unlock AI matching or as an employer to list direct recruitment pipelines.',
  },
  '/about': {
    title: 'About JOB Lo | Transparent Direct Sourcing Gateway',
    description: 'Learn about JOB Lo\'s core mission to provide ad-free, direct, and zero-middleman corporate and government job sourcing across India.',
  },
  '/contact': {
    title: 'JOB Lo Help Center & Support Queries',
    description: 'Need help with application tracking or employer verification? Reach out to the JOB Lo sourcing helpdesk team for support.',
  },
  '/privacy': {
    title: 'Data Protection & Privacy Policy (DPDP Compliance)',
    description: 'Read how JOB Lo guarantees secure, encrypted candidate data storage and direct application delivery in compliance with India\'s DPDP Act.',
  },
  '/terms': {
    title: 'Terms & Conditions of Portal Usage',
    description: 'Review terms and conditions, user rights, and publisher disclaimers governing the use of the JOB Lo job sourcing platform.',
  },
};

export function useSEO(currentPath: string): SEOMetadata {
  const [metadata, setMetadata] = useState<SEOMetadata>({
    title: 'JOB Lo | Direct Tech & Government Jobs Sourcing Gateway',
    description: 'Settle into certified corporate tech careers or verified public sector positions in India.',
  });

  useEffect(() => {
    let resolvedTitle = 'JOB Lo | Direct Tech & Government Jobs Sourcing Gateway';
    let resolvedDescription = 'Settle into certified corporate tech careers or verified public sector positions in India.';

    // 1. Check for Exact Static Route Match
    // Strip query parameters from currentPath if present for routing lookup
    const pathWithoutParams = currentPath.split('?')[0];
    const staticMetadata = STATIC_SEO_MAP[pathWithoutParams];

    if (staticMetadata) {
      resolvedTitle = staticMetadata.title;
      resolvedDescription = staticMetadata.description;
    } 
    // 2. Check for Dynamic Job Detail Route Match (/jobs/:slug)
    else if (pathWithoutParams.startsWith('/jobs/')) {
      const slug = pathWithoutParams.substring(6);
      if (slug) {
        // Look up corporate job first
        const corporateJob = MOCK_JOBS.find((j) => j.slug === slug);
        if (corporateJob) {
          resolvedTitle = `${corporateJob.title} at ${corporateJob.companyName} | JOB Lo`;
          resolvedDescription = `Apply for the ${corporateJob.title} position at ${corporateJob.companyName} in ${corporateJob.location}. Salary: ${corporateJob.salary}. Experience required: ${corporateJob.experience}. Required skills: ${corporateJob.skills.join(', ')}. Sourced through verified corporate channels.`;
        } else {
          // Look up government job as fallback
          const govJob = MOCK_GOVERNMENT_JOBS.find((gj) => gj.slug === slug);
          if (govJob) {
            resolvedTitle = `${govJob.title} - ${govJob.department} | JOB Lo Govt`;
            resolvedDescription = `Official notification for ${govJob.title} in ${govJob.department}. Eligibility criteria: ${govJob.eligibility}. Location: ${govJob.location}. Application Deadline: ${govJob.applicationDeadline}. Verified public sector listing.`;
          }
        }
      }
    } 
    // 3. Fallback Route (404 Page)
    else {
      resolvedTitle = 'Page Not Found';
      resolvedDescription = 'The requested resource could not be found on the JOB Lo portal. Use our navigation menu to discover active corporate and government positions.';
    }

    setMetadata({ title: resolvedTitle, description: resolvedDescription });

    // Inject tags dynamically into document head
    const fullTitle = `${resolvedTitle} | JOB Lo`;
    document.title = fullTitle;

    const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', resolvedDescription);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', resolvedDescription);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', window.location.href);

    // Manage Link Canonical
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', window.location.href);

    console.log(`[useSEO Hook] Dynamically injected SEO tags for path: ${currentPath}`);
  }, [currentPath]);

  return metadata;
}
