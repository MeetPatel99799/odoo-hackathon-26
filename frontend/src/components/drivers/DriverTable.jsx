import React from 'react';
import StatusBadge from '../StatusBadge';

export default function DriverTable({ drivers, selectedId, onSelectRow }) {
  const getSafetyColor = (pct) => {
    if (pct >= 90) return 'bg-green-900/40 text-green-400 border-green-700';
    if (pct >= 70) return 'bg-orange-900/40 text-orange-400 border-orange-700';
    return 'bg-red-900/40 text-red-400 border-red-700';
  };

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg overflow-hidden flex flex-col w-full mt-4">
      <div className="overflow-x-auto">
        {drivers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No drivers match the criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">License No.</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trip Compl.</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Safety</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {drivers.map((driver) => (
                <tr
                  key={driver.id}
                  onClick={() => onSelectRow(driver.id)}
                  className={`cursor-pointer transition-colors ${selectedId === driver.id ? 'bg-primary/10' : 'hover:bg-white/[0.02]'}`}
                >
                  <td className="px-6 py-4 text-sm font-bold text-text tracking-wide">{driver.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">{driver.licenseNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{driver.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {driver.expiry}
                    {driver.isExpired && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-900/60 text-red-400 border border-red-700">
                        EXPIRE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{driver.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{driver.tripCompletionPct}%</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSafetyColor(driver.safetyPct)}`}>
                      {driver.safetyPct}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={driver.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="px-6 py-4 bg-background/30 border-t border-border/40">
        <p className="text-xs text-red-400 italic">
          Rule: Expired license or Suspended status &rarr; blocked from trip assignment
        </p>
      </div>
    </div>
  );
}
