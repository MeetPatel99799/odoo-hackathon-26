import { useState, useEffect } from 'react';

/**
 * LoginForm - Presentational component for the TransitOps Login screen
 *
 * Props:
 * - onSubmit: callback function called with { email, password, role } on form submit
 * - loading: boolean indicating if authentication is in progress (disables button, shows spinner)
 * - roleOptions: array of strings or objects representing available RBAC roles
 */
export default function LoginForm({ onSubmit, loading, roleOptions }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Normalize role options to [{ value, label }]
  const normalizedRoles = (roleOptions || []).map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  // Set default role once options are loaded
  useEffect(() => {
    if (normalizedRoles.length > 0 && !role) {
      setRole(normalizedRoles[0].value);
    }
  }, [roleOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password, role, rememberMe });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background text-text font-sans">
      {/* LEFT PANEL (~40% width, light muted background) */}
      <div className="relative w-full md:w-[40%] bg-zinc-100 text-zinc-900 flex flex-col justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-200">
        <div className="flex flex-col flex-1 justify-center max-w-sm mx-auto w-full">
          {/* Square Logo Placeholder */}
          <div className="w-16 h-16 bg-zinc-800/10 border-2 border-dashed border-zinc-400 rounded-lg flex items-center justify-center mb-6 shadow-sm">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Logo</span>
          </div>

          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            TransitOps
          </h1>
          <p className="text-zinc-600 text-sm mt-1 mb-8 font-medium">
            Smart Transport Operations Platform
          </p>

          <div className="border-t border-zinc-300 pt-6">
            <h2 className="text-sm font-semibold text-zinc-800 mb-3 uppercase tracking-wider">
              One login, Four roles:
            </h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9791a]" />
                <span className="font-medium text-zinc-800">Fleet Manager</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9791a]" />
                <span className="font-medium text-zinc-800">Dispatcher</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9791a]" />
                <span className="font-medium text-zinc-800">Safety Officer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9791a]" />
                <span className="font-medium text-zinc-800">Financial Analyst</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-8 text-xs text-zinc-500 font-semibold tracking-wider">
          TRANSITOPS &copy; 2026 &middot; RBAC ENABLED
        </div>
      </div>

      {/* RIGHT PANEL (dark, ~60% width) */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-text mb-1 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@transitops.com"
                className="w-full bg-panel border border-border rounded-lg px-3.5 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-panel border border-border rounded-lg px-3.5 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* Role (RBAC) select */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Role (RBAC)
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-panel border border-border rounded-lg px-3.5 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 appearance-none cursor-pointer"
              >
                {normalizedRoles.length === 0 ? (
                  <option value="">No roles available</option>
                ) : (
                  normalizedRoles.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-text select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-panel text-primary focus:ring-primary focus:ring-offset-background h-4 w-4 cursor-pointer"
                />
                Remember me
              </label>
              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                className="text-primary hover:text-amber-500 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-amber-600 disabled:bg-primary/50 text-black font-semibold rounded-lg py-2.5 px-4 mt-6 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Scope details below form */}
          <div className="mt-8 border-t border-border pt-6">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              Access is scoped by role after login:
            </span>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-300 w-28">Fleet Manager</span>
                <span className="text-primary font-bold">&rarr;</span>
                <span>Fleet, Maintenance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-300 w-28">Dispatcher</span>
                <span className="text-primary font-bold">&rarr;</span>
                <span>Dashboard, Trips</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-300 w-28">Safety Officer</span>
                <span className="text-primary font-bold">&rarr;</span>
                <span>Drivers, Compliance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-300 w-28">Financial Analyst</span>
                <span className="text-primary font-bold">&rarr;</span>
                <span>Fuel & Expenses, Analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
