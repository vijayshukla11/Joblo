import React from 'react';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export default function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Privacy Protocol & DPDP Compliance" 
        description="Verify how JOB Lo handles credentials, cookies, and resume uploads in strict alignment with India's Digital Personal Data Protection Act (DPDP), 2023." 
        h1Text="JOB Lo Privacy Mandate"
      />

      <Breadcrumbs items={[{ label: 'Privacy Policy', path: '/privacy' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 text-xs text-gray-500 leading-relaxed font-sans">
        
        <div className="space-y-3 text-center mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Privacy & Data Sourcing Protocols</h1>
          <p className="text-gray-400">Strictly aligned with India's Digital Personal Data Protection (DPDP) Act, 2023.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>1. Sourced Resume PDF Vault Protection</span>
          </h2>
          <p>
            When utilizing the JOB Lo Resume Vault, your uploaded PDF is processed exclusively within temporary local secure buffers, scanned for security malware signatures, and saved utilizing AES-256 server-side encryption. We never rent, package, or sell user demographic data.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>2. Analytical Scrapers & Webhooks</span>
          </h2>
          <p>
            We deploy secure automated webhooks to fetch and refresh active government and corporate indices. The data gathered under these channels is restricted to authorized administrative databases, with zero client-side tracking of personal identifiers.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>3. Right to Erase (Section 12 DPDP)</span>
          </h2>
          <p>
            In accordance with Indian statutory requirements, you retain absolute authority to request immediate, complete deletion of your resume and application credentials logs from our databases at any time. Simply use your Candidate Console parameters to withdraw active consent.
          </p>
        </div>

      </section>

    </div>
  );
}
