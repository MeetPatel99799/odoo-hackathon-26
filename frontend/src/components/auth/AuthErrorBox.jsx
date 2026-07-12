/**
 * AuthErrorBox — glassmorphism error toast
 * Props: message
 */
export default function AuthErrorBox({ message }) {
  if (!message) return null;

  return (
    <div
      className="fixed top-6 right-6 z-50 max-w-md"
      role="alert"
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/40 text-red-400"
        style={{
          background: 'rgba(239,68,68,0.10)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <span className="text-xl font-bold text-red-500 select-none flex-shrink-0">✗</span>
        <span className="text-sm font-semibold tracking-wide">{message}</span>
      </div>
    </div>
  );
}
