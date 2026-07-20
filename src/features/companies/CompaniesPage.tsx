import React, { useState, useEffect } from 'react';
import { Building, MapPin, Search, Star, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { jobRepository } from '../../repositories/jobRepository';
import { Company, Job } from '../../types';
import CompanyCard from '../../components/cards/CompanyCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface CompaniesPageProps {
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function CompaniesPage({ onNavigate, onApplyDemo }: CompaniesPageProps) {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCompanyJobs, setSelectedCompanyJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true);
      const comps = await jobRepository.getCompanies();
      setCompanies(comps);
      
      // Parse query ID if clicked from homepage
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        const found = comps.find(c => c.id === id);
        if (found) {
          handleSelectCompany(found);
        }
      }
      setLoading(false);
    }
    loadCompanies();
  }, [window.location.search]);

  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company);
    const jobs = await jobRepository.getJobs();
    const matches = jobs.filter(j => j.companyId === company.id && (!j.status || j.status === 'Published'));
    setSelectedCompanyJobs(matches);
    
    // Smooth scroll to top of details area if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      let filtered = await jobRepository.getCompanies();
      const cleanQ = searchQuery.toLowerCase().trim();

      filtered = filtered.filter(comp => {
        const matchesQuery = 
          cleanQ === '' ||
          comp.name.toLowerCase().includes(cleanQ) ||
          comp.industry.toLowerCase().includes(cleanQ);

        const matchesIndustry =
          selectedIndustry === 'All' ||
          comp.industry.includes(selectedIndustry);

        return matchesQuery && matchesIndustry;
      });

      setCompanies(filtered);
      setLoading(false);
    }, 300);
  };

  const industries = ['All', 'Software', 'Cloud Infrastructure', 'Financial', 'Public Sector'];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Top Employer Directory" 
        description="Browse certified companies hiring in India. Explore employee sizes, ratings, verified active openings, and SaaS pipelines." 
        h1Text="JOB Lo Premium Employer Directory"
      />

      <Breadcrumbs items={[{ label: 'Companies Directory', path: '/companies' }]} onNavigate={onNavigate} />

      {/* HEADER SECTION */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Premium Verification Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Verified Partner Directory
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Sourced company records including official trust ratings, employment bounds, and active real-time job pipelines.
          </p>
        </div>
      </section>

      {/* DUAL CONTAINER GRID */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: LISTING DIRECTORY */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEARCH FORMS */}
          <form onSubmit={handleSearch} className="bg-white p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 flex items-center w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium employers by name or segment..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-transparent focus-ring rounded-lg font-sans font-medium text-gray-800"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setLoading(true);
                  setTimeout(async () => {
                    let filtered = await jobRepository.getCompanies();
                    if (e.target.value !== 'All') {
                      filtered = filtered.filter(comp => comp.industry.includes(e.target.value));
                    }
                    setCompanies(filtered);
                    setLoading(false);
                  }, 200);
                }}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold cursor-pointer outline-none"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind === 'All' ? 'All Segments' : ind}</option>
                ))}
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg cursor-pointer flex-1 sm:flex-none"
              >
                Filter
              </button>
            </div>
          </form>

          {loading ? (
            <LoadingState message="Extracting premium employer listings..." />
          ) : companies.length === 0 ? (
            <EmptyState
              title="No Employers Found"
              description="No partner companies match your segment criteria. Reset parameters to explore all verified listings."
              actionText="Reset Directory Filter"
              onAction={() => {
                setSearchQuery('');
                setSelectedIndustry('All');
                handleSearch(new Event('submit') as any);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              {companies.map((comp) => (
                <div key={comp.id} onClick={() => handleSelectCompany(comp)}>
                  <CompanyCard
                    company={comp}
                    onNavigateToCompany={() => handleSelectCompany(comp)}
                  />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACTIVE SELECTED PROFILE DETAILED VIEW PANEL */}
        <div className="lg:col-span-1">
          
          {selectedCompany ? (
            <div className="border border-slate-250 bg-white p-6 rounded-2xl space-y-6 sticky top-4 animate-fadeIn">
              
              {/* UPPER BRAND */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center text-xl shrink-0">
                    {selectedCompany.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">{selectedCompany.name}</h3>
                    <span className="text-[10px] text-gray-400 font-sans block">{selectedCompany.industry}</span>
                  </div>
                </div>

                <a 
                  href={selectedCompany.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 border border-slate-200 rounded-lg text-gray-400 hover:text-black hover:bg-slate-50 transition-all cursor-pointer"
                  title="Visit official portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* DETAILED STATS */}
              <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3.5 text-[11px] text-gray-500 font-sans">
                <div className="space-y-0.5">
                  <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider">Hiring Rating</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{selectedCompany.rating} / 5.0</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-gray-400 block font-bold text-[9px] uppercase tracking-wider">Workforce Size</span>
                  <span className="font-bold text-slate-800">{selectedCompany.size}</span>
                </div>
              </div>

              {/* ACTIVE PIPELINE LISTINGS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Active Openings Sourced ({selectedCompanyJobs.length})
                </h4>
                
                {selectedCompanyJobs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No corporate job listings currently active in this pipeline.</p>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {selectedCompanyJobs.map((job) => (
                      <div 
                        key={job.id}
                        onClick={() => onNavigate(`/jobs/${job.slug}`)}
                        className="p-3 border border-slate-150 hover:border-slate-350 bg-slate-50/50 rounded-xl cursor-pointer hover:bg-white transition-all space-y-1 select-none"
                      >
                        <h5 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700">{job.title}</h5>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans">
                          <span>{job.location}</span>
                          <span className="text-emerald-700 font-semibold">{job.salary.split(' - ')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AUTOMATION SEAL */}
              <div className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Certified Employer Portal</span>
                </div>
                <p className="text-[9px] text-emerald-600 leading-relaxed font-sans">
                  Applications submitted to {selectedCompany.name} route directly into their core candidate queues via active webhook endpoints.
                </p>
              </div>

            </div>
          ) : (
            <div className="border border-dashed border-slate-200 bg-slate-50/50 p-10 rounded-2xl text-center flex flex-col justify-center items-center h-[350px]">
              <Building className="w-10 h-10 text-gray-300 mb-2" />
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Selection Required</h3>
              <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-relaxed">
                Select any verified company card from the directory list on the left to inspect detailed ratings, website pointers, and active job listings.
              </p>
            </div>
          )}

        </div>

      </section>

    </div>
  );
}
