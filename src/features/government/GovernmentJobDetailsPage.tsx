import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import { adminService } from '../../services/adminService';
import { GovernmentJob } from '../../types';
import { ArrowLeft, Landmark, ShieldCheck, MapPin, Calendar, FileText, ArrowUpRight, Award, DollarSign, Users, Book, CheckCircle2, ChevronRight } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';

interface GovernmentJobDetailsPageProps {
  onNavigate: (path: string) => void;
  id?: string;
  slug?: string;
}

export default function GovernmentJobDetailsPage({ onNavigate, id, slug }: GovernmentJobDetailsPageProps) {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<GovernmentJob | null>(null);

  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      try {
        const jobs = await adminService.getGovernmentJobs();
        
        // Match slug from prop, id from prop, or URL fallback
        const targetIdentifier = slug || id || window.location.pathname.split('/').pop() || '';
        
        const found = jobs.find(
          j => j.slug?.toLowerCase() === targetIdentifier.toLowerCase() || 
          j.id.toLowerCase() === targetIdentifier.toLowerCase()
        );
        
        setJob(found || null);
      } catch (e) {
        console.error('Error fetching government job details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadJobDetails();
  }, [id, slug]);

  if (loading) {
    return (
      <MainLayout currentPath="/government-jobs" onNavigate={onNavigate}>
        <Container className="py-12">
          <LoadingState message="Extracting public sector gazette specifications and exam timelines..." />
        </Container>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout currentPath="/government-jobs" onNavigate={onNavigate}>
        <Container className="py-12">
          <EmptyState 
            title="Gazette Notification Not Found" 
            description="The requested government job notification or exam code has not been published in our national indexing portal."
            actionText="Browse Active Gazettes"
            onAction={() => onNavigate('/government-jobs')}
          />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPath="/government-jobs" onNavigate={onNavigate} id={job.id}>
      <div className="pb-16 font-sans">
        <SEO 
          title={`${job.title} Recruitment 2026 | ${job.department}`}
          description={`Apply for ${job.title} at ${job.department}. Salary: ${job.salary}. Exam Body: ${job.examBody}. Sourced under official gazette credentials.`}
        />

        <Breadcrumbs 
          items={[
            { label: 'Government Hub', path: '/government-jobs' },
            { label: job.title }
          ]} 
          onNavigate={onNavigate} 
        />

        <section className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
          
          {/* Back Button */}
          <button
            onClick={() => onNavigate('/government-jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gazette Directory</span>
          </button>

          {/* Core Notification Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-3xs">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-800 flex items-center justify-center text-3xl font-bold shrink-0 shadow-3xs select-none">
                {job.logo || '🏛️'}
              </div>
              
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                    {job.examBody} Exam
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Gazette Sourced</span>
                  </span>
                </div>
                
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
                  {job.title}
                </h1>
                
                <p className="text-xs text-slate-500 font-medium">
                  {job.department} • Central Government of India
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Apply before: {job.applicationDeadline || '24-Jul-2026'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href={job.syllabusLink || 'https://ssc.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center gap-1 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer text-center"
              >
                <span>Apply via OTR Portal</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column - Meta specs */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Job Overview */}
              <div className="space-y-3">
                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Notification Overview</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The {job.department} has issued an official recruitment gazette for the position of <strong>{job.title}</strong>, overseen by the <strong>{job.examBody}</strong>. Candidates meeting the specified educational qualifications and age brackets are invited to submit their One-Time Registrations (OTR) online before the deadline.
                </p>
              </div>

              {/* Eligibility & Qualifications */}
              <div className="space-y-4 bg-slate-50/50 p-5 border border-slate-150 rounded-2xl">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-indigo-700" />
                  <span>Eligibility & Criteria Checklist</span>
                </h3>
                
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-heading">Educational Qualification:</strong>
                      <span>{job.eligibility || 'Bachelor\'s Degree in any discipline from a recognized University or equivalent.'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-heading">Sought Core Expertise:</strong>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {job.skillsRequired?.map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-slate-900 block font-heading">Work Experience Bounds:</strong>
                      <span>{job.experience === 'Fresher' ? 'Fresher candidates are welcome. No corporate experience necessary.' : 'Prior service experience or certified technical background is specified.'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection & Syllabus */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Book className="w-4 h-4 text-indigo-700" />
                  <span>Selection Syllabus & Guidelines</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The competitive examination will be held in multiple tiers. Preliminary screening will test candidates on <strong>{job.skillsRequired?.join(', ')}</strong>. Hard-copy syllabi and sample papers can be accessed via the official coordinating coordinate link below:
                </p>
                <div className="pt-2">
                  <a
                    href={job.syllabusLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <span>Download Official Exam Syllabus PDF</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column - Gazette parameters card */}
            <div className="md:col-span-1">
              <div className="border border-slate-200 bg-white p-5 rounded-2xl space-y-5 shadow-3xs">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Gazette Specifications
                </span>
                
                <div className="space-y-4 text-xs">
                  
                  {/* Pay Scale */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase font-mono">Government Pay Scale</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {/* Coordinating Exam Body */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase font-mono">Exam Conducting Body</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{job.examBody} Board</span>
                    </div>
                  </div>

                  {/* Sourcing Authority */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase font-mono">Coordinating Department</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Landmark className="w-4 h-4 text-amber-600" />
                      <span>{job.department}</span>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-mono uppercase font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Commission Entry</span>
                </div>
              </div>
            </div>

          </div>

        </section>
      </div>
    </MainLayout>
  );
}
