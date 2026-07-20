import React from 'react';
import { Map, ArrowRight, Home, Briefcase, FileText, Settings, User } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface SitemapPageProps {
  onNavigate: (path: string) => void;
}

export default function SitemapPage({ onNavigate }: SitemapPageProps) {
  const sitemapData = [
    {
      title: 'Main Portals',
      icon: <Home className="w-4 h-4 text-emerald-600" />,
      links: [
        { label: 'Home Page', path: '/' },
        { label: 'Browse Corporate Jobs', path: '/jobs' },
        { label: 'Browse Government Gazettes', path: '/government-jobs' },
        { label: 'Companies Directory', path: '/companies' }
      ]
    },
    {
      title: 'Candidate Tools',
      icon: <User className="w-4 h-4 text-indigo-600" />,
      links: [
        { label: 'AI Resume Matcher', path: '/ai-job-match' },
        { label: 'Resume PDF Analyzer', path: '/resume-builder' },
        { label: 'Interview Preparation Q&As', path: '/interview-preparation' },
        { label: 'Salary Benchmarks Guide', path: '/salary-guide' },
        { label: 'Topic & Career Guides', path: '/career-guides' },
        { label: 'Sourcing & Learning Courses', path: '/learning' }
      ]
    },
    {
      title: 'Compliance & Legal Protocols',
      icon: <FileText className="w-4 h-4 text-slate-600" />,
      links: [
        { label: 'Privacy Policy & DPDP', path: '/privacy' },
        { label: 'Terms of Service Agreement', path: '/terms' },
        { label: 'Cookie & Cache Policy', path: '/cookie-policy' },
        { label: 'Disclaimer of Affiliation', path: '/disclaimer' },
        { label: 'Refund Guarantee Tiers', path: '/refund-policy' }
      ]
    },
    {
      title: 'Help & Technical Support',
      icon: <Settings className="w-4 h-4 text-amber-600" />,
      links: [
        { label: 'Help Centre Manuals', path: '/help-centre' },
        { label: 'Frequently Asked Questions (FAQ)', path: '/faq' },
        { label: 'Submit Support Ticket', path: '/contact' },
        { label: 'Support & HQ coordinates', path: '/support' }
      ]
    }
  ];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Sitemap & Resource Catalog" 
        description="Verify and browse the complete index of JOB Lo tools, policy documents, job seeker wizards, and employer dashboards." 
        h1Text="JOB Lo Sitemap"
      />

      <Breadcrumbs items={[{ label: 'Sitemap', path: '/sitemap' }]} onNavigate={onNavigate} />

      <section className="max-w-4xl mx-auto py-12 px-6 space-y-10 font-sans">
        
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Map className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">Complete Platform Directory</h1>
          <p className="text-xs text-gray-400">Direct links to every verified layout, privacy mandate, and match tool across our India-wide ecosystem.</p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {sitemapData.map((section, idx) => (
            <div key={idx} className="p-5 border border-slate-150 rounded-xl bg-white space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                  {section.icon}
                </div>
                <h2 className="text-xs font-bold text-gray-900 font-heading uppercase tracking-tight">{section.title}</h2>
              </div>

              <ul className="space-y-2.5">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => onNavigate(link.path)}
                      className="text-[11px] text-gray-500 hover:text-emerald-700 font-medium transition-colors text-left flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-gray-350 shrink-0" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}
