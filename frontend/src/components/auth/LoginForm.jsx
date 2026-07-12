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
  const [showPassword, setShowPassword] = useState(false);

  const normalizedRoles = (roleOptions || []).map((opt) => {
    if (typeof opt === 'string') return { value: opt, label: opt };
    return opt;
  });

  useEffect(() => {
    if (normalizedRoles.length > 0 && !role) {
      setRole(normalizedRoles[0].value);
    }
  }, [roleOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ email, password, role, rememberMe });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background text-text font-sans overflow-hidden">

      {/* ── LEFT PANEL — brand info ── */}
      <div className="relative w-full md:w-[42%] flex flex-col justify-between p-10 md:p-14 overflow-hidden">
        {/* Glass card behind content */}
        <div className="absolute inset-0 glass-dark opacity-60 pointer-events-none" />

        {/* Decorative blue orb */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,141,239,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }}
        />

        <div className="relative flex flex-col flex-1 justify-center max-w-xs">
          {/* Logo */}
          <div className="w-14 h-14 glass-primary rounded-xl flex items-center justify-center mb-8 shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold text-text tracking-tight leading-tight mb-2">
            TransitOps
          </h1>
          <p className="text-muted text-sm mb-10 font-medium">
            Smart Transport Operations Platform
          </p>

        </div>

        {/* Footer */}
        <div className="relative text-xs text-muted font-semibold tracking-widest uppercase">
          TRANSITOPS &copy; 2026 &middot; RBAC ENABLED
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="w-full md:w-[58%] flex items-center justify-center p-8 md:p-14">
        <div className="w-full max-w-md">

          {/* Glass form card */}
          <div className="glass p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-text mb-1 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-muted text-sm mb-8">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@transitops.com"
                  className="w-full glass-subtle border-0 rounded-lg px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-subtle border-0 rounded-lg px-4 py-2.5 pr-10 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Role (RBAC)
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full glass-subtle border-0 rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {normalizedRoles.length === 0 ? (
                    <option value="">No roles available</option>
                  ) : (
                    normalizedRoles.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-panel">
                        {opt.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Remember me & Forgot */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-muted hover:text-text select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border bg-panel text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  Remember me
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed"
                style={{
                  background: loading ? 'rgba(91,141,239,0.4)' : 'rgba(91,141,239,1)',
                  color: '#fff',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(91,141,239,0.35)',
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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


          </div>
        </div>
      </div>
    </div>
  );
}
