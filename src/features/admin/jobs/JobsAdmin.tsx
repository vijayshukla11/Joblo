import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Edit2, Trash2, Eye, CheckCircle2, 
  Archive, FileText, Calendar, DollarSign, Link2, 
  MapPin, Building, AlertCircle, X, Search, Check, Tag, Copy
} from 'lucide-react';
import { adminService, CompanyVerification, AdminCategory } from '../../../services/adminService';
import { Job } from '../../../types';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<CompanyVerification[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form & Editing States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Filters / Search in Admin List
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    companyId: '',
    companyName: '',
    companyLogo: '',
    location: '',
    country: 'India',
    salary: '',
    employmentType: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship',
    category: 'Tech',
    experience: '1-3 years',
    skills: '',
    description: '',
    benefits: '',
    applicationLink: '',
    deadline: '',
    isHot: false,
    isRemote: false,
    isFeatured: false,
    isUrgent: false,
    status: 'Published' as 'Draft' | 'Published' | 'Archived'
  });

  const [autoSlug, setAutoSlug] = useState(true);

  // Fetch jobs, companies, and categories
  const loadData = async () => {
    setLoading(true);
    try {
      const allJobs = await adminService.getCorporateJobs();
      
      // Seed initial jobs if empty so the screen is lively
      if (allJobs.length === 0) {
        const seedJobs: Job[] = [
          {
            id: 'job-seed-1',
            title: 'Lead React Developer',
            slug: 'lead-react-developer',
            companyId: 'comp-1',
            companyName: 'Linear Labs',
            companyLogo: '⚡',
            location: 'Bengaluru, KA',
            country: 'India',
            salary: '₹18,00,000 - ₹24,00,000 / year',
            employmentType: 'Full-time',
            category: 'Tech',
            experience: '3-5 years',
            skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js'],
            description: 'Lead development of next generation project tracking systems. Craft performant micro-interactions, collaborate on APIs, and establish component design guidelines.',
            benefits: ['Health Insurance', 'Remote Allowance'],
            applicationLink: 'https://linear.app/careers',
            deadline: '2026-12-31',
            isHot: true,
            isRemote: true,
            isFeatured: true,
            isUrgent: true,
            status: 'Published',
            postedDate: 'Just now'
          },
          {
            id: 'job-seed-2',
            title: 'Senior Product Designer',
            slug: 'senior-product-designer',
            companyId: 'comp-3',
            companyName: 'Zomato India',
            companyLogo: '🍅',
            location: 'Gurugram, HR',
            country: 'India',
            salary: '₹22,00,000 - ₹30,00,000 / year',
            employmentType: 'Full-time',
            category: 'Design',
            experience: '5+ years',
            skills: ['Figma', 'UX Research', 'Design Systems'],
            description: 'Own complex food delivery and hyper-local supply chain checkout experiences. Refine layouts, run user interviews, and pair with frontend systems engineers.',
            benefits: ['Free Meals', 'Medical Cover', 'ESOPs'],
            applicationLink: 'https://zomato.com/careers',
            deadline: '2026-11-30',
            isHot: false,
            isRemote: false,
            isFeatured: false,
            isUrgent: false,
            status: 'Draft',
            postedDate: '2 days ago'
          }
        ];
        localStorage.setItem('joblo_employer_jobs', JSON.stringify(seedJobs));
        setJobs(seedJobs);
      } else {
        setJobs(allJobs);
      }

      const allCompanies = await adminService.getCompanyVerifications();
      setCompanies(allCompanies);

      const allCategories = await adminService.getCategories();
      setCategories(allCategories);
    } catch (err: any) {
      setError(err?.message || 'Failed to load corporate database listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync slug with title if autoSlug is active
  useEffect(() => {
    if (autoSlug && !editingJob) {
      const slugified = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: slugified }));
    }
  }, [formData.title, autoSlug, editingJob]);

  const handleOpenAddForm = () => {
    setEditingJob(null);
    setAutoSlug(true);
    setFormError(null);
    
    const defaultCompany = companies[0] || { id: 'comp-1', name: 'Linear Labs', logo: '⚡' };
    setFormData({
      title: '',
      slug: '',
      companyId: defaultCompany.id,
      companyName: defaultCompany.name,
      companyLogo: (defaultCompany as any).documentUrl ? '🏢' : '⚡',
      location: 'Bengaluru, Karnataka',
      country: 'India',
      salary: '₹12,00,000 - ₹18,00,000 / year',
      employmentType: 'Full-time',
      category: 'Tech',
      experience: '1-3 years',
      skills: 'React, TypeScript, Tailwind CSS',
      description: 'We are seeking a proactive engineer to join our fast-paced corporate team. You will build and scale high-fidelity responsive user interfaces, collaborate with backend specialists, and participate in performance optimization.',
      benefits: 'Health Insurance, Flexible Hours, Remote Work Allowance',
      applicationLink: 'https://careers.joblo.in/apply',
      deadline: '2026-09-30',
      isHot: false,
      isRemote: false,
      isFeatured: false,
      isUrgent: false,
      status: 'Published'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (job: Job) => {
    setEditingJob(job);
    setAutoSlug(false);
    setFormError(null);
    setFormData({
      title: job.title,
      slug: job.slug,
      companyId: job.companyId,
      companyName: job.companyName,
      companyLogo: job.companyLogo || '⚡',
      location: job.location,
      country: job.country || 'India',
      salary: job.salary,
      employmentType: job.employmentType,
      category: job.category || 'Tech',
      experience: job.experience,
      skills: job.skills.join(', '),
      description: job.description,
      benefits: job.benefits ? job.benefits.join(', ') : '',
      applicationLink: job.applicationLink || '',
      deadline: job.deadline || '',
      isHot: job.isHot || false,
      isRemote: job.isRemote || false,
      isFeatured: job.isFeatured || false,
      isUrgent: job.isUrgent || false,
      status: job.status || 'Published'
    });
    setIsFormOpen(true);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = companies.find(c => c.id === selectedId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        companyId: selected.id,
        companyName: selected.name,
        companyLogo: '🏢',
        isRemote: prev.employmentType === 'Remote'
      }));
    }
  };

  const handleDuplicateJob = async (job: Job) => {
    try {
      const duplicatedTitle = `${job.title} (Copy)`;
      let duplicatedSlug = `${job.slug}-copy`;
      
      let counter = 1;
      while (jobs.some(j => j.slug === duplicatedSlug)) {
        duplicatedSlug = `${job.slug}-copy-${counter}`;
        counter++;
      }

      const duplicatedPayload: Job = {
        ...job,
        id: 'job-' + Date.now(),
        title: duplicatedTitle,
        slug: duplicatedSlug,
        status: 'Draft',
        postedDate: 'Just now'
      };

      await adminService.saveCorporateJob(duplicatedPayload);
      await loadData();
    } catch (err: any) {
      alert('Failed to duplicate job: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Job Title is required.');
      return;
    }
    if (!formData.slug.trim()) {
      setFormError('SEO Slug is required.');
      return;
    }
    if (!formData.companyId) {
      setFormError('Company Partner selection is required.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Job Location is required.');
      return;
    }
    if (!formData.salary.trim()) {
      setFormError('Compensation Package details are required.');
      return;
    }
    if (!formData.experience.trim()) {
      setFormError('Experience Level is required.');
      return;
    }
    if (!formData.skills.trim()) {
      setFormError('Required Skills field is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Detailed Job Description is required.');
      return;
    }

    const isSlugTaken = jobs.some(j => j.slug.toLowerCase().trim() === formData.slug.toLowerCase().trim() && j.id !== (editingJob?.id || ''));
    if (isSlugTaken) {
      setFormError('This SEO Slug is already taken by another active job posting. Slugs must be unique.');
      return;
    }

    try {
      const parsedSkills = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const parsedBenefits = formData.benefits
        .split(',')
        .map(b => b.trim())
        .filter(b => b.length > 0);

      const payload: Job = {
        id: editingJob ? editingJob.id : 'job-' + Date.now(),
        title: formData.title,
        slug: formData.slug,
        companyId: formData.companyId,
        companyName: formData.companyName,
        companyLogo: formData.companyLogo,
        location: formData.location,
        country: formData.country,
        salary: formData.salary,
        employmentType: formData.employmentType,
        category: formData.category,
        experience: formData.experience,
        skills: parsedSkills,
        description: formData.description,
        benefits: parsedBenefits,
        applicationLink: formData.applicationLink,
        deadline: formData.deadline,
        isHot: formData.isHot,
        isRemote: formData.isRemote || formData.employmentType === 'Remote',
        isFeatured: formData.isFeatured,
        isUrgent: formData.isUrgent,
        status: formData.status,
        postedDate: editingJob ? editingJob.postedDate : 'Just now'
      };

      await adminService.saveCorporateJob(payload);
      setIsFormOpen(false);
      setEditingJob(null);
      await loadData();
    } catch (err: any) {
      alert('Error saving job posting: ' + err.message);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Permanently delete this corporate job pipeline?')) {
      return;
    }
    try {
      await adminService.deleteCorporateJob(jobId);
      await loadData();
    } catch (err: any) {
      alert('Failed to delete job posting: ' + err.message);
    }
  };

  const handleQuickStatusUpdate = async (job: Job, newStatus: 'Draft' | 'Published' | 'Archived') => {
    try {
      const updated: Job = {
        ...job,
        status: newStatus
      };
      await adminService.saveCorporateJob(updated);
      await loadData();
    } catch (err: any) {
      alert('Failed to update job status: ' + err.message);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      cleanQuery === '' ||
      job.title.toLowerCase().includes(cleanQuery) ||
      job.companyName.toLowerCase().includes(cleanQuery) ||
      (job.location && job.location.toLowerCase().includes(cleanQuery)) ||
      job.skills.some(s => s.toLowerCase().includes(cleanQuery));

    const matchesStatus = 
      statusFilter === 'All' ||
      (job.status || 'Published') === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Corporate Job Pipeline Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Index corporate positions, customize URL slugs, configure criteria, and manage published/drafted pipeline status.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenAddForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>Post Corporate Job</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* FORM WORKSPACE */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-50/70 border border-slate-150 rounded-2xl p-5 space-y-5 animate-fadeIn text-left">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-fadeIn">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{editingJob ? `Modify Job Specs: ${editingJob.title}` : 'Index Corporate Job'}</span>
            </h3>
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setEditingJob(null); }}
              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead React Architect"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>SEO Slug Friendly URL *</span>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className={`text-[10px] font-bold ${autoSlug ? 'text-emerald-600' : 'text-slate-400'} hover:underline`}
                >
                  {autoSlug ? 'AutoSync: ON' : 'AutoSync: OFF'}
                </button>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[10px] text-slate-400 font-mono">/jobs/</span>
                <input
                  type="text"
                  required
                  placeholder="lead-react-architect"
                  value={formData.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }));
                  }}
                  className="w-full pl-14 pr-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Hiring Corporate Partner *</label>
              <select
                value={formData.companyId}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                {companies.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    🏢 {comp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Karnataka or Remote"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Compensation Package *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹18,00,000 - ₹24,00,000 / year"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Employment Type *</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  employmentType: e.target.value as any,
                  isRemote: e.target.value === 'Remote' ? true : prev.isRemote
                }))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Full-time">Full-time Permanent</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contractual Basis</option>
                <option value="Remote">100% Remote Hub</option>
                <option value="Internship">Internship Trainee</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Experience Required *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1-3 years, Fresher, 5+ years"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Required Skills (separated by commas) *</label>
              <input
                type="text"
                required
                placeholder="React, TypeScript, Tailwind CSS, Next.js"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Benefits & Perks (separated by commas)</label>
              <input
                type="text"
                placeholder="Health Insurance, Flexible Hours, Remote Work Allowance"
                value={formData.benefits}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Application Sourcing URL / Link</label>
              <input
                type="url"
                placeholder="https://careers.company.com/apply"
                value={formData.applicationLink}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationLink: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Closing Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Detailed Job Description (Markdown/Text) *</label>
              <textarea
                required
                rows={4}
                placeholder="Outline core responsibilities, team structures, and skills..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Featured Job</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>Urgent Job</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRemote: e.target.checked }))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Remote Option</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isHot}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Trending Hot</span>
              </label>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">Publishing Status Mode</label>
              <div className="flex gap-4">
                {['Published', 'Draft', 'Archived'].map((st) => (
                  <label key={st} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="form-status"
                      value={st}
                      checked={formData.status === st}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setEditingJob(null); }}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {editingJob ? 'Update Pipeline Specs' : 'Publish to Live Catalog'}
            </button>
          </div>
        </form>
      )}

      {/* REGISTRY FILTER ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search catalog registry by title, company, skills, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Filter status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus:outline-none"
          >
            <option value="All">All Pipelines ({jobs.length})</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Querying local SQLite registers...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
          No matches found in the job registry matching your filters.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredJobs.map((job) => {
            const jobStatus = job.status || 'Published';
            return (
              <div 
                key={job.id} 
                className="p-4 bg-slate-50/40 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs uppercase">
                    {job.companyName[0]}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900 leading-tight">{job.title}</span>
                      {job.isFeatured && (
                        <span className="text-[8px] font-extrabold text-amber-800 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase font-sans">
                          Featured
                        </span>
                      )}
                      {job.isUrgent && (
                        <span className="text-[8px] font-extrabold text-rose-800 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded uppercase font-sans">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-semibold font-sans">
                      <span className="text-slate-800 font-bold">{job.companyName}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span>{job.salary}</span>
                      <span>•</span>
                      <span>{job.experience}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">SKILLS:</span>
                      {job.skills.map((sk) => (
                        <span key={sk} className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">STATUS:</span>
                    <span className={`text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-md ${
                      jobStatus === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : jobStatus === 'Draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {jobStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {jobStatus !== 'Published' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(job, 'Published')}
                        className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        title="Publish position"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    {jobStatus !== 'Draft' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(job, 'Draft')}
                        className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-150 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        title="Move to draft status"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}

                    {jobStatus !== 'Archived' && (
                      <button
                        onClick={() => handleQuickStatusUpdate(job, 'Archived')}
                        className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        title="Archive position"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDuplicateJob(job)}
                      className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-150 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      title="Duplicate job specs"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditForm(job)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      title="Edit specifications"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-150 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      title="Delete pipeline permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
