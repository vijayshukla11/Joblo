import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ToastProps {
  message: string;
  sub?: string;
  type?: 'success' | 'error' | 'info' | 'loading';
  onClose: () => void;
  id?: string;
}

export default function Toast({ message, sub, type = 'success', onClose, id }: ToastProps) {
  const iconConfigs = {
    success: {
      bg: 'bg-emerald-500/10 text-emerald-400',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-red-500/10 text-red-400',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-500/10 text-blue-400',
      icon: Info,
    },
    loading: {
      bg: 'bg-slate-500/10 text-slate-400',
      icon: Loader2,
    },
  };

  const Config = iconConfigs[type];
  const Icon = Config.icon;

  return (
    <motion.div
      id={id || 'toast-box'}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white rounded-xl shadow-lg border border-slate-900 p-4 flex items-start gap-3 font-sans"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${Config.bg}`}>
        <Icon className={`w-4.5 h-4.5 ${type === 'loading' ? 'animate-spin' : ''}`} />
      </div>

      <div className="flex-1 space-y-0.5 pt-0.5">
        <p className="text-xs font-bold font-heading text-white">{message}</p>
        {sub && <p className="text-[10px] text-slate-400 leading-normal font-medium">{sub}</p>}
      </div>

      <button
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors cursor-pointer focus-ring rounded p-0.5 -mt-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5 shrink-0" />
      </button>
    </motion.div>
  );
}
