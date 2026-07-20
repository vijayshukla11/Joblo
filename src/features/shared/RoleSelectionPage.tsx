import React from 'react';
import { User, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

interface RoleSelectionPageProps {
  onNavigate: (path: string) => void;
  type: 'login' | 'register';
}

export default function RoleSelectionPage({ onNavigate, type }: RoleSelectionPageProps) {
  const isLogin = type === 'login';

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={isLogin ? "Select Portal Entrance" : "Join JOB Lo Network"} 
        description="Choose your account type to access personalized career features, AI-powered matching, or enterprise recruiter pipelines." 
        h1Text={isLogin ? "SSO Portal Select" : "Create Account Select"}
      />

      <Breadcrumbs 
        items={[{ label: isLogin ? 'Login Select' : 'Register Select', path: isLogin ? '/login' : '/register' }]} 
        onNavigate={onNavigate} 
      />

      <section className="max-w-2xl mx-auto py-12 px-6 mt-4">
        
        <div className="text-center space-y-3 mb-10">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl mx-auto text-xl font-heading font-black shadow-xs">
            J
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
            {isLogin ? 'Access Your Gateway' : 'Begin Your Sourced Journey'}
          </h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Select your professional capacity to connect to the correct secure credentials database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Job Seeker */}
          <div 
            onClick={() => onNavigate(isLogin ? '/seeker-login' : '/seeker-register')}
            className="group p-8 bg-white border border-slate-200 hover:border-emerald-600 rounded-3xl space-y-6 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900 font-heading">
                  Job Seeker / Candidate
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Improve skills, build verified resumes, check ATS compatibility, prepare for interviews, and get hired.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-bold text-gray-400 group-hover:text-emerald-700 uppercase tracking-wider transition-colors">
              <span>{isLogin ? 'Sign In as Seeker' : 'Create Seeker Profile'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Employer */}
          <div 
            onClick={() => onNavigate(isLogin ? '/employer-login' : '/employer-register')}
            className="group p-8 bg-white border border-slate-200 hover:border-indigo-600 rounded-3xl space-y-6 cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900 font-heading">
                  Employer / Recruiter
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Post high-priority vacancies, review smart resume matches, verify candidate backgrounds, and manage pipelines.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-bold text-gray-400 group-hover:text-indigo-700 uppercase tracking-wider transition-colors">
              <span>{isLogin ? 'Sign In as Recruiter' : 'Register Enterprise'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* DPDP Compliance Notice */}
        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[9px] text-slate-400 flex items-start gap-2.5 mt-10 leading-relaxed font-sans">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            JOB Lo protects accounts with cryptographic hash credentials. Under Section 8 of the Indian Digital Personal Data Protection (DPDP) Act, your authentication logs and details are encrypted and securely retained.
          </span>
        </div>

      </section>
    </div>
  );
}
