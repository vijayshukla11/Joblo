import React from 'react';
import { motion } from 'motion/react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  id?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = '', id }: TabsProps) {
  return (
    <div
      id={id}
      className={`border-b border-slate-150 flex items-center gap-2 select-none overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative py-3 px-4 text-xs font-bold transition-all focus-ring shrink-0 flex items-center gap-2 cursor-pointer ${
              isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />}
            <span>{tab.label}</span>
            
            {/* Animated Bottom Border Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
