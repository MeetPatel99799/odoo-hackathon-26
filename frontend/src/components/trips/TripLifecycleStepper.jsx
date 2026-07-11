import React from 'react';

export default function TripLifecycleStepper({ activeStage }) {
  const stages = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6 bg-panel p-4 rounded-xl shadow-md border border-border">
      {stages.map((stage, index) => {
        const isActive = activeStage === stage;
        return (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${isActive ? 'bg-primary text-black shadow-lg shadow-primary/30' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}
              >
                {index + 1}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                {stage}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-800 mx-2 self-start mt-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
