import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import Badge from '../../components/ui/Badge';
import { ShieldCheck, Building2 } from 'lucide-react';

interface IndustriesSEOPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export function IndustriesSEOPage({ onNavigate, id }: IndustriesSEOPageProps) {
  const industriesList = [
    'FinTech & Banking', 'Information Technology', 'Healthcare & Biotech', 
    'E-Commerce & Retail', 'Logistics', 'EdTech'
  ];

  return (
    <MainLayout currentPath="/industries" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 font-sans">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                Programmatic SEO
              </Badge>
              <span className="text-xs text-gray-400 font-mono">Industry Node v6.0</span>
            </div>
            
            <h1 className="text-3xl font-heading font-medium tracking-tight text-gray-900 sm:text-4xl">
              Industry Vertical Portals
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Seamlessly locate corporate portfolios filtered dynamically across key national business verticals.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {industriesList.map((industry) => (
              <div 
                key={industry} 
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                onClick={() => onNavigate('/jobs')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                      {industry}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Enterprise scale
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="text-[9px] bg-slate-50 text-slate-600 font-mono">
                  Explore
                </Badge>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-700">Dynamic Enterprise Pipelines</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Automated crawling integrations continuously cross-reference national registry datasets to verify company authenticity.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </MainLayout>
  );
}
export default IndustriesSEOPage;
