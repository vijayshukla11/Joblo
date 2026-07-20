import { useState } from 'react';
import { BookOpen, Award, ShieldCheck, Database, Search, ChevronDown, ChevronUp, Landmark, Map, HelpCircle, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_GUIDES, MOCK_INTERVIEW_PREP, MOCK_FAQS } from '../data';

const SALARIES_DATA = [
  { role: 'Frontend Engineer (React)', location: 'Bengaluru', lower: '₹14L', median: '₹18L', upper: '₹26L', demand: 'High' },
  { role: 'Associate Product Manager', location: 'Remote / India', lower: '₹12L', median: '₹16L', upper: '₹22L', demand: 'Very High' },
  { role: 'SBI Probationary Officer (PO)', location: 'National Pay Scale', lower: '₹7.5L', median: '₹9.2L', upper: '₹12L', demand: 'Stable' },
  { role: 'Staff Selection Specialist (ASO)', location: 'Metro Cities', lower: '₹6.8L', median: '₹8.4L', upper: '₹10.5L', demand: 'Stable' },
  { role: 'Product Designer (UX/UI)', location: 'Bengaluru / Pune', lower: '₹10L', median: '₹15L', upper: '₹20L', demand: 'Medium-High' }
];

export default function SEOStructures() {
  const [activeTab, setActiveTab] = useState<'guides' | 'salaries' | 'interviews' | 'faqs' | 'schema'>('guides');
  const [expandedInterview, setExpandedInterview] = useState<string | null>('q-1');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Schema LD+JSON markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": MOCK_FAQS.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
      {/* Top Section Nav Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-gray-100 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'guides' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-3xs' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Career Guides
        </button>
        <button
          onClick={() => setActiveTab('salaries')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'salaries' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-3xs' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" /> Indian Salary Indexes
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'interviews' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-3xs' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Interview QA Preparation
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'faqs' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-3xs' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" /> FAQ Database
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'schema' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-3xs' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" /> JSON-LD Schema Auditor
        </button>
      </div>

      {/* Render Dynamic Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'guides' && (
          <motion.div
            key="guides"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Editorial Career Resources & Guides</h3>
              <p className="text-xs text-gray-500 mt-1">
                Expert-written articles, strategies, and methodologies designed to meet Google's EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_GUIDES.map((guide) => (
                <div key={guide.id} className="bg-white border border-gray-200/80 hover:border-emerald-500 rounded-xl p-5 hover:shadow-2xs transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-flex text-3xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {guide.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 tracking-tight leading-snug hover:text-emerald-700 cursor-pointer">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-t border-gray-50 pt-3.5 mt-4 select-none">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center text-3xs font-bold font-mono">
                      {guide.author.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-700">{guide.author.name}</span>
                        {guide.author.verified && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                      </div>
                      <span className="text-3xs text-gray-400 block leading-none">{guide.author.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'salaries' && (
          <motion.div
            key="salaries"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Indian Salary Standards (2026 Index)</h3>
              <p className="text-xs text-gray-500 mt-1">
                A localized index designed to assist graduates in identifying fair market salaries across different tech hubs and government bands.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-mono font-bold uppercase tracking-wider select-none">
                    <th className="p-4">Target Role</th>
                    <th className="p-4">Primary Hubs</th>
                    <th className="p-4">Entry / Lower</th>
                    <th className="p-4">Median Salary</th>
                    <th className="p-4">Seniors / Upper</th>
                    <th className="p-4 text-center">Market Demand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {SALARIES_DATA.map((sal, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{sal.role}</td>
                      <td className="p-4 text-gray-500">{sal.location}</td>
                      <td className="p-4 font-semibold text-gray-600">{sal.lower}</td>
                      <td className="p-4 font-black text-emerald-600">{sal.median}</td>
                      <td className="p-4 font-semibold text-gray-700">{sal.upper}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-3xs font-semibold ${
                          sal.demand.includes('Very') 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : sal.demand.includes('High') 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {sal.demand}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'interviews' && (
          <motion.div
            key="interviews"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Structured Technical Q&As</h3>
              <p className="text-xs text-gray-500 mt-1">
                Real interview questions asked by hiring panels in Vercel, Linear, SBI, and tech consultancies. Expand to read detailed structural answers.
              </p>
            </div>

            <div className="space-y-2">
              {MOCK_INTERVIEW_PREP.map((prep) => {
                const isExpanded = expandedInterview === prep.id;
                return (
                  <div key={prep.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-all">
                    <button
                      onClick={() => setExpandedInterview(isExpanded ? null : prep.id)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 text-left cursor-pointer select-none"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-3xs font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
                            {prep.topic}
                          </span>
                          <span className="text-3xs font-semibold text-gray-500">
                            Targeting: {prep.role}
                          </span>
                          <span className={`text-3xs font-mono px-1 py-0.5 rounded font-bold ${
                            prep.difficulty === 'Hard' ? 'text-rose-500' : 'text-amber-500'
                          }`}>
                            {prep.difficulty}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 tracking-tight leading-snug">
                          {prep.question}
                        </h4>
                      </div>
                      <div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-4 border-t border-gray-150 text-xs text-gray-600 leading-relaxed bg-white space-y-2 font-mono whitespace-pre-wrap">
                            <span className="text-3xs font-bold uppercase tracking-wider text-emerald-800 font-mono block">Verified Solution Key:</span>
                            {prep.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'faqs' && (
          <motion.div
            key="faqs"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Frequently Asked Questions (FAQ)</h3>
              <p className="text-xs text-gray-500 mt-1">
                General queries answered by our team to guide fresh grads and candidates on compliance, data policies, and features.
              </p>
            </div>

            <div className="space-y-2">
              {MOCK_FAQS.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="border border-gray-150 rounded-xl overflow-hidden bg-white hover:border-gray-200 transition-all">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none"
                    >
                      <h4 className="text-xs md:text-sm font-bold text-gray-900">
                        {faq.question}
                      </h4>
                      <div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-4 border-t border-gray-100 text-xs text-gray-500 leading-relaxed bg-slate-50/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'schema' && (
          <motion.div
            key="schema"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="border-b border-gray-50 pb-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                <Database className="w-5 h-5 text-emerald-600" />
                Active LD-JSON Structured Schema Inspector
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Verify the actual schema injected in our code head. This structured data tells search crawlers exactly how our FAQ block is modeled, guaranteeing instant featured snippet placements.
              </p>
            </div>

            <div className="bg-slate-900 text-slate-300 font-mono text-3xs p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
              <pre>{JSON.stringify(schemaMarkup, null, 2)}</pre>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-3xs text-emerald-800 leading-relaxed">
              <strong>💡 SEO Advantage Checklist:</strong> This LD-JSON schema allows search spiders to parse questions automatically. Coupled with high-speed compilation, zero heavy imagery, and optimized HTML layouts, JOB Lo secures a massive Organic ranking advantage over traditional heavy-weight job portals.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
