import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import Badge from '../../components/ui/Badge';
import { ShieldCheck, BookOpen } from 'lucide-react';

interface BlogSEOPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export function BlogSEOPage({ onNavigate, id }: BlogSEOPageProps) {
  const blogsList = [
    'Navigating Indian Gazette Applications in 2026',
    'How to Optimize Your Resume for High-Scale API Screeners',
    'The Evolution of Tech Hubs: Hyderabad vs Pune',
    'Understanding the DPDP Act 2023 for Job Seekers'
  ];

  return (
    <MainLayout currentPath="/blog" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 font-sans">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                Programmatic SEO
              </Badge>
              <span className="text-xs text-gray-400 font-mono">Editorial Node v6.0</span>
            </div>
            
            <h1 className="text-3xl font-heading font-medium tracking-tight text-gray-900 sm:text-4xl">
              Career & Sourcing Insights
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Read verified technical guides, compliance tutorials, and industry insight reports compiled by the JOB Lo editorial board.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {blogsList.map((blog) => (
              <div 
                key={blog} 
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigate('/jobs')}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug">
                    {blog}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 font-mono mt-3">
                  5 min read • Gazette Sourced
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-700">Editorial Quality Guarantee</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                All editorial pieces are reviewed for factual accuracy and compliance with relevant employment and safety specifications.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </MainLayout>
  );
}
export default BlogSEOPage;
