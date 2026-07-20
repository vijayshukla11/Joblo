import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, Users, Building2, Settings as SettingsIcon, Bell, CheckCircle2, ShieldAlert } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OverviewTab from './employer/OverviewTab';
import CompanyProfileTab from './employer/CompanyProfileTab';
import JobManagementTab from './employer/JobManagementTab';
import ApplicantsTab from './employer/ApplicantsTab';
import SettingsTab from './employer/SettingsTab';
import CompanySetupWizard from './employer/CompanySetupWizard';
import { employerService } from '../../services/employerService';
import { CompanyProfile, Job, Applicant } from '../../types';

interface EmployerDashboardPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export default function EmployerDashboardPage({ onNavigate, id }: EmployerDashboardPageProps) {
  // Company state
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Dynamic collections to keep overview metrics in sync in memory
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);
  const [activitiesList, setActivitiesList] = useState<{ id: string; text: string; time: string }[]>([]);

  // Outer triggers for Job actions (e.g. create direct from Overview action card)
  const [jobAction, setJobAction] = useState<{ type: 'create' | 'edit' | 'preview'; jobId?: string } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Fetch initial datasets
  const loadData = async () => {
    try {
      const cmpProfile = await employerService.getCompanyProfile();
      setProfile(cmpProfile);

      const jobs = await employerService.getJobs();
      setJobsList(jobs);

      const applicants = await employerService.getApplicants();
      setApplicantsList(applicants);

      const activities = await employerService.getActivities();
      setActivitiesList(activities);
    } catch (e) {
      console.error('[EmployerDashboard] Error loading datasets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
    // Reload data to ensure everything stays perfectly in sync
    loadData();
  };

  // Compute stats in real-time
  const stats = {
    totalJobs: jobsList.length,
    activeJobs: jobsList.filter(j => j.status === 'Published').length,
    draftJobs: jobsList.filter(j => j.status === 'Draft').length,
    closedJobs: jobsList.filter(j => j.status === 'Archived').length,
    appsReceived: applicantsList.length,
    appsToday: applicantsList.filter(a => a.appliedDate === '2026-07-19' || a.appliedDate === 'Today').length || 1,
    shortlisted: applicantsList.filter(a => a.status === 'Shortlisted').length,
    rejected: applicantsList.filter(a => a.status === 'Rejected').length
  };

  // Custom Sidebar Links mapping to tabs
  const customSidebarItems = [
    { label: 'Overview Console', path: 'overview', icon: LayoutDashboard },
    { label: 'Job Board Manager', path: 'jobs', icon: Briefcase },
    { label: 'Applicant Pipeline', path: 'applicants', icon: Users },
    { label: 'Company Profile', path: 'profile', icon: Building2 },
    { label: 'Employer Settings', path: 'settings', icon: SettingsIcon }
  ];

  const handleSidebarNavigate = (path: string) => {
    // Check if the path is a valid tab item, otherwise do a full outer navigation
    if (customSidebarItems.some(item => item.path === path)) {
      setActiveTab(path);
    } else {
      onNavigate(path);
    }
  };

  // Triggered when wizard completes
  const handleWizardComplete = (newProfile: CompanyProfile) => {
    setProfile(newProfile);
    showNotification('Company Hub has been successfully activated! Welcome to JOB Lo.', 'success');
  };

  // If loading, render elegant skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-6">
        <div className="space-y-4 text-center max-w-sm">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Synchronizing Recruiter Console...</p>
        </div>
      </div>
    );
  }

  // If company profile is NOT complete, force Setup Wizard onboarding experience
  if (!profile || !profile.isProfileComplete) {
    return (
      <CompanySetupWizard 
        onComplete={handleWizardComplete} 
        onLogout={() => onNavigate('/')} 
      />
    );
  }

  return (
    <DashboardLayout
      currentPath={activeTab}
      onNavigate={handleSidebarNavigate}
      userName={profile.recruiterName || 'Shalini Roy'}
      userRole={profile.size ? `${profile.name} Recruitment` : 'Technical Recruiter'}
      items={customSidebarItems}
      id={id}
    >
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans relative">
        
        {/* Dynamic Page Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-black text-slate-950 font-heading tracking-tight">
              {activeTab === 'overview' && 'Recruiter Console'}
              {activeTab === 'jobs' && 'Job Board specifications'}
              {activeTab === 'applicants' && 'Applicant streams'}
              {activeTab === 'profile' && 'Company Hub'}
              {activeTab === 'settings' && 'Console Preferences'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {activeTab === 'overview' && `Review pipelines for ${profile.name}, verify match indexes, and manage direct corporate API quotas.`}
              {activeTab === 'jobs' && 'Add, duplicate, edit, or archive vacancy specifications across active sourcing streams.'}
              {activeTab === 'applicants' && 'Progress applicants through verification timelines, write notes, and schedule technical rounds.'}
              {activeTab === 'profile' && 'Publish culture summaries, benefits arrays, and manage office showcase gallery links.'}
              {activeTab === 'settings' && 'Adjust notification rules, rotate key coordinates, manage team members, or update billing tiers.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotification('No unread pipeline reports at this coordinate.', 'info')}
              className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl relative cursor-pointer shrink-0"
              title="Pipeline Alert center"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          </div>
        </div>

        {/* Tab Router Render */}
        <main className="min-h-[60vh]">
          {activeTab === 'overview' && (
            <OverviewTab
              onSetActiveTab={setActiveTab}
              onNavigate={onNavigate}
              onSetJobAction={setJobAction}
              stats={stats}
              activities={activitiesList}
            />
          )}

          {activeTab === 'profile' && (
            <CompanyProfileTab onShowNotification={showNotification} />
          )}

          {activeTab === 'jobs' && (
            <JobManagementTab
              onShowNotification={showNotification}
              jobAction={jobAction}
              onClearJobAction={() => setJobAction(null)}
            />
          )}

          {activeTab === 'applicants' && (
            <ApplicantsTab onShowNotification={showNotification} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab onShowNotification={showNotification} />
          )}
        </main>

        {/* Interactive Dynamic Toast Notification Alert Banner */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[9999] p-4 bg-slate-900 text-white border border-slate-800 rounded-2xl flex items-start gap-3 shadow-xl max-w-sm animate-slideUp">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-extrabold text-xs font-heading">
                {toast.type === 'success' ? 'Synchronized' : 'System Notice'}
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed font-sans">{toast.message}</p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
