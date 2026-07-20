import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import { Search, BookOpen, Landmark, Building, FileText, ChevronRight, Filter, AlertTriangle } from 'lucide-react';
import { adminService, AdminBlog, CareerResource, AdminCategory } from '../../services/adminService';
import { GovernmentJob, Company } from '../../types';
import { jobRepository } from '../../repositories/jobRepository';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { LoadingState } from '../../components/common/StatusMessages';

interface GlobalSearchPageProps {
  onNavigate: (path: string) => void;
}

type SearchType = 'All' | 'Blogs' | 'Resources' | 'GovJobs' | 'Companies';

export default function GlobalSearchPage({ onNavigate }: GlobalSearchPageProps) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('All');
  const [sortBy, setSortBy] = useState<'Relevance' | 'Alphabetical'>('Relevance');

  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [govJobs, setGovJobs] = useState<GovernmentJob[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const blgs = await adminService.getBlogs();
        setBlogs(blgs.filter(b => b.status === 'Published'));

        const res = await adminService.getCareerResources();
        setResources(res);

        const gov = await jobRepository.getGovernmentJobs();
        setGovJobs(gov);

        const comps = await jobRepository.getCompanies();
        setCompanies(comps);
        
        // Load initial query from URL search parameters if available
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || params.get('query');
        if (q) {
          setQuery(q);
        }
      } catch (e) {
        console.error('Error loading search indices:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Filter Logic
  const cleanQ = query.toLowerCase().trim();

  const filteredBlogs = blogs.filter(b => 
    cleanQ === '' ||
    b.title.toLowerCase().includes(cleanQ) ||
    b.excerpt.toLowerCase().includes(cleanQ) ||
    b.categories?.some(c => c.toLowerCase().includes(cleanQ)) ||
    b.tags?.some(t => t.toLowerCase().includes(cleanQ))
  );

  const filteredResources = resources.filter(r => 
    cleanQ === '' ||
    r.title.toLowerCase().includes(cleanQ) ||
    r.excerpt.toLowerCase().includes(cleanQ) ||
    r.category.toLowerCase().includes(cleanQ) ||
    (r.topicOrRole && r.topicOrRole.toLowerCase().includes(cleanQ))
  );

  const filteredGovJobs = govJobs.filter(g => 
    cleanQ === '' ||
    g.title.toLowerCase().includes(cleanQ) ||
    g.department.toLowerCase().includes(cleanQ) ||
    g.examBody.toLowerCase().includes(cleanQ) ||
    g.skillsRequired?.some(s => s.toLowerCase().includes(cleanQ))
  );

  const filteredCompanies = companies.filter(c => 
    cleanQ === '' ||
    c.name.toLowerCase().includes(cleanQ) ||
    c.industry.toLowerCase().includes(cleanQ) ||
    c.location.toLowerCase().includes(cleanQ)
  );

  // Sorting
  const sortFunc = (a: any, b: any) => {
    const titleA = a.title || a.name || '';
    const titleB = b.title || b.name || '';
    if (sortBy === 'Alphabetical') {
      return titleA.localeCompare(titleB);
    }
    return 0; // relevance preserves original order
  };

  const sortedBlogs = [...filteredBlogs].sort(sortFunc);
  const sortedResources = [...filteredResources].sort(sortFunc);
  const sortedGovJobs = [...filteredGovJobs].sort(sortFunc);
  const sortedCompanies = [...filteredCompanies].sort(sortFunc);

  const totalResults = 
    sortedBlogs.length + 
    sortedResources.length + 
    sortedGovJobs.length + 
    sortedCompanies.length;

  return (
    <MainLayout currentPath="/search" onNavigate={onNavigate}>
      <div className="pb-16 font-sans">
        <SEO 
          title="Universal Platform Search | JOB Lo"
          description="Query and sort across hundreds of verified tech jobs, government gazettes, corporate partners, and professional career resource publications."
        />

        <Breadcrumbs items={[{ label: 'Search', path: '/search' }]} onNavigate={onNavigate} />

        {/* Header Hero */}
        <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
          <div className="max-w-4xl mx-auto space-y-4 px-4 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              Universal Platform Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sift through blogs, legal gazettes, interview roadmaps, and verified company indexes in a single view.
            </p>

            {/* Main search inputs */}
            <div className="relative max-w-2xl mx-auto flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type keywords (e.g., Vercel, Resume, SSC, TypeScript)..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-250 focus:outline-none focus:border-emerald-600 rounded-xl text-xs sm:text-sm shadow-sm font-sans font-medium text-slate-900"
              />
            </div>
          </div>
        </section>

        {/* Content Container */}
        <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left filters */}
          <div className="md:col-span-1 space-y-5">
            
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-4 h-4 text-slate-400" />
                <span>Search Filter</span>
              </h3>

              <div className="flex flex-col gap-1.5 pt-1.5">
                {[
                  { id: 'All' as SearchType, label: 'All Indices', count: totalResults },
                  { id: 'Blogs' as SearchType, label: 'Blogs & News', count: sortedBlogs.length },
                  { id: 'Resources' as SearchType, label: 'Career Resources', count: sortedResources.length },
                  { id: 'GovJobs' as SearchType, label: 'Gov. Gazettes', count: sortedGovJobs.length },
                  { id: 'Companies' as SearchType, label: 'Companies', count: sortedCompanies.length },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      activeTab === item.id 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting panel */}
            <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Sorting Spec</h3>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg outline-none cursor-pointer"
              >
                <option value="Relevance">Match Relevance</option>
                <option value="Alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>

          </div>

          {/* Right main results */}
          <div className="md:col-span-3 space-y-6">
            
            {loading ? (
              <LoadingState message="Restructuring universal search parameters..." />
            ) : totalResults === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900">Zero Query Matches</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  No indexed records corresponded to your query keyword. Try typing broad parameters such as "UPSC", "Next.js", or "Resume".
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. BLOGS RESULTS SECTION */}
                {(activeTab === 'All' || activeTab === 'Blogs') && sortedBlogs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Blogs & Editorial News ({sortedBlogs.length})</span>
                    </h3>
                    <div className="grid gap-3">
                      {sortedBlogs.map(blog => (
                        <div 
                          key={blog.id}
                          onClick={() => onNavigate(`/blog/${blog.slug}`)}
                          className="bg-white p-4 border border-slate-150 hover:border-emerald-300 transition-all rounded-xl cursor-pointer group flex items-start gap-4"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                            <img src={blog.featuredImage} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                              {blog.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{blog.excerpt}</p>
                            <span className="inline-block text-[9px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold">
                              AUTHOR: {blog.author || 'Admin'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. CAREER RESOURCE RESULTS SECTION */}
                {(activeTab === 'All' || activeTab === 'Resources') && sortedResources.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Career Resources & Prep Guides ({sortedResources.length})</span>
                    </h3>
                    <div className="grid gap-3">
                      {sortedResources.map(res => (
                        <div 
                          key={res.id}
                          onClick={() => onNavigate('/career-guides')}
                          className="bg-white p-4 border border-slate-150 hover:border-indigo-300 transition-all rounded-xl cursor-pointer group flex items-start gap-3"
                        >
                          <div className="space-y-1 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-indigo-700 uppercase">{res.category}</span>
                              <span className="text-[9px] font-mono bg-slate-100 text-slate-400 px-1 rounded uppercase font-bold">{res.difficulty || 'Easy'}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">
                              {res.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{res.excerpt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. GOVERNMENT JOB RESULTS SECTION */}
                {(activeTab === 'All' || activeTab === 'GovJobs') && sortedGovJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-amber-600" />
                      <span>Government Gazettes & Syllabi ({sortedGovJobs.length})</span>
                    </h3>
                    <div className="grid gap-3">
                      {sortedGovJobs.map(job => (
                        <div 
                          key={job.id}
                          onClick={() => onNavigate(`/government-jobs/${job.slug || job.id}`)}
                          className="bg-white p-4 border border-slate-150 hover:border-amber-300 transition-all rounded-xl cursor-pointer group flex items-start gap-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                            {job.logo || '🏛️'}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-normal">{job.department} • {job.location}</p>
                            <span className="inline-block text-[9px] font-bold bg-amber-50 text-amber-800 px-1 py-0.5 rounded uppercase tracking-wider">
                              {job.examBody} Exam
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. COMPANIES RESULTS SECTION */}
                {(activeTab === 'All' || activeTab === 'Companies') && sortedCompanies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Verified Corporations ({sortedCompanies.length})</span>
                    </h3>
                    <div className="grid gap-3">
                      {sortedCompanies.map(comp => (
                        <div 
                          key={comp.id}
                          onClick={() => onNavigate(`/companies?id=${comp.id}`)}
                          className="bg-white p-4 border border-slate-150 hover:border-blue-300 transition-all rounded-xl cursor-pointer group flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold font-mono shrink-0">
                            {comp.logo}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                              {comp.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-normal">{comp.industry} • {comp.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </section>
      </div>
    </MainLayout>
  );
}
