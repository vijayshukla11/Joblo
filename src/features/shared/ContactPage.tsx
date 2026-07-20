import React, { useState } from 'react';
import { Mail, Phone as PhoneIcon, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [userType, setUserType] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[Support] Outbound support request queued: ${email} (${userType})`);
    setSubmitted(true);
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Contact Technical Support" 
        description="Get in touch with JOB Lo support agents. Request publisher verification keys, ask about DPDP resume storage policies, or flag inaccurate postings." 
        h1Text="Contact JOB Lo"
      />

      <Breadcrumbs items={[{ label: 'Contact Support', path: '/contact' }]} onNavigate={onNavigate} />

      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* DETAILS LEFT COLUMN */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
              How can we support you?
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Our support representatives audit technical pipeline errors, gazette notification syllabi, and publisher API authorizations. Select your perspective to route to the correct team.
            </p>
          </div>

          <div className="space-y-4 font-sans text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>sprint-support@joblo.co.in</span>
            </div>
            
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>+91 (11) 2345-6789 (Support line)</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-bold text-gray-700 block">Delhi Administrative HQ</span>
                <span>Connaught Place, New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECURE SUBMISSION RIGHT COLUMN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">Direct Outbound Pipeline</h2>

          {submitted ? (
            <div className="p-5 border border-emerald-100 bg-emerald-50/20 rounded-xl space-y-3.5 text-xs text-gray-500 text-center animate-fadeIn">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-extrabold text-emerald-950">Support Request Dispatched</p>
                <p className="text-[10px] text-emerald-600">Your query has been queued. Our agents will respond in 24 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">I am contacting as a:</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="general">General Enquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="media">Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Secure Email Coordinate</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Company Name (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none"
                  placeholder="e.g. Acme India Ltd"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 outline-none"
                  placeholder="Inquiry Subject"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Describe Your Inquiry</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 h-24 resize-none outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer select-none flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </section>

    </div>
  );
}
