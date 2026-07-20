import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Bot, Send, Loader2, Award, ClipboardCheck, Compass, Briefcase,
  TrendingUp, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, FileText,
  Search, BookOpen, Star, ArrowRight, User, HelpCircle, Activity, Play, Check, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../../ai/services/aiService';
import { aiAnalytics } from '../../ai/utils/rateLimiter';
import {
  ParsedResume,
  ATSReport,
  OptimizedResume,
  SkillGapReport,
  CareerRoadmap,
  InterviewQuestion,
  InterviewEvaluation,
  AIChatMessage
} from '../../ai/types';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface AICareerHubPageProps {
  onNavigate: (path: string) => void;
}

type AISectionTab = 'chatbot' | 'parser' | 'ats' | 'interview' | 'skillgap' | 'roadmap' | 'analytics';

export default function AICareerHubPage({ onNavigate }: AICareerHubPageProps) {
  const [activeTab, setActiveTab] = useState<AISectionTab>('chatbot');

  // Common UI indicators
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Chatbot Counselor State
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Hello! I am your JOB Lo AI Counselor. Ask me about careers, salaries, resume enhancements, interview preparation, or mock roadmaps!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 2. Resume Parser & Optimizer State
  const [rawResumeText, setRawResumeText] = useState('');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);

  // 3. ATS Alignment State
  const [atsResumeText, setAtsResumeText] = useState('');
  const [atsJobDesc, setAtsJobDesc] = useState('');
  const [atsReport, setAtsReport] = useState<ATSReport | null>(null);

  // 4. Interview Coach State
  const [targetJobTitle, setTargetJobTitle] = useState('React Frontend Developer');
  const [coachDifficulty, setCoachDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewEvaluations, setInterviewEvaluations] = useState<Record<string, InterviewEvaluation>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  // 5. Skill Gap State
  const [currentSkillsInput, setCurrentSkillsInput] = useState('HTML, CSS, basic JavaScript');
  const [targetRoleInput, setTargetRoleInput] = useState('Senior React Developer');
  const [skillGapReport, setSkillGapReport] = useState<SkillGapReport | null>(null);

  // 6. Career Roadmap State
  const [roadmapRole, setRoadmapRole] = useState('Full Stack Software Architect');
  const [roadmapMonths, setRoadmapMonths] = useState(12);
  const [careerRoadmap, setCareerRoadmap] = useState<CareerRoadmap | null>(null);

  // 7. Analytics/Logs State
  const [analyticsStats, setAnalyticsStats] = useState(aiAnalytics.getStats());

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Synchronize analytics whenever tab is visited
  useEffect(() => {
    if (activeTab === 'analytics') {
      setAnalyticsStats(aiAnalytics.getStats());
    }
  }, [activeTab, isGenerating]);

  // Reset errors on tab change
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [activeTab]);

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // 1. Chatbot Counselor submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    const newUserMsg: AIChatMessage = {
      id: `chat-${Date.now()}-user`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsGenerating(true);

    try {
      const response = await aiService.chatAssistant(userText, chatMessages);
      const newBotMsg: AIChatMessage = {
        id: `chat-${Date.now()}-bot`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newBotMsg]);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Chatbot execution failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Parser & Optimizer Submission
  const handleParseAndOptimize = async () => {
    if (!rawResumeText.trim()) {
      setErrorMessage('Please paste or enter some resume text first.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const parsed = await aiService.parseResume(rawResumeText);
      const optimized = await aiService.optimizeResume(rawResumeText);
      
      setParsedResume(parsed);
      setOptimizedResume(optimized);
      setSuccessMessage('AI analysis complete! Review extracted sections and optimized metrics below.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to analyze resume.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. ATS Alignment Submission
  const handleAtsAlignmentCheck = async () => {
    if (!atsResumeText.trim() || !atsJobDesc.trim()) {
      setErrorMessage('Please fill in both your Resume content and the target Job Description.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const report = await aiService.analyzeATS(atsResumeText, atsJobDesc);
      setAtsReport(report);
      setSuccessMessage('ATS scanner completed diagnostics safely!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete ATS checking.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 4. Interview Coach Actions
  const handleStartInterview = async () => {
    if (!targetJobTitle.trim()) {
      setErrorMessage('Please type a job title to target.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setInterviewQuestions([]);
    setInterviewEvaluations({});
    setCurrentQuestionIdx(0);

    try {
      const questions = await aiService.generateInterviewQuestions(targetJobTitle, coachDifficulty);
      setInterviewQuestions(questions);
      setSuccessMessage(`Interview simulator launched! Complete ${questions.length} custom-generated questions.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate questions.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!candidateAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    setErrorMessage(null);

    const activeQuestion = interviewQuestions[currentQuestionIdx];
    try {
      const evalReport = await aiService.evaluateInterviewAnswer(activeQuestion.text, candidateAnswer);
      setInterviewEvaluations(prev => ({
        ...prev,
        [activeQuestion.id]: evalReport
      }));
      setCandidateAnswer('');
      setSuccessMessage('Answer evaluated successfully! Read your feedback below.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Evaluation error occurred.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 5. Skill Gap Submission
  const handleSkillGapAnalysis = async () => {
    if (!currentSkillsInput.trim() || !targetRoleInput.trim()) {
      setErrorMessage('Specify current skills and target role.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setSkillGapReport(null);

    try {
      const skillsArray = currentSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const report = await aiService.analyzeSkillGap(skillsArray, targetRoleInput);
      setSkillGapReport(report);
      setSuccessMessage('Skill mismatch vectors calculated!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Analysis failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 6. Career Roadmap Submission
  const handleBuildCareerRoadmap = async () => {
    if (!roadmapRole.trim()) {
      setErrorMessage('Please state your target career role.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setCareerRoadmap(null);

    try {
      const map = await aiService.generateCareerRoadmap(roadmapRole, roadmapMonths);
      setCareerRoadmap(map);
      setSuccessMessage('Strategic Career Path milestones configured successfully!');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Roadmap configuration failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pb-16 font-sans min-h-screen bg-slate-50/30">
      <SEO
        title="AI Career Hub Terminal"
        description="Unified portal for AI resume optimizations, ATS metrics, mock interview loops, and strategic learning roadmaps."
        h1Text="JOB Lo AI Carrier Hub Platform"
      />

      <Breadcrumbs items={[{ label: 'AI Career Hub', path: '/ai-career-hub' }]} onNavigate={onNavigate} />

      {/* TOP HEADER STATUS */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-12 px-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl" />
        <div className="max-w-7xl mx-auto space-y-3 px-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOB Lo AI Platform Core</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-bold text-indigo-300 uppercase tracking-wider">
              Mode: {aiService.getProviderType() === 'GEMINI' ? '✨ Gemini Live SDK' : '⚡ Local High-Fidelity'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI Career Co-Pilot Terminal
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Leverage enterprise-grade career diagnostics to parse resumes, test against corporate applicant filters, build learning curves, and practice mock interviews.
          </p>
        </div>
      </section>

      {/* GLOBAL NOTIFICATIONS */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-rose-50 border border-rose-150 text-rose-800 rounded-xl text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT COLUMN: TABS PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">
            <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2.5 mb-2">AI MODULE MATRIX</h2>
            
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'chatbot'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bot className="w-4.5 h-4.5 shrink-0" />
              <span>AI Chat Counselor</span>
            </button>

            <button
              onClick={() => setActiveTab('parser')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'parser'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4.5 h-4.5 shrink-0" />
              <span>Parser & Optimizer</span>
            </button>

            <button
              onClick={() => setActiveTab('ats')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'ats'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ClipboardCheck className="w-4.5 h-4.5 shrink-0" />
              <span>ATS Alignment Test</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'interview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4.5 h-4.5 shrink-0" />
              <span>Mock Interview Coach</span>
            </button>

            <button
              onClick={() => setActiveTab('skillgap')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'skillgap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4.5 h-4.5 shrink-0" />
              <span>Skill Gap Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'roadmap'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4.5 h-4.5 shrink-0" />
              <span>Strategic Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4.5 h-4.5 shrink-0" />
              <span>Usage Telemetry</span>
            </button>
          </div>

          {/* DYNAMIC SHIELD PANEL */}
          <div className="bg-slate-950 text-slate-400 border border-slate-800 p-5 rounded-2xl space-y-3.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>DPDP Compliance Lock</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Your data remains safe. Core queries and documents are processed under AES-256 standard encryption keys. No training models are cached on third-party servers.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE ACTIVE VIEW */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* 1. AI CHATBOT TAB */}
            {activeTab === 'chatbot' && (
              <motion.div
                key="chatbot"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[580px]"
              >
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-150 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-none">Interactive Career Coach</h3>
                      <p className="text-[10px] text-gray-400 mt-1">Ready for general counseling & guidance</p>
                    </div>
                  </div>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                  {chatMessages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'justify-end ml-auto' : ''}`}>
                      {msg.sender === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <Bot className="w-4.5 h-4.5" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                            : 'bg-white border border-slate-250 text-gray-800 rounded-tl-none shadow-3xs'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="block text-[9px] text-gray-400 text-right px-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex gap-3 max-w-2xl">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2.5 shadow-3xs">
                        <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span className="text-3xs text-gray-400 font-mono">Drafting customized strategic advice...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Footer Input */}
                <form onSubmit={handleChatSubmit} className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isGenerating}
                    placeholder="Type a career concern (e.g., How do I negotiate starting salary at HDFC Mumbai?)"
                    className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-250 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !chatInput.trim()}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* 2. RESUME PARSER & OPTIMIZER TAB */}
            {activeTab === 'parser' && (
              <motion.div
                key="parser"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900">AI Resume Parser & Optimizer Vault</h3>
                  <p className="text-xs text-gray-400 mt-1">Convert raw resume text into standardized profile attributes and improve content alignment.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block">PASTE RESUME TEXT</label>
                  <textarea
                    rows={6}
                    value={rawResumeText}
                    onChange={(e) => setRawResumeText(e.target.value)}
                    placeholder="Paste full text from your PDF or DOCX file (e.g., Priya Nair, Delhi University, Skills: Excel, Python...)"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-xl outline-none text-gray-800 transition-all"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">STAR impact framework enabled</span>
                    <button
                      onClick={handleParseAndOptimize}
                      disabled={isGenerating}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-200" />}
                      <span>Optimize Profile</span>
                    </button>
                  </div>
                </div>

                {parsedResume && optimizedResume && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {/* Parsed Attributes */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                        <User className="w-4.5 h-4.5 text-indigo-600" />
                        <span>Standardized Attributes</span>
                      </h4>
                      <div className="space-y-3 text-xs bg-slate-50/50 p-4 rounded-xl">
                        <div>
                          <span className="text-gray-400 font-semibold block">Full Name:</span>
                          <span className="text-gray-800 font-bold">{parsedResume.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block">Academic Base:</span>
                          <span className="text-gray-800 font-bold">
                            {parsedResume.education?.[0]?.institution} ({parsedResume.education?.[0]?.degree})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block">Identified Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {parsedResume.skills?.map((sk, i) => (
                              <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Optimizer Results */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                        <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                        <span>STAR Optimization Suggestions</span>
                      </h4>
                      <div className="space-y-3 bg-emerald-50/20 border border-emerald-100/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-xs text-gray-500 font-bold">Estimated ATS Score:</span>
                          <span className="text-sm font-extrabold text-emerald-700 font-mono">
                            {optimizedResume.originalScore}% → {optimizedResume.optimizedScore}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold block text-xs mb-1">Optimized Summary Preview:</span>
                          <p className="text-[11px] text-gray-700 leading-relaxed italic">
                            "{optimizedResume.professionalSummary}"
                          </p>
                        </div>
                        <div className="space-y-2 border-t border-emerald-100/30 pt-2.5">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase">IMPROVED PHRASINGS</span>
                          {optimizedResume.improvedBulletPoints?.map((bp, idx) => (
                            <div key={idx} className="space-y-1">
                              <span className="line-through text-gray-400 block text-[10px]">"{bp.original}"</span>
                              <span className="text-gray-800 font-bold block text-xs">"✨ {bp.improved}"</span>
                              <span className="text-[9px] text-emerald-600 block italic">({bp.impactExplanation})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. ATS ALIGNMENT TAB */}
            {activeTab === 'ats' && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900">ATS Alignment Diagnostics</h3>
                  <p className="text-xs text-gray-400 mt-1">Cross-examine your resume against any active corporate job description to locate gaps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">YOUR RESUME CONTENTS</label>
                    <textarea
                      rows={5}
                      value={atsResumeText}
                      onChange={(e) => setAtsResumeText(e.target.value)}
                      placeholder="Paste your active resume keywords here..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">TARGET JOB DESCRIPTION</label>
                    <textarea
                      rows={5}
                      value={atsJobDesc}
                      onChange={(e) => setAtsJobDesc(e.target.value)}
                      placeholder="Paste the target job description or core requirements lists..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAtsAlignmentCheck}
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardCheck className="w-4 h-4 text-emerald-200" />}
                    <span>Compare Alignment</span>
                  </button>
                </div>

                {atsReport && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">COMPATIBILITY SCORES</h4>
                        <span className="text-[10px] text-gray-500 font-mono mt-1 block">{atsReport.industryCompatibility}</span>
                      </div>
                      <div className="flex gap-4 mt-2 sm:mt-0">
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">ATS Score</span>
                          <span className="text-xl font-extrabold text-emerald-700 font-mono">{atsReport.score}%</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">Density Fit</span>
                          <span className="text-xl font-extrabold text-indigo-700 font-mono">{atsReport.matchPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-2">
                        <h5 className="font-bold text-gray-800 uppercase text-[10px] tracking-wide">Keyword Overlap Analysis</h5>
                        <div className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
                          <div>
                            <span className="text-emerald-700 font-bold text-3xs block uppercase mb-1">Matched Keywords:</span>
                            <div className="flex flex-wrap gap-1">
                              {atsReport.keywordMatch.matched.map((m, idx) => (
                                <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-semibold border border-emerald-100">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-slate-55 pb-1 mt-2.5 pt-2">
                            <span className="text-rose-700 font-bold text-3xs block uppercase mb-1">Missing Sourced Keywords:</span>
                            <div className="flex flex-wrap gap-1">
                              {atsReport.keywordMatch.missing.map((m, idx) => (
                                <span key={idx} className="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded font-semibold border border-rose-100">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-bold text-gray-800 uppercase text-[10px] tracking-wide">Formatting & Optimizing Recommendations</h5>
                        <div className="space-y-2.5 bg-white p-3.5 border border-slate-200 rounded-xl">
                          <div>
                            <span className="text-gray-400 font-bold text-3xs block uppercase">Identified Gaps:</span>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700">
                              {atsReport.resumeWeaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-gray-400 font-bold text-3xs block uppercase mt-2">Actionable Suggestions:</span>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700">
                              {atsReport.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. INTERVIEW COACH TAB */}
            {activeTab === 'interview' && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900">Interactive Interview Coach</h3>
                  <p className="text-xs text-gray-400 mt-1">Simulate authentic corporate technical rounds and receive instant feedback evaluations with confidence scoring.</p>
                </div>

                {interviewQuestions.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-250 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-extrabold text-slate-400 block">TARGET ROLE</label>
                      <input
                        type="text"
                        value={targetJobTitle}
                        onChange={(e) => setTargetJobTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend React 19 Developer"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-extrabold text-slate-400 block">DIFFICULTY</label>
                      <select
                        value={coachDifficulty}
                        onChange={(e: any) => setCoachDifficulty(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                      >
                        <option value="Easy">Easy Level</option>
                        <option value="Medium">Medium Level</option>
                        <option value="Hard">Hard Level</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        onClick={handleStartInterview}
                        disabled={isGenerating}
                        className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
                      >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />}
                        <span>Launch Simulation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Active Question Panel */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-3.5 py-1 text-3xs font-bold uppercase bg-emerald-500 text-slate-900 rounded-bl-lg">
                        QUESTION {currentQuestionIdx + 1} OF {interviewQuestions.length}
                      </div>
                      <div className="space-y-2 mt-2">
                        <span className="inline-flex text-[9px] font-bold bg-zinc-800 text-slate-300 border border-zinc-700 px-2 py-0.5 rounded-full uppercase">
                          {interviewQuestions[currentQuestionIdx].type}
                        </span>
                        <h4 className="text-sm font-bold leading-relaxed pr-16">
                          "{interviewQuestions[currentQuestionIdx].text}"
                        </h4>
                      </div>
                    </div>

                    {/* Answer Input */}
                    <div className="space-y-3.5">
                      <label className="text-[10px] font-extrabold text-slate-400 block">YOUR DETAILED RESPONSE</label>
                      <textarea
                        rows={4}
                        value={candidateAnswer}
                        onChange={(e) => setCandidateAnswer(e.target.value)}
                        placeholder="Type your answer using exact technical vocabulary or the STAR framework..."
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-xl outline-none"
                      />

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            if (currentQuestionIdx > 0) {
                              setCurrentQuestionIdx(currentQuestionIdx - 1);
                              setCandidateAnswer('');
                            }
                          }}
                          disabled={currentQuestionIdx === 0}
                          className="px-3.5 py-2 text-xs font-bold text-gray-500 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 cursor-pointer"
                        >
                          Back
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={handleEvaluateAnswer}
                            disabled={isEvaluating || !candidateAnswer.trim()}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-4 h-4 text-emerald-200" />}
                            <span>Submit & Evaluate</span>
                          </button>
                          
                          {currentQuestionIdx < interviewQuestions.length - 1 && (
                            <button
                              onClick={() => {
                                setCurrentQuestionIdx(currentQuestionIdx + 1);
                                setCandidateAnswer('');
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Next Question
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feedback report for current question */}
                    {interviewEvaluations[interviewQuestions[currentQuestionIdx].id] && (
                      <div className="bg-emerald-50/20 border border-emerald-150 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                          <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">EVALUATION METRICS</h5>
                          <div className="flex gap-4">
                            <span className="text-[10px] text-gray-400">Score: <strong className="text-emerald-700">{interviewEvaluations[interviewQuestions[currentQuestionIdx].id].score}%</strong></span>
                            <span className="text-[10px] text-gray-400">Confidence: <strong className="text-indigo-700">{interviewEvaluations[interviewQuestions[currentQuestionIdx].id].confidenceScore}%</strong></span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed italic">
                          "{interviewEvaluations[interviewQuestions[currentQuestionIdx].id].feedback}"
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                          <div>
                            <span className="text-emerald-700 font-bold uppercase text-[9px] tracking-wide block">PROS IN YOUR ANSWER</span>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-600">
                              {interviewEvaluations[interviewQuestions[currentQuestionIdx].id].positives.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="text-indigo-700 font-bold uppercase text-[9px] tracking-wide block">RECOMMENDED IMPROVEMENTS</span>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-600">
                              {interviewEvaluations[interviewQuestions[currentQuestionIdx].id].improvements.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. SKILL GAP ANALYZER TAB */}
            {activeTab === 'skillgap' && (
              <motion.div
                key="skillgap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900">Skill Gap Diagnostics</h3>
                  <p className="text-xs text-gray-400 mt-1">Test your current capabilities against target benchmarks and identify missing credentials or courses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">CURRENT SKILLS LIST</label>
                    <input
                      type="text"
                      value={currentSkillsInput}
                      onChange={(e) => setCurrentSkillsInput(e.target.value)}
                      placeholder="e.g. React, CSS, basic Git (comma-separated)"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">TARGET CAREER ROLE</label>
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={(e) => setTargetRoleInput(e.target.value)}
                      placeholder="e.g. Lead Full-Stack Architect"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSkillGapAnalysis}
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-4 h-4 text-emerald-200" />}
                    <span>Map Gap Vectors</span>
                  </button>
                </div>

                {skillGapReport && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">GAP MATRIX RESULTS</h4>
                        <span className="text-[10px] text-gray-500 mt-1 block">Mapping gaps to become <strong>{skillGapReport.targetJobTitle}</strong></span>
                      </div>
                      <div className="flex gap-4 mt-2 sm:mt-0 font-mono text-xs">
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">Curve Difficulty</span>
                          <span className="text-sm font-extrabold text-indigo-700 uppercase">{skillGapReport.difficulty}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">Est. Learning Time</span>
                          <span className="text-sm font-extrabold text-emerald-700">{skillGapReport.estimatedLearningTimeWeeks} Weeks</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Missing skills & Courses */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1.5">Identified Gap Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {skillGapReport.missingSkills.map((sk, idx) => (
                              <span key={idx} className="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded font-semibold border border-rose-100">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1.5">Recommended Standard Curriculums</span>
                          <div className="space-y-2">
                            {skillGapReport.recommendedCourses.map((c, i) => (
                              <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                                <h6 className="font-extrabold text-gray-900">{c.title}</h6>
                                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                  <span>{c.provider} • {c.duration}</span>
                                  <span className="text-emerald-700 font-semibold">{c.price}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Learning curve roadmap timeline */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Curated Progression Roadmap</span>
                        <div className="relative border-l border-emerald-200 ml-2.5 pl-4 space-y-4">
                          {skillGapReport.learningRoadmap.map((p, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-white border border-emerald-500" />
                              <div className="space-y-1">
                                <span className="font-extrabold text-slate-800 block leading-tight">{p.phase} ({p.duration})</span>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                  Focus on: {p.topics.join(', ')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. CAREER ROADMAP TAB */}
            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900">Career Roadmap Builder</h3>
                  <p className="text-xs text-gray-400 mt-1">Design a modular, step-by-step 12-to-24 month milestone progression map detailing projects, qualifications, and salary growths.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">DESIRED END-GAME ROLE</label>
                    <input
                      type="text"
                      value={roadmapRole}
                      onChange={(e) => setRoadmapRole(e.target.value)}
                      placeholder="e.g. Lead Machine Learning Architect"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-slate-400 block">TIMEFRAME SPAN</label>
                    <select
                      value={roadmapMonths}
                      onChange={(e: any) => setRoadmapMonths(parseInt(e.target.value))}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-250 focus:border-emerald-500 rounded-lg outline-none"
                    >
                      <option value="6">6 Month Plan</option>
                      <option value="12">12 Month Plan</option>
                      <option value="24">24 Month Plan</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleBuildCareerRoadmap}
                    disabled={isGenerating}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-4 h-4 text-emerald-200" />}
                    <span>Map Milestones</span>
                  </button>
                </div>

                {careerRoadmap && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">STRATEGIC CAREER PLAN</h4>
                        <span className="text-sm font-extrabold text-gray-900 mt-0.5 block">{careerRoadmap.targetRole} ({careerRoadmap.timeframeMonths} Mo.)</span>
                      </div>
                      <div className="bg-white p-3 border border-slate-200 rounded-xl flex items-center gap-4 text-center text-xs mt-2.5 sm:mt-0 font-mono">
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold uppercase">Baseline Package</span>
                          <span className="text-emerald-700 font-extrabold">{careerRoadmap.salaryGrowthEstimate.current}</span>
                        </div>
                        <div className="text-gray-300">|</div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-bold uppercase">Estimated Peak</span>
                          <span className="text-indigo-700 font-extrabold">{careerRoadmap.salaryGrowthEstimate.final}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {careerRoadmap.phases?.map((p, idx) => (
                        <div key={idx} className="bg-white p-4 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Left Column: Title / Duration */}
                          <div className="space-y-1.5 border-r border-slate-100 pr-4">
                            <span className="text-3xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                              {p.duration}
                            </span>
                            <h5 className="font-extrabold text-gray-900">{p.title}</h5>
                            <div>
                              <span className="text-[9px] text-gray-400 font-bold block uppercase mt-2">TARGET CERTIFICATIONS:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.certifications?.map((c, i) => (
                                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Middle Column: Skills */}
                          <div className="space-y-1.5 border-r border-slate-100 pr-4">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">CORE SUBJECT MATTERS</span>
                            <div className="flex flex-wrap gap-1.5">
                              {p.requiredSkills?.map((s, i) => (
                                <span key={i} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-semibold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Right Column: Custom Projects */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">CURATED CV PROJECT PROTOTYPE</span>
                            {p.projects?.map((proj, i) => (
                              <div key={i} className="space-y-1 bg-slate-50/50 p-2.5 border border-slate-100 rounded-lg">
                                <h6 className="font-extrabold text-gray-800 text-[11px]">{proj.title}</h6>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{proj.desc}</p>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {proj.tech.map((t, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 7. USAGE TELEMETRY / ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">AI Request Usage & Telemetry</h3>
                    <p className="text-xs text-gray-400 mt-1">Real-time performance checks and monitoring log auditing for compliance regulations.</p>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('joblo_ai_analytics_v1');
                      setAnalyticsStats(aiAnalytics.getStats());
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 text-xs rounded border border-rose-100 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear logs</span>
                  </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">TOTAL DISPATCHED CHECKS</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono block mt-1">{analyticsStats.totalRequests}</span>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">AVERAGE LATENCY</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono block mt-1">{analyticsStats.avgResponseTimeMs}ms</span>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-center">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">COMPLIANCE SUCCESS RATE</span>
                    <span className="text-2xl font-extrabold text-slate-900 font-mono block mt-1">{analyticsStats.successRate}%</span>
                  </div>
                </div>

                {/* Real-time Logs List */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">AUDIT REGISTER (LAST 20 EVENTS)</span>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[350px] overflow-y-auto">
                    {analyticsStats.logs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400">
                        No transactions logged yet. Run any of the tabs above to create records.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-150">
                            <th className="p-3">Module</th>
                            <th className="p-3">Prompt Sourced</th>
                            <th className="p-3">Time</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analyticsStats.logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-bold text-gray-900">{log.module}</td>
                              <td className="p-3 text-gray-500 truncate max-w-[200px]">"{log.prompt}"</td>
                              <td className="p-3 font-mono text-gray-400">{log.responseTimeMs}ms</td>
                              <td className="p-3">
                                {log.success ? (
                                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">SUCCESS</span>
                                ) : (
                                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">FAILED</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
