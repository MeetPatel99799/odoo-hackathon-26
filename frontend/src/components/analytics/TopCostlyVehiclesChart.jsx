import React from 'react';

export default function TopCostlyVehiclesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-panel border border-border rounded-xl shadow-lg p-6 w-full h-80 flex flex-col justify-center items-center text-gray-500">
        No cost data available
      </div>
    );
  }

  // Find max cost to calculate proportional widths
  const maxCost = Math.max(...data.map(d => Number(d.cost) || 0));

  const getColorClass = (index) => {
    if (index === 0) return 'bg-red-500';
    if (index === 1) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg p-6 w-full h-80 flex flex-col">
      <h3 className="text-lg font-bold text-text mb-4 tracking-tight">Top Costly Vehicles</h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {data.map((item, index) => {
          const cost = Number(item.cost) || 0;
          const percentage = maxCost > 0 ? (cost / maxCost) * 100 : 0;
          
          return (
            <div key={item.vehicle || index} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-300">{item.vehicle}</span>
                <span className="text-text font-mono">${cost.toFixed(2)}</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                <div 
                  className={\`h-full rounded-full transition-all duration-500 \${getColorClass(index)}\`}
                  style={{ width: \`\${Math.max(percentage, 2)}%\` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
