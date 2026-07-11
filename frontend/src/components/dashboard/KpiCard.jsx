/**
 * KpiCard — glassmorphism version
 * Props: label, value, suffix, accentColor
 */
export default function KpiCard({ label, value, suffix, accentColor = '#5b8def' }) {
  return (
    <div
      className="glass relative overflow-hidden flex flex-col justify-between p-5 transition-all duration-300 hover:-translate-y-1 group cursor-default"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Subtle glow blob */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${accentColor}22, transparent 70%)` }}
      />

      <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-3">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-text">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
