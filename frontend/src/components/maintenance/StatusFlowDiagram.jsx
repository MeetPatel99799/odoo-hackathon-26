import React from 'react';

export default function StatusFlowDiagram() {
  return (
    <div className="bg-surface p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold mb-4 text-text">Status Flow</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Available</div>
          <div className="text-textMuted">→</div>
          <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">In Shop</div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">In Shop</div>
          <div className="text-textMuted">→</div>
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Available</div>
        </div>
      </div>
    </div>
  );
}
