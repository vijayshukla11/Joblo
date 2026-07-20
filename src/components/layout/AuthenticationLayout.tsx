import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import PageWrapper from './PageWrapper';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  title: string;
  subtitle: string;
  id?: string;
}

export default function AuthenticationLayout({
  children,
  onNavigate,
  title,
  subtitle,
  id,
}: AuthenticationLayoutProps) {
  return (
    <div id={id || 'auth-layout'} className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6 sm:px-8 font-sans">
      <PageWrapper className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Left Form Column */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-black font-semibold transition-colors mb-8 cursor-pointer focus-ring rounded-lg py-1 px-2 -ml-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to main portal</span>
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="mt-8">
            {children}
          </div>

          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP Encrypted session</span>
          </div>
        </div>

        {/* Right Info Column (Visually rich side card) */}
        <div className="hidden md:flex bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-heading font-extrabold text-base">
                J
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white font-heading">
                JOB<span className="text-emerald-400">Lo</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <span className="inline-block text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20">
              India Sourcing Gateway
            </span>
            <h3 className="text-2xl font-black text-white leading-tight tracking-tight font-heading">
              Verified Direct-Sourced Corporate & Govt Portals
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Connect directly with verified hiring executives and receive automatic status updates under absolute candidate-first privacy protections.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>STABLE VER 6.0</span>
            <span>© 2026 JOB LO</span>
          </div>
        </div>

      </PageWrapper>
    </div>
  );
}
