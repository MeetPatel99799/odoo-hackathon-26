import React, { useState } from 'react';
import StatusBadge from '../StatusBadge';

export default function LiveBoard({ trips, onComplete, onCancelTrip, readOnly }) {
  const [completeTripId, setCompleteTripId] = useState(null);
  const [odometer, setOdometer] = useState('');
  const [fuel, setFuel] = useState('');

  const handleCompleteSubmit = (tripId) => {
    if (onComplete) {
      onComplete(tripId, { odometer: Number(odometer), fuel: Number(fuel) });
    }
    setCompleteTripId(null);
    setOdometer('');
    setFuel('');
  };

  return (
    <div className="bg-panel border border-border rounded-xl shadow-lg p-6 w-full h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2 tracking-tight">Live Board</h3>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {trips.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">No live trips.</div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-primary font-bold text-sm tracking-wide block">{trip.tripCode}</span>
                  <span className="text-text font-semibold text-sm">{trip.source} &rarr; {trip.destination}</span>
                </div>
                <StatusBadge status={trip.status} />
              </div>
              
              <div className="flex justify-between items-end mt-4 text-xs">
                <div className="text-gray-400">
                  <span className="block">{trip.vehicle ? trip.vehicle : 'Unassigned Vehicle'}</span>
                  <span className="block">{trip.driver ? trip.driver : 'Unassigned Driver'}</span>
                </div>
                <div className="text-right italic text-gray-500 max-w-[50%]">
                  {trip.note}
                </div>
              </div>
              
              {!readOnly && trip.status.toLowerCase() === 'dispatched' && (
                <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                  <button 
                    onClick={() => onCancelTrip(trip.id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 bg-red-950/20 px-3 py-1 rounded transition-colors"
                  >
                    Cancel Trip
                  </button>
                  <button 
                    onClick={() => setCompleteTripId(trip.id)}
                    className="text-xs text-green-400 hover:text-green-300 border border-green-900/50 bg-green-950/20 px-3 py-1 rounded transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}
              
              {completeTripId === trip.id && (
                <div className="mt-3 p-3 bg-panel border border-border rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="number" 
                      placeholder="Final Odometer" 
                      value={odometer} 
                      onChange={e => setOdometer(e.target.value)}
                      className="w-1/2 bg-background border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-primary"
                    />
                    <input 
                      type="number" 
                      placeholder="Fuel Log" 
                      value={fuel} 
                      onChange={e => setFuel(e.target.value)}
                      className="w-1/2 bg-background border border-border rounded px-2 py-1 text-xs text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setCompleteTripId(null)} className="text-xs text-gray-400 hover:text-text">Cancel</button>
                    <button onClick={() => handleCompleteSubmit(trip.id)} className="text-xs bg-primary text-black px-2 py-1 rounded font-semibold">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border text-xs text-gray-500 italic">
        On Complete: odometer &rarr; fuel log &rarr; expenses &rarr; Vehicle &amp; Driver Available
      </div>
    </div>
  );
}
