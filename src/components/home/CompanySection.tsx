import React from 'react';
import { MOCK_COMPANIES } from '../../constants';
import { Star, ArrowRight } from 'lucide-react';

interface CompanySectionProps {
  onSelectCompany: (companyName: string) => void;
}

export default function CompanySection({ onSelectCompany }: CompanySectionProps) {
  return (
    <section id="companies-section" className="py-12 bg-white border-t border-gray-150 max-w-7xl mx-auto px-6 space-y-8">
      
      {/* SECTION HEADER */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
          Verified Employers
        </span>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-sans">
          Top Companies Hiring Direct
        </h2>
        <p className="text-xs text-gray-500 max-w-xl">
          Browse open listings at vetted organizations offering certified working conditions, transparent salaries, and zero brokerage.
        </p>
      </div>

      {/* COMPANY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {MOCK_COMPANIES.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelectCompany(company.name)}
            className="group bg-white border border-gray-150 rounded-xl p-5 hover:border-black transition-all cursor-pointer space-y-4"
          >
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xl text-gray-900 shadow-3xs group-hover:bg-black group-hover:text-white transition-colors">
                {company.logo}
              </div>

              <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{company.rating}</span>
              </div>
            </div>

            {/* Title / Industry */}
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {company.name}
              </h3>
              <p className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {company.industry}
              </p>
            </div>

            {/* Meta statistics */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-3xs font-mono font-bold text-slate-500">
              <span>Size: {company.size}</span>
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {company.openings} Active Jobs
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK LOGO CLUTTER-FREE BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-6 px-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/20 text-xs font-semibold text-slate-400">
        <span className="text-3xs font-mono font-bold uppercase tracking-widest text-slate-400">
          Trusted Partners:
        </span>
        <div className="flex flex-wrap gap-8 items-center">
          <span className="tracking-widest font-extrabold text-slate-300 select-none">▲ VERCEL</span>
          <span className="tracking-wider font-extrabold text-slate-300 select-none">⚡ LINEAR</span>
          <span className="tracking-widest font-extrabold text-slate-300 select-none">stripe</span>
          <span className="tracking-wider font-bold text-slate-300 select-none">State Bank of India</span>
        </div>
        <span className="text-3xs font-mono font-bold text-emerald-600">
          + 240 more certified
        </span>
      </div>

    </section>
  );
}
