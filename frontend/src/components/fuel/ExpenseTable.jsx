import React from 'react';
import StatusBadge from '../StatusBadge';

export default function ExpenseTable({ expenses }) {
  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg overflow-hidden w-full">
      <div className="overflow-x-auto">
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No expenses found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trip</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Toll</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Other</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Maint. (Linked)</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">{expense.trip || '—'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-text tracking-wide">{expense.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right font-mono">${Number(expense.toll || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right font-mono">${Number(expense.other || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 text-right font-mono">${Number(expense.maint_linked_cost || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary text-right font-mono">${Number(expense.total || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <StatusBadge status={expense.status || 'Draft'} />
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
