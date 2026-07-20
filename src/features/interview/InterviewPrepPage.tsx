import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface InterviewPrepPageProps {
  onNavigate: (path: string) => void;
}

export default function InterviewPrepPage({ onNavigate }: InterviewPrepPageProps) {
  const [selectedDomain, setSelectedDomain] = useState('React & Frontend');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const questions = [
    {
      domain: 'React & Frontend',
      difficulty: 'Intermediate',
      q: 'How does React 19 handle automatic state batching and Server Components?',
      ans: 'React 19 natively batches all state updates within event handlers, promises, and async actions automatically to minimize DOM repaints. React Server Components (RSC) render on the server, sending a lightweight serialized JSON structure to the client, preserving client-side React state while avoiding large client JS bundle overheads.'
    },
    {
      domain: 'React & Frontend',
      difficulty: 'Advanced',
      q: 'Explain correct dependency arrays rules inside React hooks to prevent re-renders.',
      ans: 'To prevent infinite loops, dependencies must be primitives (strings, booleans, numbers) rather than non-memoized objects or functions declared in the render block. Always stabilize callbacks with useCallback or dependencies with useMemo, or extract them entirely outside the component scope.'
    },
    {
      domain: 'Government & Quantitative',
      difficulty: 'UPSC / SSC standard',
      q: 'What are the main stages of the National Civil Services Examination selection pipeline?',
      ans: 'The exam features three sequential tiers: 1. Preliminary Examination (Objective testing GS & CSAT, qualifying format). 2. Main Examination (9 descriptive academic papers testing deep topical command). 3. Personality Test/Interview Board evaluation conducted by UPSC commissioners.'
    },
    {
      domain: 'Government & Quantitative',
      difficulty: 'Banking standard',
      q: 'Explain the difference between Repo Rate and Reverse Repo Rate in Indian Banking.',
      ans: 'Repo Rate is the fixed interest rate at which the Reserve Bank of India (RBI) lends liquidity to commercial banks against government security margins. Reverse Repo Rate is the interest rate commercial banks receive when depositing surplus funds safely with the RBI.'
    }
  ];

  const filtered = questions.filter(q => q.domain === selectedDomain);

  const toggleExpand = (idx: number) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
    }
  };

  const domains = ['React & Frontend', 'Government & Quantitative'];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Interactive Interview Preparatory Manual" 
        description="Verify interview questions and sample solutions compiled by recruiters. Explore technical React 19 execution guidelines and public civil service structures." 
        h1Text="JOB Lo Interview Question Bank"
      />

      <Breadcrumbs items={[{ label: 'Interview Preparation', path: '/interview-preparation' }]} onNavigate={onNavigate} />

      {/* HEADER BAR */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Curated Recruiter Blueprints
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Interview Question Banks
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Prep manual compilations mapped directly to corporate test loops and national commission guidelines.
          </p>
        </div>
      </section>

      {/* MAIN DIVISION LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION SELECTOR */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Select Prep Domain</h2>
          <div className="flex flex-col gap-1.5">
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => {
                  setSelectedDomain(dom);
                  setExpandedIndex(null);
                }}
                className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                  selectedDomain === dom 
                    ? 'bg-indigo-50 text-indigo-950 border border-indigo-100' 
                    : 'hover:bg-slate-50 text-gray-500'
                }`}
              >
                <span>{dom}</span>
                {selectedDomain === dom && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-[11px] text-gray-400 leading-relaxed font-sans mt-6">
            <span className="font-bold text-gray-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Answer Sourcing</span>
            </span>
            <span>All answers are reviewed by Senior Technical Directors and authorized Indian Academy examiners for complete syllabus alignment.</span>
          </div>
        </div>

        {/* INTERACTIVE EXPANDABLE LISTING */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-100">
            <span>Showing prep questions under <strong className="text-gray-800">{selectedDomain}</strong></span>
            <span className="text-[10px] font-mono">Updates: Weekly</span>
          </div>

          <div className="space-y-3">
            {filtered.map((item, index) => {
              const isExpanded = expandedIndex === index;

              return (
                <div 
                  key={index}
                  className="bg-white border border-slate-150 rounded-xl p-4 hover:border-slate-350 transition-all cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                        {item.difficulty}
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">
                        {item.q}
                      </h3>
                    </div>
                    
                    <button className="text-gray-400 hover:text-black pt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-gray-500 leading-relaxed font-sans bg-slate-50 p-4 rounded-lg space-y-2.5 animate-fadeIn">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Recommended Answer Framework</span>
                      </div>
                      <p className="whitespace-pre-line font-medium text-slate-700">{item.ans}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </section>

    </div>
  );
}
