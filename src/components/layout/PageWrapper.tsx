import React from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export default function PageWrapper({
  children,
  className = '',
  id,
  animate = true,
}: PageWrapperProps) {
  if (!animate) {
    return (
      <div id={id || 'page-wrapper'} className={`min-h-[500px] w-full flex-1 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id || 'page-wrapper'}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className={`min-h-[500px] w-full flex-1 ${className}`}
    >
      {children}
    </motion.div>
  );
}
