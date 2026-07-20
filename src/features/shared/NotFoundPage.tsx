import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import SectionWrapper from '../../components/layout/SectionWrapper';
import EmptyState from '../../components/ui/EmptyState';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export default function NotFoundPage({ onNavigate, id }: NotFoundPageProps) {
  return (
    <MainLayout currentPath="/404" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 flex items-center justify-center">
        <EmptyState
          title="404 - Requested Page Not Found"
          description="The URL path you entered does not exist on the JOB Lo portal, or the verified gazette announcement has expired. Use the portal menu to return to safety."
          icon="search"
          actionLabel="Return to Safety"
          onAction={() => onNavigate('/')}
        />
      </Container>
    </MainLayout>
  );
}
