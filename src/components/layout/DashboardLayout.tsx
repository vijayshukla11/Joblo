import React, { useState } from 'react';
import Sidebar, { SidebarItem } from './Sidebar';
import { Menu, Bell, ShieldCheck, HelpCircle } from 'lucide-react';
import PageWrapper from './PageWrapper';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  userName?: string;
  userRole?: string;
  items?: SidebarItem[];
  id?: string;
}

export default function DashboardLayout({
  children,
  currentPath,
  onNavigate,
  userName = 'Vijay Sharma',
  userRole = 'Candidate',
  items,
  id,
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div id={id || 'dashboard-shell'} className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          userName={userName}
          userRole={userRole}
          items={items}
        />
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="relative flex flex-col w-64 max-w-xs bg-slate-900 animate-slideRight">
            <Sidebar
              currentPath={currentPath}
              onNavigate={(path) => {
                onNavigate(path);
                setMobileSidebarOpen(false);
              }}
              userName={userName}
              userRole={userRole}
              items={items}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Control Bar */}
        <header className="bg-white border-b border-slate-150 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-3xs">
          
          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 focus-ring shrink-0 cursor-pointer"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sourcing security disclaimer */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 ml-4 lg:ml-0 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Active Connection under India DPDP Compliant protocols</span>
          </div>

          {/* Quick Actions (Notifications, Help, Quick logout) */}
          <div className="flex items-center gap-3.5 ml-auto">
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-50 relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            <button
              onClick={() => onNavigate('/career-guides')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-50 cursor-pointer"
              title="Help and Guides"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>

            {/* Profile trigger */}
            <div className="h-8 border-l border-slate-150" />
            
            <button
              onClick={() => onNavigate('/dashboard')}
              className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <div className="w-7.5 h-7.5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                {userName.substring(0, 2)}
              </div>
              <span className="hidden md:block text-xs font-bold text-slate-800">{userName}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <PageWrapper key={currentPath}>
            {children}
          </PageWrapper>
        </main>
      </div>

    </div>
  );
}
