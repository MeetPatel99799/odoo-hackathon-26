import { createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RouteAccessContext = createContext({ readOnly: false });

export function useRouteAccess() {
  return useContext(RouteAccessContext);
}

function isReadOnlyAccess(accessLevel) {
  return accessLevel === 'Read' || accessLevel === 'view';
}

/**
 * ProtectedRoute — auth guard with optional module-based RBAC.
 *
 * Usage:
 * <ProtectedRoute module="vehicles">
 *   <VehicleRegistry />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, module }) {
  const { token, hasAccess, permissions, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (module && !hasAccess(module, 'view')) {
    return <Navigate to="/" replace state={{ unauthorizedToast: 'Not authorized' }} />;
  }

  const perm = module ? permissions.find((p) => p.module === (module === 'fleet' ? 'vehicles' : module)) : null;
  const readOnly = perm ? isReadOnlyAccess(perm.access_level) : false;

  return (
    <RouteAccessContext.Provider value={{ readOnly }}>
      {children}
    </RouteAccessContext.Provider>
  );
}
