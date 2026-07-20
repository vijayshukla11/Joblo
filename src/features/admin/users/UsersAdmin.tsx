import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Shield, Trash2, Search, Filter, Plus, 
  Check, X, FileDown, Eye, AlertCircle, Award, Briefcase, Mail
} from 'lucide-react';
import { adminService, AdminUser, AdminJobSeeker } from '../../../services/adminService';

export default function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [seekers, setSeekers] = useState<AdminJobSeeker[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Applicant' | 'Employer' | 'Admin'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Pending'>('All');
  
  // Tab-specific toggle
  const [activeTab, setActiveTab] = useState<'all-users' | 'job-seekers'>('all-users');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Applicant' as AdminUser['role'], status: 'Active' as AdminUser['status'] });
  const [selectedSeeker, setSelectedSeeker] = useState<AdminJobSeeker | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const u = await adminService.getUsers();
      const s = await adminService.getJobSeekers();
      setUsers(u);
      setSeekers(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newUser.name.trim() || !newUser.email.trim()) {
      setModalError('Full Name and Email coordinates are required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      setModalError('This email is already registered.');
      return;
    }

    try {
      const created: AdminUser = {
        id: `usr-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        created_at: new Date().toISOString().split('T')[0],
      };
      await adminService.saveUser(created);

      // If they are an applicant, automatically create a placeholder job seeker profile
      if (newUser.role === 'Applicant') {
        const seekerPayload: AdminJobSeeker = {
          id: `jsk-${Date.now()}`,
          name: newUser.name,
          email: newUser.email,
          resumeUrl: '',
          profileCompletion: 25,
          status: 'Active',
          education: 'Incomplete',
          experience: 'Fresher',
          appliedCount: 0,
          savedCount: 0,
          skills: [],
        };
        await adminService.saveJobSeeker(seekerPayload);
      }

      setIsCreateModalOpen(false);
      setNewUser({ name: '', email: '', role: 'Applicant', status: 'Active' });
      await loadData();
    } catch (err: any) {
      setModalError(err.message || 'Failed to persist user definition.');
    }
  };

  const handleStatusChange = async (user: AdminUser, newStatus: AdminUser['status']) => {
    try {
      const updated = { ...user, status: newStatus };
      await adminService.saveUser(updated);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (user: AdminUser, newRole: AdminUser['role']) => {
    try {
      const updated = { ...user, role: newRole };
      await adminService.saveUser(updated);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this user account? This cannot be undone.')) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Role,Status,Created At\n';
    const rows = users.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.status}","${u.created_at}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joblo_user_register_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter calculation
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredSeekers = seekers.filter(s => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>User Directory Terminal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage global accounts, adjust authorization roles, toggle suspension flags, and audit job seeker credentials.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer select-none"
          >
            <FileDown className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
          >
            <Plus className="w-4 h-4" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* INNER VIEW TABS */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('all-users')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'all-users' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('job-seekers')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'job-seekers' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Job Seeker Profiles ({seekers.length})
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'all-users' ? "Search by name, email or ID..." : "Search by name, email, skills..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
          />
        </div>

        {activeTab === 'all-users' && (
          <>
            <div>
              <select
                value={roleFilter}
                onChange={(e: any) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Applicant">Applicant Only</option>
                <option value="Employer">Employer Only</option>
                <option value="Admin">Administrator Only</option>
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-bold cursor-pointer focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Accounts</option>
                <option value="Suspended">Suspended Accounts</option>
                <option value="Pending">Pending Validation</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* CORE CONTENT LAYOUTS */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Querying security registers...</span>
        </div>
      ) : activeTab === 'all-users' ? (
        // ALL USERS TABLE
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-150 text-left">
              <thead>
                <tr className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-3">Account credentials</th>
                  <th className="py-3 px-3">RBAC Role</th>
                  <th className="py-3 px-3">Gateway Status</th>
                  <th className="py-3 px-3">Created Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                      No users match the defined security constraints.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/30">
                      <td className="py-3 px-3">
                        <span className="text-slate-900 font-bold block">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{user.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={user.role}
                          onChange={(e: any) => handleRoleChange(user, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-extrabold rounded-md px-1.5 py-0.5 cursor-pointer focus:outline-none"
                        >
                          <option value="Applicant">Applicant</option>
                          <option value="Employer">Employer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={user.status}
                          onChange={(e: any) => handleStatusChange(user, e.target.value)}
                          className={`text-[10px] font-extrabold rounded-md px-2 py-0.5 border cursor-pointer focus:outline-none ${
                            user.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : user.status === 'Suspended'
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                        {user.created_at}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer transition-colors"
                            title="Inspect metadata profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer transition-colors"
                            title="Purge user credentials"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // JOB SEEKER SPECIFIC GRID / CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSeekers.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-medium col-span-2 border border-dashed border-slate-100 rounded-xl">
              No matching job seeker profiles found.
            </div>
          ) : (
            filteredSeekers.map((seeker) => (
              <div 
                key={seeker.id} 
                className="p-5 border border-slate-150 rounded-xl hover:border-slate-300 transition-all bg-slate-50/20 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{seeker.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{seeker.email}</p>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {seeker.profileCompletion}% complete
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-semibold">
                    <p className="text-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{seeker.education}</span>
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{seeker.experience}</span>
                    </p>
                  </div>

                  {seeker.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {seeker.skills.map((sk) => (
                        <span key={sk} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-4 text-[10px] text-slate-400 font-mono font-bold">
                    <span>Applied: <strong className="text-slate-800">{seeker.appliedCount}</strong></span>
                    <span>Saved: <strong className="text-slate-800">{seeker.savedCount}</strong></span>
                  </div>

                  <button
                    onClick={() => setSelectedSeeker(seeker)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-150 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Profile</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CREATE NEW ACCOUNT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleCreateUserSubmit}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Provision User Account</h3>
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl focus:border-slate-400 focus:outline-none text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-250 rounded-xl focus:border-slate-400 focus:outline-none text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Hiring/Applicant Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e: any) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none text-slate-800 font-semibold"
                  >
                    <option value="Applicant">Applicant</option>
                    <option value="Employer">Employer</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Initial Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e: any) => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-250 rounded-xl focus:outline-none text-slate-800 font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INSPECT USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">User Credentials Inspection</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">System ID</span>
                <p className="font-mono text-slate-800 font-bold select-all">{selectedUser.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Legal Name</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedUser.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Coordinates</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">RBAC Role Assigned</span>
                  <p className="font-extrabold text-indigo-700 mt-0.5 bg-indigo-50 border border-indigo-100 inline-block px-2 py-0.5 rounded-md">
                    {selectedUser.role}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Creation</span>
                  <p className="font-mono text-slate-600 mt-0.5">{selectedUser.created_at}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Compliance Parameter status</span>
                <p className="text-[10px] text-emerald-600 font-mono font-bold mt-1 leading-relaxed">
                  ✓ Verified via Indian cryptographic data consent rules.<br />
                  ✓ Active session logs clean.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT JOB SEEKER MODAL */}
      {selectedSeeker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Job Seeker Core Profile</h3>
              <button 
                onClick={() => setSelectedSeeker(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">{selectedSeeker.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedSeeker.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400">PROFILE COMPLETION</span>
                  <p className="text-lg font-mono font-extrabold text-emerald-600">{selectedSeeker.profileCompletion}%</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <p className="font-semibold text-slate-800 flex items-start gap-1.5">
                  <Award className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                  <span><strong>Education:</strong> {selectedSeeker.education}</span>
                </p>
                <p className="font-semibold text-slate-700 flex items-start gap-1.5">
                  <Briefcase className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span><strong>Experience:</strong> {selectedSeeker.experience}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Skills Stack</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSeeker.skills.length === 0 ? (
                    <span className="text-slate-400 font-medium italic">No skills listed yet.</span>
                  ) : (
                    selectedSeeker.skills.map(sk => (
                      <span key={sk} className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {sk}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Candidate Resume coordinate</span>
                {selectedSeeker.resumeUrl ? (
                  <a
                    href={selectedSeeker.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  >
                    <span>Download Candidate Resume Spec</span>
                    <span className="text-[10px] font-mono font-bold uppercase">(PDF)</span>
                  </a>
                ) : (
                  <p className="text-amber-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>No Resume file uploaded to candidate database yet.</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">APPLIED CORPORATE JOBS</span>
                  <p className="text-xl font-mono font-extrabold text-slate-800 mt-1">{selectedSeeker.appliedCount}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">SAVED PIPELINES</span>
                  <p className="text-xl font-mono font-extrabold text-slate-800 mt-1">{selectedSeeker.savedCount}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedSeeker(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
