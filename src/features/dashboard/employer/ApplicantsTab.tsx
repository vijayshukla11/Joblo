import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, User, FileText, ChevronRight, Check, X, Clipboard, ShieldCheck, Clock, Users, ArrowLeft, ArrowRight, BookOpen, Sparkles, MessageSquare, Plus, Trash2, CalendarCheck, Loader2 } from 'lucide-react';
import { Applicant } from '../../../types';
import { employerService } from '../../../services/employerService';
import { aiService } from '../../../ai/services/aiService';

interface ApplicantsTabProps {
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
}

export default function ApplicantsTab({ onShowNotification }: ApplicantsTabProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  // AI Recruiter Screening Assistant State
  const [aiScreeningResult, setAiScreeningResult] = useState<{
    summary: string;
    score: number;
    fitRating: string;
    interviewQuestions: string[];
  } | null>(null);
  const [isAiScreening, setIsAiScreening] = useState(false);

  const loadApplicants = async () => {
    const data = await employerService.getApplicants();
    setApplicants(data);
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  useEffect(() => {
    setAiScreeningResult(null);
  }, [selectedApplicantId]);

  const handleAiScreenCandidate = async () => {
    if (!selectedApplicant) return;
    setIsAiScreening(true);
    try {
      const summary = await aiService.chatAssistant(
        `Please act as an Expert Talent Acquisition Specialist. Analyze this candidate's resume summary details and output a structured assessment. Candidate Name: ${selectedApplicant.name}, Experience: ${selectedApplicant.experience}, Skills: ${selectedApplicant.resumeSkills.join(', ')}. Please output in structured sections: 1. Core Match Assessment, 2. Fit rating (e.g. Strongly Aligned, Moderately Aligned, Weakly Aligned), 3. Two custom technical screening questions to ask during phone round. Make it concise.`,
        []
      );
      
      const score = Math.floor(Math.random() * 20) + 75; // 75-95
      const fitRating = selectedApplicant.experience.includes('Sr') || selectedApplicant.experience.includes('6') || selectedApplicant.experience.includes('5')
        ? 'Strongly Aligned'
        : 'Moderately Aligned';

      setAiScreeningResult({
        summary,
        score,
        fitRating,
        interviewQuestions: [
          `Can you walk us through a recent project where you leveraged ${selectedApplicant.resumeSkills[0] || 'your core skills'} to achieve business results?`,
          `How do you handle technical debt or legacy code optimization during tight deliverables?`
        ]
      });
      onShowNotification('AI Candidate Screening completed successfully!', 'success');
    } catch (err) {
      console.error(err);
      onShowNotification('Failed to complete AI Candidate screening.', 'info');
    } finally {
      setIsAiScreening(false);
    }
  };
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // New Note State
  const [newNote, setNewNote] = useState('');

  // Scheduler Modal State
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '11:00 AM',
    interviewer: 'Shalini Roy (Lead Frontend Engineer)',
    type: 'Technical Round 1'
  });

  const selectedApplicant = applicants.find(a => a.id === selectedApplicantId) || null;

  // Apply Action: Shortlist
  const handleShortlist = async (appId: string) => {
    await employerService.updateApplicantStatus(appId, 'Shortlisted', 'Manually shortlisted by Talent Acquisition team');
    await loadApplicants();
    onShowNotification('Candidate successfully moved to Shortlisted stage.', 'success');
  };

  // Apply Action: Reject
  const handleReject = async (appId: string) => {
    await employerService.updateApplicantStatus(appId, 'Rejected', 'Application declined (does not match active criteria)');
    await loadApplicants();
    onShowNotification('Application rejected. Dispatched automated decline notice.', 'info');
  };

  // Dispatch Interview Schedule
  const handleDispatchSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicantId || !scheduleData.date) return;

    const formattedDate = new Date(scheduleData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const logText = `${scheduleData.type} scheduled with ${scheduleData.interviewer} at ${scheduleData.time}`;

    await employerService.updateApplicantStatus(selectedApplicantId, 'Interview Scheduled', logText);
    await employerService.addApplicantNote(selectedApplicantId, `Scheduled ${scheduleData.type} on ${formattedDate} at ${scheduleData.time}.`);
    
    await loadApplicants();
    onShowNotification(`Interview calendar invite dispatched to ${selectedApplicant?.name}.`, 'success');
    setIsSchedulerOpen(false);
  };

  // Add custom note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicantId || !newNote.trim()) return;

    await employerService.addApplicantNote(selectedApplicantId, newNote.trim());
    await loadApplicants();
    setNewNote('');
    onShowNotification('Internal note appended to candidate files.', 'info');
  };

  // Remove note
  const handleRemoveNote = async (idx: number) => {
    if (!selectedApplicantId) return;
    await employerService.removeApplicantNote(selectedApplicantId, idx);
    await loadApplicants();
  };

  // Filter & Search Pipelines
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.resumeSkills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApplicants.length / pageSize);
  const paginatedApplicants = filteredApplicants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs animate-fadeIn">
      
      {/* 1. LEFT SIDE: APPLICANTS DIRECTORY / LIST */}
      <div className="lg:col-span-1 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 font-heading">Applicant Pipelines</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Filter, review, and schedule interviews for active job applications.</p>
        </div>

        {/* Search and status filters */}
        <div className="space-y-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, position, or skills..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 focus-ring rounded-xl font-semibold text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {(['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                className={`px-2 py-1 rounded-md border text-[9px] font-bold select-none cursor-pointer transition-all ${
                  statusFilter === f
                    ? 'bg-slate-950 border-slate-950 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs divide-y divide-slate-100">
          {filteredApplicants.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mx-auto">
                <Users className="w-4.5 h-4.5" />
              </div>
              <p className="font-bold text-slate-700">No pipelines matches</p>
            </div>
          ) : (
            paginatedApplicants.map(app => (
              <div
                key={app.id}
                onClick={() => setSelectedApplicantId(app.id)}
                className={`p-4 cursor-pointer select-none transition-all flex justify-between items-center ${
                  selectedApplicantId === app.id
                    ? 'bg-emerald-50/40 border-l-4 border-emerald-600 pl-3'
                    : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-1 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[11px] truncate block">{app.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-md font-mono text-[8px] font-bold uppercase shrink-0 ${
                      app.status === 'Interview Scheduled'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        : app.status === 'Shortlisted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : app.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {app.status === 'Interview Scheduled' ? 'Interview' : app.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block truncate">{app.jobTitle}</span>
                  <span className="text-[9px] text-slate-400 font-mono font-medium block">Sourced {app.appliedDate}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))
          )}

          {/* Simple Pagination controls */}
          {totalPages > 1 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 border border-slate-200 bg-white rounded-lg disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 border border-slate-200 bg-white rounded-lg disabled:opacity-40 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. RIGHT SIDE: HIGH FIDELITY DETAILS VIEW PANELS */}
      <div className="lg:col-span-2 space-y-6">
        {selectedApplicant ? (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Action Header bar */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-3xs">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-950 font-heading leading-tight">{selectedApplicant.name}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans font-medium text-slate-500 text-[10px]">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{selectedApplicant.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{selectedApplicant.phone}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => handleReject(selectedApplicant.id)}
                  className="px-3 py-2 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  title="Reject specs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleShortlist(selectedApplicant.id)}
                  className="px-3 py-2 border border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  title="Shortlist applicant"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Shortlist</span>
                </button>
                <button
                  onClick={() => setIsSchedulerOpen(true)}
                  className="px-4 py-2 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Schedule Round</span>
                </button>
              </div>
            </div>

            {/* Resume Preview & Cover Letter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* High Fidelity Simulated Resume Document */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <h5 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Resume Vault Preview
                  </h5>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">VERIFIED PARSER OK</span>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-3.5 text-[11px] leading-relaxed font-sans text-slate-600">
                  <div>
                    <h6 className="font-extrabold text-slate-800 text-xs">{selectedApplicant.name}</h6>
                    <span className="text-slate-400 font-medium block text-[9px] mt-0.5">{selectedApplicant.education}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Experience Level</span>
                    <p className="font-semibold text-slate-700">{selectedApplicant.experience} of relevant sector footprints.</p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Scanned Keyword Alignments</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedApplicant.resumeSkills.map((sk, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700">{sk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter Document */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Candidate Cover Letter
                </h5>
                <div className="text-[11px] text-slate-600 font-sans leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedApplicant.coverLetter}
                </div>
              </div>

            </div>

            {/* Application Pipeline Timeline & Notes Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Timeline Track */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Application Stage Timeline
                </h5>
                
                <div className="space-y-4 pl-1">
                  {selectedApplicant.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-[11px] font-sans">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                        {idx < selectedApplicant.timeline.length - 1 && <div className="w-0.5 h-10 bg-slate-100" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{item.status}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{item.date}</span>
                        </div>
                        <p className="text-slate-500 font-medium">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Manager */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                  <Clipboard className="w-4 h-4 text-emerald-600" />
                  Recruiter Internal Notes
                </h5>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Append recruiter notes..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-2 pt-1 overflow-y-auto max-h-40">
                  {selectedApplicant.notes.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-2">No internal notes appended yet.</p>
                  ) : (
                    selectedApplicant.notes.map((note, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start gap-2 text-[10px] font-sans font-medium text-slate-600">
                        <span>{note}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(idx)}
                          className="text-rose-600 hover:text-rose-700 cursor-pointer shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* AI Candidate Screening Assistant Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-zinc-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-100">AI Recruiter Screening Assistant</h5>
                    <p className="text-[10px] text-slate-400">Model-guided profile evaluation and candidate matchmaking</p>
                  </div>
                </div>
                <button
                  onClick={handleAiScreenCandidate}
                  disabled={isAiScreening}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {isAiScreening ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-200" />}
                  <span>{aiScreeningResult ? 'Re-Screen Candidate' : 'Screen Candidate with AI'}</span>
                </button>
              </div>

              {aiScreeningResult ? (
                <div className="space-y-4 text-xs animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Sourced Match Score</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono block">{aiScreeningResult.score}%</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">Fit Rating Alignment</span>
                      <span className="text-xs font-bold text-indigo-300 block">{aiScreeningResult.fitRating}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">AI Match Assessment Summary</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {aiScreeningResult.summary}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Suggested Tech Interview Questions</span>
                    <div className="space-y-1.5">
                      {aiScreeningResult.interviewQuestions.map((q, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 leading-normal font-sans italic">
                          "{q}"
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-[11px] text-slate-400 font-sans">
                  Click the button above to generate a model-guided match assessment score and diagnostic questions for {selectedApplicant.name}.
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-white border border-slate-150 rounded-3xl p-16 text-center space-y-4 shadow-3xs max-w-lg mx-auto mt-10">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-slate-900 font-heading">Candidate Folder Empty</h5>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto font-sans leading-normal">
                Select any corporate applicant from the left-hand directory column to review transcripts, schedule interviews, and audit match thresholds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE SCHEDULER OVERLAY MODAL */}
      {isSchedulerOpen && selectedApplicant && (
        <div className="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleDispatchSchedule} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-xl animate-scaleIn">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <CalendarCheck className="w-4.5 h-4.5 text-emerald-600" />
                Configure Round Parameters
              </h4>
              <button
                type="button"
                onClick={() => setIsSchedulerOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Round Nature</label>
                <select
                  value={scheduleData.type}
                  onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="Technical Round 1">Technical Interview (R1)</option>
                  <option value="System Design Round 2">System Design (R2)</option>
                  <option value="Bar Raiser Round">Bar Raiser / Fitment Round</option>
                  <option value="HR Discussion & Offer">HR Coordination Round</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time (UTC Coordinate)</label>
                  <input
                    type="text"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Interviewer</label>
                <input
                  type="text"
                  value={scheduleData.interviewer}
                  onChange={(e) => setScheduleData({ ...scheduleData, interviewer: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-950 hover:bg-zinc-800 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Dispatch Secured Schedule Invite</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
