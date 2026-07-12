/**
 * VehicleStatusPanel - Proportional breakdown of fleet vehicle statuses
 *
 * Props:
 * - counts: object showing totals: { Available, 'On Trip', 'In Shop', Retired }
 */
export default function VehicleStatusPanel({ counts = {} }) {
  const available = counts.Available ?? 0;
  const onTrip = counts['On Trip'] ?? 0;
  const inShop = counts['In Shop'] ?? 0;
  const retired = counts.Retired ?? 0;

  const total = available + onTrip + inShop + retired;

  const statuses = [
    {
      name: 'Available',
      count: available,
      color: 'bg-green-500',
      textColor: 'text-green-400',
      dotColor: 'bg-green-500',
    },
    {
      name: 'On Trip',
      count: onTrip,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      dotColor: 'bg-blue-500',
    },
    {
      name: 'In Shop',
      count: inShop,
      color: 'bg-orange-500', // standard orange/amber status bar
      textColor: 'text-orange-400',
      dotColor: 'bg-orange-500',
    },
    {
      name: 'Retired',
      count: retired,
      color: 'bg-red-500',
      textColor: 'text-red-400',
      dotColor: 'bg-red-500',
    },
  ];

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
          Vehicle Status
        </h3>
        <span className="text-xs bg-background border border-border px-2.5 py-1 rounded-md text-gray-400 font-mono">
          Total: {total}
        </span>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {statuses.map((status) => {
          const percentage = total > 0 ? Math.round((status.count / total) * 100) : 0;

          return (
            <div key={status.name} className="flex flex-col">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${status.dotColor}`} />
                  <span className="text-gray-300">{status.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className={`text-sm ${status.textColor}`}>{status.count}</span>
                  <span className="text-gray-500 text-[10px]">({percentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${status.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
