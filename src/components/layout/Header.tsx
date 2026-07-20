import React, { useState } from 'react';
import { Briefcase, ArrowRight, ShieldCheck, Search, Sparkles, Menu, X, User, DollarSign, BookOpen, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { label: 'Corporate Jobs', path: '/jobs' },
    { label: 'Government Hub', path: '/government-jobs' },
    { label: 'Verified Companies', path: '/companies' },
    { label: 'Topical Guides', path: '/career-guides' },
    { label: 'Salary Benchmarks', path: '/salary-guide' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => handleLinkClick('/')} 
          className="flex items-center gap-2.5 cursor-pointer focus-ring rounded-lg select-none"
          tabIndex={0}
          aria-label="JOB Lo Home"
          onKeyDown={(e) => { if (e.key === 'Enter') handleLinkClick('/'); }}
        >
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-heading font-extrabold text-base shadow-xs">
            J
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-gray-900 font-heading leading-none">
              JOB<span className="text-emerald-600">Lo</span>
            </span>
            <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 mt-0.5">
              INDIA PORTAL
            </span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-500">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleLinkClick(item.path)}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer focus-ring font-semibold ${
                isActive(item.path)
                  ? 'bg-slate-100 text-black font-bold'
                  : 'hover:text-black hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => handleLinkClick('/search')}
            className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer focus-ring ${
              isActive('/search') 
                ? 'bg-slate-100 text-black font-bold' 
                : 'text-gray-600 hover:text-black hover:bg-slate-50'
            }`}
            title="Search Platform Content"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search</span>
          </button>

          <button
            onClick={() => handleLinkClick('/resume-builder')}
            className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer focus-ring ${
              isActive('/resume-builder') 
                ? 'bg-slate-100 text-black font-bold' 
                : 'text-gray-600 hover:text-black hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume Vault</span>
          </button>

          <button
            onClick={() => handleLinkClick('/dashboard')}
            className={`inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-ring ${
              isActive('/dashboard')
                ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-150'
                : 'text-gray-600 hover:text-black hover:bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Console</span>
          </button>

          {user && (
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                await new Promise(r => setTimeout(r, 600));
                await signOut();
                onNavigate('/');
                setIsLoggingOut(false);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer focus-ring"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Log Out</span>
            </button>
          )}

          <button
            onClick={() => handleLinkClick('/ai-career-hub')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 focus-ring rounded-lg select-none cursor-pointer transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-100 animate-pulse" />
            <span>AI Career Hub</span>
          </button>
        </div>

        {/* MOBILE CONTROLLERS BUTTON */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handleLinkClick('/ai-career-hub')}
            className="p-2 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-100 focus-ring cursor-pointer"
            title="Launch AI Career Hub"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-500 hover:text-black bg-slate-50 border border-slate-200 focus-ring cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-3.5 shadow-md animate-fadeIn select-none">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">Career Channels</span>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive(item.path)
                    ? 'bg-slate-50 text-emerald-700 font-extrabold'
                    : 'text-gray-600 hover:text-black hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1 border-t border-slate-50 pt-3">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1">User Platforms</span>
            
            <button
              onClick={() => handleLinkClick('/search')}
              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                isActive('/search') ? 'bg-slate-50 text-black font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Universal Search</span>
            </button>

            <button
              onClick={() => handleLinkClick('/resume-builder')}
              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                isActive('/resume-builder') ? 'bg-slate-50 text-black font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Resume Parser Vault</span>
            </button>

            <button
              onClick={() => handleLinkClick('/dashboard')}
              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                isActive('/dashboard') ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>My Candidate Console</span>
            </button>

            {user && (
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  setIsLoggingOut(true);
                  await new Promise(r => setTimeout(r, 600));
                  await signOut();
                  onNavigate('/');
                  setIsLoggingOut(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Log Out</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('/ai-career-hub')}
              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                isActive('/ai-career-hub') ? 'bg-emerald-50 text-emerald-900' : 'text-gray-600 hover:text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>AI Career Co-Pilot</span>
            </button>
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-8 bg-white border border-slate-150 rounded-2xl shadow-xl max-w-sm text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-gray-900 leading-none">Securing Your Session</h3>
              <p className="text-[11px] text-gray-400">Clearing data and signing out from JOB Lo...</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
