import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Filter, Search, ShieldAlert, Cpu, 
  Terminal, ArrowUpRight, Clock, ThumbsUp, AlertTriangle
} from 'lucide-react';

interface AiTraceLog {
  id: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: 'Success' | 'Timeout' | 'RateLimit' | 'Error';
  timestamp: string;
  promptSnippet: string;
}

export default function AiMonitoringAdmin() {
  const [logs, setLogs] = useState<AiTraceLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize logs on load
  useEffect(() => {
    const key = 'joblo_admin_ai_traces';
    const stored = localStorage.getItem(key);
    if (stored) {
      setLogs(JSON.parse(stored));
    } else {
      const initial: AiTraceLog[] = [
        { id: 'trace-1', modelName: 'gemini-2.5-flash', promptTokens: 1420, completionTokens: 850, latencyMs: 420, status: 'Success', timestamp: 'Just now', promptSnippet: 'Perform semantic candidate matching for senior SRE remote pipeline' },
        { id: 'trace-2', modelName: 'gemini-2.5-pro', promptTokens: 8500, completionTokens: 2400, latencyMs: 1150, status: 'Success', timestamp: '5 mins ago', promptSnippet: 'Generate technical skill roadmap curriculum for Kubernetes Developer v2' },
        { id: 'trace-3', modelName: 'gemini-2.5-flash', promptTokens: 1900, completionTokens: 0, latencyMs: 1500, status: 'Timeout', timestamp: '1 hour ago', promptSnippet: 'Resume parser extraction for candidate ID #5291' },
        { id: 'trace-4', modelName: 'gemini-2.5-flash', promptTokens: 450, completionTokens: 210, latencyMs: 180, status: 'Success', timestamp: '3 hours ago', promptSnippet: 'Generate meta-tags for government portal sector guide' },
        { id: 'trace-5', modelName: 'gemini-2.5-flash', promptTokens: 3500, completionTokens: 0, latencyMs: 80, status: 'RateLimit', timestamp: 'Yesterday', promptSnippet: 'Deep-crawl government gazette PDF structure classification' }
      ];
      localStorage.setItem(key, JSON.stringify(initial));
      setLogs(initial);
    }
  }, []);

  const saveLogs = (newLogs: AiTraceLog[]) => {
    localStorage.setItem('joblo_admin_ai_traces', JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  const handleTriggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    setTimeout(() => {
      const models = ['gemini-2.5-flash', 'gemini-2.5-pro'];
      const statuses: AiTraceLog['status'][] = ['Success', 'Success', 'Success', 'Timeout', 'RateLimit'];
      const snippets = [
        'Validate company registration credentials against MCA index',
        'Summarize ATS criteria checklists for frontend engineering positions',
        'Categorize government syllabus keywords automatically',
        'Verify job eligibility metadata structures'
      ];

      const chosenModel = models[Math.floor(Math.random() * models.length)];
      const chosenStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const chosenSnippet = snippets[Math.floor(Math.random() * snippets.length)];
      const promptTok = Math.floor(Math.random() * 4000) + 300;
      const compTok = chosenStatus === 'Success' ? Math.floor(Math.random() * 1500) + 100 : 0;
      const latency = Math.floor(Math.random() * 1200) + 120;

      const newTrace: AiTraceLog = {
        id: `trace-${Date.now()}`,
        modelName: chosenModel,
        promptTokens: promptTok,
        completionTokens: compTok,
        latencyMs: latency,
        status: chosenStatus,
        timestamp: 'Just now',
        promptSnippet: chosenSnippet
      };

      const updated = [newTrace, ...logs];
      saveLogs(updated);
      setIsSimulating(false);
    }, 1200);
  };

  const handleClearLogs = () => {
    if (!window.confirm('Are you sure you want to purge all active telemetry traces?')) return;
    saveLogs([]);
  };

  // Compute stats
  const totalTokens = logs.reduce((sum, log) => sum + log.promptTokens + log.completionTokens, 0);
  const avgLatency = logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + log.latencyMs, 0) / logs.length) : 0;
  const errorRate = logs.length > 0 ? Math.round((logs.filter(l => l.status !== 'Success').length / logs.length) * 100) : 0;

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchesSearch = log.promptSnippet.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.modelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>AI Gateway Telemetry & Logs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Audit API token weight allocations, inspect model latency distribution, and verify error rate resilience parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Clear Telemetry
          </button>
          <button
            onClick={handleTriggerSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSimulating ? 'Tracing Request...' : 'Trigger Sample Audit'}</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Token Volume (Run)</span>
            <Cpu className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-950 font-heading">
            {totalTokens.toLocaleString()} <span className="text-xs font-mono text-slate-400">Tokens</span>
          </p>
          <div className="text-[9px] font-bold text-slate-500 font-mono">Active budget usage limits healthy</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Avg LLM Latency</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-950 font-heading">
            {avgLatency} <span className="text-xs font-mono text-slate-400">ms</span>
          </p>
          <div className="text-[9px] font-bold text-slate-500 font-mono">Exponential backoffs enabled</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Gateway Errors</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-950 font-heading">
            {errorRate}% <span className="text-xs font-mono text-slate-400">Rate</span>
          </p>
          <div className="text-[9px] font-bold text-slate-500 font-mono">Threshold targets sub-3.00%</div>
        </div>

      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter trace by prompt query snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
          >
            <option value="All">All Trace Statuses</option>
            <option value="Success">Success</option>
            <option value="Timeout">Timeout</option>
            <option value="RateLimit">RateLimit</option>
          </select>
        </div>
      </div>

      {/* LOG TRACES */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
        <div className="bg-slate-50 px-4 py-2 text-[10px] font-mono font-bold text-slate-400 border-b border-slate-100 grid grid-cols-12 gap-4 uppercase tracking-wider">
          <div className="col-span-5 sm:col-span-6">Trace Request Snippet</div>
          <div className="col-span-3 sm:col-span-2">Model Gateway</div>
          <div className="col-span-2 text-right">Tokens</div>
          <div className="col-span-2 text-right">Latency</div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium">
              No active AI pipeline trace records match the criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="px-4 py-3.5 hover:bg-slate-50/50 transition-colors grid grid-cols-12 gap-4 items-center">
                
                {/* PROMPT SNIPPET */}
                <div className="col-span-5 sm:col-span-6 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                      log.status === 'Success' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : log.status === 'Timeout'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono font-bold leading-none">{log.timestamp}</span>
                  </div>
                  <p className="font-semibold text-slate-800 truncate font-sans pr-4" title={log.promptSnippet}>
                    {log.promptSnippet}
                  </p>
                </div>

                {/* MODEL GATEWAY */}
                <div className="col-span-3 sm:col-span-2 font-mono font-bold text-slate-600 text-[10px]">
                  {log.modelName}
                </div>

                {/* TOKENS */}
                <div className="col-span-2 text-right font-mono font-bold text-slate-600 text-[10px]">
                  {log.status === 'Success' ? (
                    <span className="text-slate-800">
                      {log.promptTokens + log.completionTokens} <span className="text-[8px] text-slate-400">({log.promptTokens} in)</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>

                {/* LATENCY */}
                <div className="col-span-2 text-right font-mono font-bold text-slate-700 text-[10px] flex items-center justify-end gap-1">
                  <span>{log.latencyMs} ms</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* GATEWAY ANNOUNCEMENT */}
      <div className="p-4 bg-indigo-50/40 border border-indigo-50 rounded-2xl flex items-start gap-3">
        <Terminal className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-extrabold text-slate-800">Dynamic Gateway Resiliency Protocol</p>
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
            The JOB Lo LLM Gateway automatically balances outbound traffic across model endpoints, with automatic fallback mapping enabled. Outages or prompt filtering blocks are cryptographically isolated and registered instantly under the Admin security log framework.
          </p>
        </div>
      </div>

    </div>
  );
}
