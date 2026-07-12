import React from 'react';

export default function FuelLogTable({ logs }) {
  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No fuel logs found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Liters</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Fuel Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-text tracking-wide">{log.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right font-mono">{Number(log.liters).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right font-mono">${Number(log.cost).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
