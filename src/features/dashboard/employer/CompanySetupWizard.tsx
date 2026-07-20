import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Image, ShieldCheck, Globe, MapPin, 
  Linkedin, Facebook, Instagram, Twitter, Award, 
  ArrowRight, ArrowLeft, Check, Plus, Trash2, 
  HelpCircle, Sparkles, LogOut, FileText, Briefcase
} from 'lucide-react';
import { CompanyProfile } from '../../../types';
import { employerService } from '../../../services/employerService';

interface CompanySetupWizardProps {
  onComplete: (profile: CompanyProfile) => void;
  onLogout: () => void;
}

export default function CompanySetupWizard({ onComplete, onLogout }: CompanySetupWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CompanyProfile>({
    name: '',
    legalName: '',
    logo: '▲',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    gstNumber: '',
    panPlaceholder: '',
    industry: '',
    size: '',
    foundedYear: '',
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter_x: '',
    headOffice: '',
    branches: [],
    about: '',
    mission: '',
    vision: '',
    culture: '',
    benefits: [
      'Flexible working arrangements',
      'Health insurance cover for employee & family',
      'Yearly learning & development budget'
    ],
    officeGallery: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=85',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=85'
    ],
    hiringStatus: 'Active',
    awards: [],
    companyEmail: '',
    recruiterName: 'Shalini Roy',
    recruiterMobile: '',
    supportEmail: '',
    isProfileComplete: false,
    wizardStep: 1
  });

  // Dynamic input states for array fields
  const [branchInput, setBranchInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  // Handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Branch operations
  const addBranch = () => {
    if (branchInput.trim() && !formData.branches.includes(branchInput.trim())) {
      setFormData(prev => ({ ...prev, branches: [...prev.branches, branchInput.trim()] }));
      setBranchInput('');
    }
  };

  const removeBranch = (branch: string) => {
    setFormData(prev => ({ ...prev, branches: prev.branches.filter(b => b !== branch) }));
  };

  // Benefit operations
  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({ ...prev, benefits: [...prev.benefits, benefitInput.trim()] }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({ ...prev, benefits: prev.benefits.filter(b => b !== benefit) }));
  };

  // Validation per step
  const validateStep = (): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Company brand name is mandatory.');
        return false;
      }
      if (!formData.legalName?.trim()) {
        setError('Registered legal entity name is mandatory.');
        return false;
      }
      if (!formData.foundedYear.trim() || formData.foundedYear.length !== 4 || isNaN(Number(formData.foundedYear))) {
        setError('Please provide a valid 4-digit founded year.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.industry) {
        setError('Select an active industry sector.');
        return false;
      }
      if (!formData.size) {
        setError('Select company employee size tier.');
        return false;
      }
      if (!formData.website.trim() || !formData.website.includes('.')) {
        setError('A valid corporate website address is mandatory.');
        return false;
      }
      if (!formData.headOffice.trim()) {
        setError('Headquarters office coordinates are required.');
        return false;
      }
    } else if (step === 3) {
      const gst = formData.gstNumber?.trim() || '';
      if (!gst || gst.length < 15) {
        setError('A valid 15-character GSTIN is required for recruiter status verification.');
        return false;
      }
      const pan = formData.panPlaceholder?.trim() || '';
      if (!pan || pan.length < 10) {
        setError('Corporate PAN card identity reference is required.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.companyEmail?.trim() || !formData.companyEmail.includes('@')) {
        setError('A valid corporate contact email is required.');
        return false;
      }
      if (!formData.recruiterName?.trim()) {
        setError('Point of Contact recruiter name is required.');
        return false;
      }
      if (!formData.recruiterMobile?.trim() || formData.recruiterMobile.length < 10) {
        setError('A valid 10-digit mobile contact coordinate is required.');
        return false;
      }
    } else if (step === 5) {
      if (!formData.about.trim() || formData.about.length < 50) {
        setError('Describe your company overview details (minimum 50 characters).');
        return false;
      }
      if (!formData.culture.trim()) {
        setError('Provide a brief culture and workspace atmosphere statement.');
        return false;
      }
    }
    return true;
  };

  // Step controls
  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const finalProfile: CompanyProfile = {
        ...formData,
        isProfileComplete: true,
        wizardStep: 5
      };
      
      // Save in persistence
      await employerService.updateCompanyProfile(finalProfile);
      
      setTimeout(() => {
        setLoading(false);
        onComplete(finalProfile);
      }, 1500);
    } catch (e) {
      console.error(e);
      setError('An error occurred while synchronizing corporate specs. Try again.');
      setLoading(false);
    }
  };

  // Calculate percentage
  const percentComplete = step === 1 ? 20 : step === 2 ? 40 : step === 3 ? 60 : step === 4 ? 80 : 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl w-full mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Wizard Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Verified Recruiter Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              Activate Company Hub
            </h1>
            <p className="text-xs text-slate-500">
              Complete your certified enterprise profile under DPDP guidelines to publish jobs and screen talent.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 border border-slate-150 hover:bg-slate-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors shrink-0 cursor-pointer"
            title="Log out of recruiter portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
            <span>Progress Complete: {percentComplete}%</span>
            <span>Step {step} of 5</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              className="bg-emerald-500 h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${percentComplete}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Stepper Headers */}
          <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-bold text-gray-400">
            <span className={step >= 1 ? 'text-emerald-600' : ''}>Identity</span>
            <span className={step >= 2 ? 'text-emerald-600' : ''}>Operations</span>
            <span className={step >= 3 ? 'text-emerald-600' : ''}>Verification</span>
            <span className={step >= 4 ? 'text-emerald-600' : ''}>Contacts</span>
            <span className={step >= 5 ? 'text-emerald-600' : ''}>Culture</span>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2.5 animate-fadeIn">
            <ShieldCheck className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Wizard Pages */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Brand Identity Elements</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Define your company branding, legal entity registrations, and year founded.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Brand Name</label>
                  <div className="relative flex items-center">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Vercel India"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Legal Entity Name</label>
                  <div className="relative flex items-center">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleChange}
                      placeholder="e.g. Vercel Developer Systems India Pvt Ltd"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Year Founded</label>
                    <input
                      type="text"
                      name="foundedYear"
                      value={formData.foundedYear}
                      onChange={handleChange}
                      placeholder="e.g. 2015"
                      maxLength={4}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Brand Logo Initial/Icon</label>
                    <input
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="▲"
                      maxLength={3}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 text-center transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cover Image URL</label>
                  <div className="relative flex items-center">
                    <Image className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: OPERATIONS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Operations & Locations</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Configure your company sectors, global sizes, website coordinates, and active offices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry Sector</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer transition-colors"
                      required
                    >
                      <option value="">Select Sector</option>
                      <option value="Information Technology & Services">Information Technology & Services</option>
                      <option value="Finance & Investment Banking">Finance & Investment Banking</option>
                      <option value="Healthcare & Lifesciences">Healthcare & Lifesciences</option>
                      <option value="E-Commerce & Retail Logistic">E-Commerce & Retail Logistic</option>
                      <option value="EdTech & E-Learning Platforms">EdTech & E-Learning Platforms</option>
                      <option value="Consumer Electronics & Hardware">Consumer Electronics & Hardware</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Size (Employee Scale)</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer transition-colors"
                      required
                    >
                      <option value="">Select Scale</option>
                      <option value="1 - 10 Employees">1 - 10 Employees (Seed Stage)</option>
                      <option value="11 - 50 Employees">11 - 50 Employees (Early Stage)</option>
                      <option value="51 - 200 Employees">51 - 200 Employees (Growth Scale)</option>
                      <option value="201 - 500 Employees">201 - 500 Employees (Mid-Market)</option>
                      <option value="501 - 1,000 Employees">501 - 1,000 Employees (Enterprise)</option>
                      <option value="1000+ Employees">1000+ Employees (Fortune Scale)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Website</label>
                    <div className="relative flex items-center">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://vercel.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headquarters City</label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="headOffice"
                        value={formData.headOffice}
                        onChange={handleChange}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Branches Array Builder */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add Secondary Office Branches (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={addBranch}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center cursor-pointer select-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {formData.branches.map((b) => (
                      <span key={b} className="bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-2 py-1 flex items-center gap-2 font-bold text-slate-700 font-sans">
                        <span>{b}</span>
                        <button type="button" onClick={() => removeBranch(b)} className="text-rose-600 hover:text-rose-700 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: VERIFICATION */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Compliance & Tax Identifications</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Under India DPDP guidelines, active corporate portals must verify GSTIN & PAN tags.</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2 text-emerald-800 leading-relaxed text-[11px] font-semibold">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                    <span>Trust & Security Guarantee</span>
                  </div>
                  <p className="font-sans font-medium text-slate-600">
                    All compliance parameters are safely hashed and are used exclusively to filter spam agencies from candidate feeds.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enterprise GSTIN (15-character ID)</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="e.g. 29AAAAA1111A1Z1"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 uppercase transition-colors font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate PAN Card Identifier</label>
                  <input
                    type="text"
                    name="panPlaceholder"
                    value={formData.panPlaceholder}
                    onChange={handleChange}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 uppercase transition-colors font-mono"
                    required
                  />
                </div>

                {/* Social Links Sub Group */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Digital Showcase (Social links)</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative flex items-center">
                      <Linkedin className="w-4 h-4 text-slate-400 absolute left-3" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn Profile URL"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl font-semibold text-slate-800 font-sans"
                      />
                    </div>
                    <div className="relative flex items-center">
                      <Twitter className="w-4 h-4 text-slate-400 absolute left-3" />
                      <input
                        type="url"
                        name="twitter_x"
                        value={formData.twitter_x}
                        onChange={handleChange}
                        placeholder="Twitter/X Profile URL"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl font-semibold text-slate-800 font-sans"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CONTACTS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recruiter Contacts</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Establish the primary verified human coordinates for coordination and support channels.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lead Recruiter Name</label>
                  <input
                    type="text"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    placeholder="e.g. Shalini Roy"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Direct Recruiting Mobile</label>
                    <input
                      type="tel"
                      name="recruiterMobile"
                      value={formData.recruiterMobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enterprise Inflow Email</label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      placeholder="careers-india@vercel.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Candidate Support Email (Optional)</label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    placeholder="support-india@vercel.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: CULTURE */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Culture, Core Principles & Benefits</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Describe company vision statements, day-to-day culture highlights, and select compensation benefits.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Company Description</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                    placeholder="We provide developer tools and next-generation cloud infrastructure to run the modern fast web..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors font-sans"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mission Statement</label>
                    <input
                      type="text"
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      placeholder="To make the web faster and more accessible..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vision Statement</label>
                    <input
                      type="text"
                      name="vision"
                      value={formData.vision}
                      onChange={handleChange}
                      placeholder="A globally frictionless web rendering standard..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Day-to-day culture statement</label>
                  <textarea
                    name="culture"
                    value={formData.culture}
                    onChange={handleChange}
                    rows={2}
                    placeholder="We work completely remote-first, value speed, design obsession, and clear asynchronous coordination..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-slate-800 transition-colors font-sans"
                    required
                  />
                </div>

                {/* Benefits List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Compensation & Benefits list</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="e.g. Internet & remote setup budget"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 font-sans"
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center cursor-pointer select-none"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {formData.benefits.map((b) => (
                      <span key={b} className="bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-2 py-1 flex items-center gap-2 font-bold text-slate-700 font-sans">
                        <span>{b}</span>
                        <button type="button" onClick={() => removeBenefit(b)} className="text-rose-600 hover:text-rose-700 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Stepper Buttons Controls */}
          <div className="flex justify-between items-center gap-4 pt-6 border-t border-slate-150">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer select-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer select-none ml-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-black flex items-center gap-1.5 cursor-pointer select-none ml-auto disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Activate Console</span>
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
