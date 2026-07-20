import React, { ReactNode } from 'react';

export type UserRole = 'applicant' | 'employer' | 'admin';

interface PermissionGuardProps {
  children: ReactNode;
  userRole: UserRole;
  requiredRoles: UserRole[];
  onRedirect: (path: string) => void;
}

/**
 * Route guard to enforce precise role permissions across JOB Lo dashboards.
 * Prevents applicants from viewing employer or admin sections.
 */
export function PermissionGuard({ children, userRole, requiredRoles, onRedirect }: PermissionGuardProps) {
  const hasPermission = requiredRoles.includes(userRole);

  React.useEffect(() => {
    if (!hasPermission) {
      console.error(`[PermissionGuard] Insufficient role permissions. Access denied for role: "${userRole}". Required: ${requiredRoles.join(', ')}`);
      onRedirect('/dashboard'); // Safe fallback
    }
  }, [hasPermission, userRole, requiredRoles, onRedirect]);

  if (!hasPermission) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-sans">
        <div className="text-center space-y-3 p-6 bg-red-50 rounded-xl border border-red-100 max-w-sm">
          <p className="text-xs font-bold text-red-700">Access Restricted</p>
          <p className="text-[11px] text-red-600 leading-relaxed">
            Your current account role does not have permission to view this panel. Redirecting you to your user dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
export default PermissionGuard;
