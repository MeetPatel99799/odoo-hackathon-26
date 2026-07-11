/**
 * StatusBadge — shared colored pill component.
 *
 * Status → color convention (section 1.4):
 *   Available / Active / Completed  → green
 *   In Transit / Dispatched         → amber/primary
 *   In Shop / Pending               → yellow
 *   Inactive / Cancelled            → red
 *   Draft                           → gray
 */
const STATUS_COLORS = {
  // Green
  available:  'bg-green-900/40 text-green-400 border border-green-700',
  active:     'bg-green-900/40 text-green-400 border border-green-700',
  completed:  'bg-green-900/40 text-green-400 border border-green-700',
  // Amber (primary)
  'in transit':  'bg-amber-900/40 text-amber-400 border border-amber-700',
  // Blue (On Trip / Dispatched)
  'on trip':     'bg-blue-900/40 text-blue-400 border border-blue-700',
  dispatched:    'bg-blue-900/40 text-blue-400 border border-blue-700',
  // Yellow
  'in shop':  'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  pending:    'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  // Red
  inactive:   'bg-red-900/40 text-red-400 border border-red-700',
  cancelled:  'bg-red-900/40 text-red-400 border border-red-700',
  // Gray
  draft:      'bg-gray-800 text-gray-400 border border-gray-600',
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase() ?? '';
  const colorClass = STATUS_COLORS[key] ?? 'bg-gray-800 text-gray-400 border border-gray-600';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}
