import React, { useState } from 'react';
import { FileText, Sparkles, ShieldCheck, CheckCircle2, Download, RefreshCw, UploadCloud } from 'lucide-react';
import ResumeUpload from '../../components/forms/ResumeUpload';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface ResumeBuilderPageProps {
  onNavigate: (path: string) => void;
}

export default function ResumeBuilderPage({ onNavigate }: ResumeBuilderPageProps) {
  const [useUpload, setUseUpload] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98765 43210',
    skills: 'React 19, TypeScript, Next.js 15, Tailwind CSS',
    experience: 'Frontend Engineer at Linear Labs (1.5 years). Developed rapid layout design systems and REST pipelines.',
    education: 'B.Tech in Computer Science, Delhi Technological University'
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [parsingScore, setParsingScore] = useState<number | null>(null);

  const handleInputChange = (field: string, val: string) => {
    setProfile({ ...profile, [field]: val });
  };

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFile(fileName);
    setAiAnalyzing(true);
    // Simulate smart backend resume parser parsing the PDF
    setTimeout(() => {
      setAiAnalyzing(false);
      setParsingScore(92);
      console.log(`[AI Analytics] Resume parsed: ${fileName}. Match Score generated: 92%`);
    }, 2500);
  };

  const triggerDownloadDemo = () => {
    // Simulated PDF render dispatch
    console.log('[Security] Dispatching resume download payload inside safe iframe environment.');
    alert("Resume template download initiated! Sourced in premium PDF format.");
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Resume Parser & Profile Builder" 
        description="Verify your CV score against corporate pipelines. Draft clean PDF resumes using Indian recruiting standard layouts or scan existing files." 
        h1Text="JOB Lo Premium Resume Vault"
      />

      <Breadcrumbs items={[{ label: 'Resume Analyzer', path: '/resume-builder' }]} onNavigate={onNavigate} />

      {/* HEADER HERO */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            DPDP Verified Privacy Encrypted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Resume Vault & Parser
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Design a professional verified CV template or scan your existing PDF to test alignment scores. Sourced using robust local mathematical models.
          </p>
        </div>
      </section>

      {/* DUAL MODE FORM GRID */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONTROL AND FORMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SELECTOR SEGMENT */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-2">
            <button
              onClick={() => setUseUpload(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                !useUpload 
                  ? 'bg-black text-white' 
                  : 'text-gray-500 hover:text-black hover:bg-slate-50'
              }`}
            >
              Construct Fresh Profile
            </button>
            <button
              onClick={() => setUseUpload(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                useUpload 
                  ? 'bg-black text-white' 
                  : 'text-gray-500 hover:text-black hover:bg-slate-50'
              }`}
            >
              Analyze Existing Resume PDF
            </button>
          </div>

          {!useUpload ? (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4 animate-fadeIn">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">Manual Profile Coordinates</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Candidate Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Electronic Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Phone Coordinate (India)</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Core Tech Competencies</label>
                  <input
                    type="text"
                    value={profile.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Work Practice Chronology</label>
                  <textarea
                    value={profile.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800 h-24 resize-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Educational Background</label>
                  <input
                    type="text"
                    value={profile.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] text-slate-400">Inputs are temporarily saved locally inside browser session cache.</p>
                <button
                  onClick={triggerDownloadDemo}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Profile</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4 animate-fadeIn">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">Secured Threat-Screened Upload</h2>
              
              <ResumeUpload onUploadSuccess={handleUploadSuccess} />

              {aiAnalyzing && (
                <div className="p-4 border border-indigo-150 bg-indigo-50/20 rounded-xl flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                  <div className="leading-tight text-xs font-sans text-indigo-950">
                    <p className="font-bold">Automated Profile Decomposition...</p>
                    <p className="text-[10px] text-indigo-700">Matching technical fields against PostgreSQL database schema constraints.</p>
                  </div>
                </div>
              )}

              {uploadedFile && !aiAnalyzing && parsingScore && (
                <div className="p-5 border border-emerald-200 bg-emerald-50/20 rounded-xl space-y-3.5 text-xs text-gray-500 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span>CV Decomposition Diagnostics Complete</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-gray-400">Parser Status:</span>
                      <strong className="text-emerald-700 block">PARSED (100% compliant)</strong>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-gray-400">Discovered Skills:</span>
                      <strong className="text-slate-800 block">React, TypeScript, CSS</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] border-t border-emerald-100 pt-3">
                    <span>Target alignment score: <strong>{parsingScore}% Match</strong></span>
                    <button
                      onClick={() => onNavigate('/ai-job-match')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Audit Compatibility Listings
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT METADATA PANEL */}
        <div className="space-y-6">
          
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase">Vault Safety Pledge</h3>
            
            <div className="space-y-3 text-[11px] text-gray-500 leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>DPDP Consent Lock: </strong>No recruiter can access your resume coordinates unless you explicitly click the "Quick Apply" trigger on a listing.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Automated Cleanse: </strong>Documents that fail our automated virus signatures are immediately removed. No malware is ever persistent inside our storage buckets.
                </p>
              </div>
            </div>
          </div>

          {/* SIMULATED TEMPLATE SELECTOR */}
          <div className="border border-slate-100 p-5 rounded-xl space-y-3 text-xs text-gray-500">
            <h4 className="font-bold text-gray-800">Available Templates (ATS Compliant)</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-800">Minimalist Slate Layout</span>
                <span className="text-[10px] text-emerald-700 font-bold">Standard</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-white">
                <span className="font-semibold text-slate-400">Technical Developer Grid</span>
                <span className="text-[10px] text-gray-400">Disabled</span>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
