import React, { useState, useEffect } from 'react';
import { 
  Landmark, FileText, Plus, Trash2, Edit2, Search, Filter, 
  X, Check, AlertCircle, Calendar, MapPin, DollarSign, ExternalLink, RefreshCw,
  Eye, Globe, ArrowLeft, ArrowRight, ShieldCheck, Tag
} from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { GovernmentJob } from '../../../types';

export default function GovernmentJobsAdmin() {
  const [govJobs, setGovJobs] = useState<GovernmentJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyFilter, setBodyFilter] = useState<'All' | 'UPSC' | 'SSC' | 'State PSC' | 'Bank PO' | 'Railways'>('All');
  const [expFilter, setExpFilter] = useState<'All' | 'Fresher' | 'Required'>('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bulk select states
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTab, setFormTab] = useState<'edit' | 'preview'>('edit');
  const [editingJob, setEditingJob] = useState<GovernmentJob | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    slug: '',
    location: '',
    salary: '',
    experience: 'Fresher',
    examBody: 'SSC',
    officialLink: '',
    syllabusLink: '',
    applicationDeadline: '',
    skillsRequired: '',
    eligibility: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGovernmentJobs();
      setGovJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Slugifier Helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Sync title & department to slug automatically if untouched
  const handleTitleOrDeptChange = (titleVal: string, deptVal: string) => {
    const isEditing = !!editingJob;
    const combined = `${deptVal} ${titleVal}`;
    const previousSlug = slugify(combined);
    const hasCustomSlug = formData.slug !== previousSlug && formData.slug !== '';

    setFormData(prev => {
      const updated = { ...prev, title: titleVal, department: deptVal };
      if (!isEditing && !hasCustomSlug) {
        updated.slug = slugify(`${deptVal} ${titleVal}`);
      }
      return updated;
    });
  };

  const handleOpenAdd = () => {
    setEditingJob(null);
    setFormError(null);
    setFormTab('edit');
    setFormData({
      title: '',
      department: '',
      slug: '',
      location: 'New Delhi, Delhi NCR',
      salary: 'Pay Level 7 (₹44,900 - ₹1,42,400)',
      experience: 'Fresher',
      examBody: 'SSC',
      officialLink: 'https://ssc.gov.in',
      syllabusLink: 'https://ssc.gov.in/syllabus',
      applicationDeadline: '',
      skillsRequired: 'Logical Reasoning, Quantitative Aptitude, General Awareness',
      eligibility: 'Bachelor Degree in any discipline with minimum 55% marks from a recognized university. Age Limit: 18-30 Years.',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: 'government jobs, sarkari naukri, central government',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: GovernmentJob) => {
    setEditingJob(job);
    setFormError(null);
    setFormTab('edit');
    setFormData({
      title: job.title,
      department: job.department,
      slug: job.slug,
      location: job.location,
      salary: job.salary,
      experience: job.experience || 'Fresher',
      examBody: job.examBody || 'SSC',
      officialLink: (job as any).officialLink || 'https://www.india.gov.in',
      syllabusLink: job.syllabusLink || '',
      applicationDeadline: job.applicationDeadline || '',
      skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : '',
      eligibility: job.eligibility || '',
      seoTitle: job.seoTitle || '',
      seoDescription: job.seoDescription || '',
      seoKeywords: job.seoKeywords || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this government gazette listing?')) {
      return;
    }
    try {
      await adminService.deleteGovernmentJob(jobId);
      await loadJobs();
      setSelectedJobIds(prev => prev.filter(id => id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim() || !formData.department.trim() || !formData.eligibility.trim() || !formData.slug.trim()) {
      setFormError('Job Title, Department, Eligibility, and Slug are required.');
      return;
    }

    try {
      const parsedSkills = formData.skillsRequired
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const finalSlug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

      const payload: GovernmentJob = {
        id: editingJob ? editingJob.id : `gov-${Date.now()}`,
        slug: finalSlug,
        title: formData.title,
        department: formData.department,
        logo: '🏛️',
        location: formData.location,
        salary: formData.salary,
        experience: formData.experience as 'Fresher' | 'Required',
        examBody: formData.examBody as 'SSC' | 'UPSC' | 'State PSC' | 'Bank PO' | 'Railways',
        postedDate: editingJob ? editingJob.postedDate : new Date().toLocaleDateString('en-IN'),
        syllabusLink: formData.syllabusLink,
        applicationDeadline: formData.applicationDeadline,
        skillsRequired: parsedSkills,
        eligibility: formData.eligibility,
        seoTitle: formData.seoTitle || `${formData.department} ${formData.title} Recruitment 2026`,
        seoDescription: formData.seoDescription || `${formData.department} is hiring for ${formData.title}. Learn qualification, salary, and age limits here.`,
        seoKeywords: formData.seoKeywords,
      };

      // Handle custom properties
      (payload as any).officialLink = formData.officialLink;

      await adminService.saveGovernmentJob(payload);
      setIsFormOpen(false);
      await loadJobs();
      setSelectedJobIds([]);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save gazette registry specifications.');
    }
  };

  // --- BULK ACTION HANDLERS ---
  const handleBulkDelete = async () => {
    if (selectedJobIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedJobIds.length} listings permanently?`)) return;
    try {
      await Promise.all(selectedJobIds.map(id => adminService.deleteGovernmentJob(id)));
      await loadJobs();
      setSelectedJobIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkExamBodyUpdate = async (body: 'SSC' | 'UPSC' | 'State PSC' | 'Bank PO' | 'Railways') => {
    if (selectedJobIds.length === 0) return;
    try {
      await Promise.all(
        selectedJobIds.map(async (id) => {
          const job = govJobs.find(j => j.id === id);
          if (job) {
            await adminService.saveGovernmentJob({ ...job, examBody: body });
          }
        })
      );
      await loadJobs();
      setSelectedJobIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // --- SEARCH & FILTERS ---
  const filteredJobs = govJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBody = bodyFilter === 'All' || job.examBody === bodyFilter;
    const matchesExp = expFilter === 'All' || job.experience === expFilter;

    return matchesSearch && matchesBody && matchesExp;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, bodyFilter, expFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <span>Government Vacancy Gazette Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Draft, publish, and maintain verified government notifications, syllabus links, exam calendars, and application links.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Gazette</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Connecting to Public Gazette cache...</span>
        </div>
      ) : (
        <>
          {/* SEARCH, COMMISSION FILTER, AND EXPERIENCE SELECTOR */}
          {!isFormOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="relative col-span-1 md:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Gazettes / Departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Commission:</span>
                <select
                  value={bodyFilter}
                  onChange={(e: any) => setBodyFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                >
                  <option value="All">All Commissions</option>
                  <option value="UPSC">UPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="State PSC">State PSC</option>
                  <option value="Bank PO">Banking / IBPS</option>
                  <option value="Railways">Railways</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Eligibility:</span>
                <select
                  value={expFilter}
                  onChange={(e: any) => setExpFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                >
                  <option value="All">All Eligibility levels</option>
                  <option value="Fresher">Freshers Allowed</option>
                  <option value="Required">Prior Experience Required</option>
                </select>
              </div>
            </div>
          )}

          {/* BULK ACTION PANEL */}
          {selectedJobIds.length > 0 && !isFormOpen && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl text-xs animate-fadeIn">
              <span className="font-bold text-emerald-800">
                {selectedJobIds.length} gazette entries selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkExamBodyUpdate('UPSC')}
                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded text-[10px] font-semibold cursor-pointer"
                >
                  Set UPSC
                </button>
                <button
                  onClick={() => handleBulkExamBodyUpdate('SSC')}
                  className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded text-[10px] font-semibold cursor-pointer"
                >
                  Set SSC
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* FORM DIALOG SECTION WITH LIVE HIGH-FIDELITY PREVIEW TAB */}
          {isFormOpen && (
            <div className="space-y-4 text-left animate-fadeIn">
              
              {/* Form Mode Selector */}
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormTab('edit')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      formTab === 'edit' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Specifications Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab('preview')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      formTab === 'preview' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>👁️ Live Gazette Preview</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {formTab === 'edit' ? (
                <form onSubmit={handleSubmit} className="bg-slate-50/40 border border-slate-150 p-5 rounded-2xl space-y-4">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Recruitment Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Assistant Section Officer (ASO)"
                        value={formData.title}
                        onChange={(e) => handleTitleOrDeptChange(e.target.value, formData.department)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Government Ministry / Department *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ministry of External Affairs"
                        value={formData.department}
                        onChange={(e) => handleTitleOrDeptChange(formData.title, e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">SEO Friendly Slug *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, slug: slugify(`${formData.department} ${formData.title}`) })}
                          className="text-[10px] text-emerald-600 hover:underline font-bold"
                        >
                          Auto-generate slug
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ssc-aso-recruitment-2026"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Exam Board Commission</label>
                      <select
                        value={formData.examBody}
                        onChange={(e) => setFormData({ ...formData, examBody: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        <option value="SSC">SSC (Staff Selection Commission)</option>
                        <option value="UPSC">UPSC (Union Public Service Commission)</option>
                        <option value="State PSC">State PSC (Provincial Commission)</option>
                        <option value="Bank PO">Bank PO / IBPS Services</option>
                        <option value="Railways">RRB Railways</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Job Location Region</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Salary Scale / Pay Level Matrix</label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Official Application Link</label>
                      <input
                        type="url"
                        value={formData.officialLink}
                        onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Official Syllabus / Rules Document Link</label>
                      <input
                        type="url"
                        value={formData.syllabusLink}
                        onChange={(e) => setFormData({ ...formData, syllabusLink: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Application Submission Deadline *</label>
                      <input
                        type="date"
                        required
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Skills / Syllabus Chapters (comma list)</label>
                      <input
                        type="text"
                        placeholder="e.g. General Intelligence, Quantitative Aptitude"
                        value={formData.skillsRequired}
                        onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Prior Experience Requirement</label>
                      <div className="flex gap-4 pt-1.5">
                        {['Fresher', 'Required'].map(exp => (
                          <label key={exp} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              name="gov-exp"
                              value={exp}
                              checked={formData.experience === exp}
                              onChange={(e: any) => setFormData({ ...formData, experience: e.target.value })}
                              className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            <span>{exp === 'Fresher' ? 'Fresher Allowed' : 'Prior Govt Service Required'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Detailed Eligibility & Age Limit parameters *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe qualifications, minimum percentage limits, and upper age ceiling limits..."
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* SEO OVERRIDES */}
                    <div className="md:col-span-2 space-y-4 border-t border-slate-150 pt-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide font-heading flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>SEO Configuration Override</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Title</label>
                          <input
                            type="text"
                            placeholder="Defaults to standard job title"
                            value={formData.seoTitle}
                            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Keywords Tags</label>
                          <input
                            type="text"
                            placeholder="e.g. Sarkari Naukri, UPSC Vacancy 2026"
                            value={formData.seoKeywords}
                            onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Description</label>
                          <textarea
                            rows={2}
                            placeholder="Defaults to department name + title description"
                            value={formData.seoDescription}
                            onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      {/* SERP PREVIEW */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Google SERP Index Preview</span>
                        <div className="pt-1.5">
                          <div className="text-[14px] text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                            {formData.seoTitle || `${formData.department} ${formData.title} Recruitment 2026 | JOB Lo`}
                          </div>
                          <div className="text-[12px] text-[#006621] leading-none mt-0.5">
                            https://joblo.in/government-jobs/{formData.slug || 'slug-placeholder'}
                          </div>
                          <div className="text-[12px] text-[#545454] leading-relaxed mt-1 max-w-2xl">
                            {formData.seoDescription || `${formData.department} is accepting applications for ${formData.title}. Eligible candidates must fit qualifications before the application deadline.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {editingJob ? 'Update Gazette Listing' : 'Publish Gazette'}
                    </button>
                  </div>
                </form>
              ) : (
                /* HIGH FIDELITY GAZETTE LIVE PREVIEW MODE */
                <div className="bg-amber-50/15 border border-amber-100 rounded-2xl p-6 md:p-8 space-y-6 text-slate-800 animate-fadeIn shadow-2xs max-w-3xl mx-auto">
                  
                  {/* Government official look header */}
                  <div className="border-b-4 border-double border-slate-300 pb-5 text-center space-y-2">
                    <div className="text-3xl">🏛️</div>
                    <span className="text-[9px] font-extrabold uppercase font-mono tracking-widest text-slate-500 block">Official Recruitment Gazette Notification</span>
                    <h1 className="text-sm font-extrabold text-slate-900 font-sans tracking-wide uppercase">
                      {formData.department || 'GOVERNMENT DEPARTMENT OFFICE'}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[8px] font-bold px-2 py-0.5 rounded font-mono">
                      COMMISSION BODY: {formData.examBody}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-base md:text-lg font-extrabold text-slate-950 text-center font-heading">
                      Notification for selection to the post of: {formData.title || 'VACANT POSITION SPECIFICATION'}
                    </h2>

                    {/* Gazette Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Posting Headquarters</p>
                          <p className="font-bold text-slate-800">{formData.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Salary scale matrix</p>
                          <p className="font-bold text-slate-800">{formData.salary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Notification Date</p>
                          <p className="font-bold text-slate-800">{new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-[10px] text-rose-400 font-bold uppercase font-mono">Last date of submission</p>
                          <p className="font-bold text-rose-700">{formData.applicationDeadline || 'Not defined'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility details */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-150 pb-1 font-mono">
                        Section I. Essential Qualification & Age limits
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600 font-sans whitespace-pre-line">
                        {formData.eligibility}
                      </p>
                    </div>

                    {/* Skills Required */}
                    {formData.skillsRequired && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-150 pb-1 font-mono">
                          Section II. Syllabus Core Focus Fields
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {formData.skillsRequired.split(',').map((sk, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-150 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                              {sk.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                      <a
                        href={formData.officialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Register & Apply Online</span>
                      </a>

                      {formData.syllabusLink && (
                        <a
                          href={formData.syllabusLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 px-4 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download Official Syllabus PDF</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TABLE AND DATA RENDER GRID */}
          {!isFormOpen && (
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-slate-150 text-left text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={govJobs.length > 0 && selectedJobIds.length === govJobs.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedJobIds(govJobs.map(j => j.id));
                              } else {
                                setSelectedJobIds([]);
                              }
                            }}
                            className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3">Department & Title</th>
                        <th className="py-3 px-3">Commission</th>
                        <th className="py-3 px-3">Headquarters</th>
                        <th className="py-3 px-3">Pay Scale</th>
                        <th className="py-3 px-3">Deadline</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {paginatedJobs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                            No verified public gazettes found.
                          </td>
                        </tr>
                      ) : (
                        paginatedJobs.map((job) => {
                          const isChecked = selectedJobIds.includes(job.id);
                          return (
                            <tr key={job.id} className="hover:bg-slate-50/50">
                              <td className="py-3.5 px-3">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedJobIds([...selectedJobIds, job.id]);
                                    } else {
                                      setSelectedJobIds(selectedJobIds.filter(id => id !== job.id));
                                    }
                                  }}
                                  className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{job.title}</span>
                                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                                      {job.experience}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{job.department}</p>
                                  <p className="text-[9px] text-slate-500 font-mono font-bold">/slug: {job.slug}</p>
                                </div>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                  <span>{job.examBody}</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-slate-700">{job.location}</td>
                              <td className="py-3.5 px-3 font-semibold text-slate-700">{job.salary}</td>
                              <td className="py-3.5 px-3">
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
                                  <Calendar className="w-3 h-3 text-rose-500 shrink-0" />
                                  <span>{job.applicationDeadline}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEdit(job)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(job.id)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 border border-rose-150 rounded-md hover:bg-rose-50 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAGINATION PANEL */}
              {filteredJobs.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  <span>
                    Showing {startIndex + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} listings
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold px-2">Page {currentPage} of {totalPages}</span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-1 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
