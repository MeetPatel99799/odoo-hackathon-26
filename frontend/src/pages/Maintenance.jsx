import React from 'react';
import ServiceRecordForm from '../components/maintenance/ServiceRecordForm';
import StatusFlowDiagram from '../components/maintenance/StatusFlowDiagram';
import ServiceLogTable from '../components/maintenance/ServiceLogTable';

export default function Maintenance() {
  // Hardcoded preview data
  const mockVehicles = [
    { id: 1, name: 'GJ-01-AB-1234 (Volvo 9400)' },
    { id: 2, name: 'GJ-01-AB-5678 (Scania Metrolink)' },
  ];

  const mockRecords = [
    { id: 1, vehicle: 'GJ-01-AB-1234', service: 'Oil Change', cost: 150, status: 'Completed' },
    { id: 2, vehicle: 'GJ-01-AB-5678', service: 'Brake Pad Replacement', cost: 300, status: 'In Shop' },
    { id: 3, vehicle: 'GJ-02-XY-9999', service: 'AC Repair', cost: 450, status: 'In Shop' },
  ];

  const handleSubmit = (fields) => {
    console.log('Submit record:', fields);
    alert('Form submitted (Preview)');
  };

  const handleClose = (id) => {
    console.log('Close record:', id);
    alert('Record closed (Preview)');
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Maintenance Hub</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ServiceRecordForm 
            vehicleOptions={mockVehicles} 
            onSubmit={handleSubmit} 
          />
        </div>
        
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <StatusFlowDiagram />
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text">Active & Recent Logs</h3>
            <ServiceLogTable 
              records={mockRecords} 
              onClose={handleClose} 
              readOnly={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}