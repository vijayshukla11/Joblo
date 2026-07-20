import React, { useState, useEffect } from 'react';
import { 
  Bookmark, FileCheck, CheckCircle2, Trash2, ArrowRight, LogOut, User, MapPin, 
  Award, FileText, AlertCircle, Calendar, Briefcase, Video, Settings, Bell, 
  Search, SlidersHorizontal, ChevronRight, ArrowUpRight, ShieldCheck, Mail, Phone, 
  Lock, KeyRound, Eye, RefreshCw, Star, Info, HelpCircle, Activity, Sparkles, X, ChevronLeft, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { candidateActivityService, ApplicationRecord } from '../../services/candidateActivityService';
import { Job, CandidateProfile } from '../../types';
import { jobRepository } from '../../repositories/jobRepository';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState, EmptyState } from '../../components/common/StatusMessages';
import ProfileWizard from './ProfileWizard';

type ActiveTabType = 'overview' | 'applications' | 'saved' | 'notifications' | 'settings';

export default function DashboardPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { user, signOut } = useAuth();
  
  // Dashboard Core State
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Array<ApplicationRecord & { job?: Job }>>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Tab: Saved Jobs state
  const [savedSearch, setSavedSearch] = useState('');
  const [savedFilterLocation, setSavedFilterLocation] = useState('All');
  const [savedPage, setSavedPage] = useState(1);
  const savedItemsPerPage = 4;

  // Tab: Applications detail overlay
  const [selectedApp, setSelectedApp] = useState<(ApplicationRecord & { job?: Job }) | null>(null);

  // Tab: Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      category: 'job_rec',
      title: 'New High-Match Opening Sourced',
      desc: 'An opening matching your Technical Skills for "React Developer" was registered by Tata Consultancy Services.',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 'notif_2',
      category: 'application_update',
      title: 'Application Advanced to Under Review',
      desc: 'Your application coordinates for "Full Stack Architect" has passed automated screening checks.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif_3',
      category: 'interview_invite',
      title: 'Video Interview Schedule Issued',
      desc: 'Wipro HR coordinated an active interview slot for July 26th, 2026. Join link has been provisioned.',
      time: '1 day ago',
      read: false
    },
    {
      id: 'notif_4',
      category: 'career_tips',
      title: 'Resume Optimizations Report Sourced',
      desc: 'Our AI engine recommends adding precise numeric metrics to raise your overall ATS index.',
      time: '3 days ago',
      read: true
    },
    {
      id: 'notif_5',
      category: 'gov_alerts',
      title: 'Sarkari Naukri: NIC Scientific Officer Registry',
      desc: 'National Informatics Centre issued direct recruitment alerts for Scientific Officers. Closing July 30th.',
      time: '4 days ago',
      read: false
    },
    {
      id: 'notif_6',
      category: 'system',
      title: 'DPDP Protection Shield Enabled',
      desc: 'Your registry coordinates have been encrypted using AES-256 standard protocols.',
      time: '1 week ago',
      read: true
    }
  ]);

  // Tab: Settings state variables
  const [settingsForm, setSettingsForm] = useState({
    fullName: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifRec: true,
    notifUpdate: true,
    notifInvite: true,
    notifTips: true,
    notifGov: true,
    notifSys: true,
    privacyPublic: true
  });

  // Recent activity log generator
  const [activityLogs, setActivityLogs] = useState<string[]>([
    'Secure candidate registry session authorized',
    'Automated resume parser matching indices aligned',
    'Profile security checks finalized'
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Load Profile
        const prof = await profileService.getProfile(user.id);
        setProfile(prof);

        // Load Jobs repository
        const jobs = await jobRepository.getJobs();
        setAllJobs(jobs);

        // Load Saved jobs
        const saved = await candidateActivityService.getSavedJobs(user.id);
        setSavedJobs(saved);

        // Load Applications
        const apps = await candidateActivityService.getApplications(user.id);
        setApplications(apps);

        // Setup settings defaults
        if (prof) {
          setSettingsForm(prev => ({
            ...prev,
            fullName: prof.full_name || '',
            phone: prof.phone || '',
            notifRec: prof.settings_notif_recommendations ?? true,
            notifUpdate: prof.settings_notif_updates ?? true,
            notifInvite: prof.settings_notif_invites ?? true,
            notifTips: prof.settings_notif_tips ?? true,
            notifGov: prof.settings_notif_gov_alerts ?? true,
            notifSys: prof.settings_notif_system ?? true,
            privacyPublic: prof.settings_privacy_public ?? true
          }));
        }
      } catch (err) {
        console.error('[DashboardPage] Sourcing error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleRemoveSaved = async (jobId: string) => {
    if (!user) return;
    try {
      const { success } = await candidateActivityService.removeSavedJob(user.id, jobId);
      if (success) {
        setSavedJobs(prev => prev.filter(j => j.id !== jobId));
        setActivityLogs(prev => [`Bookmark for Job ID ${jobId} removed`, ...prev]);
        showFeedback('success', 'Job Bookmark removed successfully.');
      }
    } catch (err) {
      showFeedback('error', 'Failed to remove saved bookmark.');
    }
  };

  const handleCancelApplication = async (appId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const { success } = await candidateActivityService.withdrawApplication(appId);
      if (success) {
        setApplications(prev => prev.filter(app => app.id !== appId));
        setSelectedApp(null);
        setActivityLogs(prev => [`Withdrew active application request (${appId})`, ...prev]);
        showFeedback('success', 'Application withdrawn successfully.');
      }
    } catch (err) {
      showFeedback('error', 'Failed to withdraw application.');
    }
  };

  // Profile completion calculation
  const completionPct = profileService.calculateCompletion(profile);

  // Gating check for FIRST LOGIN flow
  // We gate the dashboard experience until a 100% completed profile is registered.
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-2xl max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-950">Console Access Denied</h2>
          <p className="text-xs text-gray-600 mt-2">Sign in to your candidate account to access active pipelines.</p>
          <button 
            onClick={() => onNavigate('/login')}
            className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Access Login
          </button>
        </div>
      </div>
    );
  }

  // Load Wizard component if not complete
  if (!loading && (!profile || !profile.is_profile_wizard_completed)) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        <SEO 
          title="Onboarding Wizard" 
          description="Complete your multi-step JOB Lo candidate profile wizard." 
          h1Text="Candidate Registry Complete Onboarding"
        />
        <ProfileWizard 
          userId={user.id} 
          userEmail={user.email} 
          onComplete={(updatedProfile) => {
            setProfile(updatedProfile);
            setActivityLogs(prev => ['Completed Onboarding Profile Wizard registry', ...prev]);
          }} 
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Connecting to secure candidate data records..." />;
  }

  // Filtered jobs matching profile skills (Recommendations)
  const userSkills = [...(profile?.skills_technical || []), ...(profile?.skills || [])];
  const recommendedJobs = allJobs.filter(job => {
    // Matches location state/city or role preferences
    const locMatch = profile?.pref_city 
      ? job.location.toLowerCase().includes(profile.pref_city.toLowerCase())
      : true;
    const skillMatch = userSkills.some(skill => 
      job.title.toLowerCase().includes(skill.toLowerCase()) || 
      (job.skills && job.skills.some(t => t.toLowerCase().includes(skill.toLowerCase())))
    );
    return locMatch || skillMatch;
  }).slice(0, 3);

  // Government alerts / Sarkari naukri
  const govtAlerts = [
    { id: 'gov_1', title: 'NIC Scientific Officer / Engineer B', dept: 'National Informatics Centre', openDate: 'Closing 30 Jul 2026', vacancy: '420 Positions', grade: 'Group A (Gazetted)' },
    { id: 'gov_2', title: 'ISRO Technical Assistant (Electronics)', dept: 'Indian Space Research Organisation', openDate: 'Closing 05 Aug 2026', vacancy: '35 Positions', grade: 'Level 7 pay scale' },
    { id: 'gov_3', title: 'BARC Scientific Officer (Nuclear Research)', dept: 'Bhabha Atomic Research Centre', openDate: 'Closing 12 Aug 2026', vacancy: '110 Positions', grade: 'OFS 2026 Batch' }
  ];

  // Saved jobs search and pagination logic
  const filteredSavedJobs = savedJobs.filter(job => {
    const sMatch = job.title.toLowerCase().includes(savedSearch.toLowerCase()) || 
                   job.companyName.toLowerCase().includes(savedSearch.toLowerCase());
    const lMatch = savedFilterLocation === 'All' || job.location.includes(savedFilterLocation);
    return sMatch && lMatch;
  });
  
  const totalSavedPages = Math.ceil(filteredSavedJobs.length / savedItemsPerPage) || 1;
  const paginatedSavedJobs = filteredSavedJobs.slice(
    (savedPage - 1) * savedItemsPerPage,
    savedPage * savedItemsPerPage
  );

  // Notifications filtering by unread
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="pb-16 font-sans bg-slate-50/50 min-h-screen">
      <SEO 
        title="Candidate Console & Active Pipelines" 
        description="Verify your submitted applications, review security encryption logs, and inspect saved technical listings in India." 
        h1Text="JOB Lo Premium Candidate Console"
      />

      <Breadcrumbs items={[{ label: 'Candidate Dashboard', path: '/dashboard' }]} onNavigate={onNavigate} />

      {/* FLOATING FEEDBACK BAR */}
      {feedbackMsg && (
        <div className="max-w-7xl mx-auto px-6 mt-4 animate-fadeIn">
          <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
              : 'bg-rose-50 border-rose-150 text-rose-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        </div>
      )}

      {/* HEADER HERO AREA */}
      <section className="bg-gradient-to-b from-white to-slate-50/50 border-b border-slate-200/80 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
                {profile?.profile_photo ? (
                  <img src={profile.profile_photo} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl font-black text-slate-800">{profile?.full_name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <Check className="w-3 h-3" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-none">
                  {profile?.full_name || user.name}
                </h1>
                <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Registry Integrity: Complete (100%)
                </span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-gray-400 font-sans flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.city}, {profile?.state}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                // Re-trigger wizard if requested or let them edit profile
                setStepOfWizard();
              }}
              className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs font-mono"
            >
              Credentials Registry
            </button>
            
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                await new Promise(r => setTimeout(r, 600));
                await signOut();
                onNavigate('/');
                setIsLoggingOut(false);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD CORE CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        
        {/* SIDEBAR NAVIGATION CONTROLS */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Candidate Registry Portal</h2>
          
          <div className="flex flex-col gap-1.5 font-sans">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'overview' 
                  ? 'bg-zinc-950 text-white font-extrabold' 
                  : 'hover:bg-slate-100 text-gray-500 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4.5 h-4.5" />
                <span>Overview Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'applications' 
                  ? 'bg-zinc-950 text-white font-extrabold' 
                  : 'hover:bg-slate-100 text-gray-500 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4.5 h-4.5" />
                <span>My Applications</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'applications' ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-slate-200 text-slate-800'}`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'saved' 
                  ? 'bg-zinc-950 text-white font-extrabold' 
                  : 'hover:bg-slate-100 text-gray-500 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4.5 h-4.5" />
                <span>Saved Positions</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'saved' ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-slate-200 text-slate-800'}`}>
                {savedJobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'notifications' 
                  ? 'bg-zinc-950 text-white font-extrabold' 
                  : 'hover:bg-slate-100 text-gray-500 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4.5 h-4.5" />
                <span>Sourced Alerts</span>
              </div>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'settings' 
                  ? 'bg-zinc-950 text-white font-extrabold' 
                  : 'hover:bg-slate-100 text-gray-500 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4.5 h-4.5" />
                <span>Settings & Security</span>
              </div>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-zinc-900 to-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-md border border-zinc-800">
            <h4 className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DPDP Shield</span>
            </h4>
            <p className="text-[10px] text-zinc-300 leading-normal font-sans">
              Registry credentials protected under India personal privacy norms. Sourced packets parsed inside localized browser sandboxes.
            </p>
          </div>
        </div>

        {/* MAIN WORKSPACE DETAILS CONTAINER */}
        <div className="lg:col-span-3 space-y-6">

          {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn font-sans">
              
              {/* HEADER DIAGNOSTIC */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-200">
                <span>Credentials Registry Performance indices</span>
                <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Protocol: Sourced V3</span>
              </div>

              {/* 12 polishes high-fidelity cards grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* CARD 1: PROFILE COMPLETION BADGE */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Health Status</span>
                    <Award className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-900 leading-tight">Registry Completeness</h4>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xl font-black font-mono text-emerald-700">{completionPct}%</span>
                      <span className="text-[9px] text-gray-400">Validated</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>

                {/* CARD 2: APPLICATIONS SUMMARY */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Direct Pipelines</span>
                    <FileCheck className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-900 leading-tight">Direct Applications</h4>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xl font-black font-mono text-indigo-700">{applications.length}</span>
                      <span className="text-[9px] text-gray-400">Sourced Channels</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-none">
                    {applications.filter(a => a.status.includes('Scan')).length} cleared screening checks.
                  </p>
                </div>

                {/* CARD 3: SAVED JOBS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Bookmarked</span>
                    <Bookmark className="w-4.5 h-4.5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-gray-900 leading-tight">Saved Opportunities</h4>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xl font-black font-mono text-amber-700">{savedJobs.length}</span>
                      <span className="text-[9px] text-gray-400">Sourced Indices</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-none">
                    Review and finalize submittals dynamically.
                  </p>
                </div>

                {/* CARD 4: RECOMMENDED JOBS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 md:col-span-2 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">AI High-Match Sourced</span>
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-none" />
                  </div>
                  <div className="space-y-2.5">
                    {recommendedJobs.length > 0 ? (
                      recommendedJobs.map(job => (
                        <div key={job.id} className="flex justify-between items-center text-xs">
                          <div>
                            <h5 className="font-extrabold text-gray-950 truncate max-w-[200px]">{job.title}</h5>
                            <span className="text-[10px] text-gray-400">{job.companyName} • {job.location}</span>
                          </div>
                          <button 
                            onClick={() => onNavigate(`/jobs/${job.slug}`)}
                            className="p-1 hover:bg-slate-50 text-indigo-700 text-[10px] font-bold flex items-center gap-1 uppercase"
                          >
                            <span>Trigger</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No exact match found. Update your Technical Skills tags.</p>
                    )}
                  </div>
                </div>

                {/* CARD 5: INTERVIEW INVITATIONS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">HR Invites</span>
                    <Video className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-gray-900 leading-none">Video Interview</h5>
                    <p className="text-[11px] text-emerald-800 font-semibold pt-1">Tata Consultancy Services</p>
                    <div className="text-[9px] text-slate-400 font-mono">Date: 26 Jul, 2026</div>
                  </div>
                  <a 
                    href="https://meet.google.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full text-center py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-150 rounded-lg text-[10px] font-bold block"
                  >
                    Launch Video Room
                  </a>
                </div>

                {/* CARD 6: RESUME ATS SCORE ANALYZER */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">ATS Score Check</span>
                    <Award className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-black text-indigo-900 font-mono">{profile?.resume_ats_score || 84}/100</span>
                      <span className="text-[9px] text-gray-400 font-sans">Index Score</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${profile?.resume_ats_score || 84}%` }} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Optimized for: TypeScript, React Developer, Node.js indices.
                  </p>
                </div>

                {/* CARD 7: LATEST PRIVATE OPENINGS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Fresh Job Sourced</span>
                    <Briefcase className="w-4.5 h-4.5 text-zinc-700" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-gray-950 truncate">Senior Software Architect</h5>
                    <span className="text-[10px] block text-gray-400">Wipro • Bengaluru</span>
                    <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block font-mono mt-1">₹18 - ₹24 LPA</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('/jobs')}
                    className="w-full text-center py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold"
                  >
                    Quick Browse Feed
                  </button>
                </div>

                {/* CARD 8: GOVERNMENT JOBS FEED (SARKARI NAUKRI ALERTS) */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Sarkari Naukri Alerts</span>
                    <ShieldCheck className="w-4.5 h-4.5 text-indigo-700 animate-none" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-indigo-950 truncate">Scientific Officer (Grade B)</h5>
                    <span className="text-[10px] text-gray-400 block">National Informatics Centre</span>
                    <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded inline-block mt-1">420 Open Positions</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('/jobs')}
                    className="w-full text-center py-1.5 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-150 rounded-lg text-[10px] font-bold"
                  >
                    Access Govt Registry
                  </button>
                </div>

                {/* CARD 9: CAREER TIPS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Coach Insights</span>
                    <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-gray-900 leading-tight">Leverage STAR Method</h5>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Structure experience highlights: state Situation, Task, Action, and specific numeric Results.
                    </p>
                  </div>
                </div>

                {/* CARD 10: UPCOMING DEADLINES */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Closing Alerts</span>
                    <Calendar className="w-4.5 h-4.5 text-rose-600" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-gray-900 leading-none">NIC Scientific Officer</h5>
                    <div className="text-[9px] text-rose-600 font-mono font-bold pt-0.5">Closes: 30 Jul, 2026</div>
                    <p className="text-[9px] text-gray-400">Direct application gateway shuts down soon.</p>
                  </div>
                </div>

                {/* CARD 11: QUICK ACTIONS */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Quick Actions</span>
                    <Info className="w-4.5 h-4.5 text-zinc-500" />
                  </div>
                  <div className="space-y-1.5 text-xs flex flex-col pt-1">
                    <button 
                      onClick={() => onNavigate('/ai-interview')} 
                      className="text-left text-[10px] font-extrabold text-indigo-700 hover:underline flex items-center justify-between"
                    >
                      <span>Practice Mock Interview</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')} 
                      className="text-left text-[10px] font-extrabold text-indigo-700 hover:underline flex items-center justify-between"
                    >
                      <span>Configure Notifications</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* CARD 12: RECENT ACTIVITY TIMELINE */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs md:col-span-3 hover:border-slate-350 transition-all">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span>Registry Security Logs</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">Compliance DPDP 2026</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-gray-600">
                    {activityLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* AI CAREER CO-PILOT PROMO CARD */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 border border-emerald-800 p-6 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-2xl animate-pulse" />
                <div className="space-y-2 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Platform Core V2.1 Sourced</span>
                  </span>
                  <h3 className="text-sm font-black tracking-tight">Launch Your Interactive AI Career Co-Pilot</h3>
                  <p className="text-[11px] text-slate-300 max-w-lg leading-relaxed">
                    Test your resume keywords against real ATS score checkers, rehearse real-time mock technical interview rounds with automated AI evaluations, map strategic skills roadmap curves, and build milestone plans.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/ai-career-hub')}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 w-fit font-mono"
                >
                  <span>ACCESS AI TERMINAL</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: MY APPLICATIONS ==================== */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fadeIn font-sans">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-black text-gray-950">Active Applications Tracker</h2>
                  <p className="text-[11px] text-gray-400">Inspect interview coordinates and withdraw dynamic requests.</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Total Sourced: {applications.length}</span>
              </div>

              {applications.length === 0 ? (
                <EmptyState 
                  title="No Sourced Applications Detected"
                  description="Your outbound application pipelines are empty. Browse verified corporate listings and trigger matches."
                  actionText="Browse Corporate Feed"
                  onAction={() => onNavigate('/jobs')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Applications list */}
                  <div className="md:col-span-2 space-y-3">
                    {applications.map(app => {
                      const matched = selectedApp?.id === app.id;
                      return (
                        <div 
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className={`p-4 bg-white border rounded-xl hover:border-slate-350 transition-all cursor-pointer select-none ${
                            matched ? 'border-zinc-900 shadow-xs' : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                              <span className="w-9 h-9 rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {app.job?.companyLogo || "⚡"}
                              </span>
                              <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{app.job?.companyName || "Corporate Partner"}</span>
                                <h4 className="text-xs font-black text-gray-950">{app.job?.title || "Corporate Opening"}</h4>
                                <div className="text-[9px] text-gray-400 font-mono pt-1">Applied: {app.applied_at}</div>
                              </div>
                            </div>

                            <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              {app.stage || "Under Review"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Interactive Detail & Timeline View */}
                  <div className="md:col-span-1">
                    {selectedApp ? (
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 animate-fadeIn sticky top-4">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider">Application Detail</span>
                            <h4 className="text-xs font-black text-gray-950 leading-tight">{selectedApp.job?.title}</h4>
                            <p className="text-[10px] text-gray-400">{selectedApp.job?.companyName}</p>
                          </div>
                          <button 
                            onClick={() => setSelectedApp(null)}
                            className="p-1 hover:bg-slate-50 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* STATUS TIMELINE */}
                        <div className="space-y-3.5">
                          <h5 className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Sourcing Timeline</h5>
                          
                          <div className="relative pl-6 space-y-4 text-[11px] font-sans">
                            {/* Line connecting milestones */}
                            <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-slate-100" />

                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                              <div className="font-bold text-gray-900">Applied Successfully</div>
                              <p className="text-[9px] text-gray-400">Registry coordinates dispatched. Automated check cleared.</p>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-50" />
                              <div className="font-bold text-gray-900">Under Review</div>
                              <p className="text-[9px] text-gray-400">Recruiter reviewing academic credentials.</p>
                            </div>

                            <div className="relative">
                              <div className="absolute -left-[19px] top-0.5 w-2 h-2 rounded-full bg-slate-300" />
                              <div className="font-bold text-gray-400 text-slate-500">Interview Stage</div>
                              <p className="text-[9px] text-gray-400">Wipro video slot coordinated (Pending 26th July).</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <a 
                            href={profile?.resume_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-extrabold text-gray-700 flex items-center justify-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download Resume Sourced</span>
                          </a>

                          <button
                            onClick={() => handleCancelApplication(selectedApp.id)}
                            className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100 border border-rose-150 rounded-xl text-[10px] font-extrabold text-rose-700"
                          >
                            Withdraw Outbound Request
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white space-y-2 text-slate-400">
                        <Info className="w-8 h-8 mx-auto" />
                        <h4 className="text-xs font-bold text-gray-900">No App Selected</h4>
                        <p className="text-[10px] leading-normal">Click any outbound pipeline item to review active milestones.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 3: SAVED POSITIONS ==================== */}
          {activeTab === 'saved' && (
            <div className="space-y-6 animate-fadeIn font-sans">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-black text-gray-950">Bookmarked Listings</h2>
                  <p className="text-[11px] text-gray-400">Filter and trigger direct applications.</p>
                </div>
                
                {/* SEARCH & FILTERS PANEL */}
                <div className="flex gap-2 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={savedSearch}
                      onChange={(e) => setSavedSearch(e.target.value)}
                      placeholder="Search company..."
                      className="pl-8 pr-3 py-1.5 text-[10px] border border-slate-200 rounded-lg focus-ring font-semibold"
                    />
                  </div>

                  <select 
                    value={savedFilterLocation}
                    onChange={(e) => setSavedFilterLocation(e.target.value)}
                    className="px-2 py-1 text-[10px] border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="All">All Locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {filteredSavedJobs.length === 0 ? (
                <EmptyState 
                  title="No Bookmarks Registered"
                  description="No matches fit your search filters. Clear tags or explore direct openings."
                  actionText="Clear Filters"
                  onAction={() => {
                    setSavedSearch('');
                    setSavedFilterLocation('All');
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paginatedSavedJobs.map(job => (
                      <div 
                        key={job.id}
                        className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs relative hover:border-slate-350 transition"
                      >
                        <button 
                          onClick={() => handleRemoveSaved(job.id)}
                          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex gap-3 items-start pr-8">
                          <span className="w-10 h-10 bg-zinc-950 text-white flex items-center justify-center font-bold text-xs rounded-xl shrink-0">
                            {job.companyLogo}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{job.companyName}</span>
                            <h4 className="text-xs font-black text-gray-900 leading-tight truncate max-w-[150px]">{job.title}</h4>
                            <div className="flex gap-2 items-center text-[10px] text-gray-400 pt-1">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold">{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">{job.employmentType}</span>
                          <button 
                            onClick={() => onNavigate(`/jobs/${job.slug}`)}
                            className="px-3 py-1 bg-black text-white font-extrabold rounded-lg hover:bg-zinc-800 transition"
                          >
                            Details & Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SAVED PAGINATION BAR */}
                  {totalSavedPages > 1 && (
                    <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                      <button 
                        disabled={savedPage === 1}
                        onClick={() => setSavedPage(prev => Math.max(prev - 1, 1))}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-50 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-bold text-gray-500 font-mono">Page {savedPage} of {totalSavedPages}</span>
                      <button 
                        disabled={savedPage === totalSavedPages}
                        onClick={() => setSavedPage(prev => Math.min(prev + 1, totalSavedPages))}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-50 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 4: SOURCED ALERTS ==================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn font-sans">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h2 className="text-base font-black text-gray-950">Verified Alerts Feed</h2>
                  <p className="text-[11px] text-gray-400">Read live alerts dispatched by corporate bots.</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    showFeedback('success', 'All alerts registered as read.');
                  }}
                  className="text-[10px] text-indigo-700 hover:underline font-extrabold cursor-pointer"
                >
                  Clear Unreads
                </button>
              </div>

              {notifications.length === 0 ? (
                <EmptyState 
                  title="No Alerts Registered"
                  description="Your feed is clear. Automated monitors are watching matching corporate portals."
                />
              ) : (
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id}
                      className={`p-4 rounded-xl border transition-all ${
                        notif.read ? 'bg-white border-slate-200' : 'bg-emerald-50/40 border-emerald-150'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <h4 className="text-xs font-black text-gray-950 leading-tight">{notif.title}</h4>
                            <span className="text-[9px] text-gray-400 font-mono shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-normal">{notif.desc}</p>
                          
                          <div className="pt-2 flex justify-between items-center text-[9px] font-mono">
                            <span className="uppercase text-slate-400">Class: {notif.category}</span>
                            {!notif.read && (
                              <button 
                                onClick={() => {
                                  setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                }}
                                className="text-emerald-700 font-bold hover:underline"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 5: SETTINGS & SECURITY ==================== */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-6 animate-fadeIn font-sans">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-gray-950">Security & Sourcing Settings</h2>
                <p className="text-xs text-gray-400 font-sans">Manage database replication variables, password registries, and notification criteria.</p>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Personal Coordinates</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Legal Name</label>
                    <input 
                      type="text" 
                      value={settingsForm.fullName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-ring font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Phone Coordinates</label>
                    <input 
                      type="text" 
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-ring font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Password Registry Security */}
              <div className="space-y-4 border-t border-slate-50 pt-5 font-sans">
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>Update Cryptographic Password</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Current Password</label>
                    <input 
                      type="password" 
                      value={settingsForm.currentPassword}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">New Password</label>
                    <input 
                      type="password" 
                      value={settingsForm.newPassword}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase block">Confirm Password</label>
                    <input 
                      type="password" 
                      value={settingsForm.confirmPassword}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Categories preferences */}
              <div className="space-y-4 border-t border-slate-50 pt-5 font-sans">
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>Sourced Alert Preferences</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Job Recommendations Alert Packet</span>
                    <input 
                      type="checkbox" 
                      checked={settingsForm.notifRec} 
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifRec: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="font-semibold text-gray-700">Application Updates Timeline Signals</span>
                    <input 
                      type="checkbox" 
                      checked={settingsForm.notifUpdate} 
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifUpdate: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="font-semibold text-gray-700">Video Interview Invites Dispatch</span>
                    <input 
                      type="checkbox" 
                      checked={settingsForm.notifInvite} 
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifInvite: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="font-semibold text-gray-700">Curated Career Growth Tips</span>
                    <input 
                      type="checkbox" 
                      checked={settingsForm.notifTips} 
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifTips: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <span className="font-semibold text-gray-700">Sarkari Naukri (Govt Job) Sourced Bulletins</span>
                    <input 
                      type="checkbox" 
                      checked={settingsForm.notifGov} 
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, notifGov: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy section */}
              <div className="space-y-4 border-t border-slate-50 pt-5 font-sans">
                <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Privacy Shield</span>
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">Public Profile Directory Registry</span>
                    <p className="text-[10px] text-gray-400">Let corporate direct recruiters query your verified credentials index.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settingsForm.privacyPublic} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, privacyPublic: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer shrink-0"
                  />
                </div>
              </div>

              {/* SAVE ACTION */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-6 font-sans">
                {/* Delete Account placeholder */}
                <button 
                  onClick={() => {
                    if (window.confirm('WARNING: Deleting candidate record permanently purges all encrypted local cache and active outbound files. Continue?')) {
                      showFeedback('error', 'Simulator Account purged. Rerouting...');
                      setTimeout(() => window.location.reload(), 1500);
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Delete Account Registry
                </button>

                <button
                  onClick={async () => {
                    if (!profile) return;
                    setLoading(true);
                    try {
                      const updated: CandidateProfile = {
                        ...profile,
                        full_name: settingsForm.fullName,
                        phone: settingsForm.phone,
                        settings_notif_recommendations: settingsForm.notifRec,
                        settings_notif_updates: settingsForm.notifUpdate,
                        settings_notif_invites: settingsForm.notifInvite,
                        settings_notif_tips: settingsForm.notifTips,
                        settings_notif_gov_alerts: settingsForm.notifGov,
                        settings_privacy_public: settingsForm.privacyPublic
                      };
                      await profileService.saveProfile(updated);
                      setProfile(updated);
                      setActivityLogs(prev => ['Registry coordinates synchronized with local storage', ...prev]);
                      showFeedback('success', 'Candidate security preferences finalized.');
                    } catch {
                      showFeedback('error', 'Replication lock error.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-xl text-xs cursor-pointer select-none"
                >
                  Save Settings
                </button>
              </div>

            </div>
          )}

        </div>

      </section>

      {/* SECURING LOADER OVERLAY */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center animate-fadeIn">
          <div className="flex flex-col items-center gap-4 p-8 bg-white border border-slate-150 rounded-2xl shadow-xl max-w-sm text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-gray-900 leading-none">Securing Your Session</h3>
              <p className="text-[11px] text-gray-400">Clearing local buffer files and signing out from JOB Lo...</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  function setStepOfWizard() {
    if (profile) {
      setProfile({
        ...profile,
        is_profile_wizard_completed: false
      });
    }
  }
}
