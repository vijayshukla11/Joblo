import React, { useState } from 'react';
import { MOCK_GUIDES, MOCK_INTERVIEW_PREP, MOCK_FAQS, MOCK_LOCATIONS, MOCK_COMPANIES } from '../../constants';
import { BookOpen, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Clock, FileText, ArrowRight, DollarSign, MapPin, Building, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GuidesSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Filtered interview prep questions based on selected difficulty
  const filteredPrep = MOCK_INTERVIEW_PREP.filter(
    (item) => selectedDifficulty === 'All' || item.difficulty === selectedDifficulty
  );

  // Industry estimated Salary Guides data for SEO indexing
  const salaryGuides = [
    { role: 'Frontend React Developer', lower: '₹8L', upper: '₹24L', trend: '+14% YoY', index: 'Tech' },
    { role: 'Product Designer (UX/UI)', lower: '₹7L', upper: '₹22L', trend: '+9% YoY', index: 'Design' },
    { role: 'Assistant Section Officer (ASO)', lower: '₹5.4L', upper: '₹17L', trend: 'Gov Pay Band Level 7', index: 'Government' },
    { role: 'Probationary Officer (SBI PO)', lower: '₹5L', upper: '₹8L', trend: 'State Allowances Inc.', index: 'Government' }
  ];

  // Schema.org FAQ dynamic structured metadata placeholder for crawlers
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': MOCK_FAQS.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <section id="career-guides" className="py-20 bg-white border-t border-slate-100 max-w-7xl mx-auto px-6 space-y-20">
      
      {/* 1. Schema.org JSON-LD Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 2. SEO: TOP REGISTERED/VERIFIED COMPANIES CAROUSEL */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            Certified Corporate Partnerships
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MOCK_COMPANIES.map((company) => (
            <div
              key={company.id}
              className="p-5 bg-slate-50/50 border border-slate-100/60 rounded-xl flex flex-col items-center justify-center text-center space-y-2 hover:border-emerald-200 hover:bg-white transition-all"
            >
              <span className="text-2xl">{company.logo}</span>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-900 font-heading">
                  {company.name}
                </h4>
                <p className="text-[10px] text-emerald-700 font-mono font-bold">
                  {company.openingsCount} active roles
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SEO: BROWSE BY POPULAR CITIES */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            Browse Opportunities by High-Intent Locations
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between hover:border-emerald-200 hover:shadow-2xs transition-all cursor-pointer"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-900 font-heading">
                  {loc.city}
                </h4>
                <p className="text-[10px] text-gray-400 font-sans">
                  {loc.state}, {loc.country}
                </p>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                {loc.jobCount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEO: NATIONAL SALARY MATRIX GUIDES */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            National Salary Trend Indexes
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {salaryGuides.map((guide, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-gray-150 rounded-xl space-y-3 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                  guide.index === 'Tech' ? 'bg-indigo-50 text-indigo-700' :
                  guide.index === 'Design' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {guide.index}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded">
                  {guide.trend}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-900 font-heading leading-tight group-hover:text-emerald-950">
                  {guide.role}
                </h4>
                <div className="flex items-baseline gap-1 text-sm font-bold text-slate-800">
                  <span className="font-mono text-base text-gray-950">{guide.lower}</span>
                  <span className="text-gray-400 font-normal text-xs">-</span>
                  <span className="font-mono text-base text-gray-950">{guide.upper}</span>
                  <span className="text-gray-400 font-light text-[10px] ml-1">/ annum</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. EXPERT ARTICLES & ACTIVE INTERVIEW QUESTION BANK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        
        {/* Left Column: Expert Guides */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">
              Expert Career Manuals
            </h3>
          </div>

          <div className="space-y-4">
            {MOCK_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-gray-100 hover:border-emerald-200 p-5 rounded-2xl transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors leading-snug font-heading">
                  {guide.title}
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                  {guide.excerpt}
                </p>

                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-50 text-[10px] font-mono">
                  <span className="text-gray-400 font-bold uppercase">Mentor:</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    {guide.authorName}
                    {guide.authorVerified && (
                      <span title="Verified Expert Mentor">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </span>
                  <span className="text-gray-400 font-light">({guide.authorRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Q&A Bank */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">
                Active Question Bank
              </h3>
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex gap-1">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-100 hover:text-black'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPrep.map((prep) => (
              <div
                key={prep.id}
                className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-3"
              >
                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                  <span className="text-gray-400 uppercase">TOPIC: <span className="text-slate-800">{prep.topic}</span></span>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono border ${
                    prep.difficulty === 'Hard' ? 'text-red-700 bg-red-50 border-red-100' : 'text-amber-700 bg-amber-50 border-amber-100'
                  }`}>
                    {prep.difficulty}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">QUESTION:</span>
                  <p className="text-xs font-bold text-gray-900 font-heading leading-snug">
                    {prep.question}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-150">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">VERIFIED MODEL SOLUTION:</span>
                  <p className="text-xs font-light text-slate-600 whitespace-pre-line leading-relaxed font-sans">
                    {prep.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. SEO ACCORDION FAQ SECTION */}
      <div className="border-t border-slate-100 pt-16 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-heading">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">
            Have questions about career alignment, government syllabus accuracy, or secure AI match processing?
          </p>
        </div>

        <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white divide-y divide-gray-100">
          {MOCK_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="transition-all">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left p-5 font-bold text-xs sm:text-sm text-gray-900 bg-white hover:bg-slate-50 cursor-pointer select-none focus-ring font-heading"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
