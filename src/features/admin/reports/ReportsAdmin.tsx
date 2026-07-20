import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldCheck, Eye, RefreshCw, XCircle, Mail, MessageSquare, 
  Search, Check, Trash2, FileDown, X, Send, AlertCircle
} from 'lucide-react';
import { adminService, NewsletterSubscriber, ContactMessage } from '../../../services/adminService';

type ContactSubTab = 'contacts' | 'newsletter' | 'abuse';

export default function ReportsAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<ContactSubTab>('contacts');
  const [loading, setLoading] = useState(true);

  // Core Data Lists
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Local Abuse State
  const [abuseReports, setAbuseReports] = useState([
    { id: 'rep-1', reporter: 'anonymous@domain.in', targetType: 'Scam Job Post', reason: 'Unrealistic processing fee request of Rs. 15,000 for HR onboarding training.', severity: 'High', status: 'Pending' },
    { id: 'rep-2', reporter: 'soma@company.com', targetType: 'Profile Bug', reason: 'Resume loader threw a 500 server exception on 12MB PDF document files.', severity: 'Medium', status: 'Resolved' },
  ]);

  // Modal / Detail views
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await adminService.getNewsletterSubscribers();
      const c = await adminService.getContactMessages();
      setSubscribers(s);
      setContacts(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- NEWSLETTER ---
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this newsletter subscriber?')) return;
    try {
      await adminService.deleteNewsletterSubscriber(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportNewsletter = () => {
    const headers = 'ID,Email,Subscribed At\n';
    const rows = subscribers.map(s => `"${s.id}","${s.email}","${s.subscribedAt}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joblo_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // --- CONTACTS ---
  const handleOpenContact = (msg: ContactMessage) => {
    setSelectedContact(msg);
    setReplyText(msg.replyMessage || '');
  };

  const handleSaveContactReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    setReplying(true);
    try {
      const updated: ContactMessage = {
        ...selectedContact,
        status: 'Resolved',
        replyMessage: replyText,
      };
      await adminService.saveContactMessage(updated);
      setSelectedContact(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(false);
    }
  };

  const handleToggleResolveContact = async (msg: ContactMessage) => {
    try {
      const updated: ContactMessage = {
        ...msg,
        status: msg.status === 'Resolved' ? 'Unread' : 'Resolved',
      };
      await adminService.saveContactMessage(updated);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await adminService.deleteContactMessage(id);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- ABUSE REPORTS ---
  const handleDismissAbuse = (id: string) => {
    setAbuseReports(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleAbuseStatus = (id: string) => {
    setAbuseReports(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Resolved' ? 'Pending' : 'Resolved' } : r));
  };

  // --- FILTERS ---
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNewsletter = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAbuse = abuseReports.filter(r => 
    r.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emerald-600" />
            <span>Compliance, Contacts & Audience CMS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Read support inbox messages, answer corporate inquiries, manage newsletter lists, and action abuse reports.
          </p>
        </div>

        {activeSubTab === 'newsletter' && (
          <button
            onClick={handleExportNewsletter}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer select-none self-start sm:self-auto"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Subscribers</span>
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => { setActiveSubTab('contacts'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'contacts' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact Messages ({contacts.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('newsletter'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'newsletter' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Newsletter Subscribers ({subscribers.length})</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('abuse'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'abuse' 
              ? 'border-emerald-600 text-emerald-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Abuse Reports ({abuseReports.length})</span>
        </button>
      </div>

      {/* CORE RENDER */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Accessing contact logs...</span>
        </div>
      ) : (
        <>
          {/* SEARCH */}
          <div className="relative bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Search className="w-4 h-4 text-slate-400 absolute left-5 top-5" />
            <input
              type="text"
              placeholder={`Search ${activeSubTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
            />
          </div>

          {/* 1. CONTACT MESSAGES */}
          {activeSubTab === 'contacts' && (
            <div className="space-y-3">
              {filteredContacts.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                  Support inbox is empty.
                </div>
              ) : (
                filteredContacts.map(msg => (
                  <div key={msg.id} className="p-4 bg-slate-50/40 hover:bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                    <div className="space-y-1.5 flex-1 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-xs">{msg.subject}</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                          msg.status === 'Resolved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed max-w-xl line-clamp-2">
                        {msg.message}
                      </p>
                      <div className="flex gap-2 text-[10px] text-slate-400 font-bold font-mono">
                        <span>From: {msg.name} ({msg.email})</span>
                        <span>•</span>
                        <span>{msg.createdAt.split('T')[0]}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleResolveContact(msg)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                          msg.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {msg.status === 'Resolved' ? 'Resolved ✓' : 'Mark Resolved'}
                      </button>
                      <button
                        onClick={() => handleOpenContact(msg)}
                        className="p-1 text-slate-500 hover:text-slate-950 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Read message & reply"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(msg.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 border border-rose-150 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. NEWSLETTER */}
          {activeSubTab === 'newsletter' && (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-slate-150 text-left">
                  <thead>
                    <tr className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-3">Subscriber Email</th>
                      <th className="py-3 px-3">Registration Date</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {filteredNewsletter.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-slate-400">
                          No newsletter subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredNewsletter.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50/30">
                          <td className="py-3 px-3 text-slate-900 font-bold font-mono">
                            {sub.email}
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">
                            {sub.subscribedAt.split('T')[0]}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Unsubscribe user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ABUSE REPORTS */}
          {activeSubTab === 'abuse' && (
            <div className="space-y-3">
              {filteredAbuse.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl">
                  Compliance registers are currently completely green!
                </div>
              ) : (
                filteredAbuse.map(report => (
                  <div key={report.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3.5 transition-all">
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900">{report.targetType}</span>
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded ${
                            report.severity === 'High' ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {report.severity} Severity
                          </span>
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded ${
                            report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{report.reason}</p>
                        <p className="text-[9px] text-slate-400 font-mono">Reported by: {report.reporter}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Compliance logs encrypted</span>
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleToggleAbuseStatus(report.id)}
                          className="px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                        >
                          {report.status === 'Resolved' ? 'Re-open Audit' : 'Resolve Claim'}
                        </button>
                        <button
                          onClick={() => handleDismissAbuse(report.id)}
                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                        >
                          Dismiss Claim
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* SUPPORT INBOX RESPONSE DETAIL MODAL */}
      {selectedContact && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleSaveContactReply}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Support Mailbox Inbox</h3>
              <button 
                type="button"
                onClick={() => setSelectedContact(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block">Inquiry Subject</span>
                <p className="font-extrabold text-slate-950">{selectedContact.subject}</p>
                
                <span className="text-[10px] text-slate-400 font-bold uppercase block pt-1">Candidate Details</span>
                <p className="font-semibold text-slate-700">{selectedContact.name} ({selectedContact.email})</p>
                
                <span className="text-[10px] text-slate-400 font-bold uppercase block pt-1">Message Body</span>
                <p className="font-medium text-slate-800 leading-relaxed bg-white border border-slate-100 p-2.5 rounded-lg">
                  {selectedContact.message}
                </p>
              </div>

              <div className="space-y-1 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/70">
                <label className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Compliance / Support Reply</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Type support reply or solution summary parameters here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={replying}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Resolve & Transmit</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
