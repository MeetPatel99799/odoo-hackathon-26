import React, { useState } from 'react';

export default function ServiceRecordForm({ vehicleOptions, onSubmit }) {
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('In Shop');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ vehicle, service, cost: Number(cost), date, status });
  };

  return (
    <div className="bg-surface p-6 rounded-xl border border-border">
      <h2 className="text-xl font-semibold mb-4 text-text">New Service Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Vehicle</label>
          <select 
            value={vehicle} 
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
          >
            <option value="">Select a vehicle</option>
            {vehicleOptions.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Service Type</label>
          <input 
            type="text" 
            value={service} 
            onChange={(e) => setService(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
            placeholder="e.g. Engine Oil Replacement"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Cost</label>
          <input 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
          >
            <option value="In Shop">In Shop</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Save Record
          </button>
        </div>
      </form>
    </div>
  );
}
