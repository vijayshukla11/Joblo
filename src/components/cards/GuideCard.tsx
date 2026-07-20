import React from 'react';
import { BookOpen, UserCheck, Calendar } from 'lucide-react';
import { CareerGuide } from '../../types';

interface GuideCardProps {
  guide: CareerGuide;
  onNavigateToGuide: (id: string) => void;
}

export default function GuideCard({ guide, onNavigateToGuide }: GuideCardProps) {
  return (
    <article 
      onClick={() => onNavigateToGuide(guide.id)}
      className="group bg-white border border-slate-150 hover:border-slate-300 hover:shadow-md rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 focus-ring select-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onNavigateToGuide(guide.id);
      }}
      aria-label={`Read guide: ${guide.title}`}
    >
      <div className="space-y-3">
        
        {/* UPPER INFO */}
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
            {guide.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-sans">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>{guide.readTime} Read</span>
          </span>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
            {guide.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {guide.excerpt}
          </p>
        </div>

      </div>

      {/* AUTHOR & TIMESTAMP */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-heading font-extrabold text-[10px] text-gray-800 shrink-0">
            {guide.authorName.charAt(0)}
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-800">{guide.authorName}</span>
              {guide.authorVerified && (
                <span title="Verified Career Expert">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400">{guide.authorRole}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[9px] text-gray-400">
          <Calendar className="w-3 h-3 shrink-0" />
          <span>{guide.lastUpdated}</span>
        </div>
      </div>

    </article>
  );
}
