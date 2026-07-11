import React from 'react';

export default function CreateTripForm({
  source,
  destination,
  vehicleId,
  driverId,
  cargoWeight,
  distance,
  vehicleOptions,
  driverOptions,
  onChange,
  onDispatch,
  onCancel,
  capacityExceededBy,
  readOnly
}) {
  const isDispatchDisabled = !!capacityExceededBy || readOnly || !source || !destination || !vehicleId || !driverId || !cargoWeight || !distance;

  return (
    <div className="bg-panel border border-border p-6 rounded-xl shadow-lg w-full mb-6">
      <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2 tracking-tight">Create Trip</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Source</label>
          <input
            type="text"
            value={source || ''}
            onChange={(e) => onChange('source', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Destination</label>
          <input
            type="text"
            value={destination || ''}
            onChange={(e) => onChange('destination', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        
        <div>
          <label className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Vehicle <span className="text-primary italic">available only</span>
          </label>
          <select
            value={vehicleId || ''}
            onChange={(e) => onChange('vehicleId', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">Select a vehicle</option>
            {vehicleOptions.map(v => (
              <option key={v.id} value={v.id}>
                {v.regNo} - {v.capacity} kg capacity
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Driver <span className="text-primary italic">available only</span>
          </label>
          <select
            value={driverId || ''}
            onChange={(e) => onChange('driverId', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">Select a driver</option>
            {driverOptions.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Cargo Weight (kg)</label>
          <input
            type="number"
            value={cargoWeight || ''}
            onChange={(e) => onChange('cargoWeight', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Planned Distance (km)</label>
          <input
            type="number"
            value={distance || ''}
            onChange={(e) => onChange('distance', e.target.value)}
            disabled={readOnly}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>
      
      {!readOnly && (
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="border border-border text-gray-300 hover:text-text rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDispatch}
            disabled={isDispatchDisabled}
            className={`rounded-lg px-5 py-2 text-sm font-semibold shadow-md transition-all ${
              isDispatchDisabled 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-primary text-black hover:bg-amber-600 hover:shadow-lg'
            }`}
          >
            {capacityExceededBy ? 'Dispatch (disabled)' : 'Dispatch'}
          </button>
        </div>
      )}
    </div>
  );
}
