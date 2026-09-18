import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  const roleColors = {
    'fleet manager':     'from-blue-500 to-indigo-600',
    'dispatcher':        'from-emerald-500 to-teal-600',
    'safety officer':    'from-amber-500 to-orange-600',
    'financial analyst': 'from-violet-500 to-purple-600',
  };
  const roleLower = user?.role?.toLowerCase() ?? '';
  const gradient = roleColors[roleLower] ?? 'from-primary to-blue-600';

  return (
    <header className="h-14 flex-shrink-0 glass-dark border-b border-white/[0.07] flex items-center px-6 gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            id="topbar-search"
            type="search"
            placeholder="Search…"
            className="w-full glass-subtle rounded-lg pl-9 pr-4 py-1.5 text-sm text-text placeholder-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text leading-tight">{user.name}</p>
              <p className="text-xs text-muted leading-tight capitalize">{user.role}</p>
            </div>
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
              style={{ boxShadow: '0 0 12px rgba(91,141,239,0.3)' }}
              title={user.role}
            >
              {initial}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted hover:text-text hover:bg-white/[0.05] transition-colors"
              title="Sign Out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </>
        ) : (
          <span className="text-sm text-muted">Not logged in</span>
        )}
      </div>
    </header>
  );
}
