import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Briefcase, UserCheck } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export default function FAQPage({ onNavigate }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is JOB Lo an official government portal?',
      a: 'No. JOB Lo is an independent AI-powered platform designed to index public sector opportunities from official Gazettes and private sector openings from API feeds. We are not a government agency.',
      category: 'general'
    },
    {
      q: 'How does the AI Resume Analyzer secure my data?',
      a: 'We respect India\'s DPDP Act, 2023. Your resume is parsed in temporary secure server buffers, and data is only extracted for match scores. You can permanently delete your resume from our databases via your Profile Console at any time.',
      category: 'seeker'
    },
    {
      q: 'Are recruiter accounts verified on JOB Lo?',
      a: 'Yes, all employer accounts must provide business details, verifiable company emails, and valid GST details. Registered roles undergo rigorous checks before being published.',
      category: 'employer'
    },
    {
      q: 'How do I claim a refund for recruiter tokens?',
      a: 'If a posting fails to publish or technical API issues arise, we credit equivalent tokens or process a full refund within 7 business days of verification. Submit a ticket on our Contact Us page.',
      category: 'employer'
    },
    {
      q: 'Does JOB Lo charge job seekers any fees?',
      a: 'No, job discovery, resume matching, and syllabus access on JOB Lo are 100% free and open-access. We will never ask you to pay for interview placements.',
      category: 'seeker'
    }
  ];

  const filteredFaqs = faqs.filter(
    faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Frequently Asked Questions (FAQ)" 
        description="Find answers about job seeker profiles, company listings, verification steps, and AI-powered match scores." 
        h1Text="JOB Lo Help & FAQ"
      />

      <Breadcrumbs items={[{ label: 'FAQ', path: '/faq' }]} onNavigate={onNavigate} />

      <section className="max-w-3xl mx-auto py-12 px-6 space-y-8 font-sans">
        
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading font-semibold">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-400">Search questions about roles, resumes, verification, and our career technology platform.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Type your question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold text-gray-800 outline-none"
          />
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-100 rounded-xl bg-white overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50"
                  >
                    <span className="text-xs font-bold text-gray-800 font-heading">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs text-gray-500 leading-relaxed bg-slate-50/20 border-t border-slate-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-gray-400 font-mono">
              No answers matching your search criteria. Try a different topic.
            </div>
          )}
        </div>

        {/* Help CTA */}
        <div className="p-5 bg-zinc-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <p className="text-xs font-bold font-heading">Still need assistances?</p>
            <p className="text-[10px] text-zinc-400">Our support engineers and board members respond within 24 hours.</p>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-3xs font-extrabold uppercase hover:bg-slate-100 transition-all cursor-pointer"
          >
            Submit Support Request
          </button>
        </div>

      </section>

    </div>
  );
}
