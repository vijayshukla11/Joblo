import React from 'react';
import { Target, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Our Mission & Executive Mandate" 
        description="Learn more about JOB Lo's core focus: Sourcing verified corporate pipelines, supporting Indian gazette preparation schedules, and providing secured resume vaults." 
        h1Text="About JOB Lo"
      />

      <Breadcrumbs items={[{ label: 'About Our Portal', path: '/about' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-10">
        
        {/* BIG STATEMENT */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading leading-tight">
            Build India's most trusted <span className="text-emerald-700">AI-powered Career Platform</span>.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-sans max-w-xl mx-auto">
            JOB Lo is designed to bridge the structural transparency gap between ambitious candidates and verified employment pipelines. We cater strictly to verified, trust-cleared opportunities.
          </p>
        </div>

        {/* DETAILS BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900 font-heading">Sourcing Trust Model</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              All listings on our platform must pass strict regulatory audits and have transparent salary declarations before indexing. We never list speculative roles.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900 font-heading">Statutory DPDP Compliance</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              In accordance with India's Digital Personal Data Protection (DPDP) Act, 2023, we cryptographically defend all user uploads with zero third-party telemetry leasing.
            </p>
          </div>

        </div>

        {/* TEAM COMMITMENT PLEDGE */}
        <div className="p-6 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
            <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
            <span>Executive Board Committment</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed font-sans">
            Our technical engineering division works relentlessly to sustain the automated n8n pipelines, ensuring daily gazette audits and accurate technical skill matching diagnostics. We stand by absolute candidate progress telemetry.
          </p>
        </div>

      </section>

    </div>
  );
}
