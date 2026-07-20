import React, { useState, useEffect } from 'react';
import { Briefcase, Search, PlusCircle, Edit2, Trash2, Copy, Eye, CheckCircle2, Archive, FileText, Calendar, DollarSign, MapPin, AlertCircle, X, Check, ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { Job } from '../../../types';
import { employerService } from '../../../services/employerService';

interface JobManagementTabProps {
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
  jobAction: { type: 'create' | 'edit' | 'preview'; jobId?: string } | null;
  onClearJobAction: () => void;
}

export default function JobManagementTab({ onShowNotification, jobAction, onClearJobAction }: JobManagementTabProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadJobs = async () => {
    const data = await employerService.getJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);
  
  // Filtering & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selected jobs for Bulk Actions
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Editing / Form state
  const [formMode, setFormMode] = useState<'list' | 'form' | 'preview'>('list');
  const [activeFormStep, setActiveFormStep] = useState(1);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    slug: '',
    location: '',
    salary: '',
    experience: '',
    employmentType: 'Full-time',
    skills: '',
    benefits: '',
    description: '',
    responsibilities: '',
    requirements: '',
    deadline: '',
    isRemote: false,
    isUrgent: false,
    isFeatured: false,
    isHot: false
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Deletion Modal State
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  // Sync to outer actions (e.g. from Overview Quick Actions)
  useEffect(() => {
    if (jobAction) {
      if (jobAction.type === 'create') {
        handleOpenCreateForm();
      } else if (jobAction.type === 'edit' && jobAction.jobId) {
        const target = jobs.find(j => j.id === jobAction.jobId);
        if (target) handleOpenEditForm(target);
      } else if (jobAction.type === 'preview' && jobAction.jobId) {
        const target = jobs.find(j => j.id === jobAction.jobId);
        if (target) {
          setEditingJob(target);
          setFormMode('preview');
        }
      }
      onClearJobAction();
    }
  }, [jobAction]);

  const handleOpenCreateForm = () => {
    setEditingJob(null);
    setFormMode('form');
    setActiveFormStep(1);
    setFormError(null);
    setFormData({
      title: '',
      category: 'Tech',
      slug: '',
      location: '',
      salary: '',
      experience: '',
      employmentType: 'Full-time',
      skills: '',
      benefits: '',
      description: '',
      responsibilities: '',
      requirements: '',
      deadline: '',
      isRemote: false,
      isUrgent: false,
      isFeatured: false,
      isHot: false
    });
  };

  const handleOpenEditForm = (job: Job) => {
    setEditingJob(job);
    setFormMode('form');
    setActiveFormStep(1);
    setFormError(null);
    setFormData({
      title: job.title,
      category: job.category || 'Tech',
      slug: job.slug,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      employmentType: job.employmentType,
      skills: job.skills.join(', '),
      benefits: (job.benefits || []).join(', '),
      description: job.description,
      responsibilities: '',
      requirements: '',
      deadline: job.deadline || '',
      isRemote: job.isRemote || false,
      isUrgent: job.isUrgent || false,
      isFeatured: job.isFeatured || false,
      isHot: job.isHot || false
    });
  };

  // Auto-slugify
  useEffect(() => {
    if (!editingJob && formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  }, [formData.title, editingJob]);

  // Form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Form Step Navigation with validations
  const handleNextStep = () => {
    setFormError(null);
    if (activeFormStep === 1) {
      if (!formData.title.trim()) {
        setFormError('Job Title is required.');
        return;
      }
      if (!formData.slug.trim()) {
        setFormError('SEO Slug is required.');
        return;
      }
      if (!formData.location.trim()) {
        setFormError('Job Location coordinates are required.');
        return;
      }
      setActiveFormStep(2);
    } else if (activeFormStep === 2) {
      if (!formData.skills.trim()) {
        setFormError('Please input at least one required developer skill.');
        return;
      }
      if (!formData.description.trim()) {
        setFormError('Job Description overview is required.');
        return;
      }
      setActiveFormStep(3);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate deadline date if set
    if (formData.deadline) {
      const d = new Date(formData.deadline);
      if (isNaN(d.getTime())) {
        setFormError('Application Deadline must be a valid calendar date.');
        return;
      }
    }

    // Go to preview state
    setFormMode('preview');
  };

  const handleSaveDraft = () => {
    saveJobWithStatus('Draft');
  };

  const handlePublish = () => {
    saveJobWithStatus('Published');
  };

  const saveJobWithStatus = async (status: 'Published' | 'Draft') => {
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const benefitsArray = formData.benefits.split(',').map(b => b.trim()).filter(b => b.length > 0);

    const payload: Job = {
      id: editingJob?.id || 'job-' + Date.now(),
      title: formData.title,
      slug: formData.slug,
      companyId: 'c-vercel-india',
      companyName: 'Vercel India',
      companyLogo: '▲',
      location: formData.location,
      country: 'India',
      salary: formData.salary || 'Competitive',
      employmentType: formData.employmentType as any,
      category: formData.category,
      experience: formData.experience || 'Not Specified',
      skills: skillsArray,
      description: formData.description,
      benefits: benefitsArray,
      deadline: formData.deadline,
      isRemote: formData.isRemote,
      isUrgent: formData.isUrgent,
      isFeatured: formData.isFeatured,
      isHot: formData.isHot,
      status: status,
      postedDate: editingJob?.postedDate || 'Just now'
    };

    await employerService.saveJob(payload);
    await loadJobs();

    if (editingJob) {
      onShowNotification(`"${payload.title}" has been successfully updated as ${status}.`, 'success');
    } else {
      onShowNotification(`New position "${payload.title}" successfully created and saved as ${status}.`, 'success');
    }

    setFormMode('list');
    setEditingJob(null);
  };

  const handleDuplicate = async (job: Job) => {
    let duplicatedSlug = `${job.slug}-copy`;
    let counter = 1;
    while (jobs.some(j => j.slug === duplicatedSlug)) {
      duplicatedSlug = `${job.slug}-copy-${counter}`;
      counter++;
    }

    const duplicated: Job = {
      ...job,
      id: 'job-dup-' + Date.now(),
      title: `${job.title} (Copy)`,
      slug: duplicatedSlug,
      status: 'Draft',
      postedDate: 'Just now'
    };

    await employerService.saveJob(duplicated);
    await loadJobs();
    onShowNotification(`Duplicated specifications into draft pipeline: "${duplicated.title}".`, 'info');
  };

  const handleDeleteTrigger = (id: string) => {
    setDeleteJobId(id);
  };

  const confirmDelete = async () => {
    if (deleteJobId) {
      await employerService.deleteJob(deleteJobId);
      await loadJobs();
      setSelectedJobIds(prev => prev.filter(id => id !== deleteJobId));
      onShowNotification('Position specs deleted from active recruiter index.', 'info');
      setDeleteJobId(null);
    }
  };

  // Bulk operations
  const handleSelectJob = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedJobIds(prev => [...prev, id]);
    } else {
      setSelectedJobIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageJobIds = paginatedJobs.map(j => j.id);
      setSelectedJobIds(prev => {
        const unique = new Set([...prev, ...pageJobIds]);
        return Array.from(unique);
      });
    } else {
      const pageJobIds = paginatedJobs.map(j => j.id);
      setSelectedJobIds(prev => prev.filter(id => !pageJobIds.includes(id)));
    }
  };

  const executeBulkAction = async () => {
    if (selectedJobIds.length === 0 || !bulkAction) return;

    for (const id of selectedJobIds) {
      const target = jobs.find(j => j.id === id);
      if (target) {
        if (bulkAction === 'publish') {
          await employerService.saveJob({ ...target, status: 'Published' });
        } else if (bulkAction === 'draft') {
          await employerService.saveJob({ ...target, status: 'Draft' });
        } else if (bulkAction === 'archive') {
          await employerService.saveJob({ ...target, status: 'Archived' });
        } else if (bulkAction === 'delete') {
          await employerService.deleteJob(id);
        }
      }
    }

    await loadJobs();
    onShowNotification(`Executed ${bulkAction} action successfully.`, 'success');
    setSelectedJobIds([]);
    setBulkAction('');
  };

  // Filter & Search Pipelines
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 text-xs animate-fadeIn">
      
      {/* 1. LIST MANAGER VIEW */}
      {formMode === 'list' && (
        <div className="space-y-4">
          
          {/* Section Head */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">Direct Sourced Vacancies</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Maintain, modify, or duplicate vacancy pipelines on JOB Lo indexing servers.</p>
            </div>
            
            <button
              onClick={handleOpenCreateForm}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-extrabold rounded-xl flex items-center gap-2 select-none cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Create Vacancy Spec</span>
            </button>
          </div>

          {/* Filters, Search & Bulk Actions Panel */}
          <div className="bg-white border border-slate-150 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-3xs">
            
            {/* Search Input */}
            <div className="relative flex items-center flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search specs by title or skills..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
            </div>

            {/* Status Segment Filters */}
            <div className="flex flex-wrap items-center gap-1.5 font-sans font-bold">
              {(['All', 'Published', 'Draft', 'Archived'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] select-none cursor-pointer transition-all ${
                    statusFilter === f
                      ? 'bg-slate-900 border-slate-900 text-white shadow-3xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Bulk Actions Selection */}
            {selectedJobIds.length > 0 && (
              <div className="flex items-center gap-2 p-1.5 bg-emerald-50 border border-emerald-100 rounded-xl animate-fadeIn">
                <span className="font-sans font-bold text-emerald-800 px-1">{selectedJobIds.length} Selected</span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer"
                >
                  <option value="">Bulk Action</option>
                  <option value="publish">Publish Selected</option>
                  <option value="draft">Save as Draft</option>
                  <option value="archive">Archive Selected</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <button
                  onClick={executeBulkAction}
                  className="px-3 py-1 bg-slate-950 text-white rounded-lg font-bold select-none cursor-pointer"
                >
                  Go
                </button>
              </div>
            )}

          </div>

          {/* Jobs Board Responsive Table / Cards Container */}
          <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mx-auto">
                  <Briefcase className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-700">No pipelines detected</p>
                  <p className="text-[10px] text-slate-400 max-w-sm mx-auto">Try refining your filter queries or instantiate a new corporate job spec.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans font-semibold">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-150 text-[10px] text-slate-400 uppercase tracking-wider font-extrabold select-none">
                      <th className="p-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={paginatedJobs.every(j => selectedJobIds.includes(j.id))}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="p-4">Position Specification</th>
                      <th className="p-4">Status Tag</th>
                      <th className="p-4">Compensation & Loc</th>
                      <th className="p-4">Attributes</th>
                      <th className="p-4 text-right">Console Triggers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedJobIds.includes(job.id)}
                            onChange={(e) => handleSelectJob(job.id, e.target.checked)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="p-4 max-w-xs sm:max-w-sm">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 text-[12px] block truncate">{job.title}</span>
                            <span className="text-[10px] text-slate-400 block font-mono font-medium">{job.slug} • {job.postedDate}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase ${
                            job.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : job.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5 font-medium text-slate-500">
                            <span className="block">{job.location}</span>
                            <span className="text-slate-400 text-[10px]">{job.salary}</span>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex gap-1">
                            {job.isUrgent && <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[8px] px-1 py-0.5 rounded font-extrabold uppercase">Urgent</span>}
                            {job.isRemote && <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[8px] px-1 py-0.5 rounded font-extrabold uppercase">Remote</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => { setEditingJob(job); setFormMode('preview'); }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Live preview specifications"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(job)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Modify coordinates"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(job)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Duplicate spec parameters"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrigger(job.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Purge specifications"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Panel */}
            {totalPages > 1 && (
              <div className="bg-slate-50 border-t border-slate-150 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-sans font-medium text-slate-500">
                  Showing <span className="font-bold text-slate-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-bold text-slate-800">{Math.min(currentPage * pageSize, filteredJobs.length)}</span> of{' '}
                  <span className="font-bold text-slate-800">{filteredJobs.length}</span> pipelines
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg disabled:opacity-45 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        currentPage === p
                          ? 'bg-slate-900 border-slate-900 text-white font-black'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg disabled:opacity-45 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. CREATE / EDIT MULTI-STEP FORM */}
      {formMode === 'form' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          
          <div className="flex justify-between items-center pb-3 border-b border-slate-150">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                {editingJob ? `Edit vacancy: ${editingJob.title}` : 'Instantiate Vacancy Specifications'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Step {activeFormStep} of 3: Provide core operational details.</p>
            </div>
            <button
              onClick={() => setFormMode('list')}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-6 shadow-3xs">
            
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-700 font-bold animate-fadeIn">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* PROGRESS BAR WIZARD */}
            <div className="flex items-center gap-1 select-none py-1">
              {[1, 2, 3].map(st => (
                <div key={st} className="flex-1 flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border ${
                    activeFormStep === st
                      ? 'bg-emerald-600 border-emerald-600 text-slate-950 font-black'
                      : activeFormStep > st
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {st}
                  </div>
                  {st < 3 && (
                    <div className={`flex-1 h-0.5 mx-1.5 ${
                      activeFormStep > st ? 'bg-slate-900' : 'bg-slate-100'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1: Basic coordinates */}
            {activeFormStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry Stream</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Tech">Tech / Web</option>
                      <option value="Design">UI & UX Product Design</option>
                      <option value="Finance">Finance & Tax</option>
                      <option value="Content">Technical Writing / Content</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Unique Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="senior-frontend-engineer-vercel"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location (City, State)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru, Karnataka or Remote"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employment Nature</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="Full-time">Full-time (Direct Contract)</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contractor (Consultant)</option>
                      <option value="Internship">Internship Training</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Required Experience Level</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g. 5 - 8 Years"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-3 justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <span>Proceed to Skills</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Skills & Requirements */}
            {activeFormStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Required Technical Skills (Comma Separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    required
                  />
                  <span className="text-[9px] text-slate-400 font-mono">Separated by commas; these determine candidate match ratios.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compensation Details / Salary Bracket</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹28,00,000 - ₹38,00,000 / year"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Detailed Job Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the operational boundaries, product line, and corporate alignment expectations..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveFormStep(1)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl flex items-center gap-1 cursor-pointer select-none text-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <span>Proceed to Extras</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Extras, Dates & Promotion Tags */}
            {activeFormStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Application Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secondary Benefits (Comma Separated)</label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      placeholder="e.g. Health Insurance, Equity RSUs, Remote Budget"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Tags & Options Grid */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Promotion & Ingress Settings</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans font-bold text-slate-700">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Is Remote-First Workspace</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Mark as Urgent Hiring</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Feature Position on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isHot"
                        checked={formData.isHot}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Highlight in Sourcing Feeds (Hot)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveFormStep(2)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl flex items-center gap-1 cursor-pointer select-none text-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Generate Preview</span>
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>
      )}

      {/* 3. HIGH-FIDELITY PREVIEW STAGE */}
      {formMode === 'preview' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 rounded text-[9px] font-mono font-black text-indigo-700 uppercase tracking-widest block w-max mb-1.5">
                Verification Sandbox Mode
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Preview position: {formData.title || editingJob?.title}
              </h3>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFormMode(editingJob ? 'form' : 'form')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Return to Editor
              </button>

              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Save as Draft
              </button>

              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish vacancy</span>
              </button>
            </div>
          </div>

          {/* High Fidelity Card Preview */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-black text-xs select-none">▲</span>
                  <span className="font-sans font-extrabold text-slate-800 text-[11px]">Vercel India</span>
                  <span className="text-[10px] text-slate-400 font-medium">• Just now</span>
                </div>
                <h4 className="text-sm sm:text-base font-black font-heading text-slate-900 leading-tight">
                  {formData.title || editingJob?.title || 'Senior Frontend Engineer'}
                </h4>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 font-medium font-sans">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{formData.location || 'Bengaluru, India'}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" />{formData.salary || 'Competitive'}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" />{formData.employmentType || 'Full-Time'}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-1 items-end shrink-0">
                {formData.isUrgent && <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 font-mono text-[9px] font-black uppercase rounded-md tracking-wider animate-pulse">Urgent</span>}
                {formData.isRemote && <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 font-mono text-[9px] font-black uppercase rounded-md tracking-wider">Remote</span>}
              </div>
            </div>

            {/* Description Preview */}
            <div className="space-y-3 border-t border-slate-100 pt-5 font-sans">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Operational Specifications</span>
              <p className="text-slate-600 font-medium leading-relaxed text-[11px] sm:text-xs">
                {formData.description || 'Describe the operational boundaries of this role.'}
              </p>
            </div>

            {/* Skills Tags Preview */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Required Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(formData.skills ? formData.skills.split(',') : (editingJob?.skills || ['React', 'TypeScript'])).map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg font-mono text-[10px]">
                    {sk.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Extras specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-slate-500 font-sans font-medium">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Vacancy Perks / Benefits</span>
                <div className="flex flex-wrap gap-1">
                  {(formData.benefits ? formData.benefits.split(',') : (editingJob?.benefits || ['Full Remote Setup', 'Wellness Care'])).map((b, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-150">{b.trim()}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Administrative Coordinates</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Apply Deadline: <strong className="text-slate-700">{formData.deadline || 'No Deadline'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Layers className="w-3.5 h-3.5" />
                    <span>SEO Slug Coordinate: <strong className="text-slate-700">{formData.slug}</strong></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. DELETE CONFIRMATION OVERLAY MODAL */}
      {deleteJobId && (
        <div className="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-scaleIn">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Confirm Specification Deletion</h4>
              <p className="text-[11px] text-slate-500 leading-normal font-sans">
                Are you absolutely sure you want to purge these position specifications? This action is irreversible and will sever all pending direct application channels.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <button
                onClick={() => setDeleteJobId(null)}
                className="py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Purge Specs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
