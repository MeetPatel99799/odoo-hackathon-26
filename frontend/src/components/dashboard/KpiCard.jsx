/**
 * KpiCard - High-level metrics display card
 *
 * Props:
 * - label: text label for the KPI (rendered in small caps/muted styling)
 * - value: main metric numeric or string value
 * - suffix: optional trailing text (e.g. "%", "km", "hr")
 * - accentColor: CSS color string used for the top thin colored border
 */
export default function KpiCard({ label, value, suffix, accentColor = '#c9791a' }) {
  return (
    <div 
      className="bg-panel border border-border rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-black/50 border-t-4"
      style={{ borderTopColor: accentColor }}
    >
      <div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block">
          {label}
        </span>
        <div className="flex items-baseline mt-2">
          <span className="text-3xl font-extrabold tracking-tight text-text">
            {value}
          </span>
          {suffix && (
            <span className="text-sm font-medium text-gray-400 ml-1.5 uppercase tracking-wide">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
