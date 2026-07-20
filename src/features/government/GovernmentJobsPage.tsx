import React, { useState, useEffect } from 'react';
import { 
  Building, Calendar, Award, BookOpen, AlertTriangle, Search, 
  MapPin, CheckCircle2, FileText, ArrowUpRight, HelpCircle, UserCheck
} from 'lucide-react';
import { jobRepository } from '../../repositories/jobRepository';
import { GovernmentJob } from '../../types';
import GovJobCard from '../../components/cards/GovJobCard';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface GovernmentJobsPageProps {
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function GovernmentJobsPage({ onNavigate, onApplyDemo }: GovernmentJobsPageProps) {
  const [loading, setLoading] = useState(false);
  const [govJobs, setGovJobs] = useState<GovernmentJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBody, setSelectedBody] = useState<string>('All');

  useEffect(() => {
    async function fetchGovJobs() {
      setLoading(true);
      const allGov = await jobRepository.getGovernmentJobs();
      setGovJobs(allGov);
      setLoading(false);
    }
    fetchGovJobs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      let filtered = await jobRepository.getGovernmentJobs();
      const cleanQ = searchQuery.toLowerCase().trim();

      filtered = filtered.filter(job => {
        const matchesQuery =
          cleanQ === '' ||
          job.title.toLowerCase().includes(cleanQ) ||
          job.department.toLowerCase().includes(cleanQ) ||
          job.skillsRequired.some(s => s.toLowerCase().includes(cleanQ));

        const matchesBody =
          selectedBody === 'All' ||
          job.examBody === selectedBody;

        return matchesQuery && matchesBody;
      });

      setGovJobs(filtered);
      setLoading(false);
    }, 300);
  };

  const handleQuickBodyFilter = (body: string) => {
    setSelectedBody(body);
    setLoading(true);
    setTimeout(async () => {
      let filtered = await jobRepository.getGovernmentJobs();
      if (body !== 'All') {
        filtered = filtered.filter(job => job.examBody === body);
      }
      if (searchQuery) {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setGovJobs(filtered);
      setLoading(false);
    }, 200);
  };

  const bodies = ['All', 'UPSC', 'SSC', 'Bank PO', 'Railways'];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Government Jobs Careers Hub" 
        description="Official verified recruitment notifications for IAS, UPSC, SSC, and Public Sector Banking. Access eligibility, syllabi, exam timelines, and pay bands." 
        h1Text="JOB Lo National Government Jobs Directory"
      />

      <Breadcrumbs items={[{ label: 'Government Hub', path: '/government-jobs' }]} onNavigate={onNavigate} />

      {/* ADMIN TITLE BLOCK */}
      <section className="bg-orange-50/40 border-b border-orange-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[10px] font-bold text-orange-800 border border-orange-200 uppercase tracking-widest select-none">
              <span>Verified Gazette Sourced Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              National Government Career Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Access consolidated recruitment timetables, official eligibility criteria checklists, and verified pay level structures under the 7th Central Pay Commission (CPC).
            </p>
          </div>

          <div className="p-4 bg-white border border-orange-200/60 rounded-xl space-y-1.5 max-w-xs text-xs">
            <span className="font-bold text-orange-950 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>Gazetted Disclaimer</span>
            </span>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              All data has been sourced from official Indian government bulletins. Check important application dates and download correct syllabus PDFs directly.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN SEARCH & FILTER CONTENT */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR TIMELINE AND EXAM DETAILS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* SEARCH INTERFACE */}
          <form onSubmit={handleSearch} className="space-y-2.5">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Search Gazettes</h2>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Department, post name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 focus-ring rounded-lg font-sans text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-900 text-white rounded-lg text-xs font-bold hover:bg-orange-950 transition-colors cursor-pointer select-none"
            >
              Search Hub
            </button>
          </form>

          {/* EXAM BODIES SELECTOR */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Filter by Commission</h3>
            <div className="flex flex-col gap-1.5">
              {bodies.map((body) => (
                <button
                  key={body}
                  onClick={() => handleQuickBodyFilter(body)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    selectedBody === body 
                      ? 'bg-orange-50 text-orange-950 font-extrabold border border-orange-100' 
                      : 'hover:bg-slate-50 text-gray-500'
                  }`}
                >
                  <span>{body === 'All' ? 'All Commissions' : body}</span>
                  {selectedBody === body && <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* ELIGIBILITY & PAY SCALE NOTES */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-3.5 text-[11px] text-gray-500">
            <h4 className="font-extrabold text-slate-900 uppercase text-xs">Standard Eligibility Notes</h4>
            
            <div className="space-y-2">
              <p className="leading-relaxed">
                <strong>Nationality: </strong>Must be a citizen of India or subject of Nepal/Bhutan.
              </p>
              <p className="leading-relaxed">
                <strong>Age Limit: </strong>Varies between 18 to 32 years (Relaxations applicable as per statutory norms).
              </p>
              <p className="leading-relaxed">
                <strong>Pay Scales: </strong>
                Pay Level 7 represents basic pay values starting at ₹44,900 plus Allowances (DA, HRA, TA).
              </p>
            </div>
          </div>

        </div>

        {/* FEED SELECTION LIST */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing <strong className="text-slate-800 font-bold">{govJobs.length}</strong> active gazetted notifications</span>
            {(searchQuery || selectedBody !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBody('All');
                  handleQuickBodyFilter('All');
                }}
                className="text-[10px] text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <LoadingState message="Scanning certified public gazettes..." />
          ) : govJobs.length === 0 ? (
            <EmptyState
              title="No Gazetted Notices Matching Search"
              description="Our scrapers couldn't locate active government notifications matching this criteria. Ensure commission bodies are chosen correctly."
              actionText="Reset Search Filter"
              onAction={() => {
                setSearchQuery('');
                setSelectedBody('All');
                handleQuickBodyFilter('All');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {govJobs.map((job) => (
                <GovJobCard
                  key={job.id}
                  job={job}
                  onApplyDemo={onApplyDemo}
                  onNavigateToJob={(slug) => {
                    onNavigate(`/jobs/${slug}`);
                  }}
                />
              ))}
            </div>
          )}

          {/* EXAM CALENDAR TIMELINE INFO */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 font-heading">National Commission Calendar 2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-gray-500 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-gray-400">
                    <th className="pb-2 font-bold uppercase tracking-wider">Commission</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Exam Name</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Syllabus Status</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Official Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-bold text-gray-800">UPSC</td>
                    <td className="py-3">Civil Services (CSE) 2026</td>
                    <td className="py-3 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified</span>
                    </td>
                    <td className="py-3 text-orange-700 hover:underline cursor-pointer">upsc.gov.in</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-gray-800">SSC</td>
                    <td className="py-3">Combined Graduate Level (ASO)</td>
                    <td className="py-3 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified</span>
                    </td>
                    <td className="py-3 text-orange-700 hover:underline cursor-pointer">ssc.gov.in</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-gray-800">State Bank</td>
                    <td className="py-3">Probationary Officers Scheme (PO)</td>
                    <td className="py-3 text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified</span>
                    </td>
                    <td className="py-3 text-orange-700 hover:underline cursor-pointer">sbi.co.in/careers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
