import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import SectionWrapper from '../../components/layout/SectionWrapper';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Badge from '../../components/ui/Badge';
import { BookOpen, ShieldCheck, GraduationCap } from 'lucide-react';

interface LearningPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export default function LearningPage({ onNavigate, id }: LearningPageProps) {
  return (
    <MainLayout currentPath="/learning" onNavigate={onNavigate} id={id}>
      <Container className="py-6">
        <Breadcrumb
          onNavigate={onNavigate}
          items={[
            { label: 'Learning Center' },
          ]}
        />

        <SectionWrapper spacing="compact" className="mt-6">
          {/* SPRINT 1 ARCHITECTURAL DISCLOSURE CARD */}
          <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-900/5 text-slate-900 flex items-center justify-center mx-auto">
              <GraduationCap className="w-5.5 h-5.5 shrink-0" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading tracking-tight">
                JOB Lo Learning Hub (Sprint 1 Placeholder)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                A unified channel hosting aptitude mock papers, verbal reasoning syllabi, and technical interview roadmaps. Video APIs and PDF sync points are scheduled for connection in Sprint 2.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Syllabus modules mapped</span>
            </div>
          </div>
        </SectionWrapper>
      </Container>
    </MainLayout>
  );
}
