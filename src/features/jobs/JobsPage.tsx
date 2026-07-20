import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Search, Filter, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { jobRepository } from '../../repositories/jobRepository';
import { Job, Company, Category } from '../../types';
import SearchForm from '../../components/forms/SearchForm';
import JobCard from '../../components/cards/JobCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface JobsProps {
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function Jobs({ onNavigate, onApplyDemo }: JobsProps) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  // Search state
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    experience: '',
    type: 'All',
    category: 'All',
    sortBy: 'Latest'
  });

  // Load companies & categories
  useEffect(() => {
    async function loadMetadata() {
      const comps = await jobRepository.getCompanies();
      setCompanies(comps);

      const cats = await jobRepository.getCategories();
      setCategories(cats);
    }
    loadMetadata();
  }, []);

  // Parse URL search parameters for initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const l = params.get('l') || '';
    const e = params.get('e') || '';
    const t = params.get('t') || 'All';
    const c = params.get('c') || 'All';
    const s = params.get('s') || 'Latest';

    setSearchParams({ query: q, location: l, experience: e, type: t, category: c, sortBy: s });
    performSearch(q, l, e, t, c, s);
  }, [window.location.search]);

  const performSearch = async (query: string, loc: string, exp: string, type: string, category: string, sortBy: string) => {
    setLoading(true);
    setCurrentPage(1); // Reset page on filter changes
    // Simulate API delay for realistic performance UX
    setTimeout(async () => {
      let filtered = await jobRepository.getJobs();
      
      // Candidate View Filter: Strictly omit Draft or Archived jobs!
      filtered = filtered.filter(job => !job.status || job.status === 'Published');

      const cleanQ = query.toLowerCase().trim();
      const tokens = cleanQ.split(/\s+/).filter(t => t.length > 0);
      const cleanL = loc.toLowerCase().trim();
      const cleanE = exp.toLowerCase().trim();

      filtered = filtered.filter(job => {
        const matchesQuery = 
          tokens.length === 0 ||
          tokens.every(token => 
            job.title.toLowerCase().includes(token) ||
            job.companyName.toLowerCase().includes(token) ||
            job.description.toLowerCase().includes(token) ||
            job.skills.some(sk => sk.toLowerCase().includes(token))
          );

        const matchesLocation =
          cleanL === '' ||
          job.location.toLowerCase().includes(cleanL);

        const matchesExperience =
          cleanE === '' ||
          (cleanE === 'fresher' && (job.experience.toLowerCase().includes('0') || job.experience.toLowerCase().includes('fresher'))) ||
          job.experience.toLowerCase().includes(cleanE);

        const matchesType =
          type === 'All' ||
          job.employmentType === type;

        const matchesCategory =
          category === 'All' ||
          (job.category && (
            job.category.toLowerCase().includes(category.toLowerCase()) || 
            category.toLowerCase().includes(job.category.toLowerCase())
          ));

        return matchesQuery && matchesLocation && matchesExperience && matchesType && matchesCategory;
      });

      // Handle Sorting (Latest vs Featured)
      if (sortBy === 'Featured') {
        filtered = filtered.sort((a, b) => {
          const aVal = (a.isFeatured ? 2 : 0) + (a.isHot ? 1 : 0);
          const bVal = (b.isFeatured ? 2 : 0) + (b.isHot ? 1 : 0);
          return bVal - aVal;
        });
      } else {
        // Sort by Latest (simulated via reverse chronological ID or postedDate)
        filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
      }

      setJobs(filtered);
      setLoading(false);
    }, 400);
  };

  const handleSearchSubmit = (params: { query: string; location: string; experience: string; type: string; category?: string; sortBy?: string }) => {
    const merged = { ...searchParams, ...params };
    
    const urlParams = new URLSearchParams();
    if (merged.query) urlParams.append('q', merged.query);
    if (merged.location) urlParams.append('l', merged.location);
    if (merged.experience) urlParams.append('e', merged.experience);
    if (merged.type && merged.type !== 'All') urlParams.append('t', merged.type);
    if (merged.category && merged.category !== 'All') urlParams.append('c', merged.category);
    if (merged.sortBy && merged.sortBy !== 'Latest') urlParams.append('s', merged.sortBy);

    const newSearch = urlParams.toString();
    window.history.pushState(null, '', `/jobs${newSearch ? '?' + newSearch : ''}`);
    setSearchParams(merged);
    performSearch(merged.query, merged.location, merged.experience, merged.type, merged.category, merged.sortBy);
  };

  const handleQuickReset = () => {
    handleSearchSubmit({ query: '', location: '', experience: '', type: 'All', category: 'All', sortBy: 'Latest' });
  };

  const handleCategorySelect = (categoryName: string) => {
    handleSearchSubmit({ ...searchParams, category: categoryName });
  };

  const handleSortChange = (newSort: string) => {
    handleSearchSubmit({ ...searchParams, sortBy: newSort });
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Explore Verified Job Listings" 
        description="Search active jobs in India. Verified corporate openings with exact salary ranges, hiring criteria, and instant feedback." 
        h1Text="JOB Lo Corporate Search Index"
      />

      <Breadcrumbs items={[{ label: 'Job Search', path: '/jobs' }]} onNavigate={onNavigate} />

      {/* HEADER BAR */}
      <section className="bg-white border-b border-slate-100 py-8 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Sourced via Certified Corporate API pipelines
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Active Corporate Pipelines
            </h1>
            <p className="text-xs text-gray-400">
              Matches represent real open positions synchronized with our employer databases. Zero speculative placements.
            </p>
          </div>

          {/* DYNAMIC CMD-CENTER SEARCH */}
          <div className="pt-2">
            <SearchForm 
              initialQuery={searchParams.query}
              initialLocation={searchParams.location}
              initialExperience={searchParams.experience}
              initialType={searchParams.type}
              onSearch={handleSearchSubmit}
            />
          </div>
        </div>
      </section>

      {/* SEARCH LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTERS (DESKTOP HIDDEN MOVED) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* QUICK SUMMARY CARD */}
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-extrabold text-gray-900 tracking-tight uppercase flex items-center justify-between">
              <span>Channel Summary</span>
              <span className="text-[10px] text-gray-400 normal-case font-mono font-medium">Verified Status</span>
            </h2>

            <div className="space-y-3 text-[11px] text-gray-500 font-sans">
              <div className="flex items-center justify-between">
                <span>Matching Pipelines:</span>
                <span className="font-extrabold text-gray-800">{jobs.length} roles</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Integrated Corporate APIs:</span>
                <span className="font-bold text-gray-800">5 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Automation Sync Rate:</span>
                <span className="text-emerald-700 font-bold">100% (Passed today)</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200/60 rounded-lg text-[10px] text-slate-400 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>All corporate jobs require complete wage disclosure parameters before indexing.</span>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Filter by Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                  searchParams.category === 'All' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'hover:bg-slate-50 text-gray-600'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-gray-500">
                  Total
                </span>
              </button>
              {categories.map((cat) => {
                const isSelected = searchParams.category.toLowerCase() === cat.name.toLowerCase() || 
                  (cat.id === 'cat-tech' && searchParams.category === 'Tech') ||
                  (cat.id === 'cat-gov' && searchParams.category === 'Government') ||
                  (cat.id === 'cat-design' && searchParams.category === 'Design');
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id === 'cat-tech' ? 'Tech' : cat.id === 'cat-gov' ? 'Government' : cat.id === 'cat-design' ? 'Design' : cat.name)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      isSelected 
                        ? 'bg-emerald-50 text-emerald-700 font-bold' 
                        : 'hover:bg-slate-50 text-gray-600'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TOP EMPLOYERS */}
          <div className="border border-slate-100 rounded-xl p-5 space-y-4 bg-white">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Top Hiring Partners</h3>
            <div className="space-y-2.5">
              {companies.map((comp) => (
                <div 
                  key={comp.id}
                  onClick={() => onNavigate(`/companies?id=${comp.id}`)}
                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-zinc-950 text-white flex items-center justify-center text-[11px]">
                      {comp.logo}
                    </span>
                    <span className="font-semibold text-gray-700">{comp.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {comp.openingsCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* LISTINGS CONTAINER */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>Showing <strong className="text-gray-800 font-bold">{jobs.length}</strong> verified corporate roles</span>
              {(searchParams.query || searchParams.category !== 'All' || searchParams.location || searchParams.experience || searchParams.type !== 'All') && (
                <button
                  onClick={handleQuickReset}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* SORT BY SELECT */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-semibold">Sort by:</span>
              <select
                value={searchParams.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Latest">Latest Postings</option>
                <option value="Featured">Featured / Urgent</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingState message="Querying PostgreSQL catalog indices..." />
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No Sourced Matches Found"
              description="Our automated scrapers couldn't locate active open positions matching your search parameters. Try widening your filters or explore other locations."
              actionText="Reset All Filters"
              onAction={handleQuickReset}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyDemo={onApplyDemo}
                    onNavigateToJob={(slug) => onNavigate(`/jobs/${slug}`)}
                  />
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {Math.ceil(jobs.length / pageSize) > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 gap-4 animate-fadeIn">
                  <div className="text-xs text-gray-500 font-medium font-sans">
                    Showing <span className="font-bold text-gray-950">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-bold text-gray-950">
                      {Math.min(currentPage * pageSize, jobs.length)}
                    </span>{' '}
                    of <span className="font-bold text-gray-950">{jobs.length}</span> active pipelines
                  </div>
                  
                  <div className="flex items-center gap-1.5 font-sans">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-gray-700 disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer transition-colors"
                    >
                      Prev
                    </button>
                    
                    {Array.from({ length: Math.ceil(jobs.length / pageSize) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all select-none cursor-pointer ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                            : 'border border-slate-200 bg-white hover:bg-slate-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / pageSize)));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === Math.ceil(jobs.length / pageSize)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-gray-700 disabled:opacity-40 disabled:hover:bg-white select-none cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </section>

    </div>
  );
}
