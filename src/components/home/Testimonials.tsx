import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Star } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../../constants';

export default function Testimonials() {
  return (
    <section 
      id="testimonials-section" 
      className="py-16 bg-slate-50/30 border-t border-slate-100 max-w-7xl mx-auto px-6 space-y-12"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold font-mono uppercase tracking-wider rounded-full border border-emerald-100">
          <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          <span>Candidate Trust Signals</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
          Real careers, real outcomes
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-md mx-auto">
          See how ambitious professionals use our dual-stream matching to lock in roles without brokers or hidden costs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {MOCK_TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="p-6 bg-white border border-gray-150 rounded-2xl space-y-4 relative"
          >
            {/* Stars rating */}
            <div className="flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>

            <p className="text-sm text-gray-600 italic leading-relaxed font-sans">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <span className="text-2xl">{t.avatar}</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-gray-900 font-heading">
                    {t.name}
                  </h4>
                  {t.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/50">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 fill-white" />
                      <span>VERIFIED PLACEMENT</span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-sans">
                  {t.role} • <span className="font-semibold text-slate-700">{t.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* FUTURE TESTIMONIAL RESERVED SLOT (GROWTH MARKETER REQUIREMENT) */}
        <div className="p-6 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-3 bg-slate-50/20 md:col-span-2 max-w-xl mx-auto w-full">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-900 font-heading">
              Secure your next placement?
            </h4>
            <p className="text-[10px] text-gray-400 font-sans max-w-xs">
              We periodically review hiring telemetry. Let us highlight your success and inspire the next cohort of Indian and global job seekers.
            </p>
          </div>
          <button 
            className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700 hover:underline cursor-pointer"
            data-analytics-id="testimonial-submit-interest"
          >
            Submit Success Story →
          </button>
        </div>

      </div>

    </section>
  );
}
