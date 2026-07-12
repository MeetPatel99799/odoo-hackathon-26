import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — skeleton guard.
 *
 * Current behaviour: redirects to /login if no token is present in localStorage.
 *
 * TODO (Integration):
 * Add module-based RBAC gating here.
 * After the real login API is wired, check that the user's `permissions` array
 * contains an entry for `requiredModule` with access_level !== 'none'.
 * If not, redirect to a 403/Unauthorized page instead of /login.
 *
 * Usage (Integration phase):
 * <ProtectedRoute requiredModule="fleet">
 *   <VehicleRegistry />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ children, requiredModule }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Module-based RBAC check goes here (Integration phase)

  return children;
}
