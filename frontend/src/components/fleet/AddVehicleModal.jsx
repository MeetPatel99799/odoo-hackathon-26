import { useState, useEffect } from 'react';

/**
 * AddVehicleModal - Dialog popup form for registering a new fleet asset
 *
 * Props:
 * - open: boolean, if true renders the modal
 * - onClose: callback to close/cancel the modal
 * - onSubmit(fields): callback triggered on submit with the form fields
 * - error: string, error message (e.g. "Registration number already exists") shown inline under Reg No.
 */
export default function AddVehicleModal({ open, onClose, onSubmit, error }) {
  const [regNo, setRegNo] = useState('');
  const [nameModel, setNameModel] = useState('');
  const [type, setType] = useState('Van');
  const [capacity, setCapacity] = useState('');
  const [odometer, setOdometer] = useState('');
  const [acqCost, setAcqCost] = useState('');

  // Clear fields on open
  useEffect(() => {
    if (open) {
      setRegNo('');
      setNameModel('');
      setType('Van');
      setCapacity('');
      setOdometer('');
      setAcqCost('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        regNo: regNo.trim(),
        nameModel: nameModel.trim(),
        type,
        capacity: Number(capacity),
        odometer: Number(odometer),
        acqCost: Number(acqCost),
        status: 'Available', // default status
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-panel border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-all duration-300 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background/40">
          <h3 className="text-base font-bold text-text uppercase tracking-wider">
            Register New Vehicle
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-text transition-colors text-xl font-bold p-1 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Registration Number */}
          <div>
            <label htmlFor="modal-reg" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Registration Number
            </label>
            <input
              id="modal-reg"
              type="text"
              required
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. REG-7789"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {error && (
              <span className="text-xs text-red-500 font-semibold mt-1 block">
                {error}
              </span>
            )}
          </div>

          {/* Name/Model */}
          <div>
            <label htmlFor="modal-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Name / Model
            </label>
            <input
              id="modal-name"
              type="text"
              required
              value={nameModel}
              onChange={(e) => setNameModel(e.target.value)}
              placeholder="e.g. Scania G410"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label htmlFor="modal-type" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Vehicle Type
            </label>
            <div className="relative">
              <select
                id="modal-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none pr-8 cursor-pointer"
              >
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Mini">Mini</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Grid fields: Capacity, Odometer, Acq Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-capacity" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Max Capacity (kg)
              </label>
              <input
                id="modal-capacity"
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="2500"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="modal-odometer" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Odometer (km)
              </label>
              <input
                id="modal-odometer"
                type="number"
                min="0"
                required
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="10000"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-cost" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Acquisition Cost ($)
            </label>
            <input
              id="modal-cost"
              type="number"
              min="0"
              required
              value={acqCost}
              onChange={(e) => setAcqCost(e.target.value)}
              placeholder="45000"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-white/[0.05] border border-border text-gray-300 hover:text-text font-semibold text-sm rounded-lg px-4 py-2.5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-amber-600 text-black font-semibold text-sm rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg transition-all"
            >
              Register Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
