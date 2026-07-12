import StatusBadge from '../StatusBadge';

/**
 * RecentTripsTable - Displays tabular list of transits
 *
 * Props:
 * - trips: array of objects [{ tripCode, vehicle, driver, status, eta }]
 */
export default function RecentTripsTable({ trips = [] }) {
  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
          Recent Trips
        </h3>
      </div>
      <div className="overflow-x-auto flex-1">
        {trips.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No recent trips found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Trip
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ETA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {trips.map((trip, idx) => (
                <tr 
                  key={trip.tripCode || idx}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-primary tracking-wide">
                    {trip.tripCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-text font-medium">
                    {trip.vehicle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {trip.driver}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {trip.eta ? trip.eta : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
