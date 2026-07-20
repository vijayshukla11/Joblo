import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, Award, ChevronRight, FileText } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface ResumeTipsPageProps {
  onNavigate: (path: string) => void;
}

export default function ResumeTipsPage({ onNavigate }: ResumeTipsPageProps) {
  const resumeTips = [
    {
      title: 'Action-Oriented Verbs First',
      description: 'Begin every experience bullet point with strong, actionable verbs (e.g., "Led backend overhaul...", "Optimized API latencies...", "Authored database migration schemas"). Avoid passive descriptors like "Responsible for...".',
      badge: 'ATS Compliance'
    },
    {
      title: 'Map Skills Directly to Database Fields',
      description: 'Modern employers utilize database structures where queries filter for explicit skills. Specify your technical expertise (e.g., React, TypeScript, Node.js) in a clean table or structured tags rather than prose.',
      badge: 'Profile Sourcing'
    },
    {
      title: 'Keep Formatting ATS-Readable',
      description: 'Standardize layout to a single-column, clean sans-serif typography (like Inter). Avoid embedding crucial details in complex graphics, progress bar graphics, or multi-column text tables which can break scrapers.',
      badge: 'Scraper Safety'
    },
    {
      title: 'Quantify Accomplishments and Scale',
      description: 'Always specify numbers to establish immediate credibility. Write "Boosted response latency metrics by 42%" instead of just "Improved response latency metrics".',
      badge: 'Impact Metric'
    }
  ];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Resume Building & Optimization Tips" 
        description="Learn expert guidelines for structuring resumes, bypassing ATS screens, and preparing profiles for top tier Indian tech companies." 
        h1Text="JOB Lo Resume Tips"
      />

      <Breadcrumbs items={[{ label: 'Resume Tips', path: '/resume-tips' }]} onNavigate={onNavigate} />

      <section className="max-w-4xl mx-auto py-12 px-6 space-y-10 font-sans">
        
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">ATS Resume Optimization Tips</h1>
          <p className="text-xs text-gray-400">Industry-proven techniques to make your CV stand out to elite recruiters and algorithmic trackers.</p>
        </div>

        {/* Tip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeTips.map((tip, idx) => (
            <div key={idx} className="p-5 border border-slate-150 bg-white rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg uppercase">
                    {tip.badge}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-semibold">Tip #0{idx + 1}</span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 font-heading leading-snug">{tip.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive CTA Banner */}
        <div className="relative overflow-hidden bg-zinc-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-zinc-800 shadow-xl">
          <div className="space-y-2 max-w-lg text-center sm:text-left">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              Interactive Tools
            </span>
            <h3 className="text-sm font-extrabold tracking-tight font-heading">Ready to check your CV for pipeline fit?</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Upload your resume PDF to our Analyzer tool to get real-time compliance feedback and score against verified Indian roles.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/resume-builder')}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-extrabold rounded-xl text-3xs uppercase tracking-wider hover:bg-slate-100 transition-all cursor-pointer shrink-0 text-center flex items-center justify-center gap-1"
          >
            <span>Analyze Resume PDF</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

    </div>
  );
}
