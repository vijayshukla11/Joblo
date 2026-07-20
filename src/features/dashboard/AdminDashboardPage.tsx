import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, Building, Briefcase, Landmark, BookOpen, UserCheck, 
  AlertTriangle, Cpu, Sparkles, BarChart2, ShieldAlert, Settings,
  ShieldCheck, ChevronRight, LayoutDashboard
} from 'lucide-react';

// Import newly created administrative backbone components
import OverviewAdmin from '../admin/overview/OverviewAdmin';
import UsersAdmin from '../admin/users/UsersAdmin';
import CompaniesAdmin from '../admin/companies/CompaniesAdmin';
import JobsAdmin from '../admin/jobs/JobsAdmin';
import GovernmentJobsAdmin from '../admin/government-jobs/GovernmentJobsAdmin';
import ContentAdmin from '../admin/content/ContentAdmin';
import AuthorsAdmin from '../admin/authors/AuthorsAdmin';
import ReportsAdmin from '../admin/reports/ReportsAdmin';
import AutomationAdmin from '../admin/automation/AutomationAdmin';
import AiMonitoringAdmin from '../admin/ai-monitoring/AiMonitoringAdmin';
import AnalyticsAdmin from '../admin/analytics/AnalyticsAdmin';
import SecurityAdmin from '../admin/security/SecurityAdmin';
import SettingsAdmin from '../admin/settings/SettingsAdmin';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

type AdminTab = 
  | 'overview' | 'users' | 'companies' | 'jobs' | 'government-jobs' 
  | 'content' | 'authors' | 'reports' | 'automation' 
  | 'ai-monitoring' | 'analytics' | 'security' | 'settings';

export default function AdminDashboardPage({ onNavigate, id }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview' as AdminTab, label: 'System Overview', icon: LayoutDashboard, component: OverviewAdmin },
    { id: 'users' as AdminTab, label: 'User Accounts', icon: Users, component: UsersAdmin },
    { id: 'companies' as AdminTab, label: 'Verified Companies', icon: Building, component: CompaniesAdmin },
    { id: 'jobs' as AdminTab, label: 'Corporate Jobs', icon: Briefcase, component: JobsAdmin },
    { id: 'government-jobs' as AdminTab, label: 'Government Gazettes', icon: Landmark, component: GovernmentJobsAdmin },
    { id: 'content' as AdminTab, label: 'Editorial Content', icon: BookOpen, component: ContentAdmin },
    { id: 'authors' as AdminTab, label: 'Author Bios', icon: UserCheck, component: AuthorsAdmin },
    { id: 'reports' as AdminTab, label: 'Abuse Reports', icon: AlertTriangle, component: ReportsAdmin },
    { id: 'automation' as AdminTab, label: 'Automation Webhooks', icon: Cpu, component: AutomationAdmin },
    { id: 'ai-monitoring' as AdminTab, label: 'AI LLM Monitoring', icon: Sparkles, component: AiMonitoringAdmin },
    { id: 'analytics' as AdminTab, label: 'Sourcing Analytics', icon: BarChart2, component: AnalyticsAdmin },
    { id: 'security' as AdminTab, label: 'Security Firewall', icon: ShieldAlert, component: SecurityAdmin },
    { id: 'settings' as AdminTab, label: 'Portal Settings', icon: Settings, component: SettingsAdmin },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || OverviewAdmin;

  return (
    <DashboardLayout
      currentPath="/admin-dashboard"
      onNavigate={onNavigate}
      userName="Admin Root"
      userRole="System Administrator"
      id={id}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-950 font-heading tracking-tight">
            Administrative Control Panel
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage global scraping, system queues, site indexing, and DPDP logs.
          </p>
        </div>

        {/* Dynamic Responsive Tab Pickers */}
        <div className="space-y-3">
          {/* Mobile Dropdown (visible under md: width) */}
          <div className="md:hidden">
            <label htmlFor="admin-tabs" className="sr-only">Select Admin Department</label>
            <select
              id="admin-tabs"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as AdminTab)}
              className="w-full px-4 py-2 text-xs font-bold bg-white border border-slate-250 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-sans shadow-2xs"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Horizontal List (hidden on mobile, visible from md: width) */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Sub-View Component Container */}
        <div className="transition-all duration-200">
          {activeTab === 'overview' ? (
            <OverviewAdmin 
              onSelectTab={(tabId) => setActiveTab(tabId as AdminTab)} 
              onShowNotification={(msg, type) => console.log(`[${type}]: ${msg}`)}
            />
          ) : (
            <ActiveComponent />
          )}
        </div>

        {/* Footer Audit Signature */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-slate-400 font-mono font-bold uppercase">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Master control gateways connected</span>
          </div>
          <div>
            <span>SYSTEM V1.0.0 • PROD ACTIVE</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
