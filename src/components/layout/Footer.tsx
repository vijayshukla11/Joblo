import React from 'react';
import { Mail, Globe, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* COL 1: BRAND */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => handleLinkClick('/')}>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
              J
            </div>
            <span className="text-lg font-black tracking-tight text-white font-heading">
              JOB<span className="text-emerald-500">Lo</span>
            </span>
          </div>
          
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            India's most trusted AI-powered career platform helping professionals and aspirants find corporate jobs, support administrative preparation schedules, and secure resume vaults. 100% verified.
          </p>

          <div className="space-y-2 pt-2 text-3xs font-mono text-zinc-500 uppercase">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-zinc-600" />
              <span>sprint-support@joblo.co.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-zinc-600" />
              <span>HQ: Connaught Place, New Delhi, India</span>
            </div>
          </div>
        </div>

        {/* COL 2: TECH HUB */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">Corporate Careers</h5>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => handleLinkClick('/jobs?q=React')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                React Developers
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/jobs?q=Design')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Product Designers
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/jobs?q=QA')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                QA Specialists
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/jobs?t=Remote')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Remote Contracts
              </button>
            </li>
          </ul>
        </div>

        {/* COL 3: GOVT EXAMS */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">Government Hub</h5>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => handleLinkClick('/government-jobs')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                SSC Recruitment
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/government-jobs')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                UPSC Civil Services
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/government-jobs')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                State Bank PO Exams
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/career-guides')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Syllabus Roadmaps
              </button>
            </li>
          </ul>
        </div>

        {/* COL 4: SEO RESOURCES */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">Information Portal</h5>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => handleLinkClick('/about')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                About Our Mission
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/contact')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Contact Us
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/help-centre')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Help Centre
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/support')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Support & HQ
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/faq')} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">
                Frequently Asked FAQ
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
        <div>
          © 2026 JOB Lo India Private Limited. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <button onClick={() => handleLinkClick('/privacy')} className="hover:text-white cursor-pointer">Privacy Protocol</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/terms')} className="hover:text-white cursor-pointer">Terms of Service</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/cookie-policy')} className="hover:text-white cursor-pointer">Cookie Policy</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/refund-policy')} className="hover:text-white cursor-pointer">Refund Policy</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/disclaimer')} className="hover:text-white cursor-pointer">Disclaimer</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/resume-tips')} className="hover:text-white cursor-pointer">Resume Tips</button>
          <span>•</span>
          <button onClick={() => handleLinkClick('/sitemap')} className="hover:text-white cursor-pointer">Sitemap</button>
        </div>
      </div>
    </footer>
  );
}
