import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Container from '../../components/layout/Container';
import ErrorState from '../../components/ui/ErrorState';

interface ServerErrorPageProps {
  onNavigate: (path: string) => void;
  id?: string;
}

export default function ServerErrorPage({ onNavigate, id }: ServerErrorPageProps) {
  return (
    <MainLayout currentPath="/500" onNavigate={onNavigate} id={id}>
      <Container className="py-12 sm:py-20 flex items-center justify-center">
        <ErrorState
          title="500 - Internal Sourcing Pipeline Error"
          errorMessage="A structural database exception halted the operation. The database and backend architects have been auto-notified under Sprint 1 monitoring gates."
          onRetry={() => onNavigate('/')}
        />
      </Container>
    </MainLayout>
  );
}
