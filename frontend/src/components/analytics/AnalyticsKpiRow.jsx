import React from 'react';
import KpiCard from '../dashboard/KpiCard';

export default function AnalyticsKpiRow({ fuelEfficiencyKmL, fleetUtilizationPct, operationalCost, vehicleRoiPct }) {
  return (
    <div className="w-full mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <KpiCard 
          label="Fuel Efficiency" 
          value={fuelEfficiencyKmL} 
          suffix=" km/l" 
          accentColor="border-amber-500" 
        />
        <KpiCard 
          label="Fleet Utilization" 
          value={fleetUtilizationPct} 
          suffix="%" 
          accentColor="border-blue-500" 
        />
        <KpiCard 
          label="Operational Cost" 
          value={operationalCost} 
          suffix="" 
          accentColor="border-red-500" 
        />
        <KpiCard 
          label="Vehicle ROI" 
          value={vehicleRoiPct} 
          suffix="%" 
          accentColor="border-green-500" 
        />
      </div>
      <p className="text-xs text-gray-500 italic px-2">
        ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
      </p>
    </div>
  );
}
