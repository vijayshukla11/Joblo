import React from 'react';
import { Briefcase, FileText, CheckCircle2, XCircle, Users, Eye, PlusCircle, ArrowRight, Settings, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { mockActivities } from '../../../data/employerMockData';

interface OverviewTabProps {
  onSetActiveTab: (tab: string) => void;
  onNavigate: (path: string) => void;
  onSetJobAction: (action: { type: 'create' | 'edit' | 'preview'; jobId?: string }) => void;
  stats: {
    totalJobs: number;
    activeJobs: number;
    draftJobs: number;
    closedJobs: number;
    appsReceived: number;
    appsToday: number;
    shortlisted: number;
    rejected: number;
  };
  activities?: { id: string; text: string; time: string }[];
}

export default function OverviewTab({ onSetActiveTab, onNavigate, onSetJobAction, stats, activities = mockActivities }: OverviewTabProps) {
  const cards = [
    { label: 'Total Jobs', value: stats.totalJobs, color: 'border-slate-200 text-slate-900 bg-white' },
    { label: 'Active Jobs', value: stats.activeJobs, color: 'border-emerald-150 text-emerald-700 bg-emerald-50/50' },
    { label: 'Draft Jobs', value: stats.draftJobs, color: 'border-amber-150 text-amber-700 bg-amber-50/50' },
    { label: 'Closed Jobs', value: stats.closedJobs, color: 'border-slate-200 text-slate-500 bg-slate-50' },
    { label: 'Applications Received', value: stats.appsReceived, color: 'border-indigo-150 text-indigo-700 bg-indigo-50/50' },
    { label: "Today's Applications", value: stats.appsToday, color: 'border-rose-150 text-rose-700 bg-rose-50/50' },
    { label: 'Shortlisted', value: stats.shortlisted, color: 'border-teal-150 text-teal-700 bg-teal-50/50' },
    { label: 'Rejected', value: stats.rejected, color: 'border-slate-200 text-slate-400 bg-slate-50' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. KEY PERFORMANCE METRICS */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">
          Key Performance Metrics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className={`border rounded-2xl p-5 shadow-3xs flex flex-col justify-between h-28 ${c.color} transition-all duration-200 hover:shadow-2xs`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
              <span className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. RECENT ACTIVITY & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl p-6 space-y-4 shadow-3xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Recent Pipeline Activity
            </h3>
            <button 
              onClick={() => onSetActiveTab('applicants')}
              className="text-[10px] text-indigo-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Pipelines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-3 text-xs font-sans">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-700">{act.text}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                Corporate Quick Actions
              </h4>
              <p className="text-[11px] text-slate-400">
                Instantly deploy vacancies, configure alerts, or audit candidate pipelines.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <button
                onClick={() => {
                  onSetActiveTab('jobs');
                  onSetJobAction({ type: 'create' });
                }}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Create Job Opening</span>
              </button>

              <button
                onClick={() => onSetActiveTab('applicants')}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Manage Applicant Stream</span>
              </button>

              <button
                onClick={() => onSetActiveTab('profile')}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/5 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Edit Company Hub</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Quota Status: Unlimited</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Sourcing DPDP disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3 text-[11px] leading-relaxed text-slate-500">
        <AlertCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="font-sans font-medium">
          <strong>Direct API Sourcing Notice:</strong> This enterprise workspace operates under verified Sandbox credentials. Candidate identities, phone coordinates, and resume vaults are regulated by standard cryptographic access permissions. No actual Supabase integrations or live data modifications are active during this frontend review sprint.
        </p>
      </div>

    </div>
  );
}
