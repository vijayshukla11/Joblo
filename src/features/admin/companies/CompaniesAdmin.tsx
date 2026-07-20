import React, { useState, useEffect } from 'react';
import { 
  Building, CheckCircle, ShieldAlert, ArrowUpRight, Search, Filter, 
  X, Check, AlertTriangle, FileText, Download, ShieldCheck, RefreshCw,
  Eye, Globe, ArrowLeft, ArrowRight, Link2, MapPin, Tag, Plus, Trash2, Edit2,
  AlertCircle
} from 'lucide-react';
import { adminService, CompanyVerification } from '../../../services/adminService';

type CompanySubTab = 'verification' | 'directory';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const INDUSTRIES = ['Software & Tech', 'Financial Services', 'FoodTech & Logistics', 'Healthcare', 'E-Commerce', 'Education'];

export default function CompaniesAdmin() {
  const [companies, setCompanies] = useState<CompanyVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CompanySubTab>('verification');

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [industryFilter, setIndustryFilter] = useState<string>('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bulk actions selection
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);

  // KYC Modal / Inspect States
  const [selectedCompany, setSelectedCompany] = useState<CompanyVerification | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [gstInput, setGstInput] = useState('');
  const [panInput, setPanInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Profile CMS Form States
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [profileFormTab, setProfileFormTab] = useState<'edit' | 'preview'>('edit');
  const [editingProfile, setEditingProfile] = useState<CompanyVerification | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    industry: 'Software & Tech',
    jobsCount: 0,
    gstNumber: '',
    panPlaceholder: '',
    verificationNotes: '',
    documentUrl: '',
    logo: '',
    website: '',
    description: '',
    location: '',
    size: '11-50',
    foundedYear: '2020',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    slug: '',
  });

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCompanyVerifications();
      setCompanies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
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

  // Auto-slugify
  const handleNameChange = (val: string) => {
    const isEditing = !!editingProfile;
    const previousSlug = slugify(formData.name);
    const hasCustomSlug = formData.slug !== previousSlug && formData.slug !== '';

    setFormData(prev => {
      const updated = { ...prev, name: val };
      if (!isEditing && !hasCustomSlug) {
        updated.slug = slugify(val);
      }
      return updated;
    });
  };

  // Inspect KYC verification handler
  const handleOpenInspect = (company: CompanyVerification) => {
    setSelectedCompany(company);
    setVerificationNotes(company.verificationNotes || '');
    setGstInput(company.gstNumber || '');
    setPanInput(company.panPlaceholder || '');
  };

  const handleSaveVerification = async (newStatus: CompanyVerification['verificationStatus']) => {
    if (!selectedCompany) return;
    setSaving(true);
    try {
      const updated: CompanyVerification = {
        ...selectedCompany,
        verificationStatus: newStatus,
        verified: newStatus === 'Approved',
        gstNumber: gstInput,
        panPlaceholder: panInput,
        verificationNotes: verificationNotes,
      };

      await adminService.saveCompanyVerification(updated);
      setSelectedCompany(null);
      await loadCompanies();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Directory Profile CMS Handlers
  const handleOpenAddProfile = () => {
    setEditingProfile(null);
    setFormError(null);
    setProfileFormTab('edit');
    setFormData({
      name: '',
      legalName: '',
      industry: 'Software & Tech',
      jobsCount: 0,
      gstNumber: '27AAAAA1111A1Z1',
      panPlaceholder: 'ABCDE1234F',
      verificationNotes: 'Self-published brand asset.',
      documentUrl: 'https://mca.gov.in',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      website: 'https://www.company.com',
      description: 'We are a dynamic team scaling technology solutions globally.',
      location: 'Bengaluru, Karnataka',
      size: '51-200',
      foundedYear: '2021',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: 'jobs, corporate hiring, startup culture',
      slug: '',
    });
    setIsProfileFormOpen(true);
  };

  const handleOpenEditProfile = (comp: CompanyVerification) => {
    setEditingProfile(comp);
    setFormError(null);
    setProfileFormTab('edit');
    setFormData({
      name: comp.name,
      legalName: comp.legalName || comp.name,
      industry: comp.industry,
      jobsCount: comp.jobsCount || 0,
      gstNumber: comp.gstNumber || '',
      panPlaceholder: comp.panPlaceholder || '',
      verificationNotes: comp.verificationNotes || '',
      documentUrl: comp.documentUrl || '',
      logo: comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      website: comp.website || '',
      description: comp.description || '',
      location: comp.location || 'Bengaluru, Karnataka',
      size: comp.size || '11-50',
      foundedYear: comp.foundedYear || '2020',
      seoTitle: comp.seoTitle || '',
      seoDescription: comp.seoDescription || '',
      seoKeywords: comp.seoKeywords || '',
      slug: comp.slug || comp.id,
    });
    setIsProfileFormOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.slug.trim()) {
      setFormError('Company Name and URL Slug are required.');
      return;
    }

    try {
      const finalSlug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const payload: CompanyVerification = {
        id: editingProfile ? editingProfile.id : `comp-${Date.now()}`,
        name: formData.name,
        legalName: formData.legalName,
        industry: formData.industry,
        jobsCount: formData.jobsCount,
        verified: editingProfile ? editingProfile.verified : true,
        verificationStatus: editingProfile ? editingProfile.verificationStatus : 'Approved',
        gstNumber: formData.gstNumber,
        panPlaceholder: formData.panPlaceholder,
        verificationNotes: formData.verificationNotes,
        documentUrl: formData.documentUrl,
        logo: formData.logo,
        website: formData.website,
        description: formData.description,
        location: formData.location,
        size: formData.size,
        foundedYear: formData.foundedYear,
        seoTitle: formData.seoTitle || `${formData.name} Careers & Job Openings`,
        seoDescription: formData.seoDescription || `Work at ${formData.name}. Apply directly to verified high salary positions.`,
        seoKeywords: formData.seoKeywords,
        slug: finalSlug,
      };

      await adminService.saveCompanyVerification(payload);
      setIsProfileFormOpen(false);
      await loadCompanies();
      setSelectedCompanyIds([]);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save company profile specs.');
    }
  };

  const handleDeleteProfile = async (compId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this company profile permanently?')) return;
    try {
      const list = await adminService.getCompanyVerifications();
      const filtered = list.filter(c => c.id !== compId);
      localStorage.setItem('joblo_companies_verification', JSON.stringify(filtered));
      await loadCompanies();
      setSelectedCompanyIds(prev => prev.filter(id => id !== compId));
    } catch (err) {
      console.error(err);
    }
  };

  // --- BULK ACTION HANDLERS ---
  const handleBulkApprove = async () => {
    if (selectedCompanyIds.length === 0) return;
    try {
      await Promise.all(
        selectedCompanyIds.map(async (id) => {
          const comp = companies.find(c => c.id === id);
          if (comp) {
            await adminService.saveCompanyVerification({
              ...comp,
              verificationStatus: 'Approved',
              verified: true,
            });
          }
        })
      );
      await loadCompanies();
      setSelectedCompanyIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkReject = async () => {
    if (selectedCompanyIds.length === 0) return;
    try {
      await Promise.all(
        selectedCompanyIds.map(async (id) => {
          const comp = companies.find(c => c.id === id);
          if (comp) {
            await adminService.saveCompanyVerification({
              ...comp,
              verificationStatus: 'Rejected',
              verified: false,
            });
          }
        })
      );
      await loadCompanies();
      setSelectedCompanyIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Filters Calculation
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.gstNumber && c.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || c.verificationStatus === statusFilter;
    const matchesInd = industryFilter === 'All' || c.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesInd;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, industryFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <span>Corporate Brands & KYC Verifications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage company profile directories, verify legal business status (MCA/GSTIN), and audit brand SEO meta indexing.
          </p>
        </div>

        {activeTab === 'directory' && !isProfileFormOpen && (
          <button
            onClick={handleOpenAddProfile}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Brand Profile</span>
          </button>
        )}
      </div>

      {/* SUB TABS */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => { setActiveTab('verification'); setSearchQuery(''); setSelectedCompanyIds([]); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'verification' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KYC Verification Queue ({companies.filter(c => c.verificationStatus === 'Pending').length} Pending)</span>
        </button>
        <button
          onClick={() => { setActiveTab('directory'); setSearchQuery(''); setSelectedCompanyIds([]); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'directory' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Brand Directory Editor ({companies.length} Profiles)</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Connecting to business registry database...</span>
        </div>
      ) : (
        <>
          {/* SEARCH & FILTERS PANEL */}
          {!isProfileFormOpen && (
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search corporate profiles by name, industry, GSTIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                />
              </div>

              {activeTab === 'verification' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">KYC Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}

              {activeTab === 'directory' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Industry:</span>
                  <select
                    value={industryFilter}
                    onChange={(e: any) => setIndustryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                  >
                    <option value="All">All Industries</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* BULK ACTION PANEL */}
          {selectedCompanyIds.length > 0 && !isProfileFormOpen && (
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl text-xs animate-fadeIn">
              <span className="font-bold text-emerald-800">
                {selectedCompanyIds.length} companies selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkApprove}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Approve Verification
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Reject & flag
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: AUDIT VERIFICATIONS QUEUE */}
          {activeTab === 'verification' && !isProfileFormOpen && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {paginatedCompanies.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed">
                    No corporate profiles match selected status parameters.
                  </div>
                ) : (
                  paginatedCompanies.map((company) => {
                    const isChecked = selectedCompanyIds.includes(company.id);
                    return (
                      <div 
                        key={company.id} 
                        className="p-4 bg-slate-50/45 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {/* Selector */}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCompanyIds([...selectedCompanyIds, company.id]);
                              } else {
                                setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== company.id));
                              }
                            }}
                            className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-1.5 cursor-pointer shrink-0"
                          />

                          <span className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                            {company.name[0]}
                          </span>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-slate-900 leading-tight">{company.name}</span>
                              {company.verified ? (
                                <span className="bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-100 uppercase font-mono">Verified MCA</span>
                              ) : (
                                <span className="bg-amber-50 text-amber-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded border border-amber-100 uppercase font-mono">KYC Audit Required</span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-500 font-semibold font-sans">
                              <span className="text-slate-800 font-bold">{company.industry}</span>
                              <span>•</span>
                              <span>GSTIN: <span className="font-mono text-[9px] font-bold text-slate-700">{company.gstNumber || 'Not provided'}</span></span>
                              <span>•</span>
                              <span>PAN: <span className="font-mono text-[9px] font-bold text-slate-700">{company.panPlaceholder || 'Not provided'}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            company.verificationStatus === 'Approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : company.verificationStatus === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-150'
                          }`}>
                            {company.verificationStatus}
                          </span>
                          <button
                            onClick={() => handleOpenInspect(company)}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <span>Inspect KYC</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PAGINATION QUEUE */}
              {filteredCompanies.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  <span>
                    Showing {startIndex + 1} to {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} verification records
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

          {/* TAB 2: BRAND PROFILES DIRECTORY CMS */}
          {activeTab === 'directory' && !isProfileFormOpen && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {paginatedCompanies.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed">
                    No brand directory profiles matches your criteria.
                  </div>
                ) : (
                  paginatedCompanies.map((company) => {
                    const isChecked = selectedCompanyIds.includes(company.id);
                    return (
                      <div 
                        key={company.id} 
                        className="p-4 bg-slate-50/45 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Selector */}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCompanyIds([...selectedCompanyIds, company.id]);
                              } else {
                                setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== company.id));
                              }
                            }}
                            className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-1.5 cursor-pointer shrink-0"
                          />

                          <span className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                            {company.logo ? (
                              <img src={company.logo} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              <Building className="w-5 h-5 text-slate-400" />
                            )}
                          </span>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-extrabold text-slate-900 leading-tight">{company.name}</span>
                              <span className="bg-slate-100 text-slate-600 text-[8px] font-mono font-bold px-1 py-0.2 rounded uppercase">
                                SIZE: {company.size || '11-50'}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 font-mono font-bold">/slug: {company.slug || company.id}</p>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-1">{company.description || 'No about description defined.'}</p>
                            
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] text-slate-400 font-bold font-mono">
                              <span className="text-slate-800 font-extrabold">{company.industry}</span>
                              <span>•</span>
                              <span>OFFICE: {company.location || 'Bengaluru, India'}</span>
                              <span>•</span>
                              <span>ESTD: {company.foundedYear || '2020'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:self-center ml-7 md:ml-0 shrink-0">
                          <button
                            onClick={() => handleOpenEditProfile(company)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-250 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Edit Brand Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(company.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Brand Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PAGINATION DIRECTORY */}
              {filteredCompanies.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  <span>
                    Showing {startIndex + 1} to {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length} brand profiles
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

          {/* BRAND PROFILE CMS CREATOR/EDITOR WITH LIVE PREVIEW */}
          {isProfileFormOpen && (
            <div className="space-y-4 text-left animate-fadeIn">
              
              {/* Profile Editor Tab selector */}
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-150">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setProfileFormTab('edit')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      profileFormTab === 'edit' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Brand Specifications Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileFormTab('preview')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                      profileFormTab === 'preview' ? 'bg-white text-slate-950 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>👁️ Live Brand Profile Preview</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileFormOpen(false)}
                  className="p-1 hover:bg-slate-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {profileFormTab === 'edit' ? (
                <form onSubmit={handleSaveProfile} className="bg-slate-50/40 border border-slate-150 p-5 rounded-2xl space-y-4">
                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Company Brand Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Stripe Payments India"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Legal Registered Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Stripe India Pvt Ltd"
                        value={formData.legalName}
                        onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 block">SEO Friendly URL Slug *</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, slug: slugify(formData.name) })}
                          className="text-[10px] text-emerald-600 hover:underline font-bold"
                        >
                          Auto-generate slug
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. stripe-india"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Primary Sector Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Logo URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Official Website URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Headquarters Office Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Company Team Size</label>
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-bold focus:outline-none"
                      >
                        {COMPANY_SIZES.map(sz => (
                          <option key={sz} value={sz}>{sz} Employees</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block">Brand Mission / Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe what the company focuses on, its culture, and general mission..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-medium focus:outline-none"
                      />
                    </div>

                    {/* SEO FIELDS */}
                    <div className="md:col-span-2 space-y-4 border-t border-slate-150 pt-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide font-heading flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>SEO & Metadata configuration</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Title</label>
                          <input
                            type="text"
                            placeholder="Defaults to Brand Name + Careers"
                            value={formData.seoTitle}
                            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">SEO Keywords Tags</label>
                          <input
                            type="text"
                            placeholder="e.g. Tech Jobs, Bangalore Startups, Developer roles"
                            value={formData.seoKeywords}
                            onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block">SEO Meta Description</label>
                          <textarea
                            rows={2}
                            placeholder="Defaults to short description excerpt"
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
                            {formData.seoTitle || `${formData.name} Careers | JOB Lo`}
                          </div>
                          <div className="text-[12px] text-[#006621] leading-none mt-0.5">
                            https://joblo.in/companies/{formData.slug || 'slug-placeholder'}
                          </div>
                          <div className="text-[12px] text-[#545454] leading-relaxed mt-1 max-w-2xl">
                            {formData.seoDescription || `Discover job opportunities, culture, and employee details at ${formData.name}. Apply directly for verified positions with transparent salary rates.`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsProfileFormOpen(false)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {editingProfile ? 'Update Brand Details' : 'Publish Brand Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                /* HIGH FIDELITY COMPANY PROFILE PREVIEW */
                <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden text-slate-800 animate-fadeIn shadow-2xs max-w-3xl mx-auto">
                  
                  {/* Fake Cover Photo */}
                  <div className="w-full h-32 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 relative" />

                  <div className="p-6 md:p-8 space-y-6 -mt-10 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      {/* Logo Frame */}
                      <div className="w-20 h-20 bg-white p-2 rounded-2xl border border-slate-150 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                        {formData.logo ? (
                          <img src={formData.logo} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl md:text-2xl font-extrabold text-slate-950 font-heading leading-tight">
                            {formData.name || 'Untitled Brand Company'}
                          </h1>
                          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-100 uppercase tracking-wide font-mono">Verified Partner</span>
                        </div>
                        <p className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider">{formData.industry}</p>
                      </div>

                      {formData.website && (
                        <a
                          href={formData.website}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Visit Website</span>
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2 pt-2">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase font-mono tracking-wider">About our Company</h3>
                      <p className="text-xs leading-relaxed text-slate-600 font-sans">
                        {formData.description || 'Describe company services, technologies, and mission...'}
                      </p>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Head Office</p>
                        <p className="font-bold text-slate-800 mt-0.5">{formData.location || 'Bengaluru, India'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Company Size</p>
                        <p className="font-bold text-slate-800 mt-0.5">{formData.size} Employees</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Founded Year</p>
                        <p className="font-bold text-slate-800 mt-0.5">{formData.foundedYear}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Active Vacancies</p>
                        <p className="font-bold text-slate-800 mt-0.5">{formData.jobsCount} Open Positions</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSPECT KYC VERIFICATION DIALOG */}
          {selectedCompany && (
            <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-150 shadow-lg max-w-lg w-full overflow-hidden text-left animate-scaleIn">
                <div className="bg-slate-50 p-4 border-b border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-900">Audit KYC Business Registration</span>
                  </div>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="p-1 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Corporate Entity Name</p>
                    <p className="font-bold text-slate-900 text-sm">{selectedCompany.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">GSTIN Certificate ID *</label>
                      <input
                        type="text"
                        value={gstInput}
                        onChange={(e) => setGstInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">Company PAN *</label>
                      <input
                        type="text"
                        value={panInput}
                        onChange={(e) => setPanInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase font-mono block">KYC Verification Audit Comments</label>
                    <textarea
                      rows={3}
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Add system notes for the employer..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>

                  {selectedCompany.documentUrl && (
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-700">GST Registration PDF</span>
                      </div>
                      <a
                        href={selectedCompany.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 bg-white rounded-lg cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-150 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleSaveVerification('Rejected')}
                    disabled={saving}
                    className="px-4 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-lg cursor-pointer select-none"
                  >
                    Reject & flag Profile
                  </button>
                  <button
                    onClick={() => handleSaveVerification('Approved')}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer select-none shadow-sm"
                  >
                    Approve Legal KYC
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
