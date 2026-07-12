import React from 'react';

export default function OperationalCostFooter({ totalCost }) {
  return (
    <div className="bg-panel/50 border border-border rounded-xl p-4 mt-6 flex justify-end items-center gap-4">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Total Operational Cost (Auto) = Fuel + Maint
      </span>
      <span className="text-xl font-bold text-amber-500 font-mono">
        ${Number(totalCost || 0).toFixed(2)}
      </span>
    </div>
  );
}
