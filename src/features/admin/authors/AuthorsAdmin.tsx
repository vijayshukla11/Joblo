import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Plus, Search, Edit2, Trash2, Mail, Star, 
  FileText, X, Check, AlertCircle, Info, Smile
} from 'lucide-react';
import { adminService, AdminAuthor } from '../../../services/adminService';

export default function AuthorsAdmin() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AdminAuthor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    credentials: '',
    specialty: '',
    activeGuides: 0,
    email: '',
    bio: '',
    avatarSymbol: '👨‍💼'
  });

  // Feedback states
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const list = await adminService.getAuthors();
      setAuthors(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setFormData({
      name: '',
      credentials: '',
      specialty: 'Corporate Prep',
      activeGuides: 0,
      email: '',
      bio: '',
      avatarSymbol: '👨‍💼'
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author: AdminAuthor) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      credentials: author.credentials,
      specialty: author.specialty,
      activeGuides: author.activeGuides,
      email: author.email,
      bio: author.bio || '',
      avatarSymbol: author.avatarSymbol || '👨‍💼'
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this editorial advisor? This will unregister their credentials from active indexes.')) return;
    try {
      await adminService.deleteAuthor(id);
      await loadAuthors();
      setStatusMessage('Editorial advisor unregistered successfully.');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to unregister advisor.');
      setStatusType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name || !formData.email || !formData.credentials) {
      setStatusMessage('Please complete all required fields.');
      setStatusType('error');
      return;
    }

    try {
      const authorToSave: AdminAuthor = {
        id: editingAuthor ? editingAuthor.id : `auth-${Date.now()}`,
        name: formData.name,
        credentials: formData.credentials,
        specialty: formData.specialty,
        activeGuides: Number(formData.activeGuides),
        email: formData.email,
        bio: formData.bio,
        avatarSymbol: formData.avatarSymbol
      };

      await adminService.saveAuthor(authorToSave);
      await loadAuthors();
      setIsModalOpen(false);
      setStatusMessage(editingAuthor ? 'Author profile successfully updated.' : 'New industry author registered successfully.');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to save author.');
      setStatusType('error');
    }
  };

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>Editorial Author Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Authenticate industry advisors, verify corporate recruitment credentials, and configure bio metadata for career guides.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Editorial Advisor</span>
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

      {/* SEARCH CONTROL */}
      <div className="relative bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <Search className="w-4 h-4 text-slate-400 absolute left-5 top-5" />
        <input
          type="text"
          placeholder="Search authors by name, credentials, or advisory specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
        />
      </div>

      {/* RENDER LIST */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Accessing Editorial registries...</span>
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-2xl">
          No authors registered matching current criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAuthors.map((author) => (
            <div key={author.id} className="p-4 bg-slate-50/40 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs shrink-0 select-none">
                    {author.avatarSymbol || '👨‍💼'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-extrabold text-slate-900 leading-tight">{author.name}</h3>
                      <span className="text-[8px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded uppercase">
                        {author.specialty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold font-mono">{author.credentials}</p>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{author.email}</span>
                    </p>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-150">
                    {author.bio}
                  </p>
                )}
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 text-[10px] font-mono font-bold">
                <div className="inline-flex items-center gap-1 text-slate-600 bg-white px-2 py-0.5 border border-slate-150 rounded-lg">
                  <Star className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{author.activeGuides} Active Guides</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(author)}
                    className="p-1.5 text-slate-500 hover:text-slate-950 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Edit profile parameters"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 border border-rose-150 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Delete advisor registration"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{editingAuthor ? 'Edit Advisor Profile' : 'Register New Editorial Advisor'}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Advisor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvinder Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Symbol Avatar</label>
                  <select
                    value={formData.avatarSymbol}
                    onChange={(e) => setFormData({ ...formData, avatarSymbol: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                  >
                    <option value="👨‍💼">👨‍💼 (Advisor M)</option>
                    <option value="👩‍💼">👩‍💼 (Advisor F)</option>
                    <option value="🎓">🎓 (Academic)</option>
                    <option value="💼">💼 (Corporate)</option>
                    <option value="🏛️">🏛️ (Government)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Professional Credentials *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ex-HR Specialist Infosys, PhD Advisory"
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Advisory Specialty *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                  >
                    <option value="Corporate Prep">Corporate Prep</option>
                    <option value="Gazette Exams">Gazette Exams</option>
                    <option value="Resume Design">Resume Design</option>
                    <option value="Skill Mapping">Skill Mapping</option>
                    <option value="Salary Advisory">Salary Advisory</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Guides Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="8"
                    value={formData.activeGuides}
                    onChange={(e) => setFormData({ ...formData, activeGuides: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@joblo.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Biography & Background Profile</label>
                <textarea
                  rows={3}
                  placeholder="Summarize the advisor's corporate recruitment background or educational counselling metrics..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-medium leading-relaxed"
                />
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save Registry</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
