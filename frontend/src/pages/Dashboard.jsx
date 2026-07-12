import { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import KpiCard from '../components/dashboard/KpiCard';
import RecentTripsTable from '../components/dashboard/RecentTripsTable';
import VehicleStatusPanel from '../components/dashboard/VehicleStatusPanel';

// Hardcoded Mock Data for visual preview matching the specification schemas
const MOCK_VEHICLE_TYPES = ['All', 'Truck', 'Van', 'Sedan', 'SUV'];
const MOCK_STATUS_OPTIONS = ['All', 'Available', 'On Trip', 'In Shop', 'Retired', 'Completed', 'Draft', 'Cancelled'];
const MOCK_REGION_OPTIONS = ['All', 'North Region', 'South Region', 'East Region', 'West Region'];

const INITIAL_TRIPS = [
  { tripCode: 'TRP-1001', vehicle: 'Volvo FH16 (Truck)', driver: 'John Doe', status: 'On Trip', eta: '15:30', region: 'North Region', type: 'Truck' },
  { tripCode: 'TRP-1002', vehicle: 'Ford Transit (Van)', driver: 'Sarah Connor', status: 'Completed', eta: '12:15', region: 'South Region', type: 'Van' },
  { tripCode: 'TRP-1003', vehicle: 'Tesla Model S (Sedan)', driver: 'Alex Mercer', status: 'Draft', eta: '', region: 'East Region', type: 'Sedan' },
  { tripCode: 'TRP-1004', vehicle: 'Volvo FH16 (Truck)', driver: 'Jane Smith', status: 'Cancelled', eta: '', region: 'West Region', type: 'Truck' },
  { tripCode: 'TRP-1005', vehicle: 'Chevrolet Tahoe (SUV)', driver: 'Michael De Santa', status: 'Dispatched', eta: '18:45', region: 'North Region', type: 'SUV' },
  { tripCode: 'TRP-1006', vehicle: 'Freightliner Cascadia (Truck)', driver: 'Franklin Clinton', status: 'On Trip', eta: '19:15', region: 'South Region', type: 'Truck' },
  { tripCode: 'TRP-1007', vehicle: 'Mercedes Sprinter (Van)', driver: 'Trevor Philips', status: 'In Shop', eta: '', region: 'East Region', type: 'Van' }
];

const INITIAL_STATUS_COUNTS = {
  Available: 18,
  'On Trip': 8,
  'In Shop': 4,
  Retired: 2
};

export default function Dashboard() {
  const [vehicleType, setVehicleType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');

  // Filter handlers
  const handleFilterChange = (field, value) => {
    console.log(`Filter changed: ${field} => ${value}`);
    if (field === 'vehicleType') setVehicleType(value);
    if (field === 'status') setStatus(value);
    if (field === 'region') setRegion(value);
  };

  // Perform in-memory filtering for visual reactivity in preview mode
  const filteredTrips = INITIAL_TRIPS.filter((trip) => {
    const matchesType = vehicleType === 'All' || trip.type === vehicleType;
    const matchesStatus = status === 'All' || trip.status.toLowerCase() === status.toLowerCase();
    const matchesRegion = region === 'All' || trip.region === region;
    return matchesType && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header Title with Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Transit Operations and Fleet Analytics Control Center
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-md text-xs font-mono select-none self-start md:self-auto">
          Preview Mode (Live Data Stubs)
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        vehicleType={vehicleType}
        status={status}
        region={region}
        onChange={handleFilterChange}
        typeOptions={MOCK_VEHICLE_TYPES}
        statusOptions={MOCK_STATUS_OPTIONS}
        regionOptions={MOCK_REGION_OPTIONS}
      />

      {/* KPI Card Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Fleet"
          value="32"
          suffix="Vehicles"
          accentColor="#c9791a" // Brand Primary Amber
        />
        <KpiCard
          label="Trips Today"
          value="85"
          accentColor="#3b82f6" // Blue
        />
        <KpiCard
          label="Fuel Consumed"
          value="2,450"
          suffix="Liters"
          accentColor="#10b981" // Green
        />
        <KpiCard
          label="In Service Bay"
          value="4"
          suffix="Units"
          accentColor="#f59e0b" // Yellow/Amber
        />
      </div>

      {/* Bottom Main Content Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Recent Trips (Takes 2/3 width) */}
        <div className="lg:col-span-2">
          <RecentTripsTable trips={filteredTrips} />
        </div>

        {/* Right Column: Vehicle Status (Takes 1/3 width) */}
        <div className="lg:col-span-1">
          <VehicleStatusPanel counts={INITIAL_STATUS_COUNTS} />
        </div>
      </div>
    </div>
  );
}