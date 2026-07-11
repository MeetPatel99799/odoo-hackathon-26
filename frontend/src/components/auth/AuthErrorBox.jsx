/**
 * AuthErrorBox - Presentational component for authentication errors
 *
 * Props:
 * - message: string error message to display
 */
export default function AuthErrorBox({ message }) {
  if (!message) return null;

  return (
    <div 
      className="fixed top-6 right-6 z-50 max-w-md bg-zinc-900/95 border-2 border-dashed border-red-500 text-red-400 px-4 py-3 rounded-lg shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-300 transform translate-y-0 opacity-100"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-red-500 select-none">✗</span>
        <span className="text-sm font-semibold tracking-wide">{message}</span>
      </div>
    </div>
  );
}
