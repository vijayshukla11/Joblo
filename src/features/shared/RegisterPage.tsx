import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ShieldCheck, RefreshCw, Key, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

function getFriendlyErrorMessage(message: string): string {
  if (!message) return 'Unexpected error occurred.';
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Invalid email or password.';
  }
  if (lower.includes('user already exists') || lower.includes('email already exists') || lower.includes('already registered')) {
    return 'Email already exists.';
  }
  if (lower.includes('password should be') || lower.includes('weak password')) {
    return 'Password must be at least 6 characters.';
  }
  if (lower.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  return message;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP Verification Simulation State
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp } = useAuth();

  const triggerSendOtp = () => {
    if (!mobile.trim() || mobile.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpError(null);
    setOtpSending(true);
    setTimeout(() => {
      setOtpSending(false);
      setOtpSent(true);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Front-end validations
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email coordinate is required.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setError('A valid 10-digit mobile number is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!otpSent) {
      setError('Please dispatch and verify the mobile OTP token first.');
      return;
    }
    if (!otp.trim()) {
      setError('The OTP field is mandatory.');
      return;
    }

    setLocalLoading(true);

    try {
      const result = await signUp(name, email, password);
      if (result.error) {
        setError(getFriendlyErrorMessage(result.error.message));
      } else {
        setSuccess('Candidate account created successfully! Check your email to verify coordinates or log in directly.');
      }
    } catch (err) {
      setError('Unexpected error occurred.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Candidate Profile Creation" 
        description="Establish your JOB Lo seeker account. Enter details including name, mobile, and secure passkey to connect with employers." 
        h1Text="JOB Lo Seeker Registration"
      />

      <Breadcrumbs items={[{ label: 'Register Account', path: '/seeker-register' }]} onNavigate={onNavigate} />

      <section className="max-w-md mx-auto py-12 px-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl mx-auto text-lg font-bold">
              JL
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 font-heading">Candidate Registration</h1>
            <p className="text-xs text-gray-400">Join India's premium AI-powered career pipeline.</p>
          </div>

          {success ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium leading-relaxed">
                {success}
              </div>
              <button
                onClick={() => onNavigate('/seeker-login')}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer select-none"
              >
                Proceed to Log In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 font-semibold text-center animate-fadeIn">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Your Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Coordinates</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile Number (+91)</label>
                <div className="flex gap-2">
                  <div className="relative flex items-center flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                      disabled={localLoading}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={triggerSendOtp}
                    disabled={otpSending || localLoading}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold uppercase transition-all select-none shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {otpSending ? 'Sending...' : otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {otpError && <p className="text-rose-600 text-[9px] font-semibold">{otpError}</p>}
                {otpSent && <p className="text-emerald-700 text-[9px] font-bold">✓ OTP dispatched to +91 {mobile} successfully!</p>}
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[10px] font-bold text-emerald-700 uppercase">Enter Verification OTP</label>
                  <div className="relative flex items-center">
                    <Key className="w-4 h-4 text-emerald-500 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      className="w-full pl-9 pr-3 py-2 bg-emerald-50/50 border border-emerald-100 focus-ring rounded-lg font-semibold text-gray-800 text-xs font-mono"
                      disabled={localLoading}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                      disabled={localLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                      disabled={localLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                {localLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create Sourced Profile'}
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-slate-100">
            <span>Already registered? <button onClick={() => onNavigate('/seeker-login')} className="text-indigo-700 hover:underline cursor-pointer font-bold">Log In</button></span>
          </div>

        </div>
      </section>

    </div>
  );
}
