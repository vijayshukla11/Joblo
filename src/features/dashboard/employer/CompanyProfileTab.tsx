import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Globe, MapPin, Linkedin, Twitter, Github, Edit3, Save, Award, Eye, Heart, ListPlus, Plus, Trash2 } from 'lucide-react';
import { CompanyProfile } from '../../../types';
import { employerService } from '../../../services/employerService';
import { initialCompanyProfile } from '../../../data/employerMockData';

interface CompanyProfileTabProps {
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
}

export default function CompanyProfileTab({ onShowNotification }: CompanyProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>(initialCompanyProfile);
  
  // Local state for editing fields that are lists
  const [newBranch, setNewBranch] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newAward, setNewAward] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await employerService.getCompanyProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await employerService.updateCompanyProfile(profile);
    setIsEditing(false);
    onShowNotification('Company Hub profile has been cryptographically saved and synchronized.', 'success');
  };

  const addBranch = () => {
    if (newBranch.trim() && !profile.branches.includes(newBranch.trim())) {
      setProfile(prev => ({ ...prev, branches: [...prev.branches, newBranch.trim()] }));
      setNewBranch('');
    }
  };

  const removeBranch = (b: string) => {
    setProfile(prev => ({ ...prev, branches: prev.branches.filter(branch => branch !== b) }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !profile.benefits.includes(newBenefit.trim())) {
      setProfile(prev => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (b: string) => {
    setProfile(prev => ({ ...prev, benefits: prev.benefits.filter(benefit => benefit !== b) }));
  };

  const addAward = () => {
    if (newAward.trim() && !profile.awards.includes(newAward.trim())) {
      setProfile(prev => ({ ...prev, awards: [...prev.awards, newAward.trim()] }));
      setNewAward('');
    }
  };

  const removeAward = (a: string) => {
    setProfile(prev => ({ ...prev, awards: prev.awards.filter(award => award !== a) }));
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      
      {/* Header with Edit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-150">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 font-heading">Company Hub Configuration</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Manage public metadata, office galleries, culture notes, and hiring tags.</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 select-none cursor-pointer border transition-colors ${
            isEditing
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              : 'bg-slate-950 hover:bg-zinc-800 border-transparent text-white'
          }`}
        >
          {isEditing ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Preview Profile</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Modify Details</span>
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        /* ==================== EDIT FORM ==================== */
        <form onSubmit={handleSave} className="space-y-6 bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-3xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Logo, Name, Hiring Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hiring Status</label>
              <select
                value={profile.hiringStatus}
                onChange={(e) => setProfile({ ...profile, hiringStatus: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 cursor-pointer"
              >
                <option value="Active">Active Sourcing</option>
                <option value="Selective">Selective Hiring</option>
                <option value="On Hold">On Hold (Frozen)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cover and Website */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cover Image URL</label>
              <input
                type="url"
                value={profile.coverImage}
                onChange={(e) => setProfile({ ...profile, coverImage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Company Description</label>
            <textarea
              value={profile.about}
              onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Industry, Size, Founded */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry</label>
              <input
                type="text"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Size</label>
              <input
                type="text"
                value={profile.size}
                onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Founded Year</label>
              <input
                type="text"
                value={profile.foundedYear}
                onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Headquarters, LinkedIn, Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headquarters City</label>
              <input
                type="text"
                value={profile.headOffice}
                onChange={(e) => setProfile({ ...profile, headOffice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public Recruiting Email</label>
              <input
                type="email"
                value={profile.companyEmail || ''}
                onChange={(e) => setProfile({ ...profile, companyEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phone, Twitter, Facebook */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recruiter Phone Coordinate</label>
              <input
                type="text"
                value={profile.recruiterMobile || ''}
                onChange={(e) => setProfile({ ...profile, recruiterMobile: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Twitter/X Coordinates</label>
              <input
                type="url"
                value={profile.twitter_x || ''}
                onChange={(e) => setProfile({ ...profile, twitter_x: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Facebook Coordinates</label>
              <input
                type="url"
                value={profile.facebook || ''}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Branches Manager */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Branch Offices</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
              <button
                type="button"
                onClick={addBranch}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1.5">
              {profile.branches.map((b) => (
                <span key={b} className="bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-2 py-1 flex items-center gap-2 font-semibold">
                  <span>{b}</span>
                  <button type="button" onClick={() => removeBranch(b)} className="text-rose-600 hover:text-rose-700 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Benefits Manager */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Compensation & Benefits</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="e.g. Daily catered gourmet meals"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1.5">
              {profile.benefits.map((b) => (
                <span key={b} className="bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-2 py-1 flex items-center gap-2 font-semibold">
                  <span>{b}</span>
                  <button type="button" onClick={() => removeBenefit(b)} className="text-rose-600 hover:text-rose-700 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Awards Manager */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry Awards & Recognition</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                placeholder="e.g. Top Employer of India 2025"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              />
              <button
                type="button"
                onClick={addAward}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1.5">
              {profile.awards.map((a) => (
                <span key={a} className="bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-2 py-1 flex items-center gap-2 font-semibold">
                  <span>{a}</span>
                  <button type="button" onClick={() => removeAward(a)} className="text-rose-600 hover:text-rose-700 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Culture Statement</label>
            <textarea
              value={profile.culture}
              onChange={(e) => setProfile({ ...profile, culture: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-extrabold rounded-xl text-center flex items-center justify-center gap-2 select-none cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Public Specifications</span>
          </button>

        </form>
      ) : (
        /* ==================== PREVIEW PROFILE VIEW ==================== */
        <div className="space-y-6">
          
          {/* Cover and Brand Hero Block */}
          <div className="relative border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-3xs">
            <div className="h-44 sm:h-52 w-full overflow-hidden">
              <img
                src={profile.coverImage}
                alt={`${profile.name} Cover`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
              {/* Logo Overlay */}
              <div className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-2xl bg-black border-4 border-white flex items-center justify-center text-white text-3xl font-black shadow-xs select-none">
                {profile.logo}
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2.5">
                  <span>{profile.name}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md tracking-wider ${
                    profile.hiringStatus === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                      : 'bg-amber-50 text-amber-700 border border-amber-150'
                  }`}>
                    {profile.hiringStatus} Sourcing
                  </span>
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 font-medium font-sans">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {profile.industry}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.headOffice}
                  </span>
                </div>
              </div>

              {/* Quick links bar */}
              <div className="flex gap-2 shrink-0">
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Block - Metadata */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About Section */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">Corporate Overview</h4>
                <p className="text-slate-600 font-medium font-sans leading-relaxed text-[11px] sm:text-xs">
                  {profile.about}
                </p>
              </div>

              {/* Culture Section */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Culture & Operations
                </h4>
                <p className="text-slate-600 font-medium font-sans leading-relaxed text-[11px] sm:text-xs">
                  {profile.culture}
                </p>
              </div>

              {/* Photo Gallery */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">Workspace Showcase</h4>
                <div className="grid grid-cols-3 gap-3">
                  {profile.officeGallery.map((imgUrl, i) => (
                    <div key={i} className="h-20 sm:h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img src={imgUrl} alt="Workspace" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Block - Sidebar specs */}
            <div className="space-y-6">
              
              {/* Attributes Card */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-4 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">Hub Attributes</h4>
                
                <div className="space-y-3 font-sans font-medium text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Founded</span>
                    <span className="font-bold text-slate-800">{profile.foundedYear}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Scale</span>
                    <span className="font-bold text-slate-800">{profile.size}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 py-1 border-b border-slate-50">
                    <span className="text-slate-400">Secondary Sites</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.branches.map(b => (
                        <span key={b} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md font-bold text-[9px] text-slate-700">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">Select Benefits</h4>
                <div className="space-y-2">
                  {profile.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2 text-slate-600 font-sans font-medium">
                      <ListPlus className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recognition Card */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6 space-y-3.5 shadow-3xs">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Recognition & Awards
                </h4>
                <div className="space-y-2">
                  {profile.awards.map((a, i) => (
                    <div key={i} className="flex gap-2 text-slate-600 font-sans font-medium">
                      <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
