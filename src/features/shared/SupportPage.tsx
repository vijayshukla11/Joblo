import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface SupportPageProps {
  onNavigate: (path: string) => void;
}

export default function SupportPage({ onNavigate }: SupportPageProps) {
  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Support & Assistance Desk" 
        description="Connect with JOB Lo's technical assistance center. Register inquiries about database sync issues, employer registrations, or compliance protocols." 
        h1Text="JOB Lo Support"
      />

      <Breadcrumbs items={[{ label: 'Support Center', path: '/support' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-10 font-sans">
        
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Support & Technical Assistance Desk</h1>
          <p className="text-xs text-gray-400">Our customer support officers are online Monday through Friday, 9:00 AM - 6:00 PM IST.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Ticket submission */}
          <div className="p-6 bg-white border border-slate-150 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 font-heading">Submit Technical Inquiries</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Log a ticket for bugs, account locking, employer verification requests, or database sync problems.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/contact')}
              className="mt-4 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Open contact form</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Card 2: FAQ & Guidelines */}
          <div className="p-6 bg-white border border-slate-150 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 font-heading">Search Help Documents</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Access step-by-step documentation, DPDP compliance protocols, and employer verification walk-throughs.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/help-centre')}
              className="mt-4 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Explore help center</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Core details */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-4">
          <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-tight">Direct Support Coordinates</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-[11px] text-gray-500">
            <div className="space-y-1">
              <span className="font-bold text-gray-700 block">General Support Email</span>
              <span>sprint-support@joblo.co.in</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-gray-700 block">Recruiter Inquiries</span>
              <span>recruiter-desk@joblo.co.in</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-gray-700 block">New Delhi HQ Address</span>
              <span>Connaught Place, New Delhi, India</span>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
