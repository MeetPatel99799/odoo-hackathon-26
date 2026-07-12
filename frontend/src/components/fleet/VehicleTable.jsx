import StatusBadge from '../StatusBadge';

/**
 * VehicleTable - List of vehicles in the registry
 *
 * Props:
 * - vehicles: array of vehicle objects
 *   [{ regNo, nameModel, type, capacity, odometer, acqCost, status }]
 */
export default function VehicleTable({ vehicles = [] }) {
  // Utility to format numbers with commas (e.g. 25,000)
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '—';
    return Number(num).toLocaleString();
  };

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg overflow-hidden flex flex-col w-full">
      <div className="overflow-x-auto">
        {vehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No vehicles match the selected criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Reg. No.
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name/Model
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Capacity (kg)
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Odometer (km)
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Acq. Cost ($)
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {vehicles.map((vehicle) => (
                <tr 
                  key={vehicle.regNo}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-primary tracking-wide">
                    {vehicle.regNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-text font-medium">
                    {vehicle.nameModel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                    {formatNumber(vehicle.capacity)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                    {formatNumber(vehicle.odometer)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                    ${formatNumber(vehicle.acqCost)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={vehicle.status} />
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
