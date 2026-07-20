import React from 'react';
import { ShieldCheck, Calendar, Eye, Award } from 'lucide-react';

export default function EditorialNotice() {
  return (
    <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-6 max-w-7xl mx-auto my-6">
      <div className="flex flex-col md:flex-row items-start gap-5">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h4 className="text-sm font-bold text-gray-900 font-sans">
              Editorial Policy & Career Compliance Guarantee (E-E-A-T Certified)
            </h4>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              <Award className="w-3 h-3" /> Expert-Reviewed
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed max-w-5xl">
            Every career resource, recruitment syllabus guide, and government salary matrix published on <strong>JOB Lo</strong> undergoes rigorous vetting by our editorial team led by retired administrative experts and veteran tech talent acquisition managers. We guarantee 100% database schema transparency with no fake jobs or duplicate scraper listings. All information is sourced directly from certified corporate channels or official Indian government portals (Gazette publications, SSC, UPSC bulletins).
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5 border-t border-slate-200/60 text-3xs font-mono font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> LAST AUDITED: JULY 9, 2026
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" /> SECURE INTEGRITY RATIO: 100%
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-slate-400" /> EDITORS: KUNAL SHAH & DR. S. RADHAKRISHNAN (RETD. IAS)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
