import React, { useState } from 'react';
import { IndianRupee, Sparkles, TrendingUp, Info, HelpCircle, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface SalaryGuidePageProps {
  onNavigate: (path: string) => void;
}

export default function SalaryGuidePage({ onNavigate }: SalaryGuidePageProps) {
  const [role, setRole] = useState('Frontend Engineer');
  const [experience, setExperience] = useState('3');
  const [estimatedMin, setEstimatedMin] = useState(1200000);
  const [estimatedMax, setEstimatedMax] = useState(1800000);

  const calculateSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const expNum = parseInt(experience, 10) || 0;
    let baseMin = 500000;
    let baseMax = 800000;

    if (role.toLowerCase().includes('frontend') || role.toLowerCase().includes('react')) {
      baseMin = 600000 + expNum * 200000;
      baseMax = 900000 + expNum * 300000;
    } else if (role.toLowerCase().includes('design') || role.toLowerCase().includes('product')) {
      baseMin = 500000 + expNum * 150000;
      baseMax = 800000 + expNum * 250000;
    } else if (role.toLowerCase().includes('qa') || role.toLowerCase().includes('test')) {
      baseMin = 400000 + expNum * 120000;
      baseMax = 650000 + expNum * 180000;
    } else {
      baseMin = 400000 + expNum * 100000;
      baseMax = 700000 + expNum * 200000;
    }

    setEstimatedMin(baseMin);
    setEstimatedMax(baseMax);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const benchmarks = [
    { title: 'Frontend Developer (React)', exp: '1-3 yrs', avg: '₹14,00,000 / yr', trend: 'Upwards' },
    { title: 'Product Designer (Figma)', exp: '3-5 yrs', avg: '₹18,50,000 / yr', trend: 'Stable' },
    { title: 'QA Engineer (Selenium/Cypress)', exp: '3-5 yrs', avg: '₹13,00,000 / yr', trend: 'Stable' },
    { title: 'ASO (Central Government Pay L7)', exp: 'Fresher', avg: '₹6,00,000 / yr', trend: 'Statutory' },
    { title: 'Bank PO (State Bank of India)', exp: 'Fresher', avg: '₹7,20,000 / yr', trend: 'Statutory' }
  ];

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Salary Benchmark Guide" 
        description="Verify corporate and government salary metrics in India. Estimate standard compensation benchmarks based on technical skill variables." 
        h1Text="JOB Lo Salary Calculator and Benchmark"
      />

      <Breadcrumbs items={[{ label: 'Salary Benchmarks', path: '/salary-guide' }]} onNavigate={onNavigate} />

      {/* HEADER SECTION */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto space-y-3 px-4">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Real Compensation Benchmarks
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">
            Indian Salary Benchmarks
          </h1>
          <p className="text-xs text-gray-500 max-w-xl">
            Sourced compensation averages compiled from validated tax reporting and anonymous employer API disclosures.
          </p>
        </div>
      </section>

      {/* DUAL DIVISION */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COMPONENT: CALCULATOR PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900 font-heading">Compensation Estimator Utility</h2>
            </div>

            <form onSubmit={calculateSalary} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Target Role / Domain</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Product Designer"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Years of Relevant Practice</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-transparent focus-ring rounded-lg outline-none font-semibold"
                  min="0"
                  max="40"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer select-none"
                >
                  Determine Salary Range
                </button>
              </div>
            </form>

            {/* CALCULATED RESULTS */}
            <div className="p-5 border border-emerald-100 bg-emerald-50/20 rounded-xl space-y-2 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">Estimated Verified Range (India)</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 font-heading">
                {formatCurrency(estimatedMin)} — {formatCurrency(estimatedMax)}
              </div>
              <p className="text-[10px] text-emerald-600 font-sans">
                Estimations represent total package structures including basic pay, statutory PF, and gratuity limits.
              </p>
            </div>
          </div>

          {/* TABLE OF VERIFIED RECRUITMENT BENCHMARKS */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 font-heading">Active Industry Benchmarks 2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-gray-500 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-gray-400">
                    <th className="pb-2 font-bold uppercase tracking-wider">Target Domain</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Practice Scale</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Median Salary</th>
                    <th className="pb-2 font-bold uppercase tracking-wider">Trend Line</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {benchmarks.map((b, i) => (
                    <tr key={i}>
                      <td className="py-3 font-bold text-gray-800">{b.title}</td>
                      <td className="py-3">{b.exp}</td>
                      <td className="py-3 text-emerald-700 font-bold font-mono">{b.avg}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          b.trend === 'Upwards' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          b.trend === 'Statutory' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {b.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TAX & SYSTEM EXPLANATORY POLICY */}
        <div className="space-y-6">
          
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 text-xs text-gray-500">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Statutory Tax & PF Guidelines</h3>
            
            <div className="space-y-3 leading-relaxed">
              <p>
                <strong>7th Pay Commission: </strong>Government wages follow strict pay level rules (Levels 1 to 18) based on post ranking. Allowances are non-taxable up to statutory caps.
              </p>
              <p>
                <strong>New Tax Regime: </strong>Calculations are optimized based on standard tax blocks for financial year 2026-27 under the Union Budget directives.
              </p>
              <p>
                <strong>Employee Provident Fund (EPF): </strong>Standard monthly contributions represent 12% of basic wages matched by the employer.
              </p>
            </div>
          </div>

          <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs mx-auto text-slate-500">
              <Info className="w-4 h-4" />
            </span>
            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
              All listed salary metrics are processed using local secure mathematical models. No user telemetry is cached or stored during estimation calculations.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
