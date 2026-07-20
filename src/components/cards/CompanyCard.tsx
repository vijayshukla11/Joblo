import React from 'react';
import { Star, MapPin, Building, ArrowUpRight } from 'lucide-react';
import { Company } from '../../types';

interface CompanyCardProps {
  company: Company;
  onNavigateToCompany: (id: string) => void;
}

export default function CompanyCard({ company, onNavigateToCompany }: CompanyCardProps) {
  return (
    <article 
      onClick={() => onNavigateToCompany(company.id)}
      className="group bg-white border border-slate-150 hover:border-slate-300 hover:shadow-md rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 focus-ring select-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onNavigateToCompany(company.id);
      }}
      aria-label={`View ${company.name} profile`}
    >
      <div className="space-y-3.5">
        
        {/* LOGO AND BRANDING */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
              {company.logo}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <span className="font-bold text-gray-700">{company.rating}</span>
                <span>•</span>
                <span>{company.size} Employees</span>
              </div>
            </div>
          </div>
          
          <div className="w-7 h-7 rounded-full bg-slate-50 text-gray-400 group-hover:text-black group-hover:bg-slate-100 flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* DETAILS TABLE GRID */}
        <div className="space-y-1.5 border-t border-slate-50 pt-3 text-[11px] text-gray-500 font-sans">
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.industry}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{company.location}</span>
          </div>
        </div>

      </div>

      {/* FOOTER PIPELINE STATUS */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto text-[11px]">
        <span className="font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
          {company.openingsCount || company.openings || 0} Jobs Listed
        </span>
        <span className="font-mono text-[9px] text-gray-400">
          Sync Status: Live
        </span>
      </div>

    </article>
  );
}
