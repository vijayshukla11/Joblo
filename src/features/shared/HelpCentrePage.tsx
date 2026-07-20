import React from 'react';
import { BookOpen, ShieldCheck, FileText, User, HelpCircle, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface HelpCentrePageProps {
  onNavigate: (path: string) => void;
}

export default function HelpCentrePage({ onNavigate }: HelpCentrePageProps) {
  const supportCategories = [
    {
      title: 'For Job Seekers',
      icon: <User className="w-5 h-5 text-emerald-600" />,
      items: [
        { label: 'Complete profile setup wizard', path: '/profile' },
        { label: 'Upload your Resume to Vault', path: '/resume-builder' },
        { label: 'Interpret AI Match scores', path: '/ai-job-match' },
        { label: 'Request resume file deletions', path: '/privacy' }
      ]
    },
    {
      title: 'For Employers',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      items: [
        { label: 'Employer Dashboard walk-through', path: '/employer-login' },
        { label: 'Company profile layout tools', path: '/employer-register' },
        { label: 'Enter GST and Verification stubs', path: '/employer-register' },
        { label: 'Purchase premium listing tokens', path: '/refund-policy' }
      ]
    },
    {
      title: 'Compliance & Verification',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      items: [
        { label: 'DPDP Act, 2023 regulations', path: '/privacy' },
        { label: 'Gazette sourcing protocols', path: '/disclaimer' },
        { label: 'Report suspicious recruiters', path: '/contact' },
        { label: 'Platform terms & conditions', path: '/terms' }
      ]
    }
  ];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Help Centre" 
        description="Access JOB Lo platform manuals, guidelines, tutorials, and security checklists." 
        h1Text="JOB Lo Help Centre"
      />

      <Breadcrumbs items={[{ label: 'Help Centre', path: '/help-centre' }]} onNavigate={onNavigate} />

      <section className="max-w-4xl mx-auto py-12 px-6 space-y-10 font-sans">
        
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Platform Help Centre</h1>
          <p className="text-xs text-gray-400">Step-by-step guides, user specifications, and policy handbooks for the career ecosystem.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportCategories.map((cat, idx) => (
            <div key={idx} className="p-5 border border-slate-150 rounded-xl bg-white space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                  {cat.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-900 font-heading">{cat.title}</h3>
              </div>

              <ul className="space-y-2.5">
                {cat.items.map((item, i) => (
                  <li key={i} className="text-3xs font-mono uppercase tracking-wider text-gray-500 hover:text-emerald-700 transition-colors">
                    <button
                      onClick={() => onNavigate(item.path)}
                      className="flex items-center gap-1.5 text-left cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Contacts */}
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-900 font-heading">Need real-time administrative support?</h4>
            <p className="text-[11px] text-gray-500">Contact our Connaught Place headquarters directly for enterprise integration queries.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/faq')}
              className="px-4 py-2 bg-white border border-slate-200 text-gray-700 font-bold rounded-lg text-xs hover:bg-slate-100 transition-all cursor-pointer"
            >
              Read FAQs
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-4 py-2 bg-black text-white font-bold rounded-lg text-xs hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

      </section>

    </div>
  );
}
