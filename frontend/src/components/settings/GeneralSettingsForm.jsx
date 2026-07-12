import React from 'react';

export default function GeneralSettingsForm({ depotName, currency, distanceUnit, onChange, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="bg-surface p-6 rounded-xl border border-border">
      <h2 className="text-xl font-semibold mb-4 text-text">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Depot Name</label>
          <input 
            type="text" 
            value={depotName || ''} 
            onChange={(e) => onChange('depotName', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Currency</label>
          <input 
            type="text" 
            value={currency || ''} 
            onChange={(e) => onChange('currency', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Distance Unit</label>
          <input 
            type="text" 
            value={distanceUnit || ''} 
            onChange={(e) => onChange('distanceUnit', e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
