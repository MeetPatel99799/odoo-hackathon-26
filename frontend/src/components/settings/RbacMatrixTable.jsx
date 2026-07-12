import React from 'react';

const renderCell = (val) => {
  if (val === 'full') {
    return <span className="text-green-500 font-semibold">✓</span>;
  }
  if (val === 'view') {
    return <span className="text-zinc-500 italic">view</span>;
  }
  return <span className="text-zinc-600">–</span>;
};

export default function RbacMatrixTable({ matrix }) {
  if (!matrix) return null;

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/30">
        <h3 className="text-lg font-semibold text-text">RBAC Permission Matrix</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-center">Fleet</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-center">Drivers</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-center">Trips</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-center">Fuel/Exp.</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-center">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Object.keys(matrix).map((roleName) => {
              const row = matrix[roleName] || {};
              return (
                <tr key={roleName} className="hover:bg-background/40 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-text whitespace-nowrap">{roleName}</td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">{renderCell(row.fleet)}</td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">{renderCell(row.drivers)}</td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">{renderCell(row.trips)}</td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">{renderCell(row.fuel_expenses)}</td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">{renderCell(row.analytics)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
