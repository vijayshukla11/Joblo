import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: any) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onTriggerAIMatch: () => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onSearchSubmit,
  onTriggerAIMatch,
}: HeroProps) {
  
  const popularSearches = [
    { label: 'SSC CGL Notification', query: 'ASO' },
    { label: 'React Developer', query: 'React 19' },
    { label: 'UPSC Civil Services', query: 'Civil Services' },
    { label: 'Remote Designer', query: 'Product Designer' },
    { label: 'SBI Probationary Officer', query: 'PO' }
  ];

  return (
    <section 
      id="hero-section" 
      className="relative overflow-hidden bg-white pt-24 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center"
    >
      {/* Super subtle Linear-style ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-50/20 via-transparent to-transparent -z-10 pointer-events-none rounded-full blur-3xl" />

      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Subtle Brand Promise Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50/50 text-emerald-800 border border-emerald-100/60 uppercase tracking-widest font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>FIND JOBS • BUILD SKILLS • GROW YOUR CAREER</span>
        </motion.div>

        {/* Master H1 Display Heading in Plus Jakarta Sans */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] font-heading">
            Your bridge to verified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800">
              Tech and Government
            </span>{' '}
            careers.
          </h1>
          
          {/* User-focused Subtitle in Source Sans 3 */}
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Skip the clutter of traditional job boards. Search direct positions in Indian public sectors 
            and global tech platforms. Sourced 100% from certified corporate channels.
          </p>
        </motion.div>

        {/* SIGNIFICANTLY LARGER, SLICK SEARCH BAR (UI DESIGNER APPROVED) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white border border-gray-150 shadow-xs hover:border-gray-200 hover:shadow-xs focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/10 rounded-2xl p-2 sm:p-3 max-w-3xl mx-auto transition-all"
        >
          <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by role, skill ('React 19', 'Aptitude') or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-4 text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0 font-sans"
                aria-label="Search vacancies by title, skill, or organization"
                data-analytics-id="hero-search-input"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="submit"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-7 py-4 text-xs font-bold text-white bg-black hover:bg-zinc-800 transition-all rounded-xl focus-ring cursor-pointer select-none"
                data-analytics-id="hero-submit-search"
              >
                <span>Find Jobs</span>
              </button>

              <button
                type="button"
                onClick={onTriggerAIMatch}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-4 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/80 transition-all rounded-xl focus-ring cursor-pointer select-none"
                data-analytics-id="hero-open-ai-match"
                title="Match with resume"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">AI Job Match</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* POPULAR SEARCHES ROW (SEO REQUIREMENT) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs pt-1"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
            Popular Searches:
          </span>
          {popularSearches.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(tag.query);
                const el = document.getElementById('featured-jobs');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center px-3 py-1 bg-slate-50 border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/20 text-[10px] font-semibold text-gray-600 hover:text-emerald-800 rounded-lg transition-all cursor-pointer focus-ring font-sans"
              data-analytics-id={`hero-popular-tag-${tag.query.toLowerCase()}`}
            >
              {tag.label}
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
