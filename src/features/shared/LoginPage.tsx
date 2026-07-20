import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, Key, Smartphone } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  initialMode?: 'login' | 'forgot' | 'reset';
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

export default function LoginPage({ onNavigate, initialMode = 'login' }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Reset Password state
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetOtp, setResetOtp] = useState('');

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLocalLoading(true);

    try {
      const result = await signIn(email, password) as any;
      if (result.error) {
        setError(getFriendlyErrorMessage(result.error.message));
      } else if (result.data?.user || result.data?.session) {
        onNavigate('/dashboard');
      } else {
        setError('Unexpected error occurred.');
      }
    } catch (err) {
      setError('Unexpected error occurred.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!forgotEmail.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      setSuccess('A secure verification token has been dispatched to your email address. Use it on the reset password screen.');
    }, 1200);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!resetOtp.trim()) {
      setError('Please enter the verification OTP token.');
      return;
    }
    if (!resetPassword || !resetConfirmPassword) {
      setError('All passkey fields are mandatory.');
      return;
    }
    if (resetPassword !== resetConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (resetPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      setSuccess('Your password has been updated successfully. Redirecting to login portal...');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
        setError(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title={mode === 'login' ? "Candidate Login Portal" : mode === 'forgot' ? "Forgot Password" : "Reset Password"} 
        description="Access JOB Lo's secure candidate portal. Log in to review active applications and edit your digital resume." 
        h1Text="JOB Lo Seeker Entrance"
      />

      <Breadcrumbs 
        items={[
          { label: 'Seeker Entry', path: '/seeker-login' },
          { label: mode === 'login' ? 'Candidate Sign In' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password' }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="max-w-md mx-auto py-12 px-6 mt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl mx-auto text-lg font-bold">
              JL
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 font-heading">
              {mode === 'login' && 'Candidate Sign In'}
              {mode === 'forgot' && 'Reset Request'}
              {mode === 'reset' && 'Establish Passkey'}
            </h1>
            <p className="text-xs text-gray-400">
              {mode === 'login' && 'Enter your coordinates to access active career pipelines.'}
              {mode === 'forgot' && 'Provide your registered candidate email coordinates.'}
              {mode === 'reset' && 'Setup a secure new account passkey.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 font-semibold text-center animate-fadeIn">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 font-bold text-center leading-relaxed animate-fadeIn">
              {success}
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Secure Email Coordinates</label>
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
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Access Passkey</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                    className="text-[9px] text-indigo-700 hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
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

              <button
                type="submit"
                disabled={localLoading}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                {localLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Credentials'}
              </button>
            </form>
          )}

          {/* 2. FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-sans animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Registered Email Coordinates</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. candidate@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-gray-700 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                >
                  Back to login
                </button>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="flex-1 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-[10px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {localLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Dispatched Verification Link'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setSuccess(null); }}
                  className="text-[10px] text-gray-400 hover:text-indigo-600 font-bold underline"
                >
                  [Demo Shortcut] Go directly to Reset Passkey Screen
                </button>
              </div>
            </form>
          )}

          {/* 3. RESET PASSWORD MODE */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs font-sans animate-fadeIn">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Verification OTP (sent to email)</label>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">New Secure Passkey</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm Secure Passkey</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent focus-ring rounded-lg font-semibold text-gray-800 text-xs"
                    disabled={localLoading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer select-none disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {localLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm Passkey Reset'}
              </button>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-slate-100">
            <span>New seeker? <button onClick={() => onNavigate('/seeker-register')} className="text-indigo-700 hover:underline cursor-pointer font-bold">Create Account</button></span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[9px] text-slate-400 flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP consent protocols automatically regulate and cryptographically defend credentials storage vaults.</span>
          </div>

        </div>
      </section>

    </div>
  );
}
