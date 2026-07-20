import React from 'react';
import { ShieldCheck, Eye, Database, Info } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface CookiePolicyPageProps {
  onNavigate: (path: string) => void;
}

export default function CookiePolicyPage({ onNavigate }: CookiePolicyPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Cookie Policy & Preferences" 
        description="Understand how JOB Lo utilizes browser storage, cache structures, and cookies to deliver a safe, ad-free experience." 
        h1Text="JOB Lo Cookie Policy"
      />

      <Breadcrumbs items={[{ label: 'Cookie Policy', path: '/cookie-policy' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 text-xs text-gray-500 leading-relaxed font-sans">
        
        <div className="space-y-3 text-center mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Database className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Cookie Policy & Storage Preferences</h1>
          <p className="text-gray-400">Strictly localized preferences with zero third-party marketing trackers.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1. Essential Cookies & Session Vaults</span>
          </h2>
          <p>
            JOB Lo utilizes secure cookie structures to hold your active credentials and session states. These elements are highly essential for verifying role access (Job Seeker vs. Employer) and validating identity across sub-portals. They automatically expire once your browser is closed or when you click logout.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>2. Analytical & Functional Storage</span>
          </h2>
          <p>
            We use localized cache and localStorage to save your visual choices (such as filtering fields, selected locations, or recently reviewed jobs). This helps accelerate subsequent query lookups on India's premier career network. These storage devices do not gather your demographic identifiers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>3. Managing Your Preferences</span>
          </h2>
          <p>
            Since we operate a 100% ad-free experience with no corporate trackers, you can safely block cookies inside your native browser parameters. However, blocking essential cookies will restrict your ability to sign into your candidate dashboard or manage recruiter vacancies.
          </p>
        </div>

      </section>

    </div>
  );
}
