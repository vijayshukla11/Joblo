import React, { useState } from 'react';
import { Building2, Mail, Lock, User, Phone, Globe, MapPin, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';

interface EmployerAuthPageProps {
  onNavigate: (path: string) => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
}

export default function EmployerAuthPage({ onNavigate, initialMode = 'login' }: EmployerAuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [step, setStep] = useState<number>(1); // For register wizard
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset Password States
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  // Registration Form States
  const [regData, setRegData] = useState({
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    contactPerson: '',
    phone: '',
    industry: '',
    companySize: '',
    website: '',
    city: '',
    state: '',
    gstNumber: ''
  });

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please provide all credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate login
      onNavigate('/employer-dashboard');
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!forgotEmail.trim()) {
      setError('Please provide your verified corporate email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('A cryptographically secure password reset link has been dispatched to your corporate coordinates.');
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!resetPassword || !resetConfirmPassword) {
      setError('All passkey fields are mandatory.');
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setError('Passkeys do not match.');
      return;
    }

    if (resetPassword.length < 6) {
      setError('Secure passkeys must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Your corporate access passkey has been successfully reset. Redirecting to login...');
      setTimeout(() => {
        setMode('login');
        setSuccess(null);
      }, 2000);
    }, 1200);
  };

  const handleRegisterNext = () => {
    setError(null);
    if (step === 1) {
      // Validate step 1 fields
      if (!regData.companyName.trim()) {
        setError('Company Name is required.');
        return;
      }
      if (!regData.companyEmail.trim() || !regData.companyEmail.includes('@')) {
        setError('Please enter a valid corporate email address.');
        return;
      }
      if (!regData.password || regData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (regData.password !== regData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate step 2 fields
      if (!regData.contactPerson.trim()) {
        setError('Contact Person is required.');
        return;
      }
      if (!regData.phone.trim() || regData.phone.length < 8) {
        setError('Please enter a valid phone number.');
        return;
      }
      if (!regData.industry) {
        setError('Please select an industry sector.');
        return;
      }
      if (!regData.companySize) {
        setError('Please select your company size.');
        return;
      }
      setStep(3);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate step 3 fields
    if (!regData.gstNumber.trim() || regData.gstNumber.trim().length < 15) {
      setError('Please provide a valid 15-digit GSTIN.');
      return;
    }
    if (!regData.website.trim()) {
      setError('Company website URL is required.');
      return;
    }
    if (!regData.city.trim() || !regData.state.trim()) {
      setError('Headquarters location details are required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate registration & sign-in
      onNavigate('/employer-dashboard');
    }, 1500);
  };

  return (
    <div className="pb-16 font-sans">
      <SEO 
        title="Recruiter Console Auth Gate" 
        description="Access JOB Lo's verified corporate candidate pipelines, post vacancies, and review matches under DPDP compliance rules."
      />

      <Breadcrumbs 
        items={[
          { label: 'Employer Portal', path: '/employer-dashboard' },
          { label: mode === 'login' ? 'Recruiter Login' : mode === 'register' ? 'Register Enterprise' : 'Verify Identity' }
        ]} 
        onNavigate={onNavigate} 
      />

      <section className="max-w-xl mx-auto py-10 px-6 mt-4">
        
        {/* Toggle between candidate and employer flow header */}
        <div className="text-center space-y-2.5 mb-8">
          <div className="w-12 h-12 bg-emerald-600 text-slate-950 flex items-center justify-center rounded-2xl mx-auto text-xl font-black shadow-xs">
            J
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 font-heading">
            Enterprise Hiring Gateway
          </h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Review live matching benchmarks, verified candidate credentials, and direct API pipelines.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Modes Toggle (Only shown for login / register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 p-1.5 bg-slate-50 border border-slate-150 rounded-2xl">
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                  mode === 'login'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setStep(1); setError(null); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                  mode === 'register'
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Register Enterprise
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-semibold animate-fadeIn">
              <ShieldCheck className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-bold animate-fadeIn">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. LOGIN VIEW */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. recruit@vercel.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Passkey Coordinate</label>
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setError(null); }} 
                    className="text-[10px] text-indigo-700 hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer flex items-center justify-center gap-2 select-none disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : 'Enter Recruiter Console'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* 2. REGISTRATION VIEW WIZARD */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Wizard Step {step} of 3
                </span>
                <div className="flex gap-1.5">
                  <span className={`w-6 h-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                  <span className={`w-6 h-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                  <span className={`w-6 h-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                </div>
              </div>

              {/* REGISTER STEP 1: Account Essentials */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Company Name</label>
                    <div className="relative flex items-center">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="companyName"
                        value={regData.companyName}
                        onChange={handleRegChange}
                        placeholder="e.g. Vercel India Private Limited"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Corporate Contact Email</label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        name="companyEmail"
                        value={regData.companyEmail}
                        onChange={handleRegChange}
                        placeholder="e.g. talent-acquisition@vercel.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          name="password"
                          value={regData.password}
                          onChange={handleRegChange}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative flex items-center">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={regData.confirmPassword}
                          onChange={handleRegChange}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterNext}
                    className="w-full py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all focus-ring cursor-pointer flex items-center justify-center gap-1.5 select-none"
                  >
                    <span>Proceed to Contacts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* REGISTER STEP 2: Representatives & Attributes */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person Name</label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="contactPerson"
                        value={regData.contactPerson}
                        onChange={handleRegChange}
                        placeholder="e.g. Shalini Roy"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={regData.phone}
                        onChange={handleRegChange}
                        placeholder="e.g. +91 99011 22334"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Industry Sector</label>
                      <select
                        name="industry"
                        value={regData.industry}
                        onChange={handleRegChange}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-700 cursor-pointer"
                        required
                      >
                        <option value="">Select Sector</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Finance & Banking">Finance & Banking</option>
                        <option value="Healthcare & Lifesciences">Healthcare & Lifesciences</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="EdTech">EdTech</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Company Size</label>
                      <select
                        name="companySize"
                        value={regData.companySize}
                        onChange={handleRegChange}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-700 cursor-pointer"
                        required
                      >
                        <option value="">Select Size</option>
                        <option value="1 - 10 Employees">1 - 10 Employees</option>
                        <option value="11 - 50 Employees">11 - 50 Employees</option>
                        <option value="51 - 200 Employees">51 - 200 Employees</option>
                        <option value="201 - 500 Employees">201 - 500 Employees</option>
                        <option value="501 - 1000 Employees">501 - 1000 Employees</option>
                        <option value="1000+ Employees">1000+ Employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 border border-slate-200 hover:bg-slate-50 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-1 select-none cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRegisterNext}
                      className="py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-1 select-none cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTER STEP 3: Corporate Footprints */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enterprise GSTIN (GST Placeholder)</label>
                    <div className="relative flex items-center">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="gstNumber"
                        value={regData.gstNumber}
                        onChange={handleRegChange}
                        placeholder="e.g. 29AAAAA1111A1Z1 (15-digit GSTIN)"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800 uppercase"
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Web Coordinates (Website)</label>
                    <div className="relative flex items-center">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="url"
                        name="website"
                        value={regData.website}
                        onChange={handleRegChange}
                        placeholder="e.g. https://vercel.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headquarters City</label>
                      <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          name="city"
                          value={regData.city}
                          onChange={handleRegChange}
                          placeholder="e.g. Bengaluru"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">State</label>
                      <div className="relative flex items-center">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          name="state"
                          value={regData.state}
                          onChange={handleRegChange}
                          placeholder="e.g. Karnataka"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 border border-slate-200 hover:bg-slate-50 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-1 select-none cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 select-none cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Complete Registration'}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* 3. FORGOT PASSWORD VIEW */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 font-heading">Reset Recruiter Credentials</h3>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Provide your corporate identity email below. If verified, we will issue a secure reset hash key.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Corporate Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. hire@vercel.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-gray-700 rounded-xl font-bold text-center cursor-pointer select-none"
                >
                  Return to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 select-none cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Request Reset Link'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {/* Demo trick to access Reset screen quickly */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setSuccess(null); }}
                  className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 underline"
                >
                  [Demo Shortcut] Click to test Reset Password Screen
                </button>
              </div>
            </form>
          )}

          {/* 4. RESET PASSWORD VIEW */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 font-heading">Establish Secure Passkey</h3>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Your identity hash has been successfully validated. Complete coordinates configuration below.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Secure Passkey</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Re-enter Secure Passkey</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-transparent hover:border-slate-200 focus-ring rounded-xl font-semibold text-gray-800"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-950 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 select-none cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Update Secure Passkey'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* Sourcing Security disclaimer */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[9px] text-slate-400 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>
              Employer SSO authentication is cryptographically isolated from candidate databases under verified India DPDP Act compliance. Multiple wrong attempts will trigger dynamic IP rate limits.
            </span>
          </div>

        </div>
      </section>
    </div>
  );
}
