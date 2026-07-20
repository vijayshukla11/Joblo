import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenByDefault?: boolean;
}

export function AccordionItem({ title, children, isOpenByDefault = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  return (
    <div className="border border-slate-150 rounded-xl bg-white overflow-hidden shadow-3xs transition-all hover:border-slate-250">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 font-heading select-none cursor-pointer hover:bg-slate-50/40"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-800' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Accordion({ children, className = '', id }: AccordionProps) {
  return (
    <div id={id} className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
}
