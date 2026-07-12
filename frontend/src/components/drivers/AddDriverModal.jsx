import React, { useState, useEffect } from 'react';

export default function AddDriverModal({ open, onClose, onSubmit, error }) {
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [category, setCategory] = useState('LMV');
  const [expiry, setExpiry] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setLicenseNo('');
      setCategory('LMV');
      setExpiry('');
      setContact('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, licenseNo, category, expiry, contact });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-panel border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background/40">
          <h3 className="text-base font-bold text-text uppercase tracking-wider">Add Driver</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text font-bold p-1">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">License No.</label>
            <input required type="text" value={licenseNo} onChange={e => setLicenseNo(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            {error && <span className="text-xs text-red-500 font-semibold mt-1 block">{error}</span>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">License Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">License Expiry</label>
            <input required type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Contact Number</label>
            <input required type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={onClose} className="border border-border text-gray-300 hover:text-text rounded-lg px-4 py-2 text-sm font-semibold">Cancel</button>
            <button type="submit" className="bg-primary hover:bg-amber-600 text-black rounded-lg px-5 py-2 text-sm font-semibold">Add Driver</button>
          </div>
        </form>
      </div>
    </div>
  );
}
