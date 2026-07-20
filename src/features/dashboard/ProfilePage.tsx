import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  GraduationCap, Globe, Linkedin, Github, FileText, 
  Camera, ArrowLeft, CheckCircle2, AlertCircle, X, Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { CandidateProfile } from '../../types';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<CandidateProfile | null>(null);
  const [skillInput, setSkillInput] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await profileService.getProfile(user.id);
        setProfile(data);
        setEditedProfile(data);
      } catch (err) {
        setErrorMsg('Failed to load candidate profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-950">Authentication Required</h2>
          <p className="text-xs text-gray-600 mt-2">You must be logged in to view your candidate profile.</p>
          <button 
            onClick={() => onNavigate('/login')}
            className="mt-4 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Access Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Loading candidate profile schema from DB...</p>
        </div>
      </div>
    );
  }

  const currentProfile = isEditing ? editedProfile : profile;

  const handleFieldChange = (field: keyof CandidateProfile, value: string | string[]) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProfile || !skillInput.trim()) return;
    const cleanSkill = skillInput.trim();
    if (!editedProfile.skills.includes(cleanSkill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, cleanSkill]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const { data, error } = await profileService.saveProfile(editedProfile);
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setProfile(data);
        setEditedProfile(data);
        setIsEditing(false);
        setSuccessMsg('Candidate profile synchronized with Supabase database!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred while saving.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setErrorMsg(null);
  };

  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handleResumeUploadClick = () => {
    resumeInputRef.current?.click();
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const { url, error } = await profileService.uploadProfilePhoto(user.id, file);
      if (error) {
        setErrorMsg(error.message);
      } else if (url) {
        const updated = { ...profile, profile_photo: url };
        const { data, error: saveErr } = await profileService.saveProfile(updated);
        if (saveErr) {
          setErrorMsg(saveErr.message);
        } else if (data) {
          setProfile(data);
          setEditedProfile(data);
          setSuccessMsg('Profile photo updated successfully!');
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to upload profile photo.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const { url, error } = await profileService.uploadResume(user.id, file);
      if (error) {
        setErrorMsg(error.message);
      } else if (url) {
        const updated = { ...profile, resume_url: url };
        const { data, error: saveErr } = await profileService.saveProfile(updated);
        if (saveErr) {
          setErrorMsg(saveErr.message);
        } else if (data) {
          setProfile(data);
          setEditedProfile(data);
          setSuccessMsg('Resume document updated successfully!');
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      }
    } catch (err) {
      setErrorMsg('Failed to upload resume document.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!profile) return;
    if (!window.confirm('Are you sure you want to remove your resume?')) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (profile.resume_url) {
        await profileService.deleteResume(profile.resume_url);
      }
      const updated = { ...profile, resume_url: '' };
      const { data, error: saveErr } = await profileService.saveProfile(updated);
      if (saveErr) {
        setErrorMsg(saveErr.message);
      } else if (data) {
        setProfile(data);
        setEditedProfile(data);
        setSuccessMsg('Resume document removed successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to delete resume.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const completionPct = profileService.calculateCompletion(profile);

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Candidate Profile Settings" 
        description="Verify and update your candidate profile, manage resume documents, and update skills matrices inside JOB Lo."
        h1Text="JOB Lo Profile Editor"
      />

      <Breadcrumbs 
        items={[
          { label: 'Candidate Dashboard', path: '/dashboard' },
          { label: 'My Profile' }
        ]} 
        onNavigate={onNavigate} 
      />

      {/* SUCCESS / ERROR FLOATING BARS */}
      <div className="max-w-4xl mx-auto px-6 mt-4 space-y-3">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}
      </div>

      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* LEFT COLUMN: AVATAR & COMPLETION SUMMARY */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 text-center space-y-5">
            {/* AVATAR BOX */}
            <div className="relative w-28 h-28 mx-auto group">
              <div className="w-full h-full rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {currentProfile?.profile_photo ? (
                  <img 
                    src={currentProfile.profile_photo} 
                    alt="Candidate Avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-350" />
                )}
              </div>
              <button 
                onClick={handlePhotoUploadClick}
                disabled={saving}
                className="absolute bottom-0 right-0 p-2 bg-black hover:bg-zinc-800 text-white rounded-full border border-white shadow-md transition-all cursor-pointer"
                title="Change Avatar Photo"
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

            {/* QUICK INFO */}
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-gray-950 leading-snug">
                {profile?.full_name || user.name || 'Candidate Name'}
              </h2>
              <p className="text-[11px] text-gray-400">{user.email}</p>
            </div>

            {/* COMPLETION PROGRESS */}
            <div className="space-y-3.5 border-t border-slate-100 pt-4 text-left font-sans">
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Profile Completion</span>
                <span className="text-emerald-700">{completionPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full" 
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Minimum 100% required. Complete the 8-step coordinates wizard to qualify for direct corporate placements.
              </p>

              <button
                onClick={async () => {
                  if (!profile) return;
                  try {
                    const resetProfile = {
                      ...profile,
                      is_profile_wizard_completed: false
                    };
                    await profileService.saveProfile(resetProfile);
                    onNavigate('/dashboard');
                  } catch (e) {
                    console.error('Error launching wizard:', e);
                  }
                }}
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Launch Onboarding Wizard</span>
              </button>
            </div>
          </div>

          {/* RESUME MANAGEMENT CONTAINER */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Resume Document</span>
            </h3>

            {profile?.resume_url ? (
              <div className="space-y-3">
                <div className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]">Resume Sourced</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a 
                      href={profile.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-emerald-700 hover:underline"
                    >
                      Preview
                    </a>
                    <button 
                      onClick={handleDeleteResume}
                      disabled={saving}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleResumeUploadClick}
                  disabled={saving}
                  className="w-full py-2 bg-zinc-50 border border-slate-200 text-gray-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Document</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-center py-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-[11px] text-gray-500 leading-normal">No resume synchronized. Upload your curriculum vitae to qualify for corporate applications.</p>
                <button
                  onClick={handleResumeUploadClick}
                  disabled={saving}
                  className="w-full py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Resume (PDF)</span>
                </button>
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
        </div>

        {/* RIGHT COLUMN: MAIN FORM */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-gray-990 tracking-tight">Profile Credentials</h2>
                <p className="text-xs text-gray-400">Manage candidate details and personal metrics.</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </div>

            {/* FORM CONTAINER */}
            <div className="space-y-5">
              {/* PERSONAL INFO SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.full_name || ''}
                      onChange={(e) => handleFieldChange('full_name', e.target.value)}
                      placeholder="Candidate full legal name"
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.phone || ''}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      disabled={!isEditing}
                      value={currentProfile?.dob || ''}
                      onChange={(e) => handleFieldChange('dob', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Gender</label>
                  <select 
                    disabled={!isEditing}
                    value={currentProfile?.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* LOCATION SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.city || ''}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">State</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={currentProfile?.state || ''}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Country</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={currentProfile?.country || ''}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    placeholder="India"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                  />
                </div>
              </div>

              {/* SKILLS CHIPS & INPUT */}
              <div className="space-y-2 border-t border-slate-50 pt-4">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Candidate Skills Matrix</label>
                
                {/* LIST CHIPS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentProfile?.skills && currentProfile.skills.length > 0 ? (
                    currentProfile.skills.map(sk => (
                      <span 
                        key={sk}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded"
                      >
                        <span>{sk}</span>
                        {isEditing && (
                          <button 
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="text-gray-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-400">No skills specified yet. Add tags below.</span>
                  )}
                </div>

                {isEditing && (
                  <form onSubmit={handleAddSkill} className="flex gap-2 pt-1.5">
                    <input 
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Type a skill (e.g. React 19) and press enter"
                      className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                )}
              </div>

              {/* EXPERIENCE SECTION */}
              <div className="space-y-1.5 border-t border-slate-50 pt-4">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Professional Practice / Experience</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    rows={3}
                    disabled={!isEditing}
                    value={currentProfile?.experience || ''}
                    onChange={(e) => handleFieldChange('experience', e.target.value)}
                    placeholder="Detail past job history, roles, duties, and project timelines..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans resize-y"
                  />
                </div>
              </div>

              {/* EDUCATION SECTION */}
              <div className="space-y-1.5 border-t border-slate-50 pt-4">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Academic Education</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    rows={3}
                    disabled={!isEditing}
                    value={currentProfile?.education || ''}
                    onChange={(e) => handleFieldChange('education', e.target.value)}
                    placeholder="Details about university credentials, college, courses, and certifications..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans resize-y"
                  />
                </div>
              </div>

              {/* LINKS SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.linkedin_url || ''}
                      onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">GitHub URL</label>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.github_url || ''}
                      onChange={(e) => handleFieldChange('github_url', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Portfolio URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={currentProfile?.portfolio_url || ''}
                      onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                      placeholder="https://myportfolio.dev"
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-600 disabled:bg-slate-50 disabled:text-gray-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON BAR EXTRA BOTTOM (WHEN EDITING) */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel Changes
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {saving ? 'Synchronizing DB...' : 'Save Profile Credentials'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
