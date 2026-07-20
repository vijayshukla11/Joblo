import React from 'react';
import { LayoutDashboard, Briefcase, FileText, Sparkles, User, Settings, HelpCircle, LogOut } from 'lucide-react';

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  items?: SidebarItem[];
  userName?: string;
  userRole?: string;
}

export default function Sidebar({
  currentPath,
  onNavigate,
  items,
  userName = 'Vijay Sharma',
  userRole = 'Candidate',
}: SidebarProps) {
  const defaultItems: SidebarItem[] = [
    { label: 'Overview Console', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Direct Sourced Jobs', path: '/jobs', icon: Briefcase },
    { label: 'My Resume Vault', path: '/resume-builder', icon: FileText },
    { label: 'AI Matcher Engine', path: '/ai-job-match', icon: Sparkles },
    { label: 'Learning Center', path: '/learning', icon: HelpCircle },
  ];

  const sidebarItems = items || defaultItems;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800 shrink-0 font-sans">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-heading font-extrabold text-base">
          J
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold tracking-tight text-white font-heading">
            JOB<span className="text-emerald-400">Lo</span>
          </span>
          <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">
            DASHBOARD PANEL
          </span>
        </div>
      </div>

      {/* User Info Section */}
      <div className="px-6 py-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
          {userName.substring(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate leading-tight">{userName}</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
            {userRole}
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
          Navigation
        </span>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              id={`sidebar-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onNavigate(item.path)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-3 ${
                active
                  ? 'bg-emerald-600 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Links */}
      <div className="p-4 border-t border-slate-800 space-y-1 bg-slate-950/25">
        <button
          onClick={() => onNavigate('/')}
          className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer flex items-center gap-2.5"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Exit to Portal</span>
        </button>
      </div>
    </aside>
  );
}
