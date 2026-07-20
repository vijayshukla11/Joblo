import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Building, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { jobRepository } from '../../repositories/jobRepository';
import { Job, GovernmentJob, Company, Category, CareerGuide } from '../../types';
import SearchForm from '../../components/forms/SearchForm';
import JobCard from '../../components/cards/JobCard';
import GovJobCard from '../../components/cards/GovJobCard';
import CompanyCard from '../../components/cards/CompanyCard';
import GuideCard from '../../components/cards/GuideCard';

interface HomeProps {
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function Home({ onNavigate, onApplyDemo }: HomeProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [govJobs, setGovJobs] = useState<GovernmentJob[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [guides, setGuides] = useState<CareerGuide[]>([]);

  useEffect(() => {
    async function loadHomeContent() {
      const cats = await jobRepository.getCategories();
      setCategories(cats);

      const searches = await jobService.getPopularSearches();
      setPopularSearches(searches);

      const allJobs = await jobRepository.getJobs();
      const published = allJobs.filter(j => !j.status || j.status === 'Published');
      const sorted = [...published].sort((a, b) => {
        const aVal = (a.isFeatured ? 2 : 0) + (a.isHot ? 1 : 0);
        const bVal = (b.isFeatured ? 2 : 0) + (b.isHot ? 1 : 0);
        return bVal - aVal;
      });
      setFeaturedJobs(sorted.slice(0, 4));

      const gov = await jobRepository.getGovernmentJobs();
      setGovJobs(gov.slice(0, 2));

      const comps = await jobRepository.getCompanies();
      setCompanies(comps.slice(0, 3));

      const gds = await jobRepository.getGuides();
      setGuides(gds.slice(0, 3));
    }
    loadHomeContent();
  }, []);

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. HERO BANNER & SEARCH CENTRE */}
      <section className="bg-slate-50 border-b border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8 px-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* AMBIENT HIGHLIGHT */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-100 uppercase tracking-widest mx-auto select-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>India's AI Sourced Career Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-none">
              Discover verified corporate and <span className="text-emerald-700">government pipelines</span>.
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              Unified job listings sourced via secure corporate APIs, official Gazettes, and parsed using certified AI classifiers. Zero noise, 100% verified.
            </p>
          </div>

          {/* DYNAMIC FORM */}
          <SearchForm 
            onSearch={({ query, location, type }) => {
              // Redirect to main /jobs page with query parameters
              const params = new URLSearchParams();
              if (query) params.append('q', query);
              if (location) params.append('l', location);
              if (type && type !== 'All') params.append('t', type);
              onNavigate(`/jobs?${params.toString()}`);
            }}
            onTriggerAIMatch={() => onNavigate('/ai-job-match')}
          />

          {/* POPULAR SEARCHES */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto text-xs font-sans text-gray-400">
            <span className="font-semibold text-gray-500 shrink-0">Trending Channels:</span>
            {popularSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => {
                  const cleanS = search.replace(/ Exam 2026| Remote | Frontend | Eligibility/g, '').trim();
                  onNavigate(`/jobs?q=${encodeURIComponent(cleanS)}`);
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 hover:text-black rounded-lg transition-all text-[11px] font-semibold cursor-pointer"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CHANNELS / CATEGORY HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-950 font-heading">
                Explore Specialized Career Channels
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Curated catalogs mapped directly to public registries and tech hubs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              let route = '/jobs';
              if (cat.slug === 'government-jobs') route = '/government-jobs';
              else if (cat.slug === 'remote-jobs') route = '/jobs?t=Remote';
              else if (cat.slug === 'design-jobs') route = '/jobs?q=Design';

              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(route)}
                  className="group bg-white border border-slate-150 hover:border-slate-300 hover:shadow-sm rounded-xl p-5 cursor-pointer transition-all focus-ring select-none"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onNavigate(route); }}
                >
                  <div className="text-2xl mb-3.5 group-hover:scale-110 transition-transform w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 font-heading group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 text-[11px] font-medium pt-3 border-t border-slate-50 text-gray-400 group-hover:text-black">
                    <span>{cat.jobCount.toLocaleString()} openings</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VERIFIED CORRESPONDENTS (LATEST FEEDS) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COL 1 & 2: CORPORATE VACANCIES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-950 font-heading">
                Latest Verified Corporate Openings
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Refreshed directly via webhook channels. Mapped to PostgreSQL schemas.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/jobs')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>View Feed ({featuredJobs.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyDemo={onApplyDemo}
                onNavigateToJob={(slug) => onNavigate(`/jobs/${slug}`)}
              />
            ))}
          </div>
        </div>

        {/* COL 3: GOVERNMENT GAZETTES OVERVIEW */}
        <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold tracking-tight text-gray-950 font-heading">
                  National Gazette Hub
                </h2>
                <p className="text-[11px] text-gray-400 font-sans">
                  Sourced from administrative bulletins.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/government-jobs')}
                className="text-[11px] font-bold text-orange-700 hover:text-orange-800 transition-colors cursor-pointer"
              >
                Full Hub
              </button>
            </div>

            <div className="space-y-4">
              {govJobs.map((gov) => (
                <div 
                  key={gov.id}
                  onClick={() => onNavigate('/government-jobs')}
                  className="bg-white border border-slate-150 p-4 rounded-xl hover:border-slate-300 transition-all cursor-pointer space-y-2 select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded uppercase">
                      {gov.examBody} Exam
                    </span>
                    <span className="text-[9px] text-gray-400">{gov.postedDate}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 font-heading leading-tight line-clamp-1">
                    {gov.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 border-t border-slate-100 mt-1">
                    <span className="text-emerald-700 font-bold font-mono">Pay L7 basic</span>
                    <span className="text-rose-600 font-semibold">{gov.applicationDeadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border border-orange-100 bg-orange-50/50 rounded-xl space-y-1.5 mt-5">
            <p className="text-[10px] font-bold text-orange-900 leading-snug">
              Official Government Portal Integration
            </p>
            <p className="text-[9px] text-orange-700 leading-relaxed">
              We sync with SSC, UPSC and Banking boards daily. Our editorial staff verifies syllabi for correct preparation guidelines.
            </p>
          </div>
        </div>

      </section>

      {/* 4. COMPANY SECTOR HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-gray-950 font-heading">
              Featured Verified Employers
            </h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Explore custom rating cards and direct active application paths.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/companies')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>All Companies ({companies.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onNavigateToCompany={(id) => onNavigate(`/companies?id=${id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. CAREER MANUALS & QUESTION BANK PREVIEW */}
      <section className="bg-slate-50 py-12 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-gray-950 font-heading">
                Topic Clusters & Career Guides
              </h2>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Topical Authority indexes compiled by certified Indian recruiters and examiners.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/interview-preparation')}
                className="text-xs font-semibold text-gray-600 hover:text-black hover:bg-white border border-transparent hover:border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Interview Prep Bank
              </button>
              <button
                onClick={() => onNavigate('/career-guides')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Full Guides Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onNavigateToGuide={(id) => onNavigate('/career-guides')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI RESUME ADVISORY ACCELERATION PREVIEW banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden bg-zinc-950 text-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-zinc-800">
          {/* BACKGROUND BLURS */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl" />

          <div className="space-y-3 max-w-xl relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-sans">
              AI Match Optimization Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
              Analyze your CV against real pipeline constraints
            </h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Upload your CV directly. Our AI scanner tests compliance scores across 18 PostgreSQL skill fields in 2 seconds. Strictly local and secure under DPDP regulations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
            <button
              onClick={() => onNavigate('/resume-builder')}
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-700 transition-colors cursor-pointer text-center"
            >
              Resume PDF Analyzer
            </button>
            <button
              onClick={() => onNavigate('/ai-job-match')}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-black rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Resume Matcher</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
