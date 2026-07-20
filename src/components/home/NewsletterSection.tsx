import React, { useState } from 'react';
import { Mail, Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate real database subscription flow
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1200);
  };

  return (
    <section className="py-16 bg-white border-t border-slate-100 max-w-7xl mx-auto px-6">
      <div className="relative overflow-hidden bg-black text-white rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Info content */}
        <div className="space-y-4 max-w-xl text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-900 text-emerald-400 border border-zinc-800 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Weekly Career Dispatch</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight font-heading">
            Get job alerts and salary guides
          </h3>
          
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md font-sans">
            No spam, no agency cold calls. Join over 12,000 ambitious professionals who receive direct recruitment updates, salary benchmarks, and interview questions straight to their inbox.
          </p>
        </div>

        {/* Subscription Bar form */}
        <div className="w-full max-w-md z-10">
          {isSubscribed ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-heading">You are subscribed!</p>
                <p className="text-[11px] text-zinc-400 font-sans mt-1">
                  We will send you the latest verified roles and syllabus updates every Sunday morning.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-emerald-500 transition-all">
                <div className="flex items-center gap-2 pl-3 flex-1">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-transparent border-0 text-white placeholder-zinc-500 text-xs font-semibold focus:outline-none w-full py-2.5 font-sans"
                    aria-label="Email address for job alerts"
                    data-analytics-id="newsletter-email-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black hover:bg-zinc-100 transition-all font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1 select-none cursor-pointer disabled:opacity-50 font-sans"
                  data-analytics-id="newsletter-subscribe-submit"
                >
                  {loading ? 'Joining...' : 'Subscribe Free'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>⚡ Real-time Updates</span>
                <span>•</span>
                <span>🔒 Private & Secure</span>
                <span>•</span>
                <span>❌ Unsubscribe Anytime</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
