import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ConsentBanner from '../common/ConsentBanner';
import PageWrapper from './PageWrapper';
import { ShieldCheck } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  id?: string;
}

export default function MainLayout({ children, currentPath, onNavigate, id }: MainLayoutProps) {
  return (
    <div id={id || 'portal-main-layout'} className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800 flex flex-col justify-between">
      <div>
        {/* Top Editorial Quality Guarantee Banner */}
        <div className="bg-slate-50 border-b border-slate-100 text-[11px] text-gray-500 py-2.5 px-4 select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 px-6 font-sans">
            <span className="flex items-center gap-1.5 font-semibold text-gray-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              JOB Lo Editorial Guarantee: All positions are sourced through certified corporate APIs and public Gazettes.
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              Stable Version 6.0 • 100% Ad-Free, Open Access
            </span>
          </div>
        </div>

        {/* Global Nav Header */}
        <Header currentPath={currentPath} onNavigate={onNavigate} />

        {/* Dynamic Animate Route Container */}
        <main className="min-h-[500px]">
          <PageWrapper key={currentPath}>
            {children}
          </PageWrapper>
        </main>
      </div>

      {/* Global Footer */}
      <Footer onNavigate={onNavigate} />

      {/* GDPR & DPDP Compliant Cookies Banner */}
      <ConsentBanner />
    </div>
  );
}
