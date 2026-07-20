import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, RefreshCw, BarChart2, Lightbulb, AlertCircle } from 'lucide-react';
import { jobRepository } from '../../repositories/jobRepository';
import { Job } from '../../types';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { LoadingState } from '../../components/common/StatusMessages';

interface AIJobMatchPageProps {
  onNavigate: (path: string) => void;
  onApplyDemo: (title: string, company: string) => void;
}

export default function AIJobMatchPage({ onNavigate, onApplyDemo }: AIJobMatchPageProps) {
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(['React 19', 'TypeScript', 'Tailwind CSS']);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [inputValue, setInputValue] = useState('');

  const preSets = ['React 19', 'TypeScript', 'Next.js 15', 'Tailwind CSS', 'Figma', 'SQL', 'Cypress'];

  const calculateMatches = async (skillsList: string[]) => {
    setLoading(true);
    // Simulate smart client-side matching algorithm
    setTimeout(async () => {
      const allJobs = await jobRepository.getJobs();
      const published = allJobs.filter(j => !j.status || j.status === 'Published');
      
      const scored = published.map(job => {
        // Calculate overlap ratio
        const overlap = job.skills.filter(s => skillsList.includes(s));
        const ratio = skillsList.length > 0 ? (overlap.length / job.skills.length) * 100 : 50;
        const finalScore = Math.min(100, Math.max(40, Math.round(ratio + 30))); // Normalise score

        return { ...job, aiMatchScore: finalScore };
      });

      // Sort by match score descending
      const sorted = scored.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
      setMatchedJobs(sorted);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    calculateMatches(userSkills);
  }, []);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !userSkills.includes(trimmed)) {
      const updated = [...userSkills, trimmed];
      setUserSkills(updated);
      calculateMatches(updated);
    }
    setInputValue('');
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = userSkills.filter(s => s !== skill);
    setUserSkills(updated);
    calculateMatches(updated);
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="AI Career Matcher Diagnostics" 
        description="Optimize your CV skill matrix against Indian corporate pipeline rules. Verify active alignment percentages and discover missing skill benchmarks." 
        h1Text="JOB Lo AI Match Optimizer Terminal"
      />

      <Breadcrumbs items={[{ label: 'AI Match Diagnostics', path: '/ai-job-match' }]} onNavigate={onNavigate} />

      {/* BANNER HEADER */}
      <section className="bg-indigo-950 text-white border-b border-zinc-800 py-12 px-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl" />
        <div className="max-w-7xl mx-auto space-y-3 px-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Matcher Diagnostics Gateway</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
            AI Compatibility Optimizer
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Input your core technologies, operational standards, or design methodologies to test alignment indices across 18 PostgreSQL database pipelines.
          </p>
        </div>
      </section>

      {/* CORE WORKSPACE GRID */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE SKILLS BUILDER TERMINAL */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
              <BarChart2 className="w-4.5 h-4.5 text-indigo-600" />
              <span>Skill Matrix Inputs</span>
            </h2>

            {/* ADD COMPONENT FORM */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(inputValue); }}
                  placeholder="e.g. Next.js 15, Figma..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold text-gray-800"
                />
                <button
                  onClick={() => handleAddSkill(inputValue)}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Insert
                </button>
              </div>

              {/* QUICK CHEATS */}
              <div className="flex flex-wrap gap-1">
                {preSets.map((ps) => {
                  const selected = userSkills.includes(ps);
                  return (
                    <button
                      key={ps}
                      onClick={() => selected ? handleRemoveSkill(ps) : handleAddSkill(ps)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer select-none ${
                        selected 
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                          : 'bg-slate-50 text-gray-400 border border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {selected ? `✓ ${ps}` : `+ ${ps}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIST OF ACTIVE TAGS */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-[10px] text-gray-400 font-extrabold uppercase">Analyzed Skill Bounds ({userSkills.length})</label>
              <div className="flex flex-wrap gap-1.5">
                {userSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-950 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg"
                  >
                    <span>{sk}</span>
                    <button 
                      onClick={() => handleRemoveSkill(sk)}
                      className="text-indigo-400 hover:text-indigo-800 font-bold ml-1.5 cursor-pointer text-xs leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* DYNAMIC OPTIMIZER ADVICE PANEL */}
          <div className="p-5 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Optimizing Diagnostics</span>
            </div>
            <p className="leading-relaxed">
              Adding <strong>Figma</strong> or <strong>Next.js 15</strong> triggers higher match alignment scores for Product Design and Frontend Developer tracks respectively. Corporate scraper webhooks prioritize these combinations.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: MATCHED RESULTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-100">
            <span>Dynamic compatibility matches sorted by fit priority</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full font-bold">Active Indices: {matchedJobs.length}</span>
          </div>

          {loading ? (
            <LoadingState message="Calculating vector alignment distances inside local state cache..." />
          ) : matchedJobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-gray-800 uppercase">Input Matrix Depleted</h3>
              <p className="text-[11px] text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Add skills on the left to activate our alignment scoring vectors.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {matchedJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="group bg-white border border-slate-200/80 rounded-xl p-5 hover:border-indigo-300 transition-all cursor-pointer relative"
                  onClick={() => onNavigate(`/jobs/${job.slug}`)}
                >
                  {/* ALIGNMENT GAUGE */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 font-mono font-bold text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <span>{job.aiMatchScore}% Match</span>
                  </div>

                  <div className="space-y-3.5 pr-24">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded bg-zinc-950 text-white flex items-center justify-center text-xs">
                        {job.companyLogo}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-gray-500">{job.companyName}</h3>
                        <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors">{job.title}</h4>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.map((skill, i) => {
                        const isMatched = userSkills.includes(skill);
                        return (
                          <span 
                            key={i} 
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                              isMatched 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                : 'bg-slate-50 text-gray-400'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-slate-50 mt-4">
                    <span>{job.location} • {job.salary.split(' / ')[0]}</span>
                    <button className="text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 cursor-pointer">
                      <span>Detailed diagnostics</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </section>

    </div>
  );
}
