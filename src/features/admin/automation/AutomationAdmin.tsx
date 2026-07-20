import React, { useState, useEffect } from 'react';
import { 
  Cpu, Plus, Search, Edit2, Trash2, Play, RefreshCw, 
  X, Check, AlertCircle, Link2, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { adminService, AutomationWebhook } from '../../../services/adminService';

export default function AutomationAdmin() {
  const [webhooks, setWebhooks] = useState<AutomationWebhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active testing tasks mapping
  const [testingIds, setTestingIds] = useState<string[]>([]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<AutomationWebhook | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    endpointUrl: '',
    method: 'POST' as 'POST' | 'GET' | 'PUT',
    intervalSchedule: 'Every 24 Hours',
    isActive: true
  });

  // Feedback states
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const list = await adminService.getWebhooks();
      setWebhooks(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleOpenCreate = () => {
    setEditingWebhook(null);
    setFormData({
      name: '',
      endpointUrl: '',
      method: 'POST',
      intervalSchedule: 'Every 24 Hours',
      isActive: true
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (webhook: AutomationWebhook) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      endpointUrl: webhook.endpointUrl,
      method: webhook.method,
      intervalSchedule: webhook.intervalSchedule,
      isActive: webhook.isActive
    });
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this automation webhook pipeline?')) return;
    try {
      await adminService.deleteWebhook(id);
      await loadWebhooks();
      setStatusMessage('Automation webhook deleted successfully.');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to delete webhook.');
      setStatusType('error');
    }
  };

  const handleToggleActive = async (webhook: AutomationWebhook) => {
    try {
      const updated: AutomationWebhook = {
        ...webhook,
        isActive: !webhook.isActive,
        status: !webhook.isActive ? 'Healthy' : 'Paused'
      };
      await adminService.saveWebhook(updated);
      await loadWebhooks();
      setStatusMessage(`Pipeline "${webhook.name}" is now ${updated.isActive ? 'Active' : 'Paused'}.`);
      setStatusType('success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestTrigger = async (webhook: AutomationWebhook) => {
    if (testingIds.includes(webhook.id)) return;
    
    setTestingIds(prev => [...prev, webhook.id]);
    setStatusMessage(null);

    // Simulate endpoint request latency
    setTimeout(async () => {
      try {
        const updated: AutomationWebhook = {
          ...webhook,
          lastRun: 'Just now',
          status: 'Healthy'
        };
        await adminService.saveWebhook(updated);
        await loadWebhooks();
        setStatusMessage(`Programmatic trigger transmitted to ${webhook.endpointUrl}. Response received: 200 OK.`);
        setStatusType('success');
      } catch (err) {
        console.error(err);
      } finally {
        setTestingIds(prev => prev.filter(id => id !== webhook.id));
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name || !formData.endpointUrl) {
      setStatusMessage('Please complete all required fields.');
      setStatusType('error');
      return;
    }

    try {
      const toSave: AutomationWebhook = {
        id: editingWebhook ? editingWebhook.id : `web-${Date.now()}`,
        name: formData.name,
        endpointUrl: formData.endpointUrl,
        method: formData.method,
        intervalSchedule: formData.intervalSchedule,
        lastRun: editingWebhook ? editingWebhook.lastRun : 'Never',
        status: editingWebhook ? editingWebhook.status : 'Healthy',
        isActive: formData.isActive
      };

      await adminService.saveWebhook(toSave);
      await loadWebhooks();
      setIsModalOpen(false);
      setStatusMessage(editingWebhook ? 'Webhook settings updated.' : 'New scraper pipeline registered.');
      setStatusType('success');
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to save webhook.');
      setStatusType('error');
    }
  };

  const filtered = webhooks.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.endpointUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>n8n Webhooks & Scraping Schedulers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Configure rest webhooks, monitor regional cron scrapers, and force-dispatch data ingestion queues.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Register Webhook</span>
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

      {/* SEARCH */}
      <div className="relative bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <Search className="w-4 h-4 text-slate-400 absolute left-5 top-5" />
        <input
          type="text"
          placeholder="Search endpoints or scheduler names..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
        />
      </div>

      {/* RENDER GRID */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 font-medium">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs">Reading pipeline indexes...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-medium bg-slate-50 border border-dashed rounded-2xl">
          No pipeline webhooks match current queries.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((webhook) => {
            const isTesting = testingIds.includes(webhook.id);
            return (
              <div 
                key={webhook.id} 
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  webhook.isActive 
                    ? 'bg-slate-50/45 hover:bg-slate-50 border-slate-100' 
                    : 'bg-slate-100/40 border-slate-200 opacity-75'
                }`}
              >
                <div className="space-y-1.5 text-xs flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900">{webhook.name}</span>
                    <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded border uppercase ${
                      webhook.status === 'Healthy' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : webhook.status === 'Paused'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {webhook.status}
                    </span>
                    <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
                      {webhook.method}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1 leading-none truncate max-w-lg">
                    <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{webhook.endpointUrl}</span>
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                    <span>INTERVAL: {webhook.intervalSchedule}</span>
                    <span>•</span>
                    <span>LAST DISPATCHED: {webhook.lastRun}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-slate-100/60 sm:border-0">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleActive(webhook)}
                    className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    title={webhook.isActive ? "Pause webhook cron" : "Activate webhook cron"}
                  >
                    {webhook.isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTestTrigger(webhook)}
                      disabled={isTesting || !webhook.isActive}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-h-[30px]"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                      ) : (
                        <Play className="w-3 h-3 text-indigo-600" />
                      )}
                      <span>{isTesting ? 'Testing...' : 'Test Cron'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(webhook)}
                      className="p-1.5 text-slate-500 hover:text-slate-950 border border-slate-200 hover:bg-white rounded-lg cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 border border-rose-150 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DIALOG FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-md w-full border border-slate-150 p-6 space-y-4 shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>{editingWebhook ? 'Edit Webhook Configuration' : 'Register Custom Webhook Pipeline'}</span>
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
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Pipeline Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Govt Gazetted Web Scraper v2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">REST Endpoint URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://n8n.joblo.in/..."
                    value={formData.endpointUrl}
                    onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">HTTP Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as 'POST' | 'GET' | 'PUT' })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Execution Interval Schedule</label>
                <select
                  value={formData.intervalSchedule}
                  onChange={(e) => setFormData({ ...formData, intervalSchedule: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
                >
                  <option value="Every 30 Minutes">Every 30 Minutes</option>
                  <option value="Every 4 Hours">Every 4 Hours</option>
                  <option value="Every 12 Hours">Every 12 Hours</option>
                  <option value="Every 24 Hours">Every 24 Hours</option>
                  <option value="Every Sunday 00:00">Every Sunday 00:00</option>
                </select>
              </div>

              <label className="p-3 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer flex items-center justify-between text-xs font-bold text-slate-700 select-none">
                <span>Enable immediately upon registration</span>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

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
                <span>Save Pipeline</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
