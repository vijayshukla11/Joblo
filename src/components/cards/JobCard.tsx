import React, { useState } from 'react';
import { Briefcase, MapPin, IndianRupee, Clock, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onApplyDemo: (title: string, company: string) => void;
  onNavigateToJob: (slug: string) => void;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onApplyDemo, onNavigateToJob, onToggleSave, isSaved = false }: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onToggleSave) {
      onToggleSave(job.id);
    }
  };

  return (
    <article 
      onClick={() => onNavigateToJob(job.slug)}
      className="group relative bg-white border border-slate-150 hover:border-slate-300 hover:shadow-md rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-5 focus-ring select-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onNavigateToJob(job.slug);
      }}
      aria-label={`${job.title} at ${job.companyName}`}
    >
      {/* AI MATCH OR HOT BADGES */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {job.aiMatchScore && job.aiMatchScore >= 80 && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
            <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>AI: {job.aiMatchScore}% Match</span>
          </div>
        )}
        {job.isHot && (
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-700 border border-amber-100">
            <span>🔥 Hot Opening</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* HEADER: COMPANY LOGO & TEXT */}
        <div className="flex items-start gap-3.5 pr-20">
          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            {job.companyLogo}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 hover:underline">{job.companyName}</span>
              <span className="text-[10px] font-mono text-gray-300">•</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span>n8n Sourced</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

        {/* DETAILS TABLE GRID */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 font-sans border-t border-slate-50 pt-3.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location} {job.isRemote && '(Remote Eligible)'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-semibold text-gray-700">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.experience} Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Posted {job.postedDate}</span>
          </div>
        </div>

        {/* TECH SKILL TAGS */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1.5">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-black rounded px-2 py-0.5 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Sourcing tags triggers filtering
                }}
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[9px] font-mono font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-50 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApplyDemo(job.title, job.companyName);
          }}
          className="flex-1 py-2 text-[11px] font-bold text-center text-white bg-black hover:bg-zinc-800 focus-ring rounded-lg cursor-pointer transition-all active:scale-98 select-none"
          data-analytics-id={`job-card-apply-${job.id}`}
        >
          Quick Apply
        </button>

        <button
          onClick={handleSaveToggle}
          className={`p-2 rounded-lg border focus-ring cursor-pointer transition-all ${
            saved 
              ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' 
              : 'text-gray-400 hover:text-black border-slate-200 hover:bg-slate-50'
          }`}
          aria-label={saved ? 'Unsave job' : 'Save job'}
          title={saved ? 'Unsave job' : 'Save job'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

    </article>
  );
}
