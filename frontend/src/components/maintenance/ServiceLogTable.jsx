import React from 'react';

const StatusBadge = ({ status }) => {
  if (status === 'In Shop') {
    return (
      <span className="px-2.5 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-medium">
        In Shop
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
      Completed
    </span>
  );
};

export default function ServiceLogTable({ records, onClose, readOnly }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Cost</th>
              <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider">Status</th>
              {!readOnly && <th className="px-6 py-4 text-xs font-semibold text-textMuted uppercase tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-background/40 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-text whitespace-nowrap">{record.vehicle}</td>
                <td className="px-6 py-4 text-sm text-textMuted">{record.service}</td>
                <td className="px-6 py-4 text-sm text-text whitespace-nowrap">${record.cost}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                {!readOnly && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {record.status === 'In Shop' && (
                      <button 
                        onClick={() => onClose(record.id)}
                        className="text-xs font-medium bg-surface border border-border hover:bg-background hover:text-amber-500 text-text px-3 py-1.5 rounded transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={readOnly ? 4 : 5} className="px-6 py-8 text-center text-sm text-textMuted">
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
