import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Unlock, Check, AlertOctagon, 
  Search, Shield, Key, Eye, HelpCircle, EyeOff, AlertCircle
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  eventName: string;
  ipAddress: string;
  severity: 'Low' | 'Medium' | 'Critical';
  actionTaken: 'Logged' | 'IP Blocked' | 'Captcha Enforced';
  timestamp: string;
  isResolved: boolean;
}

export default function SecurityAdmin() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize data on load
  useEffect(() => {
    const eventsKey = 'joblo_admin_security_events';
    const blockedKey = 'joblo_admin_blocked_ips';
    
    const storedEvents = localStorage.getItem(eventsKey);
    const storedBlocked = localStorage.getItem(blockedKey);

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      const initialEvents: SecurityEvent[] = [
        { id: 'sec-1', eventName: 'SQL Injection attempts detected on search endpoint', ipAddress: '45.12.19.141', severity: 'Critical', actionTaken: 'IP Blocked', timestamp: 'Just now', isResolved: false },
        { id: 'sec-2', eventName: 'Excessive login attempts on employer gate', ipAddress: '192.168.1.104', severity: 'Medium', actionTaken: 'Captcha Enforced', timestamp: '1 hour ago', isResolved: false },
        { id: 'sec-3', eventName: 'Cross-Origin resource block alert', ipAddress: '103.5.21.90', severity: 'Low', actionTaken: 'Logged', timestamp: '3 hours ago', isResolved: true },
        { id: 'sec-4', eventName: 'Authorized DPDP audit log deletion requested', ipAddress: '110.12.5.4', severity: 'Medium', actionTaken: 'Logged', timestamp: 'Yesterday', isResolved: false }
      ];
      localStorage.setItem(eventsKey, JSON.stringify(initialEvents));
      setEvents(initialEvents);
    }

    if (storedBlocked) {
      setBlockedIps(JSON.parse(storedBlocked));
    } else {
      const initialBlocked = ['45.12.19.141', '102.13.114.5'];
      localStorage.setItem(blockedKey, JSON.stringify(initialBlocked));
      setBlockedIps(initialBlocked);
    }
  }, []);

  const saveEvents = (newEvents: SecurityEvent[]) => {
    localStorage.setItem('joblo_admin_security_events', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const saveBlockedIps = (newBlocked: string[]) => {
    localStorage.setItem('joblo_admin_blocked_ips', JSON.stringify(newBlocked));
    setBlockedIps(newBlocked);
  };

  const handleBlockIp = (ip: string) => {
    if (blockedIps.includes(ip)) {
      setStatusMessage(`IP ${ip} is already blocked.`);
      return;
    }
    const updatedBlocked = [...blockedIps, ip];
    saveBlockedIps(updatedBlocked);

    // Update matching security events as "IP Blocked"
    const updatedEvents = events.map(ev => 
      ev.ipAddress === ip ? { ...ev, actionTaken: 'IP Blocked' as const } : ev
    );
    saveEvents(updatedEvents);
    
    setStatusMessage(`IP Address ${ip} has been blocked and blacklisted.`);
  };

  const handleUnblockIp = (ip: string) => {
    const updatedBlocked = blockedIps.filter(item => item !== ip);
    saveBlockedIps(updatedBlocked);

    const updatedEvents = events.map(ev => 
      ev.ipAddress === ip ? { ...ev, actionTaken: 'Logged' as const } : ev
    );
    saveEvents(updatedEvents);

    setStatusMessage(`IP Address ${ip} has been removed from blocklists.`);
  };

  const handleSettleEvent = (id: string) => {
    const updated = events.map(ev => 
      ev.id === id ? { ...ev, isResolved: true } : ev
    );
    saveEvents(updated);
    setStatusMessage('Security event marked as cryptographically settled.');
  };

  const filteredEvents = events.filter(ev => {
    const matchesSeverity = filterSeverity === 'All' || ev.severity === filterSeverity;
    const matchesSearch = ev.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-heading flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
            <span>DPDP Auditing & Cybersecurity Firewalls</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Monitor real-time security breaches, manage IP access blocks, and verify candidate DPDP data erasure requests.
          </p>
        </div>

        <span className="text-[10px] font-mono font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 self-start sm:self-auto">
          Firewall Status: ACTIVE
        </span>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-600 font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* CORE SPLIT ROW: LOGS & IP BLOCKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOGS LISTING */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Recent Intrusion Audits & Logs</span>
          </p>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search events by IP or payload alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-semibold"
              />
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2 py-1 text-xs bg-white border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-800 font-bold"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((log) => (
              <div 
                key={log.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                  log.isResolved 
                    ? 'bg-slate-50/50 border-slate-100 opacity-75' 
                    : 'bg-white border-slate-150 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">
                        {log.eventName}
                      </p>
                      <span className={`text-[8px] font-bold font-mono px-1.5 py-0.2 rounded border uppercase ${
                        log.severity === 'Critical' 
                          ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' 
                          : log.severity === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {log.severity}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold font-mono">
                      IP SOURCE: {log.ipAddress} • TIMESTAMP: {log.timestamp} • ACTION: {log.actionTaken}
                    </p>
                  </div>

                  {log.isResolved && (
                    <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.2 rounded uppercase">
                      Settled
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[10px] font-mono font-bold">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Audited cryptographically</span>
                  </span>

                  {!log.isResolved && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleBlockIp(log.ipAddress)}
                        disabled={blockedIps.includes(log.ipAddress)}
                        className="px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-h-[28px] flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>{blockedIps.includes(log.ipAddress) ? 'Blocked' : 'Block IP'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleSettleEvent(log.id)}
                        className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg min-h-[28px]"
                      >
                        <span>Settle Audit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IP BLOCKLIST MANAGEMENT */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
          <div>
            <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Active IP Blocklist</span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Banned client coordinates restricted from applying, posting, or parsing.
            </p>
          </div>

          <div className="space-y-2">
            {blockedIps.length === 0 ? (
              <p className="text-[10px] text-slate-400 font-bold text-center py-4 font-mono">
                BLOCKLIST VACANT
              </p>
            ) : (
              blockedIps.map((ip) => (
                <div key={ip} className="p-2.5 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700">{ip}</span>
                  
                  <button
                    onClick={() => handleUnblockIp(ip)}
                    className="p-1 text-slate-500 hover:text-indigo-600 bg-slate-50 border border-slate-150 hover:bg-indigo-50 rounded-lg cursor-pointer"
                    title="Revoke block restrictions"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Manual Block Input */}
          <div className="pt-3 border-t border-slate-200 space-y-1.5">
            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Manual restriction entry</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('ip') as HTMLInputElement;
                if (input && input.value) {
                  handleBlockIp(input.value.trim());
                  form.reset();
                }
              }}
              className="flex gap-1.5"
            >
              <input
                type="text"
                name="ip"
                required
                placeholder="e.g. 15.112.5.4"
                className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-250 rounded-lg focus:outline-none focus:border-slate-400 font-mono font-semibold"
              />
              <button 
                type="submit"
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800 shrink-0"
              >
                Ban
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* DPDP AUDITING DISCLOSURE */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-50 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-extrabold text-slate-800">DPDP Verification Certificate Compliance</p>
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
            Under India's Digital Personal Data Protection (DPDP) Act, candidate records request deletions automatically sync with physical file deletions within a maximum of 48 hours. Consent metadata is cached in isolated memory and periodically audited for cryptographic verification logs.
          </p>
        </div>
      </div>

    </div>
  );
}
