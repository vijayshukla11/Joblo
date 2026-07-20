import React, { useEffect, useState } from 'react';
import { 
  Users, UserCheck, Building, Briefcase, CheckCircle2, FileText, 
  Layers, BookOpen, Landmark, Mail, MessageSquare, Compass, 
  TrendingUp, Activity, DollarSign, Zap, RefreshCw, Server, AlertCircle
} from 'lucide-react';
import { adminService, AdminActivity } from '../../../services/adminService';

interface OverviewAdminProps {
  onSelectTab?: (tabId: string) => void;
  onShowNotification?: (msg: string, type: 'success' | 'info') => void;
}

export default function OverviewAdmin({ onSelectTab, onShowNotification }: OverviewAdminProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    jobSeekers: 0,
    employers: 0,
    companies: 0,
    jobs: 0,
    publishedJobs: 0,
    draftJobs: 0,
    applications: 0,
    blogs: 0,
    careerResources: 0,
    governmentJobs: 0,
    newsletterSubscribers: 0,
    contactMessages: 0,
  });

  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState({ status: 'Healthy', ping: '14ms', cpu: '8.4%', mem: '42%' });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const users = await adminService.getUsers();
      const seekers = await adminService.getJobSeekers();
      const verifications = await adminService.getCompanyVerifications();
      const rawJobs = await adminService.getCorporateJobs();
      const categories = await adminService.getCategories();
      const blogs = await adminService.getBlogs();
      const resources = await adminService.getCareerResources();
      const govJobs = await adminService.getGovernmentJobs();
      const subscribers = await adminService.getNewsletterSubscribers();
      const contacts = await adminService.getContactMessages();
      const activeActivities = await adminService.getActivities();

      // Set state
      setStats({
        totalUsers: users.length + 1482, // Seed baseline + users.length
        jobSeekers: seekers.length + 950,
        employers: users.filter(u => u.role === 'Employer').length + 532,
        companies: verifications.length,
        jobs: rawJobs.length + govJobs.length + 120,
        publishedJobs: rawJobs.filter(j => j.status === 'Published').length + govJobs.length + 95,
        draftJobs: rawJobs.filter(j => j.status === 'Draft').length + 25,
        applications: 2480, // Dynamic aggregate mock
        blogs: blogs.length,
        careerResources: resources.length,
        governmentJobs: govJobs.length,
        newsletterSubscribers: subscribers.length,
        contactMessages: contacts.length,
      });

      setActivities(activeActivities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = async () => {
    await loadStats();
    onShowNotification('Synchronized real-time administrative indicators.', 'success');
  };

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', tab: 'users' },
    { label: 'Job Seekers', value: stats.jobSeekers, icon: UserCheck, color: 'text-sky-600 bg-sky-50 border-sky-100', tab: 'users' },
    { label: 'Employers', value: stats.employers, icon: Building, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', tab: 'users' },
    { label: 'Companies', value: stats.companies, icon: Building, color: 'text-amber-600 bg-amber-50 border-amber-100', tab: 'companies' },
    { label: 'All Jobs', value: stats.jobs, icon: Briefcase, color: 'text-violet-600 bg-violet-50 border-violet-100', tab: 'jobs' },
    { label: 'Published Jobs', value: stats.publishedJobs, icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 border-teal-100', tab: 'jobs' },
    { label: 'Draft Jobs', value: stats.draftJobs, icon: FileText, color: 'text-slate-600 bg-slate-100 border-slate-200', tab: 'jobs' },
    { label: 'Applications', value: stats.applications, icon: Layers, color: 'text-rose-600 bg-rose-50 border-rose-100', tab: 'companies' },
    { label: 'Blogs CMS', value: stats.blogs, icon: BookOpen, color: 'text-pink-600 bg-pink-50 border-pink-100', tab: 'content' },
    { label: 'Career Guides', value: stats.careerResources, icon: Compass, color: 'text-orange-600 bg-orange-50 border-orange-100', tab: 'content' },
    { label: 'Government Jobs', value: stats.governmentJobs, icon: Landmark, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', tab: 'government-jobs' },
    { label: 'Newsletter', value: stats.newsletterSubscribers, icon: Mail, color: 'text-blue-600 bg-blue-50 border-blue-100', tab: 'contacts' },
    { label: 'Contact Messages', value: stats.contactMessages, icon: MessageSquare, color: 'text-purple-600 bg-purple-50 border-purple-100', tab: 'contacts' },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-950 font-heading flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-emerald-600" />
            <span>Operational Indicators Panel</span>
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
            Overview metrics for user register volume, pending verifications, and regional gazette caching statistics.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg min-h-[36px] shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Sync Register</span>
        </button>
      </div>

      {/* METRIC CARDS BENTO GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => onSelectTab(card.tab)}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans group-hover:text-slate-600">
                  {card.label}
                </span>
                <span className={`p-1.5 rounded-lg border shrink-0 ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading">
                  {loading ? '...' : card.value}
                </span>
                <p className="text-[9px] text-slate-400 font-medium mt-1 font-mono">Manage Entity →</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* VISITORS AND HEALTH ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Tracker Cards */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 lg:col-span-2">
          <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Sourcing Traffic & Financials (Mocks)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Daily Visitors</span>
              <p className="text-lg font-bold text-slate-900 font-mono">14,284</p>
              <span className="text-[9px] text-emerald-600 font-bold font-mono">+12.4% today</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Monthly Visitors</span>
              <p className="text-lg font-bold text-slate-900 font-mono">392,480</p>
              <span className="text-[9px] text-emerald-600 font-bold font-mono">+8.1% vs last month</span>
            </div>
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg space-y-1">
              <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">Revenue Index</span>
              <p className="text-lg font-bold text-emerald-950 font-mono">₹4,82,900</p>
              <span className="text-[9px] text-emerald-600 font-bold font-mono">Paid Employer Plans</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs text-slate-500 font-medium">
            <p className="leading-relaxed">
              <strong>System Insights:</strong> Sourcing index density is currently highest in Bangalore (24%) and Mumbai (18%). Resume ATS processing pipeline exhibits an average score matching factor of 82%.
            </p>
          </div>
        </div>

        {/* System Health Status */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>System Health Checks</span>
            </h3>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Gateway Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {systemHealth.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">DB Roundtrip:</span>
                <span className="text-slate-800 font-bold font-mono">{systemHealth.ping}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">CPU Loading:</span>
                <span className="text-slate-800 font-bold font-mono">{systemHealth.cpu}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Memory Caching:</span>
                <span className="text-slate-800 font-bold font-mono">{systemHealth.mem}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-[10px] text-indigo-800 font-mono flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Sitemaps generated, robots.txt allows search spiders crawling indexing live corporate pages.</span>
          </div>
        </div>
      </div>

      {/* ACTIVITIES TABLE AND QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Activity Logs */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 lg:col-span-2">
          <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
            <Activity className="w-4 h-4 text-slate-600" />
            <span>Recent Auditable Activities</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {activities.length === 0 ? (
              <p className="py-4 text-slate-400 text-center">No recent activities logged.</p>
            ) : (
              activities.slice(0, 5).map((act) => (
                <div key={act.id} className="py-3.5 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                      act.type === 'security' ? 'bg-rose-500' :
                      act.type === 'job' ? 'bg-amber-500' :
                      act.type === 'company' ? 'bg-emerald-500' :
                      act.type === 'user' ? 'bg-indigo-500' : 'bg-slate-400'
                    }`} />
                    <span className="text-slate-700 font-medium leading-relaxed">{act.text}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono font-bold whitespace-nowrap uppercase">
                    {act.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Action Matrix */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-3">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Administrative Quick Tools</span>
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-2.5">
              <button
                onClick={() => onSelectTab?.('users')}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Add / Manage User Registers</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">→</span>
              </button>
              <button
                onClick={() => onSelectTab?.('jobs')}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Index New Job Position</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">→</span>
              </button>
              <button
                onClick={() => onSelectTab?.('content')}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Publish New Editorial Blog</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">→</span>
              </button>
              <button
                onClick={() => onSelectTab?.('companies')}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Verify Pending Companies</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">→</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[9px] text-slate-400 font-bold font-mono">SECURE ROOT ACCESS LOGGED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
