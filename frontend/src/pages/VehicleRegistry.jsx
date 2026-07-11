import { useState } from 'react';
import VehicleFilterBar from '../components/fleet/VehicleFilterBar';
import VehicleTable from '../components/fleet/VehicleTable';
import AddVehicleModal from '../components/fleet/AddVehicleModal';

const INITIAL_VEHICLES = [
  { regNo: 'REG-001', nameModel: 'Volvo FH16', type: 'Truck', capacity: 25000, odometer: 125000, acqCost: 135000, status: 'On Trip' },
  { regNo: 'REG-002', nameModel: 'Ford Transit', type: 'Van', capacity: 3500, odometer: 85000, acqCost: 45000, status: 'Available' },
  { regNo: 'REG-003', nameModel: 'Mercedes Sprinter', type: 'Van', capacity: 4000, odometer: 95000, acqCost: 52000, status: 'In Shop' },
  { regNo: 'REG-004', nameModel: 'Suzuki Carry', type: 'Mini', capacity: 1000, odometer: 180000, acqCost: 15000, status: 'Retired' },
  { regNo: 'REG-005', nameModel: 'Scania R500', type: 'Truck', capacity: 26000, odometer: 42000, acqCost: 160000, status: 'Available' },
  { regNo: 'REG-006', nameModel: 'Toyota TownAce', type: 'Mini', capacity: 850, odometer: 110000, acqCost: 22000, status: 'On Trip' }
];

export default function VehicleRegistry() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  // Handle changes from filter bar
  const handleFilterChange = (field, value) => {
    if (field === 'type') setType(value);
    if (field === 'status') setStatus(value);
    if (field === 'search') setSearch(value);
  };

  // Perform interactive filter matching in-memory
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesType = !type || vehicle.type === type;
    const matchesStatus = !status || vehicle.status === status;
    const matchesSearch = !search || vehicle.regNo.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Handle registering a new vehicle asset
  const handleAddVehicle = (newVehicle) => {
    // Business Rule check: Registration number must be unique!
    const isDuplicate = vehicles.some(
      (v) => v.regNo.toLowerCase() === newVehicle.regNo.toLowerCase()
    );

    if (isDuplicate) {
      setModalError(`Registration number "${newVehicle.regNo}" already exists.`);
      return;
    }

    // Success: Append to list, clear errors, close modal
    setVehicles([...vehicles, newVehicle]);
    setModalError('');
    setIsModalOpen(false);
    console.log('Successfully registered new vehicle:', newVehicle);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Vehicle Registry</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View, filter, and register transport assets within the fleet registry.
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-md text-xs font-mono select-none self-start md:self-auto">
          Preview Mode (In-Memory Data)
        </div>
      </div>

      {/* Vehicle Filter Bar */}
      <VehicleFilterBar
        type={type}
        status={status}
        search={search}
        onChange={handleFilterChange}
        onAddClick={() => setIsModalOpen(true)}
        canAdd={true} // Enabled for testing the visual flow
      />

      {/* Vehicles Table */}
      <VehicleTable vehicles={filteredVehicles} />

      {/* Add Vehicle Modal Dialog */}
      <AddVehicleModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError('');
        }}
        onSubmit={handleAddVehicle}
        error={modalError}
      />
    </div>
  );
}