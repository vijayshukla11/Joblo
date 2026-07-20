import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Sparkles, AlertCircle, FileText, Upload, RefreshCw, X, Check, Eye } from 'lucide-react';
import { jobApi, ApiResponse } from '../../api/jobApi';
import { Job } from '../../types';

interface JobSectionProps {
  searchQuery: string;
  selectedType: string;
  onApplyDemo: (title: string, company: string) => void;
  // Expose triggers to allow header or hero to open the AI Match panel
  forceOpenMatcher?: boolean;
}

export default function JobSection({ searchQuery, selectedType, onApplyDemo, forceOpenMatcher }: JobSectionProps) {
  // Core Job state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [offlineState, setOfflineState] = useState<boolean>(false);

  // QA Toggles
  const [qaSimulateLoading, setQaSimulateLoading] = useState<boolean>(false);
  const [qaSimulateError, setQaSimulateError] = useState<boolean>(false);
  const [qaSimulateOffline, setQaSimulateOffline] = useState<boolean>(false);

  // AI Match States
  const [isMatcherOpen, setIsMatcherOpen] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState<boolean>(false);
  const [aiMatchScores, setAiMatchScores] = useState<Record<string, number> | null>(null);

  // Handle forcing open matcher from parent
  useEffect(() => {
    if (forceOpenMatcher) {
      setIsMatcherOpen(true);
      const el = document.getElementById('featured-jobs');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [forceOpenMatcher]);

  // Load jobs based on filters and QA simulation states
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setErrorState(null);
      setOfflineState(false);

      try {
        const res = await jobApi.fetchAllJobs({
          forceError: qaSimulateError,
          simulateOffline: qaSimulateOffline,
          delayMs: qaSimulateLoading ? 1500 : 300,
        });

        if (res.isOffline) {
          setOfflineState(true);
          setJobs([]);
        } else if (res.status === 500) {
          setErrorState(res.message);
          setJobs([]);
        } else {
          // Filter client-side based on search query and category
          const query = searchQuery.toLowerCase().trim();
          const filtered = res.data.filter((job) => {
            const matchesSearch =
              query === '' ||
              job.title.toLowerCase().includes(query) ||
              job.companyName.toLowerCase().includes(query) ||
              job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
              job.description.toLowerCase().includes(query);

            const matchesType =
              selectedType === 'All' ||
              (selectedType === 'Remote' && job.employmentType === 'Remote') ||
              (selectedType === 'Full-time' && job.employmentType === 'Full-time') ||
              (selectedType === 'Internship' && job.employmentType === 'Internship') ||
              (selectedType === 'Part-time' && job.employmentType === 'Part-time');

            return matchesSearch && matchesType;
          });

          setJobs(filtered);
        }
      } catch (err) {
        setErrorState('Failed to read job feed from gateway.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [searchQuery, selectedType, qaSimulateLoading, qaSimulateError, qaSimulateOffline]);

  // Handle Drag Events for File Upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResume(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processResume(e.target.files[0]);
    }
  };

  // Mock Resume AI parsing logic
  const processResume = (file: File) => {
    setUploadedFileName(file.name);
    setAnalyzingResume(true);

    // Simulate model analysis and scoring
    setTimeout(() => {
      setAnalyzingResume(false);
      // Assign custom high match scores to demonstrate direct feed updates
      setAiMatchScores({
        'job-1': 96, // Linear - perfect match
        'job-2': 84, // Vercel
        'job-3': 58, // Stripe
        'job-4': 72, // BrowserStack
      });
    }, 1800);
  };

  const resetAIJobMatch = () => {
    setUploadedFileName(null);
    setAiMatchScores(null);
  };

  return (
    <section id="featured-jobs" className="py-16 bg-white border-t border-slate-100 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* 1. Header with Filters & QA Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-gray-100">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
            Latest Corporate Careers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">
            Directly open private sector vacancies from top engineering organizations. Fully integrated with your AI Matcher.
          </p>
        </div>

        {/* QA Diagnostic Toggle panel (Clean, minimal dashboard bypass) */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 border border-gray-100 rounded-xl max-w-md">
          <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest px-2 block w-full sm:w-auto">
            QA AUDIT:
          </span>
          <button
            onClick={() => {
              setQaSimulateLoading(!qaSimulateLoading);
              setQaSimulateError(false);
              setQaSimulateOffline(false);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
              qaSimulateLoading ? 'bg-amber-100 text-amber-800' : 'bg-white text-gray-500 hover:text-black border border-gray-100'
            }`}
            data-analytics-id="qa-toggle-loading"
          >
            {qaSimulateLoading ? '● Loading On' : '○ Loading Off'}
          </button>
          
          <button
            onClick={() => {
              setQaSimulateError(!qaSimulateError);
              setQaSimulateLoading(false);
              setQaSimulateOffline(false);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
              qaSimulateError ? 'bg-red-100 text-red-800' : 'bg-white text-gray-500 hover:text-black border border-gray-100'
            }`}
            data-analytics-id="qa-toggle-error"
          >
            {qaSimulateError ? '● Error On' : '○ Error Off'}
          </button>

          <button
            onClick={() => {
              setQaSimulateOffline(!qaSimulateOffline);
              setQaSimulateLoading(false);
              setQaSimulateError(false);
            }}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer ${
              qaSimulateOffline ? 'bg-purple-100 text-purple-800' : 'bg-white text-gray-500 hover:text-black border border-gray-100'
            }`}
            data-analytics-id="qa-toggle-offline"
          >
            {qaSimulateOffline ? '● Offline On' : '○ Offline Off'}
          </button>
        </div>
      </div>

      {/* 2. Unified AI Job Match Drawer/Panel */}
      <AnimatePresence>
        {isMatcherOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border border-emerald-100 bg-emerald-50/10 rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-gray-900 font-heading">
                    AI Job Matcher Scorecard
                  </h3>
                </div>
                <p className="text-xs text-gray-500 font-sans max-w-xl">
                  Upload your CV to calculate immediate compatibility percentages across our corporate career feed. All analytics are computed securely in your browser.
                </p>
              </div>
              <button
                onClick={() => setIsMatcherOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Close AI Job Matcher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop File Block */}
            {!uploadedFileName ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                  dragActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800">
                    Drag & Drop your resume here, or <span className="text-emerald-700 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Supports PDF, DOCX up to 5MB • 100% Secure Client-Side Analysis
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-file-picker"
                />
                <label
                  htmlFor="resume-file-picker"
                  className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-zinc-800 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer select-none"
                  data-analytics-id="resume-manual-browse"
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 font-heading">
                      {uploadedFileName}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      {analyzingResume ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                          <span>PARSING RESUME & ALIGNING SKILLS...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">MATCH SCORECARD SUCCESSFULLY COMPUTED</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {!analyzingResume && (
                  <button
                    onClick={resetAIJobMatch}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-600 cursor-pointer"
                    data-analytics-id="resume-reset"
                  >
                    Clear Resume
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Job Feed Content Layout */}
      <div>
        {/* Loading Spinner Block */}
        {loading && (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
              Fetching corporate recruitment gateway...
            </p>
          </div>
        )}

        {/* Offline / Network Glitch Block */}
        {offlineState && !loading && (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900 font-heading">
                Offline Mode Detected
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                You are currently offline. Showing cached search recommendations for offline reading. Check your connection.
              </p>
            </div>
            <button
              onClick={() => setQaSimulateOffline(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
            >
              Retry Online Sync
            </button>
          </div>
        )}

        {/* Database Error Block */}
        {errorState && !loading && (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900 font-heading">
                Gateway Sync Failed
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                {errorState}
              </p>
            </div>
            <button
              onClick={() => setQaSimulateError(false)}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-xs font-bold text-white rounded-lg cursor-pointer"
            >
              Reset Connection
            </button>
          </div>
        )}

        {/* Empty States (No Search Results) */}
        {!loading && !errorState && !offlineState && jobs.length === 0 && (
          <div className="py-20 text-center max-w-sm mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-gray-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-800 font-heading">
                No matching opportunities found
              </p>
              <p className="text-xs text-gray-400 font-sans">
                We couldn't find vacancies matching "{searchQuery}". Try broadening your keywords.
              </p>
            </div>
            <button
              onClick={() => {
                setQaSimulateError(false);
                setQaSimulateOffline(false);
              }}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

        {/* Real Dynamic Job Cards Grid (Shared Cards Architecture) */}
        {!loading && !errorState && !offlineState && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => {
              // Extract match rating from either mock parsing or standard score
              const currentScore = aiMatchScores ? aiMatchScores[job.id] : job.aiMatchScore;

              return (
                <div
                  key={job.id}
                  className="p-6 bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden group"
                >
                  {/* Subtle Top Accent */}
                  {job.isHot && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-bl-lg select-none">
                      URGENT APPLICANT STREAM
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-widest">
                            {job.companyName}
                          </span>
                          
                          {/* AI Score Badge - Exposing ONLY AI Job Match */}
                          {currentScore && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-mono text-[10px] font-bold border border-emerald-100/50">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{currentScore}% AI FIT</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 font-heading leading-snug group-hover:text-emerald-950 transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0">
                        {job.companyLogo}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">
                      {job.description}
                    </p>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-gray-500 font-sans">
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center bg-slate-50 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold text-slate-700">
                        {job.salary.split(' /')[0]}
                      </span>
                      <span className="inline-flex items-center bg-emerald-50/40 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase font-mono border border-emerald-100/30">
                        {job.employmentType}
                      </span>
                    </div>

                    {/* Skills Tag row */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-slate-50/50 text-[10px] text-gray-400 rounded-md font-sans border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Shared CTA Buttons Footer */}
                  <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">
                      POSTED {job.postedDate}
                    </span>

                    <button
                      onClick={() => onApplyDemo(job.title, job.companyName)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-zinc-800 text-xs font-bold text-white rounded-lg transition-colors focus-ring cursor-pointer select-none"
                      data-analytics-id={`corp-apply-btn-${job.id}`}
                    >
                      Instant Apply
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
}
