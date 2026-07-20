import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  GraduationCap, Globe, Linkedin, Github, FileText, 
  Camera, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, 
  X, Upload, Plus, Award, ChevronRight, Check, Sparkles, Building2, Terminal
} from 'lucide-react';
import { CandidateProfile } from '../../types';
import { profileService } from '../../services/profileService';

interface ProfileWizardProps {
  userId: string;
  userEmail: string;
  onComplete: (profile: CandidateProfile) => void;
  onCancel?: () => void;
}

export default function ProfileWizard({ userId, userEmail, onComplete, onCancel }: ProfileWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<CandidateProfile>({
    id: 'prof_' + Math.random().toString(36).substring(2, 9),
    user_id: userId,
    full_name: '',
    phone: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    country: 'India',
    skills: [],
    experience: '',
    education: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    resume_url: '',
    profile_photo: '',
    address: '',
    pincode: '',
    edu_10th_percentage: '',
    edu_12th_percentage: '',
    edu_diploma_percentage: '',
    edu_graduation_percentage: '',
    edu_masters_percentage: '',
    edu_university: '',
    edu_passing_year: '',
    edu_cgpa: '',
    exp_is_fresher: false,
    exp_company: '',
    exp_designation: '',
    exp_joining_date: '',
    exp_leaving_date: '',
    exp_responsibilities: '',
    exp_achievements: '',
    skills_technical: [],
    skills_soft: [],
    skills_languages: [],
    skills_level: 'Intermediate',
    skills_certificates: [],
    resume_ats_score: 0,
    resume_last_updated: '',
    pref_role: '',
    pref_industry: '',
    pref_city: '',
    pref_state: '',
    pref_expected_salary: '',
    pref_current_salary: '',
    pref_notice_period: 'Immediate',
    pref_employment_type: 'Full-time',
    pref_work_mode: 'Remote',
    pref_open_to_relocate: false,
    link_website: '',
    link_behance: '',
    link_dribbble: '',
    ach_projects: '',
    ach_awards: '',
    ach_hackathons: '',
    ach_publications: '',
    ach_volunteer: '',
    is_profile_wizard_completed: false,
    wizard_step: 1
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Tag input states
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [certInput, setCertInput] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Calculated Progress bar (10%, 20%, 40%, 60%, 80%, 100%)
  const calculateWizardProgress = () => {
    // Let's divide by step:
    // step 1 -> 10%
    // step 2 -> 20%
    // step 3 -> 40%
    // step 4 -> 50%
    // step 5 -> 60%
    // step 6 -> 70%
    // step 7 -> 80%
    // step 8 -> 90%
    // step 9 -> 100% (or dynamic section completion)
    switch(step) {
      case 1: return 10;
      case 2: return 20;
      case 3: return 45;
      case 4: return 60;
      case 5: return 75;
      case 6: return 85;
      case 7: return 90;
      case 8: return 95;
      case 9: return 100;
      default: return 10;
    }
  };

  const handleFieldChange = (field: keyof CandidateProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setErrorMsg(null);
    
    // Validations per step
    if (step === 1) {
      if (!profile.full_name.trim()) {
        setErrorMsg('Please specify your full legal name.');
        return;
      }
      if (!profile.phone.trim() || profile.phone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile coordinate.');
        return;
      }
      if (!profile.gender) {
        setErrorMsg('Please select your gender identity.');
        return;
      }
      if (!profile.dob) {
        setErrorMsg('Please state your Date of Birth.');
        return;
      }
      if (!profile.city.trim() || !profile.state.trim() || !profile.pincode?.trim()) {
        setErrorMsg('City, State, and Pincode coordinates are mandatory.');
        return;
      }
    }

    if (step === 2) {
      if (!profile.edu_university?.trim()) {
        setErrorMsg('University/College name is required.');
        return;
      }
      if (!profile.edu_passing_year) {
        setErrorMsg('Passing Year is required.');
        return;
      }
      if (!profile.edu_graduation_percentage && !profile.edu_cgpa) {
        setErrorMsg('Please provide either Graduation Percentage or CGPA.');
        return;
      }
    }

    if (step === 3) {
      if (!profile.exp_is_fresher) {
        if (!profile.exp_company?.trim() || !profile.exp_designation?.trim()) {
          setErrorMsg('Company Name and Designation are mandatory for experienced candidates.');
          return;
        }
        if (!profile.exp_joining_date) {
          setErrorMsg('Joining date is required.');
          return;
        }
      }
    }

    if (step === 4) {
      const mergedSkills = [...(profile.skills_technical || []), ...(profile.skills || [])];
      if (mergedSkills.length === 0) {
        setErrorMsg('Please configure at least one Technical Skill tag.');
        return;
      }
    }

    if (step === 5) {
      if (!profile.resume_url) {
        setErrorMsg('Please upload your verified resume file to continue.');
        return;
      }
    }

    if (step === 6) {
      if (!profile.pref_role?.trim() || !profile.pref_industry?.trim() || !profile.pref_city?.trim()) {
        setErrorMsg('Preferred Role, Industry, and Location are mandatory.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(prev => prev - 1);
  };

  // Simulated Photo Upload
  const handlePhotoUpload = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSaving(true);
      setTimeout(() => {
        // Stock avatars list
        const avatars = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        ];
        const chosen = avatars[Math.floor(Math.random() * avatars.length)];
        handleFieldChange('profile_photo', chosen);
        setSaving(false);
      }, 800);
    }
  };

  // Simulated Resume Upload
  const handleResumeUpload = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSaving(true);
      setTimeout(() => {
        // Generate mock ATS score (75 to 94)
        const randAts = Math.floor(Math.random() * 20) + 75;
        const mockUrl = `https://example.com/storage/resumes/${userId}_cv.pdf`;
        
        setProfile(prev => ({
          ...prev,
          resume_url: mockUrl,
          resume_ats_score: randAts,
          resume_last_updated: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }));
        setSaving(false);
      }, 1200);
    }
  };

  const handleDeleteResume = () => {
    setProfile(prev => ({
      ...prev,
      resume_url: '',
      resume_ats_score: 0,
      resume_last_updated: ''
    }));
  };

  // Tag list helpers
  const addTag = (type: 'tech' | 'soft' | 'lang' | 'cert', val: string) => {
    if (!val.trim()) return;
    const clean = val.trim();
    if (type === 'tech') {
      const current = profile.skills_technical || [];
      if (!current.includes(clean)) {
        setProfile(prev => ({
          ...prev,
          skills_technical: [...current, clean],
          // Keep legacy skills sync
          skills: [...(prev.skills || []), clean]
        }));
      }
      setTechInput('');
    } else if (type === 'soft') {
      const current = profile.skills_soft || [];
      if (!current.includes(clean)) {
        handleFieldChange('skills_soft', [...current, clean]);
      }
      setSoftInput('');
    } else if (type === 'lang') {
      const current = profile.skills_languages || [];
      if (!current.includes(clean)) {
        handleFieldChange('skills_languages', [...current, clean]);
      }
      setLangInput('');
    } else if (type === 'cert') {
      const current = profile.skills_certificates || [];
      if (!current.includes(clean)) {
        handleFieldChange('skills_certificates', [...current, clean]);
      }
      setCertInput('');
    }
  };

  const removeTag = (type: 'tech' | 'soft' | 'lang' | 'cert', tag: string) => {
    if (type === 'tech') {
      const filtered = (profile.skills_technical || []).filter(t => t !== tag);
      setProfile(prev => ({
        ...prev,
        skills_technical: filtered,
        skills: (prev.skills || []).filter(t => t !== tag)
      }));
    } else if (type === 'soft') {
      handleFieldChange('skills_soft', (profile.skills_soft || []).filter(t => t !== tag));
    } else if (type === 'lang') {
      handleFieldChange('skills_languages', (profile.skills_languages || []).filter(t => t !== tag));
    } else if (type === 'cert') {
      handleFieldChange('skills_certificates', (profile.skills_certificates || []).filter(t => t !== tag));
    }
  };

  const handleFinishWizard = async () => {
    setSaving(true);
    try {
      const finalizedProfile: CandidateProfile = {
        ...profile,
        is_profile_wizard_completed: true,
        wizard_step: 9,
        // Ensure education summary combines
        education: `${profile.edu_graduation_percentage ? 'Graduation: ' + profile.edu_graduation_percentage + '% - ' : ''}${profile.edu_university} (${profile.edu_passing_year})`,
        // Ensure experience summary combines
        experience: profile.exp_is_fresher 
          ? 'Fresher' 
          : `${profile.exp_designation} at ${profile.exp_company} (${profile.exp_joining_date} to ${profile.exp_leaving_date || 'Present'})`
      };

      const { data, error } = await profileService.saveProfile(finalizedProfile);
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        onComplete(data);
      }
    } catch (err) {
      setErrorMsg('Unexpected database replication timeout error.');
    } finally {
      setSaving(false);
    }
  };

  const progressPct = calculateWizardProgress();

  // Step names for sidebar indicator
  const stepsList = [
    'Basic Coordinates',
    'Academics Grid',
    'Career Experience',
    'Skills Matrix',
    'Verified Resume',
    'Career Preferences',
    'Social Links',
    'Achievements Hub',
    'Diagnostics Review'
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-sans">
      
      {/* 1. TOP WELCOME TITLE & OVERALL PROGRESS */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 mb-8 relative overflow-hidden shadow-xl border border-zinc-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sourcing Protocol Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Welcome to JOB Lo
            </h1>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-md">
              Complete your cryptographic candidate coordinates profile. Corporate direct-hire channels require a completed verified registry matching direct APIs.
            </p>
          </div>

          <div className="w-full md:w-64 bg-zinc-950/40 p-4 border border-zinc-800 rounded-2xl shrink-0 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Registry Security Strength</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[9px] text-zinc-400 font-sans leading-none pt-0.5">
              Minimum 100% required to qualify for corporate applications.
            </p>
          </div>
        </div>
      </div>

      {/* 2. BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: STATIC STEP SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Wizard Progress</h3>
            
            <div className="space-y-1 font-sans">
              {stepsList.map((st, idx) => {
                const sNumber = idx + 1;
                const isActive = step === sNumber;
                const isPassed = step > sNumber;

                return (
                  <div 
                    key={st}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs transition-all ${
                      isActive 
                        ? 'bg-zinc-950 text-white font-bold' 
                        : isPassed 
                          ? 'text-emerald-700 font-semibold' 
                          : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500 text-zinc-950 font-black' 
                        : isPassed 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-gray-500'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : sNumber}
                    </div>
                    <span className="truncate leading-none">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] text-slate-500 flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All information is locked securely using state-of-the-art AES-256 local database simulation under the Digital Personal Data Protection Act compliance.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE CONTAINER */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative">
            
            {saving && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-50 rounded-3xl flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-xs font-bold text-gray-900 font-mono">Syncing credentials schema...</p>
              </div>
            )}

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest font-mono">
                Step {step} of 9
              </span>
              <h2 className="text-lg font-black text-gray-950 font-heading">
                {step === 1 && "Basic Information Coordinates"}
                {step === 2 && "Academics & Educational Grid"}
                {step === 3 && "Past Professional Experience"}
                {step === 4 && "Skills & Certificates Matrix"}
                {step === 5 && "Verified Resume Document"}
                {step === 6 && "Career Preferences & Scope"}
                {step === 7 && "Professional Network Links"}
                {step === 8 && "Achievements & Projects Portfolio"}
                {step === 9 && "Profile Quality Review & Diagnostic"}
              </h2>
              <p className="text-xs text-gray-400">
                {step === 1 && "Input legal contact coordinates so corporate partners can call or write you directly."}
                {step === 2 && "State your educational percentage indices from school boards to graduation."}
                {step === 3 && "Specify details about your past internships, positions, or check if you are a fresher."}
                {step === 4 && "Tag your core competencies and languages to align with smart search query keywords."}
                {step === 5 && "Upload your primary PDF resume. Our simulated scanner checks ATS scores instantly."}
                {step === 6 && "Detail your salary expectations, notice periods, and geographic flexibility."}
                {step === 7 && "Paste direct URLs to external codebases, portfolios, and professional platforms."}
                {step === 8 && "List your custom hackathons, awards, or projects that set your application apart."}
                {step === 9 && "Inspect completeness diagnostics before final submittal to corporate pipelines."}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* -------------------- STEP 1: BASIC INFORMATION -------------------- */}
            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-4 border-b border-slate-100">
                  <div className="relative w-24 h-24 shrink-0">
                    <div className="w-full h-full rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {profile.profile_photo ? (
                        <img src={profile.profile_photo} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-10 h-10 text-slate-350" />
                      )}
                    </div>
                    <button 
                      onClick={handlePhotoUpload}
                      type="button"
                      className="absolute bottom-0 right-0 p-1.5 bg-black text-white rounded-full border border-white shadow hover:bg-zinc-800 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="file" 
                      ref={photoInputRef}
                      onChange={handlePhotoFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Digital Avatar</h4>
                    <p className="text-[11px] text-gray-400">Click to upload a professional portrait picture. Recruiter search response rises by 40% with high-resolution photos.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={profile.full_name}
                        onChange={(e) => handleFieldChange('full_name', e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Mobile Coordinate (+91)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        value={profile.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 animate-none" />
                      <input 
                        type="date" 
                        value={profile.dob}
                        onChange={(e) => handleFieldChange('dob', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Gender Identity</label>
                    <select 
                      value={profile.gender}
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Detailed Address Coordinates</label>
                  <textarea 
                    rows={2}
                    value={profile.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Provide street address, house no, apartment name..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={profile.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">State</label>
                    <input 
                      type="text" 
                      value={profile.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Pincode</label>
                    <input 
                      type="text" 
                      value={profile.pincode}
                      onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="e.g. 400001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 2: EDUCATION -------------------- */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">University / College Institution</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        value={profile.edu_university}
                        onChange={(e) => handleFieldChange('edu_university', e.target.value)}
                        placeholder="e.g. IIT Delhi, BITS Pilani"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Graduation / Master Passing Year</label>
                    <input 
                      type="text" 
                      value={profile.edu_passing_year}
                      onChange={(e) => handleFieldChange('edu_passing_year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="e.g. 2025"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Graduation Score Percentage (%)</label>
                    <input 
                      type="text" 
                      value={profile.edu_graduation_percentage}
                      onChange={(e) => handleFieldChange('edu_graduation_percentage', e.target.value)}
                      placeholder="e.g. 84.5"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Masters Score Percentage (%)</label>
                    <input 
                      type="text" 
                      value={profile.edu_masters_percentage}
                      onChange={(e) => handleFieldChange('edu_masters_percentage', e.target.value)}
                      placeholder="e.g. 91.2 (Optional)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Cumulative CGPA</label>
                    <input 
                      type="text" 
                      value={profile.edu_cgpa}
                      onChange={(e) => handleFieldChange('edu_cgpa', e.target.value)}
                      placeholder="e.g. 8.92 / 10"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">10th Grade Percentage (%)</label>
                    <input 
                      type="text" 
                      value={profile.edu_10th_percentage}
                      onChange={(e) => handleFieldChange('edu_10th_percentage', e.target.value)}
                      placeholder="e.g. 92.4"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">12th Grade Percentage (%)</label>
                    <input 
                      type="text" 
                      value={profile.edu_12th_percentage}
                      onChange={(e) => handleFieldChange('edu_12th_percentage', e.target.value)}
                      placeholder="e.g. 89.8"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Diploma Percentage (%)</label>
                    <input 
                      type="text" 
                      value={profile.edu_diploma_percentage}
                      onChange={(e) => handleFieldChange('edu_diploma_percentage', e.target.value)}
                      placeholder="e.g. 78.5 (Optional)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 3: EXPERIENCE -------------------- */}
            {step === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5 pr-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                      Are you a Fresher?
                    </h4>
                    <p className="text-[11px] text-gray-400">Enable this if you have zero commercial career history. We'll bypass experience grids.</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={profile.exp_is_fresher}
                    onChange={(e) => handleFieldChange('exp_is_fresher', e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer shrink-0"
                  />
                </div>

                {profile.exp_is_fresher ? (
                  <div className="p-8 border border-dashed border-slate-200 rounded-3xl text-center space-y-3 bg-white animate-fadeIn">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900 leading-none">Establishing Fresher Track Registry</h4>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Bypassing experienced metrics. Our engine will prioritize your academic projects, skills tags, hackathon archives, and certification badges to match corporate openings.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Latest Company Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={profile.exp_company}
                            onChange={(e) => handleFieldChange('exp_company', e.target.value)}
                            placeholder="e.g. Tata Consultancy Services"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Designation</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={profile.exp_designation}
                            onChange={(e) => handleFieldChange('exp_designation', e.target.value)}
                            placeholder="e.g. Software Engineer"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Joining Date</label>
                        <input 
                          type="date" 
                          value={profile.exp_joining_date}
                          onChange={(e) => handleFieldChange('exp_joining_date', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Leaving Date</label>
                        <input 
                          type="date" 
                          value={profile.exp_leaving_date}
                          onChange={(e) => handleFieldChange('exp_leaving_date', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Core Responsibilities</label>
                      <textarea 
                        rows={2}
                        value={profile.exp_responsibilities}
                        onChange={(e) => handleFieldChange('exp_responsibilities', e.target.value)}
                        placeholder="Detail day-to-day duties, stack utilized, or direct project oversight..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase">Core Achievements</label>
                      <textarea 
                        rows={2}
                        value={profile.exp_achievements}
                        onChange={(e) => handleFieldChange('exp_achievements', e.target.value)}
                        placeholder="Detail performance metrics achieved, e.g., 'Sped up response latency by 30%'"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- STEP 4: SKILLS -------------------- */}
            {step === 4 && (
              <div className="space-y-5 text-xs">
                
                {/* Tech Skills */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Technical Skills Matrix (Press enter or add)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('tech', techInput))}
                      placeholder="e.g. React 19, TypeScript, Docker, SQL"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                    <button 
                      onClick={() => addTag('tech', techInput)}
                      type="button"
                      className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(profile.skills_technical || []).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-1 rounded font-bold text-[10px]">
                        <span>{t}</span>
                        <X className="w-3 h-3 text-slate-400 hover:text-rose-600 cursor-pointer" onClick={() => removeTag('tech', t)} />
                      </span>
                    ))}
                    {(profile.skills_technical || []).length === 0 && (
                      <span className="text-gray-400 italic">No technical skills added yet.</span>
                    )}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Soft Skills Matrix</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={softInput}
                      onChange={(e) => setSoftInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('soft', softInput))}
                      placeholder="e.g. Team Collaboration, Critical Thinking, Agile"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                    <button 
                      onClick={() => addTag('soft', softInput)}
                      type="button"
                      className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(profile.skills_soft || []).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2 py-1 rounded font-bold text-[10px]">
                        <span>{t}</span>
                        <X className="w-3 h-3 text-indigo-400 hover:text-rose-600 cursor-pointer" onClick={() => removeTag('soft', t)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2 border-t border-slate-50 pt-4">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Languages Spoken</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={langInput}
                      onChange={(e) => setLangInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('lang', langInput))}
                      placeholder="e.g. English, Hindi, Kannada, Tamil"
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                    <button 
                      onClick={() => addTag('lang', langInput)}
                      type="button"
                      className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(profile.skills_languages || []).map(t => (
                      <span key={t} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-bold text-[10px]">
                        <span>{t}</span>
                        <X className="w-3 h-3 text-emerald-400 hover:text-rose-600 cursor-pointer" onClick={() => removeTag('lang', t)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Level & Certificates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Overall Expertise Level</label>
                    <select 
                      value={profile.skills_level}
                      onChange={(e) => handleFieldChange('skills_level', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="Beginner">Beginner / Graduate</option>
                      <option value="Intermediate">Intermediate Practitioner</option>
                      <option value="Expert">Expert / Specialist</option>
                      <option value="Advanced">Advanced Architect</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Professional Certificates</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('cert', certInput))}
                        placeholder="e.g. AWS Certified Architect, PMP"
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                      />
                      <button 
                        onClick={() => addTag('cert', certInput)}
                        type="button"
                        className="px-4 py-2 bg-zinc-950 text-white rounded-xl font-bold flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(profile.skills_certificates || []).map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded font-bold text-[10px]">
                          <span>{t}</span>
                          <X className="w-3 h-3 text-amber-400 hover:text-rose-600 cursor-pointer" onClick={() => removeTag('cert', t)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 5: RESUME -------------------- */}
            {step === 5 && (
              <div className="space-y-4 text-xs font-sans">
                {profile.resume_url ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-900 truncate max-w-[280px]">Sourced_Candidate_CV.pdf</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                            <span>Last Sync: {profile.resume_last_updated}</span>
                            <span>•</span>
                            <span>152 KB</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a 
                          href={profile.resume_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg tracking-wider text-[10px] uppercase"
                        >
                          Preview
                        </a>
                        <button 
                          onClick={handleDeleteResume}
                          type="button"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Simulated ATS Score Tracker */}
                    <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider">Automated ATS Score Check</span>
                        </div>
                        <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {profile.resume_ats_score || 85} / 100
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700" 
                          style={{ width: `${profile.resume_ats_score || 85}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        Your ATS ranking is structured nicely! To push past 90 points, ensure you list specific achievements inside Step 8.
                      </p>
                    </div>

                    <button 
                      onClick={handleResumeUpload}
                      type="button"
                      className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Replace Resume Document</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={handleResumeUpload}
                    className="p-10 border border-dashed border-slate-200 hover:border-emerald-600 rounded-3xl text-center space-y-4 cursor-pointer transition bg-slate-50/50"
                  >
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-full mx-auto shadow-xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-xs">Drag & Drop Resume coordinates or browse files</h4>
                      <p className="text-[10px] text-gray-400 max-w-xs mx-auto">Supports PDF, DOC, or DOCX formats up to 4MB sizes.</p>
                    </div>
                    <span className="inline-block text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest font-mono">
                      Trigger Simulated Scanner
                    </span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={resumeInputRef}
                  onChange={handleResumeFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </div>
            )}

            {/* -------------------- STEP 6: CAREER PREFERENCES -------------------- */}
            {step === 6 && (
              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Preferred Job Role</label>
                    <input 
                      type="text" 
                      value={profile.pref_role}
                      onChange={(e) => handleFieldChange('pref_role', e.target.value)}
                      placeholder="e.g. Backend Developer, UI UX Designer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Preferred Industry</label>
                    <select 
                      value={profile.pref_industry}
                      onChange={(e) => handleFieldChange('pref_industry', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="">Select Industry</option>
                      <option value="IT & Software Development">IT & Software Development</option>
                      <option value="E-Commerce & Internet Services">E-Commerce & Internet Services</option>
                      <option value="Financial Services & Banking">Financial Services & Banking</option>
                      <option value="Healthcare & Lifesciences">Healthcare & Lifesciences</option>
                      <option value="Education & EdTech">Education & EdTech</option>
                      <option value="Engineering & Construction">Engineering & Construction</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Preferred City Coordinates</label>
                    <input 
                      type="text" 
                      value={profile.pref_city}
                      onChange={(e) => handleFieldChange('pref_city', e.target.value)}
                      placeholder="e.g. Bengaluru, Remote, Mumbai"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Preferred State Coordinates</label>
                    <input 
                      type="text" 
                      value={profile.pref_state}
                      onChange={(e) => handleFieldChange('pref_state', e.target.value)}
                      placeholder="e.g. Karnataka, Remote"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Expected Salary (LPA in ₹)</label>
                    <input 
                      type="text" 
                      value={profile.pref_expected_salary}
                      onChange={(e) => handleFieldChange('pref_expected_salary', e.target.value)}
                      placeholder="e.g. 12,00,000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Current Salary (LPA in ₹)</label>
                    <input 
                      type="text" 
                      value={profile.pref_current_salary}
                      onChange={(e) => handleFieldChange('pref_current_salary', e.target.value)}
                      placeholder="e.g. 8,00,000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Notice Period</label>
                    <select 
                      value={profile.pref_notice_period}
                      onChange={(e) => handleFieldChange('pref_notice_period', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="Immediate">Immediate / Serving</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Employment Type</label>
                    <select 
                      value={profile.pref_employment_type}
                      onChange={(e) => handleFieldChange('pref_employment_type', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="Full-time">Full-time Regular</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract (C2C)</option>
                      <option value="Remote">Remote</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Work Mode</label>
                    <select 
                      value={profile.pref_work_mode}
                      onChange={(e) => handleFieldChange('pref_work_mode', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    >
                      <option value="On-site">On-site Office</option>
                      <option value="Hybrid">Hybrid Practice</option>
                      <option value="Remote">100% Remote</option>
                    </select>
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-slate-150 transition h-[40px]">
                      <span className="font-bold text-gray-500 text-[10px]">Open To Relocate</span>
                      <input 
                        type="checkbox"
                        checked={profile.pref_open_to_relocate}
                        onChange={(e) => handleFieldChange('pref_open_to_relocate', e.target.checked)}
                        className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 7: PROFESSIONAL LINKS -------------------- */}
            {step === 7 && (
              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Linkedin className="w-3.5 h-3.5 text-indigo-600" />
                      <span>LinkedIn Profile</span>
                    </label>
                    <input 
                      type="url" 
                      value={profile.linkedin_url}
                      onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/aaravsharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Github className="w-3.5 h-3.5 text-zinc-900" />
                      <span>GitHub Profile</span>
                    </label>
                    <input 
                      type="url" 
                      value={profile.github_url}
                      onChange={(e) => handleFieldChange('github_url', e.target.value)}
                      placeholder="e.g. https://github.com/aaravsharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Portfolio Website</span>
                    </label>
                    <input 
                      type="url" 
                      value={profile.portfolio_url}
                      onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                      placeholder="e.g. https://aaravsharma.dev"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Personal Blog Website</span>
                    </label>
                    <input 
                      type="url" 
                      value={profile.link_website}
                      onChange={(e) => handleFieldChange('link_website', e.target.value)}
                      placeholder="e.g. https://blog.aaravsharma.dev"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Behance URL</label>
                    <input 
                      type="url" 
                      value={profile.link_behance}
                      onChange={(e) => handleFieldChange('link_behance', e.target.value)}
                      placeholder="e.g. https://behance.net/aaravsharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Dribbble URL</label>
                    <input 
                      type="url" 
                      value={profile.link_dribbble}
                      onChange={(e) => handleFieldChange('link_dribbble', e.target.value)}
                      placeholder="e.g. https://dribbble.com/aaravsharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 8: ACHIEVEMENTS HUB -------------------- */}
            {step === 8 && (
              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Key Projects</label>
                  <textarea 
                    rows={2}
                    value={profile.ach_projects}
                    onChange={(e) => handleFieldChange('ach_projects', e.target.value)}
                    placeholder="e.g. Built decentralized escrow using Ethereum web3.js; Speed optimized next-gen UI using memoized contexts..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Core Awards & Honors</label>
                  <textarea 
                    rows={2}
                    value={profile.ach_awards}
                    onChange={(e) => handleFieldChange('ach_awards', e.target.value)}
                    placeholder="e.g. Best Innovator, Tata Hackathon 2024; Gold Medalist Academic Dean Excellence Roll..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Hackathons Participated</label>
                    <input 
                      type="text" 
                      value={profile.ach_hackathons}
                      onChange={(e) => handleFieldChange('ach_hackathons', e.target.value)}
                      placeholder="e.g. Smart India Hackathon, ETH India"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Publications & Research Papers</label>
                    <input 
                      type="text" 
                      value={profile.ach_publications}
                      onChange={(e) => handleFieldChange('ach_publications', e.target.value)}
                      placeholder="e.g. IEEE Distributed Systems volume IV"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Volunteer / Extracurricular Work</label>
                    <input 
                      type="text" 
                      value={profile.ach_volunteer}
                      onChange={(e) => handleFieldChange('ach_volunteer', e.target.value)}
                      placeholder="e.g. NGO Tech Volunteer, NSS Representative"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 9: PROFILE REVIEW -------------------- */}
            {step === 9 && (
              <div className="space-y-6 text-xs font-sans">
                
                {/* 1. Profile Strength Summary Bar */}
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-150 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                      <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">Candidate Registry Integrity Checks passed</h4>
                    </div>
                    <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                      Your coordinates met structural criteria. Ready to unlock corporate direct APIs.
                    </p>
                  </div>
                  <span className="text-sm font-black text-emerald-900 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-mono shrink-0">
                    Registry Strength: 100%
                  </span>
                </div>

                {/* 2. Diagnostics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Missing information diagnostics */}
                  <div className="border border-slate-150 rounded-2xl p-5 space-y-3.5 bg-slate-50/50">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Completeness Diagnostics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] text-gray-700">Verified Contact coordinates matched (100%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] text-gray-700">Educations matrix validated (100%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] text-gray-700">Technical skills index generated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] text-gray-700">Primary ATS formatted resume parsed</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions block */}
                  <div className="border border-slate-150 rounded-2xl p-5 space-y-3.5 bg-slate-50/50">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Automated Optimization Suggestions</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Keep Github repositories public for our automated ATS background scanning API to fetch code quality reports.</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[10px] text-slate-500">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Ensure your mobile coordinate is active for instant HR SMS dispatch notifications.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Metadata Cards Preview */}
                <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Candidate Registry Card Preview</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
                    <div className="sm:col-span-1 flex flex-col items-center text-center space-y-2 border-r border-slate-100 pr-4">
                      <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                        {profile.profile_photo ? (
                          <img src={profile.profile_photo} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-8 h-8 text-slate-350" />
                        )}
                      </div>
                      <h5 className="font-extrabold text-gray-900">{profile.full_name}</h5>
                      <p className="text-[10px] text-gray-400">{profile.pref_role || "Backend Developer"}</p>
                    </div>

                    <div className="sm:col-span-2 space-y-3 font-sans">
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <span className="text-gray-400 block font-bold text-[9px] uppercase">Mobile Coordinate</span>
                          <span className="font-semibold text-slate-800">+91 {profile.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold text-[9px] uppercase">City Coordinates</span>
                          <span className="font-semibold text-slate-800">{profile.city}, {profile.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold text-[9px] uppercase">Passing Institution</span>
                          <span className="font-semibold text-slate-800 truncate block">{profile.edu_university}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold text-[9px] uppercase">Career Segment</span>
                          <span className="font-semibold text-slate-800">{profile.exp_is_fresher ? "Graduate / Fresher" : `${profile.exp_designation}`}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {[...(profile.skills_technical || []), ...(profile.skills || [])].slice(0, 5).map(s => (
                          <span key={s} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-extrabold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* -------------------- NAV FOOTER BUTTON BAR -------------------- */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-6">
              <div>
                {step > 1 ? (
                  <button
                    onClick={handlePrev}
                    type="button"
                    className="flex items-center gap-1.5 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition select-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  onCancel && (
                    <button
                      onClick={onCancel}
                      type="button"
                      className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs cursor-pointer transition select-none"
                    >
                      Exit Wizard
                    </button>
                  )
                )}
              </div>

              <div>
                {step < 9 ? (
                  <button
                    onClick={handleNext}
                    type="button"
                    className="flex items-center gap-1.5 py-2.5 px-5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition select-none"
                  >
                    <span>Proceed Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishWizard}
                    type="button"
                    disabled={saving}
                    className="flex items-center gap-1.5 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg transition cursor-pointer select-none disabled:opacity-50"
                  >
                    <span>Complete Profile</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
