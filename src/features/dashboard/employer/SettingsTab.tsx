import React, { useState } from 'react';
import { Settings, Bell, Shield, Palette, Users, CreditCard, Trash2, CheckCircle2, Lock, Key, Mail, RefreshCw, AlertTriangle } from 'lucide-react';

interface SettingsTabProps {
  onShowNotification: (msg: string, type: 'success' | 'info') => void;
}

export default function SettingsTab({ onShowNotification }: SettingsTabProps) {
  const [subTab, setSubTab] = useState<'general' | 'notifications' | 'security' | 'branding' | 'team' | 'billing' | 'danger'>('general');
  
  // Settings States
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Shalini Roy', email: 'shalini@vercel.com', role: 'Technical Lead' },
    { id: '2', name: 'Vijay Sharma', email: 'vijay@vercel.com', role: 'HR Specialist' }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Recruiter');

  const [notificationPrefs, setNotificationPrefs] = useState({
    candidateApp: true,
    weeklyMatches: true,
    interviewReminders: true,
    systemUpdates: false
  });

  const [brandColor, setBrandColor] = useState('#059669'); // Default emerald-600
  const [compName, setCompName] = useState('Vercel India');

  // Deletion state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification('General corporate details refreshed.', 'success');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification('Notification dispatch rules configured.', 'success');
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification('Enterprise branding colors applied successfully.', 'success');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    setTeamMembers(prev => [
      ...prev,
      {
        id: 'member-' + Date.now(),
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole
      }
    ]);

    setNewMemberName('');
    setNewMemberEmail('');
    onShowNotification(`Team invite dispatched to ${newMemberEmail}.`, 'success');
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    onShowNotification('Team member access revoked.', 'info');
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmation !== 'DELETE PERMANENTLY') {
      onShowNotification('Invalid confirmation phrase. Aborting deletion.', 'info');
      return;
    }

    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onShowNotification('Your corporate database instance has been deleted.', 'info');
      window.location.href = '/';
    }, 2000);
  };

  const subMenuItems = [
    { id: 'general', label: 'Company Info', icon: Settings },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'security', label: 'Consoles Security', icon: Shield },
    { id: 'branding', label: 'Branding Layout', icon: Palette },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'billing', label: 'Billing Plan', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs animate-fadeIn font-sans">
      
      {/* 1. LEFT SIDE: SETTINGS SUB-MENU NAVIGATION */}
      <div className="md:col-span-1 space-y-1 bg-white border border-slate-150 rounded-2xl p-3 shadow-3xs h-max select-none">
        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block px-3 py-1 mb-1">Configuration</span>
        {subMenuItems.map(item => {
          const Icon = item.icon;
          const active = subTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-3 transition-all cursor-pointer ${
                active
                  ? 'bg-slate-950 text-white shadow-3xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/70'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. RIGHT SIDE: SETTINGS DETAILS FORM PANEL */}
      <div className="md:col-span-3">
        
        {/* SUB TAB A: GENERAL Specs */}
        {subTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-4 shadow-3xs animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Company Specifications</h4>
              <p className="text-[10px] text-slate-400">Update workspace metadata served to prospective recruits.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Workspace Display Name</label>
                <input
                  type="text"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Workspace Domain ID</label>
                <input
                  type="text"
                  value="vercel.com"
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-transparent rounded-xl font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-bold rounded-xl transition-all select-none cursor-pointer"
            >
              Update Info
            </button>
          </form>
        )}

        {/* SUB TAB B: NOTIFICATIONS */}
        {subTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-4 shadow-3xs animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Alert Dispatch Preferences</h4>
              <p className="text-[10px] text-slate-400">Regulate email and webhook alerts sent during matching schedules.</p>
            </div>

            <div className="space-y-3 pt-2 font-bold text-slate-700">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationPrefs.candidateApp}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, candidateApp: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Instant email alert for every new candidate application</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationPrefs.weeklyMatches}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, weeklyMatches: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Weekly automated AI match-index reports summary</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationPrefs.interviewReminders}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, interviewReminders: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Calendar interview schedules daily briefing</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationPrefs.systemUpdates}
                  onChange={(e) => setNotificationPrefs({ ...notificationPrefs, systemUpdates: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <span>Opt-in for minor version change logs and marketing briefings</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-bold rounded-xl transition-all select-none cursor-pointer"
            >
              Save Alert Rules
            </button>
          </form>
        )}

        {/* SUB TAB C: SECURITY */}
        {subTab === 'security' && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-6 shadow-3xs animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Access passkey & security logs</h4>
              <p className="text-[10px] text-slate-400">Establish credential rotates or audit active API token states.</p>
            </div>

            <div className="space-y-4">
              {/* Reset Password flow trigger simulation */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 block">Rotate Console Passkey</span>
                  <p className="text-[10px] text-slate-400">Trigger a verified reset token to dispatch secure emails.</p>
                </div>
                <button
                  onClick={() => onShowNotification('A secure identity rotation link has been dispatched.', 'info')}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-[10px] select-none cursor-pointer text-slate-700"
                >
                  Rotate Key
                </button>
              </div>

              {/* MFA Simulation */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 block">Multi-Factor MFA Isolation</span>
                  <p className="text-[10px] text-slate-400">Secure Recruiter console via corporate authentication.</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-mono font-bold text-[9px] uppercase border border-emerald-150">
                  Secured (MFA active)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB D: BRANDING */}
        {subTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-4 shadow-3xs animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Public branding coordinates</h4>
              <p className="text-[10px] text-slate-400">Establish corporate accents applied dynamically on your job cards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Theme Hex Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                    placeholder="#059669"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public Brand Slogan</label>
                <input
                  type="text"
                  value="Deploy instantly and scale automatically."
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-transparent rounded-xl font-semibold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 text-white hover:bg-zinc-800 font-bold rounded-xl transition-all select-none cursor-pointer"
            >
              Apply Accent Layouts
            </button>
          </form>
        )}

        {/* SUB TAB E: TEAM MEMBERS */}
        {subTab === 'team' && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-5 shadow-3xs animate-fadeIn">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Enterprise Team Roles</h4>
              <p className="text-[10px] text-slate-400">Grant recruitment, design, or engineering review console access.</p>
            </div>

            {/* Team Addition form */}
            <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800"
                required
              />
              <input
                type="email"
                placeholder="Corporate Email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-transparent focus-ring rounded-xl font-semibold text-slate-800 sm:col-span-2"
                required
              />
              <button
                type="submit"
                className="py-2 bg-slate-950 hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center cursor-pointer select-none"
              >
                Dispatch Invite
              </button>
            </form>

            {/* Members Directory */}
            <div className="border border-slate-150 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-extrabold uppercase select-none">
                    <th className="p-3">Team Member</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Console Role</th>
                    <th className="p-3 text-right">Revoke Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {teamMembers.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-800">{m.name}</td>
                      <td className="p-3 text-slate-500 font-medium">{m.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-mono text-slate-500 font-bold">{m.role}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="p-1 text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB TAB F: BILLING PLAN */}
        {subTab === 'billing' && (
          <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 space-y-6 shadow-3xs animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Enterprise billing tier</h4>
                <p className="text-[10px] text-slate-400">Review quota configurations, invoices, or billing details.</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-150 font-bold text-[10px] uppercase font-mono">
                Active Sandbox Plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-150 bg-slate-50/40 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Current Month Ingress</span>
                <p className="text-xl font-extrabold font-heading text-slate-800">₹0.00 <span className="text-xs text-slate-400 font-medium font-sans">Free Review Trial</span></p>
                <span className="text-[9px] text-emerald-600 font-bold block">Renewal Date: 2026-08-19</span>
              </div>

              <div className="p-4 border border-slate-150 bg-slate-50/40 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Matches Quota Cap</span>
                <p className="text-xl font-extrabold font-heading text-slate-800">Unlimited / month</p>
                <span className="text-[9px] text-indigo-600 font-bold block">Sandbox testing access active</span>
              </div>
            </div>

            {/* Invoices list placeholder */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Recent Invoices logs</span>
              <div className="p-4 border border-dashed border-slate-150 rounded-xl text-center text-slate-400 italic">
                Invoice logs empty under active Sandbox evaluation trial.
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB G: DANGER ZONE */}
        {subTab === 'danger' && (
          <form onSubmit={handleDeleteAccount} className="bg-white border border-rose-150 rounded-2xl p-6 sm:p-8 space-y-5 shadow-3xs animate-fadeIn">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-600" />
                Enterprise Danger Zone
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Deleting this enterprise account will permanently purge your company specifications, all posted vacancies, and applicant timeline records. This action cannot be revoked.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">
                Type <span className="font-mono text-rose-600 font-black tracking-widest bg-rose-50 border border-rose-100 px-1 py-0.5 rounded">DELETE PERMANENTLY</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE PERMANENTLY"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-rose-200 focus-ring rounded-xl font-mono text-[11px] font-bold text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isDeleting || deleteConfirmation !== 'DELETE PERMANENTLY'}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-black rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {isDeleting ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : 'Permanently Delete Enterprise Credentials'}
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
