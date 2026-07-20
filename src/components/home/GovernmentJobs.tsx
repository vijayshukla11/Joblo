import React from 'react';
import { Shield, MapPin, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_GOVERNMENT_JOBS } from '../../constants';

interface GovernmentJobsProps {
  onSelectSkill: (skill: string) => void;
  onApplyDemo: (title: string, agency: string) => void;
}

export default function GovernmentJobs({ onSelectSkill, onApplyDemo }: GovernmentJobsProps) {
  return (
    <section 
      id="gov-jobs-section" 
      className="py-16 bg-slate-50/40 border-t border-slate-100 max-w-7xl mx-auto px-6 space-y-12"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-5xl mx-auto">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>Indian Public Sector Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
            Government Notifications & Exams
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-xl">
            Sourced directly from verified Gazette publications and central recruitment bulletins. 100% ad-free, secure, and authenticated.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400">
          <span>Last automated sync:</span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
            2 hours ago
          </span>
        </div>
      </div>

      {/* Grid of notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {MOCK_GOVERNMENT_JOBS.map((govJob, idx) => (
          <motion.div
            key={govJob.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="flex flex-col justify-between p-6 bg-white border border-gray-150 rounded-2xl hover:border-emerald-200 hover:shadow-xs transition-all relative overflow-hidden group"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {govJob.examBody} Notification
                  </span>
                  <h3 className="text-base font-bold text-gray-900 font-heading leading-snug group-hover:text-emerald-950 transition-colors">
                    {govJob.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 font-sans">
                    {govJob.department}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-heading text-lg shrink-0">
                  {govJob.logo}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-gray-100 text-xs text-gray-500 font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">SALARY LEVEL</span>
                  <span className="font-mono text-xs font-bold text-gray-800">{govJob.salary.split(' basic')[0]}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">ELIGIBILITY</span>
                  <span className="font-semibold text-gray-800">{govJob.eligibility.split('.')[0]}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">LOCATION</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {govJob.location.split(' /')[0]}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">DEADLINE</span>
                  <span className="flex items-center gap-1 font-semibold text-red-600">
                    <Calendar className="w-3 h-3" />
                    {govJob.applicationDeadline.split(', ')[0]}
                  </span>
                </div>
              </div>

              {/* Skills required for syllabus */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">KEY SYLLABUS TOPICS</span>
                <div className="flex flex-wrap gap-1.5">
                  {govJob.skillsRequired.map((skill, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => onSelectSkill(skill)}
                      className="px-2 py-1 bg-slate-50 border border-gray-100 hover:border-emerald-300 text-[10px] font-semibold text-gray-600 hover:text-emerald-800 rounded-md transition-all cursor-pointer focus-ring font-sans"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-6 mt-6 border-t border-gray-100">
              {govJob.syllabusLink && (
                <a
                  href={govJob.syllabusLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/10 text-xs font-bold text-gray-600 hover:text-emerald-800 rounded-lg transition-all focus-ring"
                  data-analytics-id={`gov-syllabus-link-${govJob.slug}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Syllabus PDF</span>
                </a>
              )}
              
              <button
                onClick={() => onApplyDemo(govJob.title, govJob.examBody)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-black hover:bg-zinc-800 text-xs font-bold text-white rounded-lg transition-colors focus-ring cursor-pointer select-none"
                data-analytics-id={`gov-apply-btn-${govJob.slug}`}
              >
                Apply Online
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust announcement */}
      <div className="max-w-3xl mx-auto flex items-center gap-3 p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-xl text-xs text-emerald-800 font-sans">
        <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>E-Sourcing Policy:</strong> We do not host or process public funds. All 'Apply Online' links route applicants safely directly to the official government portals (e.g., <code>ssc.gov.in</code>, <code>upsc.gov.in</code>). No data brokerage, 100% security.
        </span>
      </div>

    </section>
  );
}
