import React from 'react';
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export default function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Terms of Service" 
        description="Verify our publisher conditions, gazette indexing accuracy guidelines, and resume storage terms of service." 
        h1Text="JOB Lo Terms of Service"
      />

      <Breadcrumbs items={[{ label: 'Terms of Service', path: '/terms' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 text-xs text-gray-500 leading-relaxed font-sans">
        
        <div className="space-y-3 text-center mb-8">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Terms of Service Mandate</h1>
          <p className="text-gray-400">Rules regulating our public and corporate career directory pipelines.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>1. Sourcing Accuracy & Gazette Indexing</span>
          </h2>
          <p>
            While our editorial team audits commission websites (UPSC, SSC, State PSC) daily to secure accurate exam timelines and syllabus PDFs, official governmental boards retain primary authority over vacancies. Candidates are always advised to cross-reference direct governmental portals.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Candidate Conduct Rules</span>
          </h2>
          <p>
            Users are strictly forbidden from uploading corrupted documents, injecting malicious scripts into our Resume Vault, or utilizing automated scrapers to extract parsed employer lists. Violations trigger immediate deactivation of credentials logs.
          </p>
        </div>

      </section>

    </div>
  );
}
