import React from 'react';
import { Calendar, Award, BookOpen, Link, FileText, ArrowUpRight } from 'lucide-react';
import { GovernmentJob } from '../../types';

interface GovJobCardProps {
  job: GovernmentJob;
  onApplyDemo: (title: string, company: string) => void;
  onNavigateToJob: (slug: string) => void;
}

export default function GovJobCard({ job, onApplyDemo, onNavigateToJob }: GovJobCardProps) {
  return (
    <article 
      onClick={() => onNavigateToJob(job.slug)}
      className="group bg-white border border-slate-150 hover:border-slate-350 hover:shadow-md rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-5 focus-ring"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onNavigateToJob(job.slug);
      }}
      aria-label={`${job.title} under ${job.department}`}
    >
      <div className="space-y-4">
        {/* TOP TITLE WITH EXAM BODY BADGE */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold shrink-0">
              {job.logo}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-orange-700 tracking-tight uppercase">
                {job.examBody} Conducted
              </span>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                {job.title}
              </h3>
            </div>
          </div>
          <div className="text-[10px] text-orange-800 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full font-bold">
            Gazette Sourced
          </div>
        </div>

        {/* DETAILS TABLE GRID */}
        <div className="space-y-2 border-t border-slate-50 pt-3.5 text-[11px] text-gray-500 font-sans">
          <div className="flex items-start gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div className="leading-tight">
              <span className="font-semibold text-gray-700">Eligibility: </span>
              <span>{job.eligibility}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="leading-tight">
              <span className="font-semibold text-gray-700">Basic Pay: </span>
              <span className="text-emerald-700 font-bold">{job.salary}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <div className="leading-tight">
              <span className="font-semibold text-rose-700">Deadline: </span>
              <span className="text-rose-700 font-semibold">{job.applicationDeadline}</span>
            </div>
          </div>
        </div>

        {/* TECH SKILL TAGS */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {job.skillsRequired.map((skill, index) => (
              <span 
                key={index} 
                className="text-[9px] font-semibold text-slate-500 bg-slate-100 rounded px-2 py-0.5"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-50 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApplyDemo(job.title, job.department);
          }}
          className="flex-1 py-2 text-[11px] font-bold text-center text-orange-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 focus-ring rounded-lg cursor-pointer transition-all active:scale-98"
        >
          Official Notification
        </button>

        {job.syllabusLink && (
          <a
            href={job.syllabusLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg border border-slate-200 text-gray-500 hover:text-black hover:bg-slate-50 transition-colors cursor-pointer"
            title="Download Syllabus PDF"
          >
            <FileText className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

    </article>
  );
}
