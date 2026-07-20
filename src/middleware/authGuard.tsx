import React, { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  isAuthenticated: boolean;
  onRedirect: (path: string) => void;
}

/**
 * Route guard to prevent unauthenticated users from accessing protected sections
 * like /dashboard, /resume-builder, or /ai-job-match.
 */
export function AuthGuard({ children, isAuthenticated, onRedirect }: AuthGuardProps) {
  React.useEffect(() => {
    if (!isAuthenticated) {
      console.warn('[AuthGuard] Unauthenticated access blocked. Redirecting to login.');
      onRedirect('/login');
    }
  }, [isAuthenticated, onRedirect]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-xs text-gray-500 font-medium">Authenticating session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
export default AuthGuard;
