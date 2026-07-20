import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import Badge from '../../components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

interface SkillsSEOPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export function SkillsSEOPage({ onNavigate, id }: SkillsSEOPageProps) {
  const skillsList = [
    'React 19', 'TypeScript', 'Node.js', 'Drizzle ORM', 'PostgreSQL', 
    'Python', 'Machine Learning', 'Data Structures', 'Cloud SQL', 'Kubernetes'
  ];

  return (
    <MainLayout currentPath="/skills" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 font-sans">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                Programmatic SEO
              </Badge>
              <span className="text-xs text-gray-400 font-mono">Dynamic Node v6.0</span>
            </div>
            
            <h1 className="text-3xl font-heading font-medium tracking-tight text-gray-900 sm:text-4xl">
              Sought-after Professional Skills
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Explore hyper-targeted job pipelines categorized dynamically by validated technical, engineering, and administrative competencies.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {skillsList.map((skill) => (
              <div 
                key={skill} 
                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                onClick={() => onNavigate('/jobs')}
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                    {skill} Jobs
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Updated today • Gazette certified
                  </p>
                </div>
                <Badge variant="default" className="text-[9px] bg-slate-50 text-slate-600 font-mono">
                  Sourced
                </Badge>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-700">Automation Enabled</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                This SEO indexer triggers n8n webhook gateways automatically upon new corporate Gazette filings to keep indexing caches in sync.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </MainLayout>
  );
}
export default SkillsSEOPage;
