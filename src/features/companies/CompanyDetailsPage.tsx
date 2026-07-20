import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, ShieldCheck, MapPin, Globe, Users, Star, ExternalLink, Calendar, Briefcase, IndianRupee } from 'lucide-react';
import { jobRepository } from '../../repositories/jobRepository';
import { Company, Job } from '../../types';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface CompanyDetailsPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export default function CompanyDetailsPage({ onNavigate, id }: CompanyDetailsPageProps) {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [openJobs, setOpenJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function loadCompanyDetails() {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const comps = await jobRepository.getCompanies();
      
      // Match by exact ID or slugified name
      const found = comps.find(
        c => c.id === id || 
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id.toLowerCase()
      );
      
      setCompany(found || null);

      if (found) {
        const jobs = await jobRepository.getJobs();
        // Only show Published jobs
        const companyJobs = jobs.filter(
          j => j.companyId === found.id && (!j.status || j.status === 'Published')
        );
        setOpenJobs(companyJobs);
      }
      setLoading(false);
    }
    loadCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState message="Extracting premium employer metadata and active pipelines..." />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="py-12">
        <EmptyState 
          title="Employer Profile Not Found" 
          description="The requested company record or pipeline ID does not exist in our corporate index."
          actionText="Explore Verified Directory"
          onAction={() => onNavigate('/companies')}
        />
      </div>
    );
  }

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={`${company.name} Careers & Openings`}
        description={`Explore verified job openings at ${company.name} (${company.location}). Rating: ${company.rating}/5. Employee size: ${company.size}. Sourced under corporate API compliance.`}
      />

      <Breadcrumbs 
        items={[
          { label: 'Companies', path: '/companies' },
          { label: company.name }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* Hero Header */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-zinc-950 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm border border-zinc-800 select-none">
              {company.logo}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{company.industry}</span>
                <span className="text-gray-300 font-mono text-[9px]">•</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                  <span>Verified Partner</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.size} Employees</span>
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              href={company.website}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-white hover:bg-slate-50 text-gray-800 border border-slate-200 rounded-xl transition-all cursor-pointer select-none"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Columns: Company Details & Jobs */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Company Brief Description */}
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Corporate Overview
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              {company.name} is a premier organization in the <strong>{company.industry}</strong> sector, employing over <strong>{company.size}</strong> industry professionals. Headquartered in <strong>{company.location}</strong>, the enterprise maintains an exceptional workplace satisfaction rating of <strong>{company.rating} / 5.0</strong>. Through certified automated pipelines, all live vacancies are synchronized with JOB Lo indices daily.
            </p>
          </div>

          {/* Active Job Openings List */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Active Job Openings ({openJobs.length})
            </h2>

            {openJobs.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center">
                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400 italic">No corporate job listings currently active in this pipeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {openJobs.map((job) => (
                  <div 
                    key={job.id}
                    onClick={() => onNavigate(`/jobs/${job.slug}`)}
                    className="group bg-white border border-slate-150 hover:border-slate-300 rounded-xl p-5 cursor-pointer transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 focus-ring select-none"
                  >
                    <div className="space-y-1.5 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{job.employmentType}</span>
                        <span className="text-gray-200 font-mono text-[9px]">•</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">Verified</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3.5 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-350" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-350" />
                          <span>{job.experience}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right shrink-0">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Salary Range</span>
                        <span className="text-xs font-black text-emerald-800 font-mono flex items-center gap-0.5">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-450" />
                          <span>{job.salary.split(' / ')[0]}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Metadata Panel */}
        <div className="space-y-6">
          
          {/* Trust Panel */}
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              Employer Trust index
            </h3>
            
            <div className="space-y-3 text-[11px] text-gray-500 font-sans">
              <div className="flex justify-between items-center">
                <span>Employee Satisfaction:</span>
                <span className="font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{company.rating} / 5.0</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Verification Rating:</span>
                <span className="text-emerald-700 font-bold">Grade A+ Certified</span>
              </div>
              <div className="flex justify-between items-center">
                <span>API Channel Sync:</span>
                <span className="text-gray-800 font-semibold">Active n8n Hook</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Records Inspected:</span>
                <span className="text-gray-400 font-mono">DPDP Act Compliant</span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-4 border border-dashed border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Route Sourcing</span>
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
              All listed openings are verified with {company.name}'s human resources registry. We never host speculative roles or third-party scraper archives.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
