import React from 'react';

export default function StatusToggleBar({ disabled, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={disabled}
        onClick={() => onToggle('Available')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${disabled ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-green-900/20 text-green-400 border-green-700 hover:bg-green-900/40'}`}
      >
        Available
      </button>
      <button
        disabled={disabled}
        onClick={() => onToggle('On Trip')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${disabled ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-blue-900/20 text-blue-400 border-blue-700 hover:bg-blue-900/40'}`}
      >
        On Trip
      </button>
      <button
        disabled={disabled}
        onClick={() => onToggle('Off Duty')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${disabled ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'}`}
      >
        Off Duty
      </button>
      <button
        disabled={disabled}
        onClick={() => onToggle('Suspended')}
        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${disabled ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-orange-900/20 text-orange-400 border-orange-700 hover:bg-orange-900/40'}`}
      >
        Suspended
      </button>
    </div>
  );
}
