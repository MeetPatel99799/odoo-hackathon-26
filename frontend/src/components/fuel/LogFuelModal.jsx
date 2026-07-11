import React, { useState, useEffect } from 'react';

export default function LogFuelModal({ open, onClose, onSubmit, vehicleOptions = [] }) {
  const [vehicleId, setVehicleId] = useState('');
  const [logDate, setLogDate] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => {
    if (open) {
      setVehicleId('');
      setLogDate(new Date().toISOString().split('T')[0]);
      setLiters('');
      setCost('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        vehicle_id: vehicleId,
        log_date: logDate,
        liters: Number(liters),
        cost: Number(cost)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-panel border border-border rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background/40">
          <h3 className="text-base font-bold text-text uppercase tracking-wider">Log Fuel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text font-bold p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Date</label>
            <input 
              required 
              type="date" 
              value={logDate} 
              onChange={e => setLogDate(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Liters</label>
            <input 
              required 
              type="number" 
              step="0.01"
              value={liters} 
              onChange={e => setLiters(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Cost</label>
            <input 
              required 
              type="number" 
              step="0.01"
              value={cost} 
              onChange={e => setCost(e.target.value)} 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="border border-border text-gray-300 hover:text-text rounded-lg px-4 py-2 text-sm font-semibold">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-amber-600 text-black rounded-lg px-5 py-2 text-sm font-semibold">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
}
