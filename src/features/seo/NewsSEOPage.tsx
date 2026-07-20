import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import Badge from '../../components/ui/Badge';
import { ShieldCheck, Newspaper } from 'lucide-react';

interface NewsSEOPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export function NewsSEOPage({ onNavigate, id }: NewsSEOPageProps) {
  const newsList = [
    'Central Government Approves Landmark Gazette Portal Upgrades',
    'Employment Rates Rise 12% in Hyderabad Core Tech Hubs',
    'Tech Recruitment Trends: Rise in TypeScript Requirement Frequencies',
    'V6.0 Stable Core System Released Successfully'
  ];

  return (
    <MainLayout currentPath="/news" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 font-sans">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                Programmatic SEO
              </Badge>
              <span className="text-xs text-gray-400 font-mono">Newsroom Node v6.0</span>
            </div>
            
            <h1 className="text-3xl font-heading font-medium tracking-tight text-gray-900 sm:text-4xl">
              Official Press Release & News Sourcing
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Verify legal notices, corporate API transitions, and official JOB Lo framework notices on our news feed.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {newsList.map((newsItem) => (
              <div 
                key={newsItem} 
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigate('/jobs')}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug">
                    {newsItem}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 font-mono mt-3">
                  Verified • Today
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-700">Live News Ticker Verification</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                JOB Lo aggregates dynamic national gazette news with immediate filtering algorithms, ensuring clean feeds at all times.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </MainLayout>
  );
}
export default NewsSEOPage;
