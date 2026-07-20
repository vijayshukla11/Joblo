import React, { useState, useEffect } from 'react';
import { 
  Settings, ShieldCheck, Save, RefreshCw, Shield, Bell, 
  Tv, Mail, Lock, Check, AlertCircle, Link2, Key
} from 'lucide-react';
import { adminService, SiteSettings, AdminProfile } from '../../../services/adminService';

export default function SettingsAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<'branding' | 'profile'>('branding');
  const [loading, setLoading] = useState(true);

  // Site settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logo: '',
    favicon: '',
    homepageBanner: '',
    footerText: '',
    footerLinks: [],
    socialLinks: { twitter: '', linkedin: '', github: '' },
    contactDetails: { email: '', phone: '', address: '' },
  });

  // Admin profile state
  const [profile, setProfile] = useState<AdminProfile>({
    name: '',
    email: '',
    role: '',
    securityEnabled: true,
    notificationPrefs: { securityAlerts: true, systemLogs: true, weeklyReports: false },
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status indicators
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await adminService.getSiteSettings();
      const p = await adminService.getAdminProfile();
      setSiteSettings(s);
      setProfile(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    try {
      await adminService.saveSiteSettings(siteSettings);
      setStatusMessage('Global site branding configurations updated successfully.');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to save settings.');
      setStatusType('error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // If changing password, validate
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setStatusMessage('To cycle administrative credentials, all password parameters are required.');
        setStatusType('error');
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMessage('New passwords do not match.');
        setStatusType('error');
        return;
      }
      if (newPassword.length < 8) {
        setStatusMessage('Security password must contain at least 8 characters.');
        setStatusType('error');
        return;
      }
    }

    try {
      await adminService.saveAdminProfile(profile);
      
      if (newPassword) {
        // Mock password update
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStatusMessage('Admin profile and security passwords rotated successfully.');
      } else {
        setStatusMessage('Admin profile parameters saved successfully.');
      }
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to update admin profile.');
      setStatusType('error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Portal Settings & Profile Control</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Customize platform branding elements, update contact coordinates, rotate root administrator credentials, and manage notification triggers.
          </p>
        </div>
      </div>

      {/* SUB TABS */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => { setActiveSubTab('branding'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'branding' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Branding & Site Details
        </button>
        <button
          onClick={() => { setActiveSubTab('profile'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'profile' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Admin Profile & Security
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fadeIn ${
          statusType === 'success' 
            ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border border-rose-100 text-rose-800'
        }`}>
          {statusType === 'success' ? (
            <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Reading environment specifications...</span>
        </div>
      ) : activeSubTab === 'branding' ? (
        // BRANDING FORM
        <form onSubmit={handleSaveSiteSettings} className="space-y-5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Platform Branding details */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Platform Identity</span>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Custom Brand Logo Text</label>
                <input
                  type="text"
                  required
                  placeholder="▲ JOB Lo"
                  value={siteSettings.logo}
                  onChange={(e) => setSiteSettings({ ...siteSettings, logo: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-extrabold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Favicon Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="▲"
                  value={siteSettings.favicon}
                  onChange={(e) => setSiteSettings({ ...siteSettings, favicon: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-extrabold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Homepage Banner Header</label>
                <input
                  type="text"
                  required
                  placeholder="Discover the Ultimate Tech & Government Career Pipeline"
                  value={siteSettings.homepageBanner}
                  onChange={(e) => setSiteSettings({ ...siteSettings, homepageBanner: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Corporate Contact Coordinates */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Contact Details Coordinates</span>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Support Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="support@joblo.in"
                  value={siteSettings.contactDetails.email}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    contactDetails: { ...siteSettings.contactDetails, email: e.target.value } 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Helpline Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 80 4912 1000"
                  value={siteSettings.contactDetails.phone}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    contactDetails: { ...siteSettings.contactDetails, phone: e.target.value } 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Head Office Address</label>
                <input
                  type="text"
                  required
                  placeholder="Indiranagar, Bengaluru, KA, India"
                  value={siteSettings.contactDetails.address}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    contactDetails: { ...siteSettings.contactDetails, address: e.target.value } 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Social Media links */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Social Integration Channels</span>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Twitter / X Coordinate URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://x.com/joblo"
                  value={siteSettings.socialLinks.twitter}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, twitter: e.target.value } 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>LinkedIn Page coordinate</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/joblo"
                  value={siteSettings.socialLinks.linkedin}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, linkedin: e.target.value } 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Footer and legal copyright lines */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Footer Legal Signatures</span>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Copyright Text Block</label>
                <input
                  type="text"
                  required
                  placeholder="JOB Lo © 2026. Certified under Indian DPDP Guidelines."
                  value={siteSettings.footerText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Footer Links (separated by commas)</label>
                <input
                  type="text"
                  placeholder="Privacy Policy, Terms of Use, GDPR Logs, MCA Directory"
                  value={siteSettings.footerLinks.join(', ')}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    footerLinks: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0) 
                  })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

          </div>

          {/* Email notifications layout placeholder */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Candidate Sourcing Email Template Placeholder</span>
            <p className="text-slate-600 text-xs font-medium leading-relaxed">
              Default system email template includes: <strong>{"{{candidate_name}}"}</strong>, <strong>{"{{job_title}}"}</strong>, and <strong>{"{{company_name}}"}</strong> tags. These tags will automatically map to the active parameters when triggering automated hiring recommendations.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save System Branding</span>
            </button>
          </div>
        </form>
      ) : (
        // ADMIN PROFILE & SECURITY
        <form onSubmit={handleSaveProfile} className="space-y-5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Credentials Info */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Admin Information</span>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Administrator Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Master Role Assigned</label>
                <input
                  type="text"
                  disabled
                  value={profile.role}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono font-bold"
                />
              </div>
            </div>

            {/* Rotate Password Parameters */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono flex items-center gap-1.5">
                <Key className="w-4 h-4 text-rose-500" />
                <span>Rotate Credentials Security</span>
              </span>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Current Security Passphrase</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Administrative Password</label>
                <input
                  type="password"
                  placeholder="Enter 8+ characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm Rotating Passphrase</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

          </div>

          {/* Alarm triggers preferences */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Alarm Trigger Preferences</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between text-xs font-bold text-slate-700 select-none">
                <span>Security alerts (SMS)</span>
                <input
                  type="checkbox"
                  checked={profile.notificationPrefs.securityAlerts}
                  onChange={(e) => setProfile({
                    ...profile,
                    notificationPrefs: { ...profile.notificationPrefs, securityAlerts: e.target.checked }
                  })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between text-xs font-bold text-slate-700 select-none">
                <span>Scraper Cron system logs</span>
                <input
                  type="checkbox"
                  checked={profile.notificationPrefs.systemLogs}
                  onChange={(e) => setProfile({
                    ...profile,
                    notificationPrefs: { ...profile.notificationPrefs, systemLogs: e.target.checked }
                  })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between text-xs font-bold text-slate-700 select-none">
                <span>Weekly compliance reports</span>
                <input
                  type="checkbox"
                  checked={profile.notificationPrefs.weeklyReports}
                  onChange={(e) => setProfile({
                    ...profile,
                    notificationPrefs: { ...profile.notificationPrefs, weeklyReports: e.target.checked }
                  })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* ACTIVE SESSIONS PANEL */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-mono">Active Sessions Register</span>
            
            <div className="divide-y divide-slate-150 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Linux Chrome OS (This Browser)</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">IP: 104.182.20.91 • Location: Bengaluru, KA</p>
                </div>
                <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                  Active Now
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">iOS Apple Safari Mobile</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">IP: 157.14.90.101 • Location: Indiranagar, Bengaluru</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer select-none"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Rotate Profile Security</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
