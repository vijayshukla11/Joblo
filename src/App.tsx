import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Layout & Common
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ConsentBanner from './components/common/ConsentBanner';
import { NotFoundState } from './components/common/StatusMessages';

// Route Pages
import Home from './features/shared/Home';
import Jobs from './features/jobs/JobsPage';
import JobDetails from './features/jobs/JobDetailsPage';
import GovernmentJobsPage from './features/government/GovernmentJobsPage';
import GovernmentJobDetailsPage from './features/government/GovernmentJobDetailsPage';
import CompaniesPage from './features/companies/CompaniesPage';
import CompanyDetailsPage from './features/companies/CompanyDetailsPage';
import CareerGuidesPage from './features/career-guides/CareerGuidesPage';
import SalaryGuidePage from './features/salary/SalaryGuidePage';
import InterviewPrepPage from './features/interview/InterviewPrepPage';
import ResumeBuilderPage from './features/resume/ResumeBuilderPage';
import AIJobMatchPage from './features/ai/AIJobMatchPage';
import AICareerHubPage from './features/ai/AICareerHubPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ProfilePage from './features/dashboard/ProfilePage';
import EmployerDashboardPage from './features/dashboard/EmployerDashboardPage';
import AdminDashboardPage from './features/dashboard/AdminDashboardPage';
import LearningPage from './features/learning/LearningPage';
import LoginPage from './features/shared/LoginPage';
import RegisterPage from './features/shared/RegisterPage';
import EmployerAuthPage from './features/shared/EmployerAuthPage';
import RoleSelectionPage from './features/shared/RoleSelectionPage';
import AboutPage from './features/shared/AboutPage';
import ContactPage from './features/shared/ContactPage';
import PrivacyPage from './features/shared/PrivacyPage';
import TermsPage from './features/shared/TermsPage';
import NotFoundPage from './features/shared/NotFoundPage';
import ServerErrorPage from './features/shared/ServerErrorPage';

// New Pages
import CookiePolicyPage from './features/shared/CookiePolicyPage';
import RefundPolicyPage from './features/shared/RefundPolicyPage';
import DisclaimerPage from './features/shared/DisclaimerPage';
import FAQPage from './features/shared/FAQPage';
import HelpCentrePage from './features/shared/HelpCentrePage';
import SupportPage from './features/shared/SupportPage';
import SitemapPage from './features/shared/SitemapPage';
import ResumeTipsPage from './features/resume/ResumeTipsPage';

// Programmatic SEO Pages
import SkillsSEOPage from './features/seo/SkillsSEOPage';
import CitiesSEOPage from './features/seo/CitiesSEOPage';
import IndustriesSEOPage from './features/seo/IndustriesSEOPage';
import CategoriesSEOPage from './features/seo/CategoriesSEOPage';
import BlogSEOPage from './features/seo/BlogSEOPage';
import NewsSEOPage from './features/seo/NewsSEOPage';

// CMS & Content Pages
import BlogsPage from './features/blogs/BlogsPage';
import BlogDetailPage from './features/blogs/BlogDetailPage';
import GlobalSearchPage from './features/shared/GlobalSearchPage';

// Custom Hooks
import { useSEO } from './hooks/useSEO';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [toast, setToast] = useState<{ message: string; sub: string; type: 'success' | 'info' } | null>(null);

  // Dynamically inject page-specific titles, meta descriptions, and Open Graph tags
  useSEO(currentPath);

  // Synchronize path on browser forward/back pops
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Standard route transition controller
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(`[Router] Navigation dispatched: ${path}`);
  };

  // Sourcing Quick Apply simulation callback
  const handleApplyDemo = (jobTitle: string, organization: string) => {
    console.log(`[Analytics Event] SOURCING_OUTBOUND_CLICK: ${jobTitle} at ${organization}`);
    
    setToast({
      message: `Applying to ${organization}`,
      sub: `Redirecting to verified official careers page for "${jobTitle}".`,
      type: 'success'
    });

    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Determine current active page layout
  const renderRoute = () => {
    // 1. Static Paths
    if (currentPath === '/' || currentPath === '/index.html') {
      return <Home onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
    }
    if (currentPath === '/jobs') {
      return <Jobs onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
    }
    if (currentPath === '/government-jobs') {
      return <GovernmentJobsPage onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
    }
    if (currentPath === '/companies') {
      return <CompaniesPage onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
    }
    if (currentPath === '/career-guides') {
      return <CareerGuidesPage onNavigate={navigate} initialCategory="Career Guides" />;
    }
    if (currentPath === '/resume-tips') {
      return <CareerGuidesPage onNavigate={navigate} initialCategory="Resume Tips" />;
    }
    if (currentPath === '/interview-questions') {
      return <CareerGuidesPage onNavigate={navigate} initialCategory="Interview Questions" />;
    }
    if (currentPath === '/salary-guides') {
      return <CareerGuidesPage onNavigate={navigate} initialCategory="Salary Guides" />;
    }
    if (currentPath === '/skill-roadmaps') {
      return <CareerGuidesPage onNavigate={navigate} initialCategory="Skill Roadmaps" />;
    }
    if (currentPath === '/search') {
      return <GlobalSearchPage onNavigate={navigate} />;
    }
    if (currentPath === '/blogs') {
      return <BlogsPage onNavigate={navigate} />;
    }
    if (currentPath === '/salary-guide') {
      return <SalaryGuidePage onNavigate={navigate} />;
    }
    if (currentPath === '/interview-preparation') {
      return <InterviewPrepPage onNavigate={navigate} />;
    }
    if (currentPath === '/resume-builder') {
      return <ResumeBuilderPage onNavigate={navigate} />;
    }
    if (currentPath === '/ai-job-match') {
      return <AIJobMatchPage onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
    }
    if (currentPath === '/ai-career-hub') {
      return <AICareerHubPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }
    if (currentPath === '/profile') {
      return <ProfilePage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/employer-dashboard')) {
      return <EmployerDashboardPage onNavigate={navigate} />;
    }
    if (currentPath === '/employer-login') {
      return <EmployerAuthPage onNavigate={navigate} initialMode="login" />;
    }
    if (currentPath === '/employer-register') {
      return <EmployerAuthPage onNavigate={navigate} initialMode="register" />;
    }
    if (currentPath === '/employer-forgot-password') {
      return <EmployerAuthPage onNavigate={navigate} initialMode="forgot" />;
    }
    if (currentPath === '/employer-reset-password') {
      return <EmployerAuthPage onNavigate={navigate} initialMode="reset" />;
    }
    if (currentPath === '/admin-dashboard') {
      return <AdminDashboardPage onNavigate={navigate} />;
    }
    if (currentPath === '/learning') {
      return <LearningPage onNavigate={navigate} />;
    }
    if (currentPath === '/login') {
      return <RoleSelectionPage type="login" onNavigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RoleSelectionPage type="register" onNavigate={navigate} />;
    }
    if (currentPath === '/seeker-login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/seeker-register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (currentPath === '/cookie-policy') {
      return <CookiePolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/refund-policy') {
      return <RefundPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/disclaimer') {
      return <DisclaimerPage onNavigate={navigate} />;
    }
    if (currentPath === '/faq') {
      return <FAQPage onNavigate={navigate} />;
    }
    if (currentPath === '/help-centre') {
      return <HelpCentrePage onNavigate={navigate} />;
    }
    if (currentPath === '/support') {
      return <SupportPage onNavigate={navigate} />;
    }
    if (currentPath === '/sitemap') {
      return <SitemapPage onNavigate={navigate} />;
    }
    if (currentPath === '/resume-tips') {
      return <ResumeTipsPage onNavigate={navigate} />;
    }
    if (currentPath === '/500') {
      return <ServerErrorPage onNavigate={navigate} />;
    }
    if (currentPath === '/skills') {
      return <SkillsSEOPage onNavigate={navigate} />;
    }
    if (currentPath === '/cities') {
      return <CitiesSEOPage onNavigate={navigate} />;
    }
    if (currentPath === '/industries') {
      return <IndustriesSEOPage onNavigate={navigate} />;
    }
    if (currentPath === '/categories') {
      return <CategoriesSEOPage onNavigate={navigate} />;
    }
    if (currentPath === '/blog') {
      return <BlogsPage onNavigate={navigate} />;
    }
    if (currentPath === '/news') {
      return <NewsSEOPage onNavigate={navigate} />;
    }

    // 2. Dynamic Paths (e.g., /jobs/:slug)
    if (currentPath.startsWith('/jobs/')) {
      const slug = currentPath.substring(6); // Extract the slug part
      if (slug) {
        return <JobDetails slug={slug} onNavigate={navigate} onApplyDemo={handleApplyDemo} />;
      }
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.substring(6);
      if (slug) {
        return <BlogDetailPage slug={slug} onNavigate={navigate} />;
      }
    }
    if (currentPath.startsWith('/companies/')) {
      const slug = currentPath.substring(11); // Extract the slug part
      if (slug) {
        return <CompanyDetailsPage id={slug} onNavigate={navigate} />;
      }
    }
    if (currentPath.startsWith('/company/')) {
      const slug = currentPath.substring(9);
      if (slug) {
        return <CompanyDetailsPage id={slug} onNavigate={navigate} />;
      }
    }
    if (currentPath.startsWith('/government-jobs/')) {
      const slug = currentPath.substring(17); // Extract the slug part
      if (slug) {
        return <GovernmentJobDetailsPage slug={slug} onNavigate={navigate} />;
      }
    }
    if (currentPath.startsWith('/government-job/')) {
      const slug = currentPath.substring(16);
      if (slug) {
        return <GovernmentJobDetailsPage slug={slug} onNavigate={navigate} />;
      }
    }

    // 3. Fallback Route
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800 flex flex-col justify-between">
      
      <div>
        {/* TOP EDITORIAL BANNER */}
        <div className="bg-slate-50 border-b border-slate-100 text-[11px] text-gray-500 py-2.5 px-4 select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 px-6 font-sans">
            <span className="flex items-center gap-1.5 font-semibold text-gray-600">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              JOB Lo Editorial Guarantee: All positions are sourced through certified corporate APIs and public Gazettes.
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              Stable Version 6.0 • 100% Ad-Free, Open Access
            </span>
          </div>
        </div>

        {/* REUSABLE HEADER NAVIGATION */}
        <Header currentPath={currentPath} onNavigate={navigate} />

        {/* ANIMATED TRANSITION ROUTE CONTAINER */}
        <main className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              {renderRoute()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* REUSABLE FOOTER */}
      <Footer onNavigate={navigate} />

      {/* COMPLIANCE CONSENT GATE */}
      <ConsentBanner />

      {/* ACTION NOTIFICATION TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-zinc-950 text-white rounded-xl shadow-lg border border-zinc-800 p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            
            <div className="flex-1 space-y-1">
              <p className="text-xs font-bold font-heading">{toast.message}</p>
              <p className="text-[10px] text-zinc-400 leading-snug font-sans">{toast.sub}</p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
