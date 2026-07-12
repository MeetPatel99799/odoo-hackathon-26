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
  const { token, hasAccess, permissions } = useAuth();

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
