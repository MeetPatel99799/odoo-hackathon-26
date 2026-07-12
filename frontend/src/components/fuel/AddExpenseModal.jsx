import React, { useState, useEffect } from 'react';

export default function AddExpenseModal({ open, onClose, onSubmit, vehicleOptions = [], tripOptions = [], maintenanceOptions = [] }) {
  const [vehicleId, setVehicleId] = useState('');
  const [tripId, setTripId] = useState('');
  const [toll, setToll] = useState('');
  const [other, setOther] = useState('');
  const [maintenanceId, setMaintenanceId] = useState('');

  useEffect(() => {
    if (open) {
      setVehicleId('');
      setTripId('');
      setToll('');
      setOther('');
      setMaintenanceId('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        vehicle_id: vehicleId,
        trip_id: tripId || null,
        toll: Number(toll),
        other: Number(other),
        maintenance_linked_id: maintenanceId || null
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-panel border border-border rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background/40">
          <h3 className="text-base font-bold text-text uppercase tracking-wider">Add Expense</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text font-bold p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Vehicle</label>
            <select 
              required 
              value={vehicleId} 
              onChange={e => setVehicleId(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">Select a vehicle</option>
              {vehicleOptions.map(v => (
                <option key={v.id} value={v.id}>{v.reg_no || v.regNo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex justify-between text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Trip <span className="text-gray-500 lowercase font-normal italic">optional</span>
            </label>
            <select 
              value={tripId} 
              onChange={e => setTripId(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">None</option>
              {tripOptions.map(t => (
                <option key={t.id} value={t.id}>{t.trip_code || t.tripCode}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Toll</label>
              <input 
                type="number" 
                step="0.01"
                value={toll} 
                onChange={e => setToll(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Other</label>
              <input 
                type="number" 
                step="0.01"
                value={other} 
                onChange={e => setOther(e.target.value)} 
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="flex justify-between text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Linked Maintenance <span className="text-gray-500 lowercase font-normal italic">optional</span>
            </label>
            <select 
              value={maintenanceId} 
              onChange={e => setMaintenanceId(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">None</option>
              {maintenanceOptions.map(m => (
                <option key={m.id} value={m.id}>{m.service_type || m.serviceType} (${m.cost})</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="border border-border text-gray-300 hover:text-text rounded-lg px-4 py-2 text-sm font-semibold">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-amber-600 text-black rounded-lg px-5 py-2 text-sm font-semibold">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}
