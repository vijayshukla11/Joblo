import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, Sparkles, Check } from 'lucide-react';

interface SearchFormProps {
  initialQuery?: string;
  initialLocation?: string;
  initialExperience?: string;
  initialType?: string;
  onSearch: (params: { query: string; location: string; experience: string; type: string }) => void;
  onTriggerAIMatch?: () => void;
}

export default function SearchForm({
  initialQuery = '',
  initialLocation = '',
  initialExperience = '',
  initialType = 'All',
  onSearch,
  onTriggerAIMatch,
}: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [experience, setExperience] = useState(initialExperience);
  const [type, setType] = useState(initialType);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, location, experience, type });
  };

  const handleClear = () => {
    setQuery('');
    setLocation('');
    setExperience('');
    setType('All');
    onSearch({ query: '', location: '', experience: '', type: 'All' });
  };

  const experienceOptions = [
    { value: '', label: 'Any Experience' },
    { value: 'fresher', label: 'Fresher (0 years)' },
    { value: '1-3 years', label: 'Junior (1-3 years)' },
    { value: '3-5 years', label: 'Mid-Senior (3-5 years)' },
    { value: '5+ years', label: 'Lead/Director (5+ years)' },
  ];

  const typeOptions = [
    { value: 'All', label: 'All Job Types' },
    { value: 'Full-time', label: 'Full-time Permanent' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Remote', label: '100% Remote Hub' },
    { value: 'Internship', label: 'Internships / Trainee' },
  ];

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-4"
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-2.5">
        
        {/* FIELD 1: TITLE / KEYWORDS */}
        <div className="flex-1 min-w-[200px] relative flex items-center">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Role, skills, or company name (e.g. React, Next.js)"
            className="w-full pl-10.5 pr-4 py-3 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-0 focus-ring rounded-xl font-sans transition-all text-gray-800 placeholder-slate-400 font-medium"
            aria-label="Search Job Title, Skills or Company"
          />
        </div>

        {/* FIELD 2: LOCATION */}
        <div className="flex-1 min-w-[150px] relative flex items-center">
          <MapPin className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or 'Remote'"
            className="w-full pl-10.5 pr-4 py-3 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-0 focus-ring rounded-xl font-sans transition-all text-gray-800 placeholder-slate-400 font-medium"
            aria-label="Search Location"
          />
        </div>

        {/* FIELD 3: EXPERIENCE DROPDOWN */}
        <div className="w-full lg:w-48 relative flex items-center">
          <Briefcase className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 shrink-0 pointer-events-none" />
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full pl-10.5 pr-8 py-3 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-0 focus-ring rounded-xl font-sans transition-all text-gray-800 font-semibold cursor-pointer appearance-none"
            aria-label="Filter by Experience"
          >
            {experienceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none w-1.5 h-1.5 border-r border-b border-slate-400 rotate-45" />
        </div>

        {/* ACTION BUTTONS BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`px-3.5 py-3 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              isAdvancedOpen 
                ? 'bg-slate-100 border-slate-300 text-black' 
                : 'bg-white border-slate-200 text-gray-500 hover:text-black hover:bg-slate-50'
            }`}
            title="Toggle advanced job filters"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            type="submit"
            className="flex-1 lg:flex-none px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-all focus-ring shadow-xs select-none cursor-pointer flex items-center justify-center gap-1.5"
            data-analytics-id="search-submit-btn"
          >
            <span>Search Jobs</span>
          </button>
        </div>

      </div>

      {/* ADVANCED EXPANSIBLE FILTERS */}
      {isAdvancedOpen && (
        <div className="pt-4 border-t border-slate-100 animate-fadeIn flex flex-col sm:flex-row flex-wrap items-center gap-3 justify-between">
          {/* JOB TYPES SELECTOR BUTTONS */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1.5 font-sans">
              Employment:
            </span>
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setType(opt.value);
                  onSearch({ query, location, experience, type: opt.value });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  type === opt.value
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-gray-500 border border-transparent hover:bg-slate-100 hover:text-black'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(query || location || experience || type !== 'All') && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 rounded-lg cursor-pointer transition-colors"
              >
                Clear All Filters
              </button>
            )}

            {onTriggerAIMatch && (
              <button
                type="button"
                onClick={onTriggerAIMatch}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg cursor-pointer select-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Trigger AI Optimizer</span>
              </button>
            )}
          </div>
        </div>
      )}

    </form>
  );
}
