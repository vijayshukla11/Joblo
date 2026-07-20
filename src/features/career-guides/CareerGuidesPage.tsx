import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Calendar, CheckCircle2, UserCheck, ChevronRight, Award, Flame, Link2 } from 'lucide-react';
import { adminService, CareerResource } from '../../services/adminService';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState } from '../../components/common/StatusMessages';

interface CareerGuidesPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: CareerResource['category'] | 'All';
}

export default function CareerGuidesPage({ onNavigate, initialCategory = 'All' }: CareerGuidesPageProps) {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<CareerResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeGuide, setActiveGuide] = useState<CareerResource | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const allRes = await adminService.getCareerResources();
        setResources(allRes);
        
        // Auto-select first matching guide if category selected
        const matched = initialCategory === 'All' 
          ? allRes 
          : allRes.filter(r => r.category.toLowerCase() === initialCategory.toLowerCase());
          
        if (matched.length > 0) {
          setActiveGuide(matched[0]);
        }
      } catch (e) {
        console.error('Error loading career guides:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialCategory]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const filtered = resources.filter(r => {
      const matchesCat = cat === 'All' || r.category.toLowerCase() === cat.toLowerCase();
      const matchesDiff = selectedDifficulty === 'All' || r.difficulty === selectedDifficulty;
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesDiff && matchesSearch;
    });
    if (filtered.length > 0) {
      setActiveGuide(filtered[0]);
    } else {
      setActiveGuide(null);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.content && r.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.topicOrRole && r.topicOrRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      r.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDiff = 
      selectedDifficulty === 'All' || 
      r.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDiff;
  });

  const categories = ['All', 'Resume Tips', 'Interview Questions', 'Salary Guides', 'Career Guides', 'Skill Roadmaps'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={`${selectedCategory === 'All' ? 'Career Editorial & Sourcing Guides' : selectedCategory} | JOB Lo`} 
        description="Browse certified corporate salary reviews, technical syllabus analyses, and resume format checkers curated by the editorial board." 
        h1Text="JOB Lo Career CMS Directory"
      />

      <Breadcrumbs items={[{ label: 'Career Hub', path: '/career-guides' }, { label: selectedCategory === 'All' ? 'All Guides' : selectedCategory }]} onNavigate={onNavigate} />

      {/* Hero Header Banner */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Verified Sourcing Authority Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Topic Authority & Career Prep CMS
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Sourced tech roadmaps, soft skills manuals, resume checker blueprints, and HR templates maintained under verified advisory boards.
          </p>
        </div>
      </section>

      {/* Main Grid View */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Resource lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controllers & Filters bar */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search syllabus roadmaps, question databases, CV guides..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-lg font-sans text-gray-800"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    const filtered = resources.filter(r => {
                      const matchesCat = selectedCategory === 'All' || r.category.toLowerCase() === selectedCategory.toLowerCase();
                      const matchesDiff = e.target.value === 'All' || r.difficulty === e.target.value;
                      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchesCat && matchesDiff && matchesSearch;
                    });
                    setActiveGuide(filtered[0] || null);
                  }}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold cursor-pointer outline-none"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff === 'All' ? 'All Complexities' : `${diff} Level`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Selector Tab Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer border ${
                    selectedCategory.toLowerCase() === cat.toLowerCase() 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                      : 'bg-slate-50 text-gray-500 hover:bg-slate-100 hover:text-black border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingState message="Extracting career resources catalogue..." />
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No Editorial Assets Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No career guides, resume checklists, or syllabus maps correspond to this category and complexity.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Reset Selection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div 
                  key={res.id} 
                  onClick={() => setActiveGuide(res)}
                  className={`p-4 border transition-all rounded-2xl flex flex-col justify-between space-y-3 cursor-pointer ${
                    activeGuide?.id === res.id 
                      ? 'bg-indigo-50/40 border-indigo-300 shadow-sm' 
                      : 'bg-white hover:bg-slate-50 border-slate-150'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-wide">
                        {res.category}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        res.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        res.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {res.difficulty || 'Easy'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug font-heading">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                      {res.excerpt}
                    </p>

                    {res.topicOrRole && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                        ROLE: {res.topicOrRole}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[10px] font-bold text-indigo-700">
                    <span>Read Guide manual</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Read dynamic detail panel */}
        <div className="lg:col-span-1">
          {activeGuide ? (
            <div className="border border-slate-250 bg-white p-6 rounded-2xl space-y-6 sticky top-4 animate-fadeIn">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-100 uppercase tracking-wider">
                    {activeGuide.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                    COMPLEXITY: {activeGuide.difficulty || 'Easy'}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 leading-snug font-heading">{activeGuide.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-sans border-b border-slate-100 pb-3">
                  <Flame className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sourced by certified executive recruiters</span>
                </div>
              </div>

              {/* Guide Contents */}
              <div className="space-y-4">
                <p className="text-[11px] text-gray-600 leading-relaxed font-sans font-semibold italic">
                  "{activeGuide.excerpt}"
                </p>
                
                <div className="text-xs text-gray-500 leading-relaxed font-sans space-y-3 whitespace-pre-line border-t border-slate-50 pt-3">
                  {activeGuide.content ? (
                    activeGuide.content
                  ) : (
                    "This authoritative blueprint guidelines covers practical examples, interview checklists, metrics-tracking formats, and career acceleration maps for candidate compliance."
                  )}
                </div>
              </div>

              {/* Related reference links */}
              {activeGuide.links && activeGuide.links.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Official Reference Coordinates
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {activeGuide.links.map((lnk, idx) => (
                      <a
                        key={idx}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>{lnk.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/resume-builder')}
                  className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Optimize Resume via ATS Sourcing
                </button>
              </div>

            </div>
          ) : (
            <div className="border border-dashed border-slate-200 bg-slate-50/50 p-10 rounded-2xl text-center flex flex-col justify-center items-center h-[350px]">
              <BookOpen className="w-10 h-10 text-gray-300 mb-2" />
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Select Material</h3>
              <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-relaxed">
                Choose any guide on the left to read its complete text directly in this viewport. Includes HR vetting standards and software prep material.
              </p>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
