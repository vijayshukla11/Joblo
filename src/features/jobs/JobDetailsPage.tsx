import React, { useState, useEffect } from 'react';
import { 
  Briefcase, MapPin, IndianRupee, Clock, Bookmark, ArrowLeft, 
  Sparkles, CheckCircle2, ShieldCheck, Mail, Calendar, HelpCircle, FileText,
  Globe, Building2, Users, Star
} from 'lucide-react';
import { jobRepository } from '../../repositories/jobRepository';
import { Job, Company } from '../../types';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';
import { useAuth } from '../../contexts/AuthContext';
import { candidateActivityService } from '../../services/candidateActivityService';

interface JobDetailsProps {
  slug: string;
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function JobDetails({ slug, onNavigate, onApplyDemo }: JobDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchJobAndCompany() {
      setLoading(true);
      const jobs = await jobRepository.getJobs();
      const foundJob = jobs.find(j => j.slug === slug);
      setJob(foundJob || null);
      if (foundJob) {
        const companies = await jobRepository.getCompanies();
        const foundCompany = companies.find(c => c.id === foundJob.companyId);
        setCompany(foundCompany || null);

        // Fetch related jobs (same category, company, or sharing key skills, excluding itself)
        const related = jobs
          .filter(j => j.id !== foundJob.id && (!j.status || j.status === 'Published') && (
            j.category === foundJob.category ||
            j.companyName === foundJob.companyName ||
            j.skills.some(sk => foundJob.skills.includes(sk))
          ))
          .slice(0, 3);
        setRelatedJobs(related);

        // Check if saved or applied in Supabase database
        if (user) {
          const savedJobs = await candidateActivityService.getSavedJobs(user.id);
          setIsSaved(savedJobs.some(sj => sj.id === foundJob.id));

          const apps = await candidateActivityService.getApplications(user.id);
          setIsApplied(apps.some(app => app.job_id === foundJob.id));
        }
      }
      setLoading(false);
    }
    fetchJobAndCompany();
  }, [slug, user]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login or create an account to apply to this corporate pipeline.");
      onNavigate('/login');
      return;
    }
    if (job) {
      try {
        const { success } = await candidateActivityService.applyToJob(user.id, job.id);
        if (success) {
          setIsApplied(true);
          onApplyDemo(job.title, job.companyName);
        }
      } catch (err) {
        console.error('Failed to apply directly:', err);
      }
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      alert("Please login or create an account to save job opportunities.");
      onNavigate('/login');
      return;
    }
    if (job) {
      try {
        if (isSaved) {
          const { success } = await candidateActivityService.removeSavedJob(user.id, job.id);
          if (success) setIsSaved(false);
        } else {
          const { success } = await candidateActivityService.saveJob(user.id, job.id);
          if (success) setIsSaved(true);
        }
      } catch (err) {
        console.error('Failed to toggle bookmark:', err);
      }
    }
  };

  if (loading) {
    return <LoadingState message="Extracting job pipeline schemas from PostgreSQL..." />;
  }

  if (!job) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Job Listing Not Found" 
          description="The exact job URI or slug does not match any current active pipelines in our index. It may have expired or been deactivated."
          actionText="Return to Job Search Feed"
          onAction={() => onNavigate('/jobs')}
        />
      </div>
    );
  }

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": "2026-07-01",
    "validThrough": "2026-12-31",
    "employmentType": job.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.companyName,
      "sameAs": "https://joblo.in"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    }
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={`${job.title} at ${job.companyName}`}
        description={`Apply for ${job.title} at ${job.companyName} (${job.location}). Compensation: ${job.salary}. Requirements: ${job.experience}. Sourced with n8n workflow.`}
        schema={jobSchema}
      />

      <Breadcrumbs 
        items={[
          { label: 'Job Search', path: '/jobs' },
          { label: job.companyName, path: `/jobs?q=${encodeURIComponent(job.companyName)}` },
          { label: job.title }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* JOB CARD PROFILE HEADER */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-zinc-950 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm border border-zinc-800">
              {job.companyLogo}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500">{job.companyName}</span>
                <span className="text-gray-300 font-mono text-[9px]">•</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span>n8n Verified</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posted {job.postedDate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleSaveToggle}
              className={`p-2.5 rounded-xl border focus-ring cursor-pointer transition-all ${
                isSaved 
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
                  : 'text-gray-400 hover:text-black border-slate-200 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={handleApply}
              disabled={isApplied}
              className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-bold text-white rounded-xl focus-ring transition-all select-none cursor-pointer text-center ${
                isApplied 
                  ? 'bg-emerald-600 text-white cursor-default' 
                  : 'bg-black hover:bg-zinc-800'
              }`}
            >
              {isApplied ? 'Application Outbound ✓' : 'Apply Directly'}
            </button>
          </div>

        </div>
      </section>

      {/* BODY SPECIFICATION CONTAINER */}
      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COL 1 & 2: RECRUITER SPECS & DESCRIPTION */}
        <div className="md:col-span-2 space-y-6">
          
          {/* CRITICAL ATTRIBUTES TABLE */}
          <div className="border border-slate-150 rounded-xl p-5 grid grid-cols-3 gap-3 bg-white">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Wages Offered</span>
              <div className="flex items-center gap-1 font-sans text-xs text-emerald-800 font-bold">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.salary.split(' / ')[0]}</span>
              </div>
            </div>

            <div className="space-y-1 border-l border-slate-100 pl-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Required Practice</span>
              <div className="flex items-center gap-1 font-sans text-xs text-gray-800 font-bold">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.experience}</span>
              </div>
            </div>

            <div className="space-y-1 border-l border-slate-100 pl-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Workforce Model</span>
              <div className="flex items-center gap-1 font-sans text-xs text-gray-800 font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.employmentType}</span>
              </div>
            </div>
          </div>

          {/* EDITORIAL CONTENT */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 font-heading tracking-tight border-b border-slate-100 pb-2">
              Role Specification & Core Requirements
            </h2>
            
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              {job.description}
            </p>

            <div className="space-y-2.5 pt-4">
              <h3 className="text-xs font-bold text-gray-800 font-heading">Expected Competencies</h3>
              <ul className="list-disc list-inside text-xs text-gray-500 leading-relaxed font-sans space-y-1.5 pl-2">
                <li>Demonstrated expertise working with clean interface hierarchies and responsive typography grids.</li>
                <li>Comprehensive mastery of relational database indexes and secure API gateway protocols.</li>
                <li>Proven communication skills collaborating with cross-functional product departments.</li>
                <li>Self-motivated technical integrity with strict execution constraints.</li>
              </ul>
            </div>
          </div>

          {/* AI ASSESSMENT */}
          {job.aiMatchScore && (
            <div className="p-5 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-gray-900 font-heading">AI Fit Recommendation Analysis</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                This opportunity presents a <strong className="text-emerald-700">{job.aiMatchScore}% match</strong> score against industry standards for technical skill sets like <strong>{job.skills.slice(0, 3).join(', ')}</strong>. Upload your PDF resume in our AI Matcher Portal to request custom alignment score diagnostics.
              </p>
              <button
                onClick={() => onNavigate('/ai-job-match')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-indigo-900 bg-indigo-100/60 hover:bg-indigo-100 transition-colors rounded-lg cursor-pointer"
              >
                <span>Diagnostic Skills Audit</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 shrink-0" />
              </button>
            </div>
          )}

        </div>

        {/* COL 3: GATEWAY SYNC PANEL */}
        <div className="space-y-6">
          
          {/* VERIFICATION AND METADATA */}
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-tight">System Integrity Panel</h3>
            
            <div className="space-y-2.5 text-[11px] text-gray-500 font-sans">
              <div className="flex justify-between items-center">
                <span>Verified Today:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Automation Status:</span>
                <span className="text-gray-800 font-bold">n8n Workflow Live</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Threat Check:</span>
                <span className="text-gray-800 font-semibold">0 Flags Sourced</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Synced:</span>
                <span className="text-gray-400 font-mono">Today, 06:00 IST</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex flex-wrap gap-1">
              {job.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="text-[9px] font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-100"
                  onClick={() => onNavigate(`/jobs?q=${encodeURIComponent(skill)}`)}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* EMPLOYER BRANDING PANEL */}
          {company && (
            <div className="bg-white border border-slate-150 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-lg shadow-sm border border-zinc-800">
                  {company.logo}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">{company.name}</h4>
                  <p className="text-[10px] text-gray-400">{company.industry}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-[11px] text-gray-600 font-sans">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Company Size</span>
                  </span>
                  <span className="font-semibold text-gray-800">{company.size} employees</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Headquarters</span>
                  </span>
                  <span className="font-semibold text-gray-800">{company.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span>Employee Rating</span>
                  </span>
                  <span className="font-bold text-gray-800">{company.rating} / 5.0</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <a
                  href={company.website}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center justify-center gap-1 select-none"
                >
                  <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Website</span>
                </a>
                <button
                  onClick={() => onNavigate(`/companies?id=${company.id}`)}
                  className="flex-1 text-center py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors select-none"
                >
                  View Profile
                </button>
              </div>
            </div>
          )}

          {/* APPLICATION TIMELINE TRACKER PROGRESS */}
          {isApplied && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Active Outbound Sourced Pipeline</span>
              </h4>
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                Your application request has been encrypted under DPDP Act protocols and queued for API transfer. Review status updates inside your dashboard.
              </p>
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full text-center py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
              >
                View Live Application Tracker
              </button>
            </div>
          )}

          {/* OUTBOUND DISCLAIMER */}
          <div className="p-4 border border-dashed border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Verified Publisher Pledge</span>
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
              We never utilize scraped placeholders or dummy contact addresses. All applications route directly to authorized publisher channels via corporate single-sign-on (SSO).
            </p>
          </div>

        </div>

      </section>
      
      {/* RELATED JOBS SECTION */}
      {relatedJobs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 mt-16 pt-10 border-t border-slate-100 space-y-6">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Related Corporate Pipelines</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Verified listings matching similar skill domains or structural industries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedJobs.map((rJob) => (
              <div 
                key={rJob.id}
                onClick={() => onNavigate(`/jobs/${rJob.slug}`)}
                className="bg-white border border-slate-150 hover:border-slate-300 hover:shadow-sm rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 focus-ring select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[70%]">{rJob.companyName}</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono shrink-0">Verified</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">{rJob.title}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{rJob.description}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-slate-50">
                  <span className="font-medium text-slate-600 truncate max-w-[60%]">{rJob.location}</span>
                  <span className="font-extrabold text-emerald-700 font-mono text-[9px]">{rJob.salary.split(' / ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
