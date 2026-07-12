import React from 'react';

export default function CapacityErrorBox({ capacityKg, cargoKg }) {
  if (cargoKg <= capacityKg) return null;

  const exceededBy = cargoKg - capacityKg;

  return (
    <div className="w-full bg-red-950/20 border-2 border-dashed border-red-500 rounded-lg p-4 my-4 flex items-start gap-3">
      <span className="text-xl font-bold text-red-500 mt-0.5">&cross;</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-red-400">
          Capacity exceeded by {exceededBy} kg &mdash; dispatch blocked
        </span>
        <span className="text-xs text-red-400/80 mt-1 font-mono">
          Vehicle Capacity: {capacityKg} kg | Cargo Weight: {cargoKg} kg
        </span>
      </div>
    </div>
  );
}
