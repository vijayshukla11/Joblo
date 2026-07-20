import React from 'react';
import { CreditCard, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface RefundPolicyPageProps {
  onNavigate: (path: string) => void;
}

export default function RefundPolicyPage({ onNavigate }: RefundPolicyPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Refund Policy & Premium Services" 
        description="Review JOB Lo's clear, transparent guidelines on refunds, candidate token credits, and employer publisher accounts." 
        h1Text="JOB Lo Refund Policy"
      />

      <Breadcrumbs items={[{ label: 'Refund Policy', path: '/refund-policy' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 text-xs text-gray-500 leading-relaxed font-sans">
        
        <div className="space-y-3 text-center mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Refund Policy & Credit Guarantees</h1>
          <p className="text-gray-400">Clear, fair, and transparent regulations for future premium recruiter and candidate pipelines.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>1. Premium Recruiter Postings</span>
          </h2>
          <p>
            recruiter packages, pipeline integrations, or candidate screening tokens are offered with highly clear service tiers. If an employer account experiences downtime or API integration issues preventing job publication, we credit equivalent tokens or issue a full refund within 7 business days of verification.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-800 font-heading border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Candidate Training Credits</span>
          </h2>
          <p>
            Any future paid certificates, AI interview practice runs, or resume templates are fully backed by a 48-hour satisfaction query window. If you're dissatisfied with the verified syllabus alignment or AI tips, contact support for a prompt credit refund.
          </p>
        </div>

        <div className="space-y-4 font-mono text-[10px] p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            <span>EXCLUSIONS & VERIFICATIONS</span>
          </div>
          <p>
            Refund requests made outside our official contact forms or past the 48-hour satisfaction period are evaluated case-by-case by the Delhi Editorial Board. To trigger a refund dispute, submit a verified receipt number via our contact page.
          </p>
        </div>

      </section>

    </div>
  );
}
