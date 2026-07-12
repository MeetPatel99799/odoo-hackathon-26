export default function Topbar({ user }) {
  /**
   * user shape (from AuthContext):
   * { name: string, role: string }
   */
  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  // Assign a deterministic color per role
  const roleColors = {
    admin:    'bg-red-700',
    manager:  'bg-blue-700',
    driver:   'bg-green-700',
    viewer:   'bg-gray-600',
  };
  const roleLower = user?.role?.toLowerCase() ?? '';
  const badgeColor = roleColors[roleLower] ?? 'bg-primary';

  return (
    <header className="h-14 bg-panel border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1">
        <input
          id="topbar-search"
          type="search"
          placeholder="Search…"
          className="w-full max-w-sm bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-400">{user.name}</span>
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ${badgeColor}`}
              title={user.role}
            >
              {initial}
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-500">Not logged in</span>
        )}
      </div>
    </header>
  );
}
