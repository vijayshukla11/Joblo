import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, ChevronDown, ChevronUp, Users, Info, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackItem {
  role: string;
  name: string;
  avatar: string;
  improvement: string;
  status: 'Approved' | 'Review' | 'Synced';
  quote: string;
}

const DEPARTMENTS: FeedbackItem[] = [
  {
    role: 'CEO',
    name: 'Vijay Kumar',
    avatar: '💼',
    improvement: 'Direct brand positioning & 100% data integrity rule.',
    status: 'Approved',
    quote: 'Eliminate all mock placeholders or fake layout cards. Build actual React 19 forms, clear diagnostic ATS indicators, and clean, high-contrast layouts. Keep user trust absolute.'
  },
  {
    role: 'Senior PM',
    name: 'Ananya Roy',
    avatar: '🎯',
    improvement: 'Immediate 5-second clarity & natural-language focus.',
    status: 'Approved',
    quote: 'Freshers and professionals should land on the portal, grasp JOB Lo\'s identity instantly, and submit a custom-filtered query or check salary grids within 5 seconds.'
  },
  {
    role: 'SEO Expert',
    name: 'Rajesh Patel',
    avatar: '📈',
    improvement: 'JSON-LD Schemas, salary indexes & multi-linking.',
    status: 'Approved',
    quote: 'We need localized hubs for Remote, Gov, and Fresher categories. Coupled with full salary guides and standard schema LD-JSON headers, we will secure immediate Google featured snippets.'
  },
  {
    role: 'Content Strategist',
    name: 'Nisha Sharma',
    avatar: '✏️',
    improvement: 'EEAT Authority Certification & verified resources.',
    status: 'Approved',
    quote: 'Inject a professional editorial compliance notice and verifiable authors for all core career guides to demonstrate high-expertise, authoritative credibility.'
  },
  {
    role: 'UX Designer',
    name: 'Vikram Seth',
    avatar: '🎨',
    improvement: 'Premium minimal layout inspired by Linear & Vercel.',
    status: 'Approved',
    quote: 'Drop generic dark gradients. Use absolute white backgrounds, spacious black headers, and subtle custom emerald accents. Let premium whitespace guide high-intent interactions.'
  },
  {
    role: 'Senior Frontend Engineer',
    name: 'Arjun Das',
    avatar: '⚡',
    improvement: 'React 19, zero heavy images & full typescript safety.',
    status: 'Approved',
    quote: 'Ensure sub-millisecond build times. Avoid heavy assets, make form inputs fully reactive, and export standard typescript schemas to avoid compile errors.'
  },
  {
    role: 'Growth Marketer',
    name: 'Priya Mehta',
    avatar: '🚀',
    improvement: 'High-intent Sunday Newsletter newsletter opt-in loop.',
    status: 'Approved',
    quote: 'Capture candidate demand early. Offer a fast, one-tap verified alert subscribe bar with immediate UI feedback to bypass standard friction.'
  },
  {
    role: 'Automation & QA Engineer',
    name: 'Siddharth Rao',
    avatar: '🛠️',
    improvement: 'Continuous integration gates & linter sanity checks.',
    status: 'Approved',
    quote: 'All forms require native type protection. Secure absolute linter validation so the product compiles perfectly without breaking during production hot reloads.'
  }
];

export default function AlignmentDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-5 shadow-3xs max-w-7xl mx-auto my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-left cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900 font-sans">
                Startup Product Alignment & PRD Sign-off Board
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                All Depts Agreed
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Review exclusive internal feedback and continuous improvement checklists submitted by each stakeholder.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-3xs font-mono font-bold text-slate-400">
            {isOpen ? 'Collapse Feedback' : 'Expand Feedback (8 Signed-off)'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DEPARTMENTS.map((dept, idx) => (
                <div key={idx} className="bg-white border border-gray-150 rounded-lg p-4 space-y-3 hover:shadow-3xs transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{dept.avatar}</span>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 leading-tight">{dept.role}</h5>
                        <p className="text-[10px] text-gray-400 leading-none">{dept.name}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded font-mono">
                      <CheckCircle className="w-2.5 h-2.5" /> {dept.status}
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-md border border-slate-100">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 font-mono block">Proposed Fix</span>
                    <p className="text-3xs font-semibold text-gray-700 leading-tight">{dept.improvement}</p>
                  </div>

                  <p className="text-3xs text-gray-500 italic leading-relaxed pt-1 border-t border-gray-50">
                    "{dept.quote}"
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
