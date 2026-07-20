import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface DisclaimerPageProps {
  onNavigate: (path: string) => void;
}

export default function DisclaimerPage({ onNavigate }: DisclaimerPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Official Disclaimer" 
        description="Verify JOB Lo's official notices, affiliations, and data compilation guarantees regarding private corporate roles and administrative exams." 
        h1Text="JOB Lo Disclaimer"
      />

      <Breadcrumbs items={[{ label: 'Disclaimer', path: '/disclaimer' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 text-xs text-gray-500 leading-relaxed font-sans">
        
        <div className="space-y-3 text-center mb-8">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Official Affiliation Disclaimer</h1>
          <p className="text-gray-400">Strictly clarifying our independent status and public-data verification methods.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>1. Independent Platform Status</span>
          </h2>
          <p>
            JOB Lo is an independent career discovery platform. We are NOT associated, endorsed, affiliated, or sponsored by any local, state, or central Indian government bodies, public sector enterprises, or administrative exam boards. All logos or trademarks listed belong strictly to their certified owners.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Public Gazettes & Source Verification</span>
          </h2>
          <p>
            Government-associated details, exam syllabus maps, or age constraints are extracted directly from official public gazettes and government websites (such as the SSC, UPSC, and State recruiting channels). While our editorial staff strives to review and verify entries for maximum correctness, aspirants must consult official notifications before submitting exam payments.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span>3. Recruiter Liability</span>
          </h2>
          <p>
            While JOB Lo requires recruiter accounts to provide valid details and GST placeholders, we are not liable for fraudulent hiring practices initiated offline. We strongly advise applicants never to pay fees for job interviews or remote system setups. Report suspicious recruiters immediately using our support page.
          </p>
        </div>

      </section>

    </div>
  );
}
