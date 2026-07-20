import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, BookOpen, Shield, Globe } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_SKILLS } from '../../constants';

interface CategoryGridProps {
  onSelectCategory: (categorySlug: string) => void;
  onSelectSkill: (skill: string) => void;
}

export default function CategoryGrid({ onSelectCategory, onSelectSkill }: CategoryGridProps) {
  
  // Icon picker helper mapping string keys to React elements
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'tech-jobs':
        return <Terminal className="w-5 h-5 text-gray-700" />;
      case 'government-jobs':
        return <Shield className="w-5 h-5 text-emerald-700" />;
      case 'design-jobs':
        return <BookOpen className="w-5 h-5 text-indigo-700" />;
      case 'remote-jobs':
        return <Globe className="w-5 h-5 text-blue-700" />;
      default:
        return <Terminal className="w-5 h-5 text-gray-700" />;
    }
  };

  return (
    <section 
      id="categories-section" 
      className="py-16 bg-white border-t border-slate-100 max-w-7xl mx-auto px-6 space-y-12"
    >
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
          Browse by career streams
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-sans">
          Select a high-intent focus area to instantly update your verified job stream.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            onClick={() => onSelectCategory(cat.slug)}
            className="group flex flex-col justify-between p-6 bg-white border border-gray-100 hover:border-emerald-300 rounded-2xl hover:shadow-xs transition-all cursor-pointer select-none focus-ring"
            tabIndex={0}
            role="button"
            aria-label={`Browse ${cat.name}`}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectCategory(cat.slug); }}
            data-analytics-id={`category-card-${cat.slug}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  {getIcon(cat.slug)}
                </div>
                <span className="font-mono text-[10px] font-bold text-gray-400 group-hover:text-emerald-700 transition-colors bg-slate-50 group-hover:bg-emerald-50/50 px-2.5 py-0.5 rounded-full">
                  {cat.jobCount.toLocaleString()} Jobs
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-950 font-heading transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 group-hover:text-emerald-700 transition-all pt-4 mt-auto">
              <span>View Listings</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* POPULAR SKILLS (SEO REQUIREMENT) */}
      <div className="p-6 bg-slate-50/50 border border-slate-100/50 rounded-2xl space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
            Popular Professional Skills:
          </h4>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {MOCK_SKILLS.map((skill) => (
            <button
              key={skill.id}
              onClick={() => onSelectSkill(skill.name)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50/30 border border-gray-100 hover:border-emerald-200 text-xs text-gray-600 hover:text-emerald-800 rounded-lg transition-all cursor-pointer focus-ring font-sans"
              data-analytics-id={`skill-tag-${skill.name.toLowerCase()}`}
            >
              <span>{skill.name}</span>
              <span className={`w-1 h-1 rounded-full ${
                skill.popularity === 'High' ? 'bg-emerald-500' :
                skill.popularity === 'Trending' ? 'bg-orange-400 animate-pulse' : 'bg-slate-300'
              }`} />
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
