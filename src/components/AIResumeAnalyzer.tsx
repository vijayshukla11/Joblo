import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagnosticRule {
  id: string;
  category: 'impact' | 'keywords' | 'formatting' | 'basics';
  status: 'pass' | 'fail' | 'warn';
  title: string;
  desc: string;
  recommendation: string;
}

const TEMPLATE_RESUMES = [
  {
    name: 'Vijay Kumar - Fresher Software Engineer',
    role: 'Frontend Developer',
    score: 64,
    skills: 'HTML, CSS, JavaScript, Basic React, Git',
    rules: [
      { id: 'r1', category: 'impact', status: 'fail', title: 'Weak Action Verbs', desc: 'Used passive words like "responsible for managing" or "assisted with".', recommendation: 'Change to high-impact verbs like "engineered", "spearheaded", or "optimized".' },
      { id: 'r2', category: 'keywords', status: 'warn', title: 'Missing Key Frameworks', desc: 'No mention of TypeScript, Next.js, or Tailwind CSS which are heavily searched for this role.', recommendation: 'Integrate React 19 concepts, TypeScript static typing, and Tailwind styles.' },
      { id: 'r3', category: 'formatting', status: 'pass', title: 'Perfect Single-Page Layout', desc: 'The resume fits cleanly on one page. Excellent visual density.', recommendation: 'Maintain this length. Do not extend.' },
      { id: 'r4', category: 'basics', status: 'pass', title: 'GitHub Portfolio Linked', desc: 'Valid GitHub profile found in header.', recommendation: 'Ensure pinning your best 3 projects with readmes.' },
    ] as DiagnosticRule[]
  },
  {
    name: 'Priyanka Sharma - Associate Product Manager',
    role: 'Product Manager',
    score: 82,
    skills: 'User Research, Wireframing, Agile, JIRA, SQL, Product Analytics',
    rules: [
      { id: 'r1', category: 'impact', status: 'pass', title: 'Excellent Metric Quantification', desc: '80% of project descriptions include tangible metrics (e.g., "boosted retention by 14%").', recommendation: 'Keep these metrics up-to-date with your latest project launches.' },
      { id: 'r2', category: 'keywords', status: 'warn', title: 'A/B Testing Terminology Missing', desc: 'Mention of split testing or telemetry analytics is sparse.', recommendation: 'Add words like "A/B testing", "Amplitude", or "Mixpanel metrics".' },
      { id: 'r3', category: 'formatting', status: 'pass', title: 'Modern Clean Typography', desc: 'Inter font with proper weight distribution used.', recommendation: 'Maintain font consistency across export types.' },
      { id: 'r4', category: 'basics', status: 'fail', title: 'No LinkedIn Personal URL', desc: 'LinkedIn URL is completely missing or unlinked.', recommendation: 'Add a professional custom LinkedIn handle in the header section.' },
    ] as DiagnosticRule[]
  }
];

export default function AIResumeAnalyzer() {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<typeof TEMPLATE_RESUMES[0] | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const startMockAnalysis = (fileName: string, templateIndex = 0) => {
    setAnalyzing(true);
    setUploadedFile(fileName);
    setActiveAnalysis(null);

    // Simulate AI deep scan
    setTimeout(() => {
      setAnalyzing(false);
      setActiveAnalysis(TEMPLATE_RESUMES[templateIndex]);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      startMockAnalysis(file.name, 0); // Analyze using standard developer template
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startMockAnalysis(file.name, 0);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const resetAnalyzer = () => {
    setActiveAnalysis(null);
    setUploadedFile(null);
  };

  return (
    <div id="resume-analyzer-section" className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3 border border-emerald-100">
          ✨ AI CO-PILOT
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 font-sans">
          AI Resume Optimizer
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Upload your resume to get instant ATS scores, identify critical missing industry keywords, and receive specific wording edits designed to match recruiters' search filters.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedFile && !analyzing && (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Drag & Drop Box */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleTriggerUpload}
              className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-50/40 scale-[0.99]' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-800">
                Drag & drop your resume file here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports PDF, DOC, DOCX up to 5MB
              </p>
              <button className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition-colors">
                Browse Files
              </button>
            </div>

            {/* Test Templates */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center md:text-left">
                No resume ready? Test with dynamic candidate profiles:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TEMPLATE_RESUMES.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => startMockAnalysis(`${t.role}_Sample.pdf`, idx)}
                    className="flex items-start text-left p-3.5 bg-white rounded-lg border border-gray-200 hover:border-emerald-500 hover:shadow-xs transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-emerald-50 text-gray-500 group-hover:text-emerald-600 mr-3 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-700">
                        {t.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        Targeting: <span className="text-gray-700 font-medium">{t.role}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {analyzing && (
          <motion.div
            key="analyzing-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Scanning Resume Integrity</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">
              Evaluating word weights, cross-referencing industry standard key terms, and calculating semantic relevance...
            </p>
          </motion.div>
        )}

        {uploadedFile && activeAnalysis && (
          <motion.div
            key="analysis-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Result */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{uploadedFile}</h3>
                  <p className="text-xs text-gray-500">
                    Optimized for <span className="font-semibold text-gray-700">{activeAnalysis.role}</span> listings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-medium">ATS Match Score</span>
                  <span className={`text-2xl font-black ${
                    activeAnalysis.score >= 80 ? 'text-emerald-600' : 'text-amber-500'
                  }`}>
                    {activeAnalysis.score}%
                  </span>
                </div>
                <button
                  onClick={resetAnalyzer}
                  className="p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-lg hover:shadow-xs transition-all"
                  title="Upload Another Resume"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Critical Weakness</span>
                <span>Optimized Expert (85%+)</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    activeAnalysis.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${activeAnalysis.score}%` }}
                />
              </div>
            </div>

            {/* Detailed Audit Checklist */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Actionable Checklist Checklist
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {activeAnalysis.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center gap-3 justify-between ${
                      rule.status === 'pass'
                        ? 'bg-emerald-50/10 border-emerald-100'
                        : rule.status === 'fail'
                        ? 'bg-rose-50/10 border-rose-100'
                        : 'bg-amber-50/10 border-amber-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {rule.status === 'pass' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                        {rule.status === 'fail' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                        {rule.status === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900">{rule.title}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">{rule.desc}</p>
                        <p className="text-xs text-gray-700 font-semibold mt-1 bg-white inline-block px-2 py-0.5 rounded border border-gray-100 shadow-3xs">
                          💡 Suggestion: {rule.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Optimization Tips */}
            <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
              <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                🚀 Dynamic Keyword Booster
              </h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Our analysis suggests integrating the following trending skills to boost matching by up to 18%: <strong>{activeAnalysis.skills}</strong>. Try mentioning actual metrics such as <em>"reduced load speed by 25%"</em> or <em>"collaborated in a 4-person sprint"</em> to establish high-intent credibility.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
