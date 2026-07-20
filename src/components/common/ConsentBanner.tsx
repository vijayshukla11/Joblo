import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Consent states matching DPDP / GDPR
  const [consents, setConsents] = useState({
    essential: true,
    analytics: true,
    resumeConsent: true,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('joblo_privacy_consent');
    if (!savedConsent) {
      // Small timeout to not disrupt initial page loading
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const updated = { essential: true, analytics: true, resumeConsent: true };
    localStorage.setItem('joblo_privacy_consent', JSON.stringify(updated));
    setShow(false);
    console.log('[Analytics] User Accepted All DPDP Privacy Consents:', updated);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('joblo_privacy_consent', JSON.stringify(consents));
    setShow(false);
    console.log('[Analytics] User Saved Custom DPDP Privacy Consents:', consents);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] font-sans"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6">
            
            {/* CONTENT */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-xs tracking-tight">
                <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>India DPDP Act & Privacy Consent Gate</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-4xl">
                JOB Lo requires your consent before managing files or storing cookies. In accordance with the Digital Personal Data Protection (DPDP) Act, 2023, we secure all user resume payloads with AES-256 server-side encryption. We never rent your data. Select your analytical and data sharing preferences below.
              </p>

              {/* DETAILS EXPANDED */}
              {showDetails && (
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 mt-3 animate-fadeIn">
                  <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={consents.essential} 
                      disabled 
                      className="accent-emerald-600 mt-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">Essential (Session ID)</span>
                      <span className="text-[9px] text-gray-400">Strictly required for basic routing.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={consents.analytics} 
                      onChange={(e) => setConsents({ ...consents, analytics: e.target.checked })}
                      className="accent-emerald-600 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">Analytical & Heatmaps</span>
                      <span className="text-[9px] text-gray-400">Tracks job conversion and search counts.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={consents.resumeConsent} 
                      onChange={(e) => setConsents({ ...consents, resumeConsent: e.target.checked })}
                      className="accent-emerald-600 mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">Resume Vault Storage</span>
                      <span className="text-[9px] text-gray-400">Enables one-click application pipelines.</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-[11px] font-semibold text-gray-600 hover:text-black hover:bg-slate-50 transition-all rounded-lg cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showDetails ? 'Hide Settings' : 'Customize'}</span>
              </button>

              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors rounded-lg cursor-pointer"
                >
                  Save Selection
                </button>
              ) : (
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-[11px] font-bold text-white bg-black hover:bg-zinc-800 transition-colors rounded-lg cursor-pointer"
                >
                  Accept All (Recommended)
                </button>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
